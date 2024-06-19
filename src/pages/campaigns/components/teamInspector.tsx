import { Api } from '@/api/api'
import { teamAnalyst, teamBD } from '@/utils/teamReview'
import { LoadingOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, message, Row, Select, Space } from 'antd'
import { use, useEffect, useState } from 'react'

interface IProps {
  user: any
  slug: any
}

const TeamInspector = ({ user, slug }: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [bd, setBd] = useState<any>([])
  const [analyst, setAnalyst] = useState<any>([])

  const initData = () => {
    setLoading(true)

    Api.get(`campaign/contract/team-review/${slug}`, user?.token)
      .then((res: any) => {
        form.setFieldsValue({
          bd: res.data.email_bd,
          analyst: res.data.email_analyst,
        })
      })
      .finally(() => setLoading(false))
  }

  const initOptionBd = () => {
    Api.get(`team-analyzers/options/business development`, user?.token).then(
      (res: any) => {
        setBd(res.data)
        console.log(res)
      }
    )
  }

  const initOptionRisk = () => {
    Api.get(`team-analyzers/options/risk`, user?.token).then((res: any) => {
      setAnalyst(res.data)
      console.log(res)
    })
  }

  useEffect(() => {
    initData()
    initOptionBd()
    initOptionRisk()
  }, [])

  const onFinish = (values: any) => {
    setBtnLoading(true)

    const bdData: any = teamBD.filter((opt) => opt.value === values.bd)
    const analystData: any = teamAnalyst.filter(
      (opt) => opt.value === values.analyst
    )

    Api.post(`campaign/contract/team-review/${slug}/save`, user?.token, null, {
      name_bd: bdData[0]?.label,
      email_bd: bdData[0]?.value,
      name_analyst: analystData[0]?.label,
      email_analyst: analystData[0]?.value,
    })
      .then((res: any) => {
        message.success({ content: 'Success to update data review' })
      })
      .catch((err: any) => message.error({ content: 'Failed to change data' }))
      .finally(() => {
        initData()
        setBtnLoading(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      size="large"
    >
      {loading ? (
        <div className="text-center my-5">
          <LoadingOutlined style={{ fontSize: '2.5rem' }} />
          <h3>Please Wait</h3>
        </div>
      ) : (
        <>
          <Divider orientation="left" dashed>
            {`Select BD & Analyst`}
          </Divider>

          <Row gutter={[30, 0]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Select Bussines Development"
                name="bd"
                rules={[{ required: true, message: 'Please select BD' }]}
              >
                <Select
                  placeholder="Select a person"
                  optionFilterProp="children"
                  options={bd}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Select Analyst"
                name="analyst"
                rules={[{ required: true, message: 'Please select Analyst' }]}
              >
                <Select
                  placeholder="Select a person"
                  optionFilterProp="children"
                  options={analyst}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" dashed />

          <Space size={20}>
            <Button
              type="primary"
              style={{ width: 150 }}
              htmlType={`submit`}
              disabled={btnLoading}
              icon={<SendOutlined />}
            >
              {btnLoading ? <LoadingOutlined /> : <>Submit</>}
            </Button>
            <Button onClick={initData}>Reset</Button>
          </Space>
        </>
      )}
    </Form>
  )
}

export default TeamInspector
