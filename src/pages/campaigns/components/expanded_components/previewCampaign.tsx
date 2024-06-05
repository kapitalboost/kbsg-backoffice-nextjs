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
    })
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
      width={`980`}
      centered
    >
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

              {data.campaign_images.length && (
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

              {data.campaign_pdfs.length && (
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
    </Modal>
  )
}

export default PreviewCampaign
