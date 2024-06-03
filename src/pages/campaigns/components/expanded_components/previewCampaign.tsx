import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  BuildOutlined,
  FileMarkdownOutlined,
  HomeOutlined,
  ProjectOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import { Card, Col, List, Modal, Row, Space } from 'antd'
import { useEffect, useState } from 'react'

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
  const [data, setData] = useState<any>(undefined)

  const init = () => {
    Api.get(`campaign/detail/${campaign.slug}`, user.token).then((res: any) => {
      setData(res.data)

      console.log(res.data.description)
    })
  }

  useEffect(() => {
    init()
    console.log(campaign)
  }, [])

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
      width={`980`}
      centered
    >
      {data ? (
        <>
          <Row>
            <Col span={24}>
              <img src={data.cover_image} width={`100%`} height={`450`} />
              <Card
                style={{
                  position: 'absolute',
                  width: '500px',
                  top: '140px',
                  left: 'calc((100%/2) - (500px/2))',
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
            <Col span={16}>
              <span
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></span>
            </Col>
            <Col span={8}>
              <Card
                title={<h3 style={{ textAlign: 'center' }}>Overview</h3>}
                bodyStyle={{ padding: '0' }}
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
            </Col>
          </Row>
        </>
      ) : (
        <h1>Data Not Found</h1>
      )}
    </Modal>
  )
}

export default PreviewCampaign
