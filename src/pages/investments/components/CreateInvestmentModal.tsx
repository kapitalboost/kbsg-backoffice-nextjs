import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
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
  const [userOptions, setUserOptions] = useState([])
  const [bankOptions, setBankOptions] = useState([])
  const [bankType, setBankType] = useState(null)

  const loadCampaignOptions = () => {
    Api.get(`campaign/options`, user.token)
      .then((res: any) => {
        setCampaignOptions(res.data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const loadUserOptions = (newValue: string) => {
    if (newValue.length > 2) {
      Api.get(`users/option?filter=${newValue}`, user.token)
        .then((res: any) => {
          setUserOptions(res.data)
        })
        .catch((err: any) => {
          console.log(err)
        })
    }

    return false
  }

  const loadBankOptions = () => {
    const user_id = form.getFieldValue('user_id')

    Api.get(`users/${user_id}/banks/option`, user.token)
      .then((res: any) => {
        setBankOptions(res.data)
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
              <Form.Item name={`user_id`} label="Select user">
                <Select
                  showSearch
                  placeholder={`Enter user name or email address`}
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  filterOption={false}
                  onSearch={loadUserOptions}
                  notFoundContent={null}
                  options={userOptions}
                />
              </Form.Item>

              <Form.Item name={`campaign_id`} label="Select campaign">
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
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>

              <Divider />

              <Form.Item name={`payment_method`} label="Payment Type">
                <Select
                  placeholder="Please select type"
                  onChange={(val) => {
                    setBankType(val)
                  }}
                >
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

              <Form.Item name={`bank`} label="Bank Name">
                <Select
                  showSearch
                  filterOption={(input, option: any) =>
                    (option?.label.toLowerCase() ?? '').includes(input)
                  }
                  placeholder="Select bank account"
                  allowClear
                  options={bankOptions}
                  onFocus={() => loadBankOptions()}
                  disabled={bankType !== 'bank-transfer'}
                />
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
