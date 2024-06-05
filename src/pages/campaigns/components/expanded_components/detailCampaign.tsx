import {
  EditOutlined,
  EyeOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import { Button, Col, List, message, Row, Space, Tooltip } from 'antd'
import { currency } from '@/utils/helpers'
import Link from 'next/link'
import { Api } from '@/api/api'
import { useState } from 'react'
import PreviewCampaign from './previewCampaign'

interface IProps {
  campaign: any
  user: any
}

const DetailCampaign = ({ campaign, user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const data = [
    { title: 'Company Name', content: campaign?.country },
    { title: 'Industry', content: campaign?.industry },
    { title: 'Project Type', content: campaign?.type.toUpperCase() },
    { title: 'SME Sub Type', content: campaign?.subtype },
    { title: 'Risk', content: campaign?.risk },
    {
      title: 'Minimum Invest',
      content: currency(campaign?.minimum_invest_amount),
    },
    { title: 'Project Return', content: campaign?.return + '%' },
    { title: 'Project Tenor', content: campaign?.tenor },
  ]

  const sendNotif = () => {
    setLoading(true)
    Api.post(`campaign/send-notif/${campaign?.slug}`, user?.token)
      .then((res: any) => {
        message.success(res.message)
      })
      .catch((err) => {
        message.error('Failed to send notification')
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Row gutter={30}>
        <Col span={12}>
          <List
            size={`small`}
            dataSource={data}
            renderItem={(item, idx) =>
              idx % 2 === 0 && (
                <List.Item>
                  <List.Item.Meta title={item.title} />

                  <div>{item.content}</div>
                </List.Item>
              )
            }
          />
        </Col>
        <Col span={12}>
          <List
            size={`small`}
            dataSource={data}
            renderItem={(item, idx) =>
              idx % 2 === 1 && (
                <List.Item>
                  <List.Item.Meta title={<>{item.title}</>} />

                  <div>{item.content}</div>
                </List.Item>
              )
            }
          />
        </Col>
      </Row>
      <Row className="my-2">
        <Col span={24}>
          <Space>
            <Link href={`/campaigns/edit/${campaign?.slug}`}>
              <Button type="primary" icon={<EditOutlined />} size={`small`}>
                Edit Campaign
              </Button>
            </Link>
            <Button
              icon={<EyeOutlined />}
              size={`small`}
              onClick={() => setPreviewOpen(true)}
            >
              Preview Campaign
            </Button>
            <Tooltip title="Notify users a new campaign has been released!">
              <Button
                icon={<NotificationOutlined />}
                size={`small`}
                onClick={sendNotif}
                loading={loading}
              >
                Send Mobile Notification
              </Button>
            </Tooltip>
            {/* <Tooltip title="Notification has been sent">
              <Button icon={<NotificationOutlined />} size={`small`} disabled>
                Send Mobile Notification
              </Button>
            </Tooltip> */}
          </Space>
        </Col>
      </Row>

      <PreviewCampaign
        handleClose={() => setPreviewOpen(false)}
        isModalOpen={previewOpen}
        campaign={campaign}
        user={user}
      />
    </>
  )
}

export default DetailCampaign
