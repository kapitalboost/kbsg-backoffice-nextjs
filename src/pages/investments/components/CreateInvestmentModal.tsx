import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from 'antd'
import { useEffect, useState } from 'react'

interface iProps {
  user: any
  isModalOpen: boolean
  setIsModalOpen: any
}
const CreateInvestmentModal = ({
  user,
  isModalOpen,
  setIsModalOpen,
}: iProps) => {
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [campaignOptions, setCampaignOptions] = useState([])

  const loadCampaignOptions = () => {
    Api.get(`campaign/options`, user.token)
      .then((res: any) => {
        setCampaignOptions(res.data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  useEffect(() => {
    loadCampaignOptions()
  }, [])

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <>
      <Modal
        title="Create New Investment"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
        centered
      >
        <Row
          gutter={25}
          justify="center"
          align={'middle'}
          style={{ marginTop: '20px' }}
        >
          <Col span={24}>
            <Form
              form={form}
              autoComplete={'off'}
              onFinish={onSubmit}
              layout={'vertical'}
            >
              <Form.Item name={`user`} label="Select user">
                <Input placeholder="Enter user name or email address" />
              </Form.Item>
              <Form.Item name={`campaign`} label="Select campaign">
                {/* <Input placeholder="Enter campaign name or accronim" /> */}
                <Select
                  showSearch
                  filterOption={(input, option: any) =>
                    (option?.label.toLowerCase() ?? '').includes(input)
                  }
                  placeholder="Enter campaign name or accronim"
                  allowClear
                  options={campaignOptions}
                />
              </Form.Item>
              <Form.Item name={`amount`} label="Funding Amount">
                <Input disabled />
              </Form.Item>

              <Divider />

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
                <Input placeholder="Bank name" />
              </Form.Item>
              <Form.Item name={`bank_account`} label="Account Name">
                <Input placeholder="Account name" disabled />
              </Form.Item>
              <Form.Item name={`bank_number`} label="Account Number">
                <Input placeholder="Account number" disabled />
              </Form.Item>
              <Form.Item name={`is_paid`} label="Status Payment">
                <Select placeholder="Please select status payment">
                  <Select.Option value={1}>Paid</Select.Option>
                  <Select.Option value={2}>Pending Approval</Select.Option>
                  <Select.Option value={0}>Unpaid</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginTop: '35px', marginBottom: '0' }}>
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SendOutlined />}
                    loading={submitLoading}
                  >
                    Submit Investment
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default CreateInvestmentModal
