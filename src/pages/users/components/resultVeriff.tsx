/* eslint-disable jsx-a11y/alt-text */
import { Api } from '@/api/api'
import { veriffStatusByCode } from '@/utils/veriff-code'
import {
  CloseCircleOutlined,
  DeleteFilled,
  FundProjectionScreenOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Grid,
  notification,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import Link from 'next/link'
import { useState } from 'react'

const { useBreakpoint } = Grid

interface IProps {
  veriff: any
  token: string
  initUser: any
}

const VERIFF_STATION = process.env.NEXT_PUBLIC_VERIFF_STATION

const ResultVeriff = ({ veriff, token, initUser }: IProps) => {
  const [loadingImport, setLoadingImport] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const screens = useBreakpoint()

  const importDocument = async () => {
    setLoadingImport(true)

    Api.get(`users/${veriff?.user_id}/veriff/import`, token)
      .then((res: any) => {
        notification.success({ message: res.message })
        initUser()
      })
      .catch((err) => {
        notification.error({ message: err.data.message })
      })
      .finally(() => setLoadingImport(false))
  }

  const deleteSession = async () => {
    setLoadingDelete(true)

    Api.post(`users/${veriff?.session_id}/veriff/delete`, token)
      .then((res: any) => {
        notification.success({ message: res.message })
        initUser()
      })
      .catch((err) => {
        notification.error({ message: err.data.message })
      })
      .finally(() => setLoadingDelete(false))
  }

  return (
    <>
      <Divider orientation="left" dashed>
        Veriff Information
      </Divider>
      {veriff ? (
        <>
          <Row gutter={20}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Session ID :</h4>
              <Typography className="pb-1 fs-2">
                {veriff?.session_id}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Season Status :</h4>
              <Typography.Text
                className="pb-1 fs-2"
                style={{ marginBottom: '20px' }}
              >
                {veriffStatusByCode(veriff?.code)}
              </Typography.Text>
              <br />
              <h4 className="m-0 p-0">Status :</h4>
              <Typography.Text className="pb-1 fs-2">
                {veriff?.status}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <h4 className="m-0 p-0">Reason :</h4>
              <Typography.Text className="pb-1 fs-2" italic>
                {veriff?.reason
                  ? veriff?.reason
                  : `-- There is no reason from veriff --`}
              </Typography.Text>
            </Col>
          </Row>

          <Divider orientation="left" dashed />

          <Space className="space-between" align="end">
            <Space
              direction={screens.md ? 'horizontal' : 'vertical'}
              size={screens.lg ? 10 : 20}
            >
              <Tooltip title="See the detail on veriff station">
                <Link
                  href={`${VERIFF_STATION}/${veriff?.session_id}`}
                  target="_blank"
                >
                  <Button
                    type="primary"
                    icon={<FundProjectionScreenOutlined />}
                    style={{ width: screens.lg ? '230px' : '185px' }}
                    size={screens.xs ? 'small' : 'middle'}
                  >
                    Open Detail on Veriff
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="Import document photo from veriff">
                <Button
                  icon={<FundProjectionScreenOutlined />}
                  style={{ width: screens.lg ? '230px' : '185px' }}
                  onClick={importDocument}
                  loading={loadingImport}
                  disabled={veriff?.code.toString() !== '9001'}
                  size={screens.xs ? 'small' : 'middle'}
                >
                  Import Document
                </Button>
              </Tooltip>
            </Space>
            <>
              <Button
                type="primary"
                icon={<DeleteFilled />}
                style={{ width: screens.lg ? '160px' : 'auto' }}
                onClick={deleteSession}
                disabled={veriff?.code.toString() === '9001'}
                loading={loadingDelete}
                danger
                size={screens.xs ? 'small' : 'middle'}
              >
                Delete Session
              </Button>
            </>
          </Space>
        </>
      ) : (
        <>
          <Typography.Title level={5} className="text-center" type="danger">
            <CloseCircleOutlined style={{ fontSize: '5rem' }} />
            <p>Data veriff not found</p>
          </Typography.Title>
        </>
      )}
    </>
  )
}

export default ResultVeriff
