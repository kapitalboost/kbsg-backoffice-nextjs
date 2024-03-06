import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Grid,
  Input,
  Modal,
  notification,
  Select,
  Space,
} from 'antd'

import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface Props {
  isShow: boolean
  handleHide: any
  action: string
  admin?: any
  token: string
  reloadData: any
}

const FormAdmin = ({
  isShow,
  handleHide,
  action,
  admin,
  token,
  reloadData,
}: Props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const screens = useBreakpoint()

  useEffect(() => {
    if (!isShow) {
      form.resetFields()
    } else {
      form.setFieldsValue(admin)
    }
  }, [form, isShow, admin])

  const onFinish = (values: any) => {
    setLoading(true)
    const url =
      action === 'create' ? `admins` : `admins/${admin?.id}?_method=put`

    Api.post(url, token, null, values)
      .then((res: any) => {
        notification.success({ message: res.message })
        reloadData()

        setTimeout(() => {
          handleHide()
        }, 500)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      title={action === 'create' ? `Create New Admin` : `Edit Data Admin`}
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
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input placeholder="Enter the name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input project email!' }]}
        >
          <Input placeholder="Enter the email" autoComplete={`false`} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          extra={
            action === 'edit'
              ? "Leave blank if you don't want to change the password"
              : null
          }
          rules={[
            {
              required: action === 'create',
              message: 'Please input password!',
            },
          ]}
        >
          <Input.Password autoComplete={`false`} />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select placeholder="Select role" allowClear>
            <Select.Option value="admin">admin</Select.Option>
            <Select.Option value="super admin">super admin</Select.Option>
          </Select>
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
              loading={loading}
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

export default FormAdmin
