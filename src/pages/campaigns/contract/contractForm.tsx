import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  InputNumber,
  message,
  Row,
  Space,
} from 'antd'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface Iprops {
  campaign: any
  contract: any
  user: any
}

const CampaignContractForm = ({ campaign, contract, user }: Iprops) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const screens = useBreakpoint()

  const onFinish = (values: any) => {
    console.log('Success:', values)
    setLoading(true)

    Api.post(
      `campaign/contract/detail/${contract?.id}`,
      user?.token,
      null,
      values
    )
      .then((res: any) => {
        console.log('update response ===> ', res)
        message.success({ content: 'Success to update data contract' })
      })
      .catch((err) => {
        console.log('Error => ', err)
        message.error({ content: err.data.message })
      })
      .finally(() => setLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const calculatePayout = (value: any) => {
    if (contract) {
      const fee_kb = value ? parseFloat(parseFloat(value).toFixed(2)) : 0
      const exchange_rate = form.getFieldValue('exchange_rate')
        ? parseFloat(form.getFieldValue('exchange_rate'))
        : 1

      let fee_return =
        parseFloat(contract.campaign_funding) *
        (parseFloat(contract.investor_return) / 100)
      const total_payout =
        parseFloat(contract.campaign_funding) + fee_kb + fee_return
      const total_payout_idr = total_payout * exchange_rate

      form.setFieldValue('wakalah_fee', fee_kb)
      form.setFieldValue('investor_fee', fee_return)
      form.setFieldValue('total_payout', total_payout)
      form.setFieldValue('total_payout_idr', total_payout_idr)
    }

    return false
  }

  useEffect(() => {
    let fee_kb = contract?.total_funding * (contract?.sub_agent_fee / 100)
    calculatePayout(fee_kb)
  }, [])

  return (
    <Form
      form={form}
      name="basic"
      initialValues={contract}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      style={screens.xs || screens.sm ? { padding: '0 15px' } : {}}
      size="large"
    >
      <Divider orientation="left" dashed>
        Automatically Generated
      </Divider>

      <Row gutter={[20, 0]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Contract Number" name="contract_no">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Current Funding Amount" name="campaign_funding">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              disabled
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Wakalah Fee (Kapital Boost)" name="wakalah_fee">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              onChange={(v: any) => calculatePayout(v)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Wakalah Fee (Investor)" name="investor_fee">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              disabled
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Total Payout" name="total_payout">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              disabled
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item label="Total Payout (IDR)" name="total_payout_idr">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" dashed>
        Company Information
      </Divider>

      <Row gutter={[30, 0]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Company Name" name="company_name_en">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[30, 0]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Email 1" name="email_1">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Email 2" name="email_2">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Signee 1" name="signee_1">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Signee 2" name="signee_2">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="ID Number 1" name="id_number_1">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="ID Number 2" name="id_number_2">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Customer Name (English)" name="customer_name_en">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Customer Name (Bahasa)" name="customer_name_ba">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Admin Fee (%)" name="admin_fee_percentage">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Agent Fee (%)"
            name="investor_return"
            tooltip="Filed not found (return can get in campaign)"
          >
            {/* Added the campaign information to contract object - setting it in API */}
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Exchange Rate (IDR)" name="exchange_rate">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Variable Funding (IDR)" name="asset_cost_local">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Alamat Perusahaan" name="transfer_info_en">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Bilyet Giro Information (Bahasa)"
            name="transfer_info_ba"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Syarat 1" name="other_en">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Syarat 2" name="payment_method_ba">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="UKM Phone Number" name="payment_method_en">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Other Requirements" name="other_ba">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>

      {/* Form for SME - Asset Purcashing */}
      {campaign?.subtype === 'ASSET PURCHASE FINANCING' && (
        <>
          <Divider orientation="left" dashed>
            Asset Financing
          </Divider>

          <Row gutter={[30, 0]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Asset to be purchased" name="purchase_asset_en">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Asset to be purchased ID"
                name="purchase_asset_ba"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Campaign Country Currency"
                name="campaign_local_currency"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Purchase cost contribution date / Disburstment date"
                name="purchase_date"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {/* Form for SME - Asset Purcashing */}
      {campaign?.subtype === 'INVOICE FINANCING' && (
        <>
          <Divider orientation="left" dashed>
            Invoice Financing
          </Divider>

          <Row gutter={[30, 0]}>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item label="Maturity Date" name="maturity_date">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item label="Repayment Date" name="repayment_date">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item label="Sub-Agency Fees (%)" name="sub_agent_fee">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Receivable Amount as per invoice"
                name="receivable_amount_invoice"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Receivable Amount as per invoice (SGD)"
                name="receivable_amount_sgd"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Akta Number" name="akta_no_en">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Akta Number (ID)" name="akta_no_ba">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Underlying Document"
                name="underlying_document_en"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label="Underlying Document (ID)"
                name="underlying_document_ba"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Divider orientation="left" dashed />

      <Row>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '185px' }}
              loading={loading}
              icon={<SendOutlined />}
            >
              Submit
            </Button>
            <Button>Reset</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default CampaignContractForm
