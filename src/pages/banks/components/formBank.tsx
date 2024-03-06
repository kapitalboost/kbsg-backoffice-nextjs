import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Grid,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Switch,
} from 'antd'

import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface Props {
  isShow: boolean
  handleHide: any
  action: string
  bank?: any
  token: string
  reInit: any
}

const FormBank = ({
  isShow,
  handleHide,
  action,
  bank,
  token,
  reInit,
}: Props) => {
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [countryOptions, setCountryOptions] = useState<any>(null)
  const screens = useBreakpoint()

  const countryOption = async () => {
    await Api.get(`countries-option`, token)
      .then((res: any) => {
        setCountryOptions(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (!isShow) {
      setData({})
      form.resetFields()
    } else {
      countryOption()
      form.setFieldsValue(bank)
    }
  }, [form, isShow, bank])

  const onFinish = (values: any) => {
    setLoadingSubmit(true)

    const uri = action === 'create' ? `banks` : `banks/${bank?.id}?_method=put`

    Api.post(uri, token, null, values)
      .then((res: any) => {
        notification.success({ message: res.message })
        reInit()
        handleHide()
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => setLoadingSubmit(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      title={action === 'create' ? 'Create new bank' : 'Edit data bank'}
      open={isShow}
      onCancel={handleHide}
      footer={false}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="mt-2"
      >
        {/* <Form.Item
          label="Bank Code"
          name="bank_code"
          rules={[{ required: true, message: 'Please input bank code!' }]}
        >
          <Input placeholder="Enter the bank code" />
        </Form.Item> */}

        <Form.Item
          label="BIC / Swift code"
          name="bic_code"
          rules={[
            { required: true, message: 'Please input project bic code!' },
          ]}
        >
          <Input placeholder="Enter the bic code" />
        </Form.Item>

        <Form.Item
          label="IBAN code"
          name="iban_code"
          rules={[{ required: true, message: 'Please input iban_code!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="bank_name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Currency"
          name="currency"
          rules={[{ required: true, message: 'Please input currency!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Select
            placeholder="Select country"
            showSearch
            allowClear
            options={countryOptions}
          ></Select>
        </Form.Item>

        <Form.Item label="Is Enable" name="is_enable" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: screens.md ? 6 : 0,
            xs: 24,
            sm: 24,
            md: 18,
            lg: 18,
          }}
        >
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSubmit}
              icon={<SendOutlined />}
              style={{ width: '150px' }}
            >
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormBank
