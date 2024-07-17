import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import { isMobile } from '@/utils/screen'
import {
  BuildOutlined,
  FileMarkdownOutlined,
  HomeOutlined,
  LoadingOutlined,
  ProjectOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import { Card, Col, Grid, List, Modal, Row, Space } from 'antd'
import { useEffect, useState } from 'react'
const { useBreakpoint } = Grid

interface Iprops {
  isModalOpen: boolean
  handleClose: any
  campaign: any
  user: any
}

const FRONT_SITE_URL = process.env.NEXT_PUBLIC_FRONT_SITE_URL

const PreviewCampaign = ({
  isModalOpen,
  handleClose,
  campaign,
  user,
}: Iprops) => {
  const screens = useBreakpoint()
  const [data, setData] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  const init = () => {
    setLoading(true)

    Api.get(`campaign/detail/${campaign?.id}`, user.token)
      .then((res: any) => {
        setData(res.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isModalOpen) {
      init()
    } else {
      setData(undefined)
    }
  }, [isModalOpen])

  const overview = [
    { title: 'Target Funding', content: currency(data?.total_invest_amount) },
    { title: 'Funded', content: currency(parseFloat(data?.currenct_invest)) },
    { title: 'Minimun Invest', content: currency(data?.minimum_invest_amount) },
    { title: 'Returns', content: `${data?.return}%` },
    { title: 'Tenor', content: data?.tenor },
  ]

  return (
    <Modal
      title={`Preview Campaign - ${data?.name}`}
      open={isModalOpen}
      footer={false}
      onCancel={handleClose}
      width={
        screens.xs || (screens.sm && !screens.lg)
          ? `100%`
          : screens.md && !screens.xl
          ? `85%`
          : `70%`
      }
      centered
    >
      {loading ? (
        <div className="text-center my-5">
          <LoadingOutlined style={{ fontSize: '2.5rem' }} />
          <h3>Loading..</h3>
        </div>
      ) : (
        <>
          {data ? (
            <>
              <Row>
                <Col span={24}>
                  <img
                    src={data.cover_image}
                    width={`100%`}
                    height={`450`}
                    alt="Campaign Banner"
                  />
                  <Card
                    style={{
                      position: 'absolute',
                      width:
                        screens.xs || (screens.sm && !screens.md)
                          ? '85%'
                          : '500px',
                      top: '140px',
                      left:
                        screens.xs || (screens.sm && !screens.md)
                          ? 'calc((100%/2) - (85%/2))'
                          : 'calc((100%/2) - (500px/2))',
                      boxShadow: '0 0 10px rgba(0,0,0,.5)',
                    }}
                    title={<h2 style={{ padding: '0' }}>{data.acronim}</h2>}
                    headStyle={{ border: 'none' }}
                  >
                    <Space className="space-between">
                      <span>
                        <PushpinOutlined />
                        {` ${data.country}`}
                      </span>

                      <span>
                        <ProjectOutlined />
                        {` ${data.industry}`}
                      </span>
                    </Space>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[20, 20]} style={{ marginTop: '15px' }}>
                <Col
                  xs={24}
                  sm={24}
                  md={16}
                  order={screens.xs || (screens.sm && !screens.md) ? 1 : 0}
                >
                  {screens.xs ||
                    (screens.sm && !screens.md && (
                      <h1>Campaign Description</h1>
                    ))}
                  <div
                    className="campaign-description"
                    style={{ width: '100%' }}
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  ></div>
                </Col>

                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  order={screens.xs || (screens.sm && !screens.md) ? 0 : 1}
                >
                  <Card
                    title={<h3 style={{ textAlign: 'center' }}>Overview</h3>}
                    bodyStyle={{ padding: '0' }}
                    style={{ marginBottom: '30px' }}
                  >
                    <List
                      size={`small`}
                      dataSource={overview}
                      renderItem={(item, idx) => (
                        <List.Item>
                          <List.Item.Meta title={item.title} />

                          <div>{item.content}</div>
                        </List.Item>
                      )}
                    />
                  </Card>

                  {data.campaign_images.length > 0 && (
                    <>
                      <h2 className="text-center">Gallery</h2>
                      <Row gutter={[10, 10]}>
                        {data.campaign_images.map((image: any) => (
                          <Col span={6} key={Math.random()}>
                            <a
                              href={image.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={image.link}
                                width={'100%'}
                                alt={image.name}
                              />
                            </a>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}

                  {data.campaign_pdfs.length > 0 && (
                    <div style={{ marginTop: '30px' }}>
                      <h2 className="text-center">Documents</h2>
                      <Row gutter={[10, 10]}>
                        <Col span={24}>
                          <ul>
                            {data.campaign_pdfs.map((file: any) => (
                              <li key={Math.random()}>
                                <a
                                  href={file.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {file.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <h1>Data Not Found</h1>
          )}
        </>
      )}
    </Modal>
  )
}

export default PreviewCampaign
