import { Api } from '@/api/api'
import { SendOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  message,
} from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
  isModalOpen: boolean
  handleCancel: any
  action: string
  token: string
  id?: number
  onReloadData: any
}

const FormTeam = ({
  isModalOpen,
  handleCancel,
  action,
  token,
  id,
  onReloadData,
}: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onInit = async () => {
    setLoading(true)
    await Api.get(`team-analyzers/${id}`, token)
      .then((res: any) => {
        form.setFieldsValue(res.data)
      })
      .catch((err) => {
        message.error(err.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    onReset()

    if (isModalOpen) {
      if (id !== 0) {
        onInit()
      }
    }
  }, [isModalOpen])

  const onFinish = async (values: any) => {
    setLoading(true)
    const uri =
      action === 'create'
        ? `team-analyzers`
        : `team-analyzers/${id}?_method=put`

    await Api.post(uri, token, null, values)
      .then((res: any) => {
        message.success(res.message)
        onReloadData()
        handleCancel()
      })
      .catch((err) => {
        if (err.data) {
          message.error(err.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <Modal
      title={action === 'create' ? 'Create new team' : 'Edit team'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600, marginTop: '30px' }}
        layout="vertical"
        size="large"
        disabled={loading}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Not Active" />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'Business Development', label: 'Business Development' },
              { value: 'Risk', label: 'Risk' },
            ]}
          />
        </Form.Item>

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
          <Button onClick={onReset}>Reset</Button>
        </Space>
      </Form>
    </Modal>
  )
}

export default FormTeam
