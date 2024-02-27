import { Api } from '@/api/api'
import { LoadingOutlined, SelectOutlined } from '@ant-design/icons'
import {
  Card,
  Col,
  List,
  Modal,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
  notification,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import useMousePosition from './useMousePosition'
import { signersInitial } from '@/utils/signers'

/**
 * Position details
 * Color for signers :
 *  investor : orange
 *  company director : green
 *  company commissioner : chartreuse
 *  KB director : blue
 */

interface IProps {
  user: any
  contractTemplate: any
  signatureContent: string
  signerJson?: any
  isModalOpen: boolean
  handleCancel: any
  investmentId?: string
}

const URL_BE = process.env.NEXT_PUBLIC_BE_URL

const SignaturePosition = ({
  user,
  contractTemplate,
  signatureContent,
  signerJson,
  isModalOpen,
  handleCancel,
  investmentId,
}: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [paginateCanvas, setPaginateCanvas] = useState<any>(null)
  const [paperDetail, setPaperDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [inEdit, setInEdit] = useState(false)
  const [signPages, setSignPages] = useState<any>([])
  const [pageActive, setPageActive] = useState(0)
  const [coords, handleCoords] = useMousePosition(true)
  const [signerActive, setSignerActive] = useState('investor')
  const [signerPositions, setSignerPositions] = useState<any>(null)
  const signerColor = {
    investor: 'rgba(22, 160, 133,1.0)',
    kb_director: 'rgba(52, 152, 219,1.0)',
    ukm_director: 'rgba(127, 140, 141,1.0)',
    ukm_commissioner: 'rgba(189, 195, 199,1.0)',
  }

  const signSize = {
    width: 240,
    height: 100,
  }

  const init = () => {
    setLoading(true)

    Api.adminV1Post(
      `${URL_BE}/api/admin/contract-template-preview/prepare`,
      user?.token,
      user?.id,
      {
        content: signatureContent,
        investment_id: investmentId,
        single: true,
      }
    )
      .then((res: any) => {
        setInEdit(false)
        setPaperDetail(res)
        let images = []
        for (let index = 0; index < res.page_count; index++) {
          images.push(`${res?.url}/${index}.png`)
        }
        setSignPages(images)
      })
      .catch((err) => {
        notification.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  const resetPopup = () => {
    setSignPages([])
    setPageActive(0)
    setLoading(false)
  }

  useEffect(() => {
    if (isModalOpen) {
      const signer_json = JSON.parse(contractTemplate.signer_json)
      if (signer_json !== null) {
        let signObject: any = {}

        for (let index = 0; index < signer_json.length; index++) {
          const element = signer_json[index]

          signObject[element.type] = element
        }
        setSignerPositions(signObject)

        drawSignerPosition(0, signObject)
      } else {
        setSignerPositions(signersInitial)
      }
      init()
    } else {
      resetPopup()
    }
  }, [isModalOpen])

  const drawSignerPosition = (page: number, sign_object: any) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')

      if (ctx) {
        if (sign_object) {
          for (const property in sign_object) {
            console.log(property, sign_object[property])
            const element = sign_object[property]

            if (element.page === page) {
              if (element.startX !== 0) {
                ctx.strokeStyle = element.color
                ctx.fillStyle = element.color
                ctx?.strokeRect(
                  element.startX,
                  element.startY,
                  signSize.width,
                  signSize.height
                )
              }
            }
          }
        }
      }
    }
  }

  const onChange = (checked: boolean) => {
    setInEdit(checked)
  }

  const onRemoveSignerPosition = (key: string) => {
    let assignSignerPositions = signerPositions[key]

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx?.clearRect(
        assignSignerPositions.startX - 5,
        assignSignerPositions.startY - 5,
        assignSignerPositions.width + 15,
        assignSignerPositions.height + 15
      )

      assignSignerPositions = {
        ...assignSignerPositions,
        page: null,
        startX: 0,
        startY: 0,
        width: 0,
        height: 0,
      }

      const result = {
        ...signerPositions,
        [key]: assignSignerPositions,
      }

      setSignerPositions(result)
    }
  }

  const onPageChange = (page_number: number) => {
    setPageActive(page_number)

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx?.clearRect(0, 0, 933, 1324)

      drawSignerPosition(page_number, signerPositions)
    }
  }

  const onSave = () => {
    setSubmitLoading(true)
    const keys = ['investor', 'kb_director', 'ukm_director', 'ukm_commissioner']
    let params: any = []

    keys.forEach((signer: any) => {
      params.push(signerPositions[signer])
    })

    Api.post(
      `contract-templates/sign-position/${contractTemplate?.id}`,
      user.token,
      user.id,
      {
        sign_json: params,
      }
    )
      .then((res: any) => {
        notification.success({ message: res.message })
      })
      .catch((err: any) => {
        notification.error({ message: err.message })
      })
      .finally(() => setSubmitLoading(false))
  }

  return (
    <>
      <Modal
        title="Signature Position"
        open={isModalOpen}
        // footer={false}
        okText={`Save Position`}
        okButtonProps={{
          loading: submitLoading,
        }}
        onCancel={handleCancel}
        onOk={() => onSave()}
        width={1366}
        style={{ top: 20 }}
      >
        {loading && (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2.5rem' }} />
            <h3>Loading..</h3>
          </div>
        )}

        <div
          style={
            loading
              ? {
                  position: 'absolute',
                  zIndex: -1,
                  visibility: 'hidden',
                }
              : {}
          }
        >
          <Space align="start">
            <div>
              <Card
                style={{ width: '350px', borderColor: '#d9d9d9' }}
                bodyStyle={{ padding: 0 }}
                title={
                  <Space className="space-between">
                    <Typography.Title level={5} className="m-0">
                      Signers
                    </Typography.Title>
                    <Tooltip title={`Switch to edit position`}>
                      <Switch onChange={onChange} checked={inEdit} />
                    </Tooltip>
                  </Space>
                }
              >
                <List className="list-signers">
                  <List.Item
                    className={`item ${
                      signerActive === 'investor' && 'active'
                    }`}
                    actions={
                      inEdit
                        ? [
                            <a
                              key="list-loadmore-edit"
                              onClick={() => setSignerActive('investor')}
                            >
                              set
                            </a>,
                            <a
                              key="list-loadmore-more"
                              onClick={() => onRemoveSignerPosition('investor')}
                            >
                              remove
                            </a>,
                          ]
                        : []
                    }
                  >
                    <Space>
                      <SelectOutlined
                        style={{ color: signerColor['investor'] }}
                      />
                      <span>INVESTOR</span>
                    </Space>
                  </List.Item>
                  <List.Item
                    className={`item ${
                      signerActive === 'ukm_director' && 'active'
                    }`}
                    actions={
                      inEdit
                        ? [
                            <a
                              key="list-loadmore-edit"
                              onClick={() => setSignerActive('ukm_director')}
                            >
                              set
                            </a>,
                            <a
                              key="list-loadmore-more"
                              onClick={() =>
                                onRemoveSignerPosition('ukm_director')
                              }
                            >
                              remove
                            </a>,
                          ]
                        : []
                    }
                  >
                    <Space>
                      <SelectOutlined
                        style={{ color: signerColor['ukm_director'] }}
                      />
                      <span>[UKM] Director</span>
                    </Space>
                  </List.Item>
                  <List.Item
                    className={`item ${
                      signerActive === 'ukm_commissioner' && 'active'
                    }`}
                    actions={
                      inEdit
                        ? [
                            <a
                              key="list-loadmore-edit"
                              onClick={() =>
                                setSignerActive('ukm_commissioner')
                              }
                            >
                              set
                            </a>,
                            <a
                              key="list-loadmore-more"
                              onClick={() =>
                                onRemoveSignerPosition('ukm_commissioner')
                              }
                            >
                              remove
                            </a>,
                          ]
                        : []
                    }
                  >
                    <Space>
                      <SelectOutlined
                        style={{ color: signerColor['ukm_commissioner'] }}
                      />
                      <span>[UKM] Commissioner</span>
                    </Space>
                  </List.Item>
                  <List.Item
                    className={`item ${
                      signerActive === 'kb_director' && 'active'
                    }`}
                    actions={
                      inEdit
                        ? [
                            <a
                              key="list-loadmore-edit"
                              onClick={() => setSignerActive('kb_director')}
                            >
                              set
                            </a>,
                            <a
                              key="list-loadmore-more"
                              onClick={() =>
                                onRemoveSignerPosition('kb_director')
                              }
                            >
                              remove
                            </a>,
                          ]
                        : []
                    }
                  >
                    <Space>
                      <SelectOutlined
                        style={{ color: signerColor['kb_director'] }}
                      />
                      <span>[KB] Director</span>
                    </Space>
                  </List.Item>
                </List>
              </Card>

              <div>
                <Typography.Title level={5}>Pages</Typography.Title>

                <Row
                  gutter={10}
                  style={{ width: '330px', borderColor: '#d9d9d9' }}
                >
                  {signPages.map((page: any, i: number) => (
                    <Col span={8} key={i}>
                      <Card
                        key={i}
                        className="mb-1"
                        bodyStyle={{
                          padding: 0,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <a onClick={() => onPageChange(i)}>
                          <img
                            src={page}
                            alt={`Signature Page`}
                            width={'100%'}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              width: '100%',
                              backgroundColor:
                                pageActive === i
                                  ? '#3498db'
                                  : 'rgba(0,0,0,0.2)',
                              color: 'white',
                              textAlign: 'center',
                            }}
                          >{`Page ${i + 1}`}</span>
                        </a>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              {/* <button
                onClick={() => {
                  if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d')
                    ctx?.clearRect(0, 0, 669, 950)
                  }
                }}
              >
                CLEAR
              </button> */}
            </div>
            <div className="signature-area">
              <canvas
                ref={canvasRef}
                width="871"
                height="1235"
                className="signature-canvas"
                onClick={(e) => {
                  let assignSignerPositions = signerPositions[signerActive]

                  if (inEdit) {
                    if (canvasRef.current) {
                      const ctx = canvasRef?.current.getContext('2d')

                      // clear old position
                      if (assignSignerPositions.startX !== 0) {
                        ctx?.clearRect(
                          assignSignerPositions.startX - 5,
                          assignSignerPositions.startY - 5,
                          assignSignerPositions.width + 15,
                          assignSignerPositions.height + 15
                        )
                      }

                      // set new position
                      handleCoords(e as unknown as MouseEvent)
                      if (ctx && signerActive !== '') {
                        // set color stroke
                        ctx.fillStyle =
                          signerColor[signerActive as keyof typeof signerColor]

                        ctx.strokeStyle =
                          signerColor[signerActive as keyof typeof signerColor]

                        ctx?.strokeRect(
                          coords.x,
                          coords.y,
                          signSize.width,
                          signSize.height
                        )

                        // set position and page
                        assignSignerPositions = {
                          ...assignSignerPositions,
                          page: pageActive,
                          startX: coords.x,
                          startY: coords.y,
                          width: signSize.width,
                          height: signSize.height,
                          color:
                            signerColor[
                              signerActive as keyof typeof signerColor
                            ],
                        }

                        const result = {
                          ...signerPositions,
                          [signerActive]: assignSignerPositions,
                        }

                        setSignerPositions(result)
                      }
                    }
                  }
                }}
              />
              <img
                src={signPages[pageActive]}
                alt="Signature Area"
                className="signature-image"
              />
            </div>
          </Space>
        </div>
      </Modal>
    </>
  )
}

export default SignaturePosition
