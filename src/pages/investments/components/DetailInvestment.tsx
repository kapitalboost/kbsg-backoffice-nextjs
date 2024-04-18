import { Api } from '@/api/api'
import {
  CheckOutlined,
  SaveFilled,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  message,
  notification,
  Row,
  Select,
  Typography,
} from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface IProps {
  investment: any
  token: string
  reloadData: any
}

const DetailInvestment = ({ investment, token, reloadData }: IProps) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const screens = useBreakpoint()

  useEffect(() => {
    if (!investment) {
      form.resetFields()
    } else {
      form.setFieldsValue(investment)
    }
  }, [form, investment])

  const onSubmit = (values: any) => {
    setSubmitLoading(true)

    // console.log(values)

    Api.post(`investments/${investment?.id}?_method=put`, token, null, values)
      .then((res: any) => {
        notification.success({ message: 'success to update payment data' })

        setTimeout(() => {
          reloadData()
        }, 350)
      })
      .catch((err) => {
        message.error({
          content: 'Failed to update data, please check your input',
        })
      })
      .finally(() => setSubmitLoading(false))
  }

  return (
    <div>
      <Typography.Title level={4} className="m-0">
        Investment Detail of {investment?.campaign_name}
      </Typography.Title>
      <br />
      <Form layout={'vertical'}>
        <Row gutter={15}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Investor Full Name">
              <Input value={investment?.user_name} readOnly />
            </Form.Item>
            <Form.Item label="Investor Email Address">
              <Input value={investment?.user.email} readOnly />
            </Form.Item>
            <Form.Item label="Investor Country">
              <Input value={investment?.user.country} readOnly />
            </Form.Item>
            <Form.Item label="Investment Date">
              <Input value={investment?.created_at} readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Campaign Name">
              <Input value={investment?.campaign_name} readOnly />
            </Form.Item>
            <Form.Item label="Project Type">
              <Input value={investment?.campaign.type} readOnly />
            </Form.Item>
            <Form.Item label="Total Funding">
              <Input value={investment?.amount} readOnly />
            </Form.Item>
            <Form.Item label="Expected Payout">
              <Input value={investment?.payout} readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider plain>
        <b>Payment Detail</b>
      </Divider>

      <Row gutter={25} justify="center" align={'middle'}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form
            form={form}
            autoComplete={'off'}
            onFinish={onSubmit}
            layout={'vertical'}
          >
            <Form.Item name={`payment_method`} label="Payment Type">
              <Select placeholder="Please select type">
                <Select.Option value="bank-transfer">
                  Bank Transfer
                </Select.Option>
                <Select.Option value="kb-wallet">KB Wallet</Select.Option>
                <Select.Option value="paypal" disabled>
                  Paypal
                </Select.Option>
                <Select.Option value="xfers" disabled>
                  Xfers
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={`bank_name`} label="Bank Name">
              <Input
                placeholder="Bank name"
                disabled={investment?.payment_method !== 'bank-transfer'}
              />
            </Form.Item>
            <Form.Item name={`bank_account`} label="Account Name">
              <Input
                placeholder="Account name"
                disabled={investment?.payment_method !== 'bank-transfer'}
              />
            </Form.Item>
            <Form.Item name={`bank_number`} label="Account Number">
              <Input
                placeholder="Account number"
                disabled={investment?.payment_method !== 'bank-transfer'}
              />
            </Form.Item>
            <Form.Item name={`is_paid`} label="Status Payment">
              <Select placeholder="Please select status payment">
                <Select.Option value={1}>Paid</Select.Option>
                <Select.Option value={2}>Pending Approval</Select.Option>
                <Select.Option value={0}>Unpaid</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                disabled={investment?.is_paid === 1}
                loading={submitLoading}
              >
                Update Payment Status
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          {investment?.bank_proof ? (
            <div className="text-center">
              <Link target={`_blank`} href={investment?.bank_proof}>
                <img
                  src={investment?.bank_proof}
                  style={{ maxHeight: '450px', maxWidth: '100%' }}
                  alt="investment-bank-proof"
                />
              </Link>
            </div>
          ) : (
            <img
              src="https://dummyimage.com/600x400/8c8c8c/fff&text=File+not+found"
              width={`100%`}
              alt="investment-bank-proof-dummy"
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default DetailInvestment
