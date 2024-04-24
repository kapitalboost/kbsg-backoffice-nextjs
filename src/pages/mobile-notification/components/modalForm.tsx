import { Api } from '@/api/api'
import { CheckOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Space, message, notification } from 'antd'
import { useEffect, useState } from 'react'

interface iProps {
  token: string
  data?: any
  isOpen: boolean
  handleClose: any
}

const ModalFormMobileNotification = ({
  token,
  isOpen,
  handleClose,
  data,
}: iProps) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [isOpen])

  const onSubmit = (values: any) => {
    setLoading(true)

    const action = data
      ? `mobile-notifications/${data.id}?_method=put`
      : `mobile-notifications`

    Api.post(action, token, null, values)
      .then((res: any) => {
        message.success(res.message)

        handleClose()
      })
      .catch((err: any) => {
        message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={data ? 'Edit Message' : 'Create Message'}
      open={isOpen}
      onCancel={handleClose}
      footer={false}
    >
      <Form
        form={form}
        autoComplete={'off'}
        onFinish={onSubmit}
        layout={'vertical'}
      >
        <Form.Item name={`title`} label="Title">
          <Input />
        </Form.Item>

        <Form.Item name={`message`} label="Message">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item style={{ marginTop: '35px', marginBottom: '0' }}>
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              icon={<CheckOutlined />}
            >
              Submit Investment
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalFormMobileNotification
