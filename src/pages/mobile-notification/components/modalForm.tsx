import { Api } from '@/api/api'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Upload,
  message,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import type { UploadFile, UploadProps } from 'antd'

interface iProps {
  token: string
  data?: any
  isOpen: boolean
  handleClose: any
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const ModalFormMobileNotification = ({
  token,
  isOpen,
  handleClose,
  data,
}: iProps) => {
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<UploadFile[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)

      if (data.image) {
        setImageFile(data.image)
      }
    } else {
      form.resetFields()
      setImage([])
    }
  }, [isOpen])

  const setImageFile = (image_url: string) => {
    let files: any = []
    let itemImage = {
      uid: Math.floor(1000 + Math.random() * 9000),
      name: `file-image`,
      status: 'done',
      url: image_url,
    }

    files.push(itemImage)
    setImage(files)
  }

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

  const handleChangeImage: UploadProps['onChange'] = ({ file, fileList }) => {
    setImage(fileList)

    if (file.status === 'done') {
      form.setFieldValue('image', file.response.data.file_path)

      // set file url into image variable
      setImageFile(file.response.data.file_path)
    }
  }

  const onRemoveImage: UploadProps['onRemove'] = (file) => {
    // console.log(file)
    setImage([])
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

        {isOpen && (
          <Form.Item label="Upload Image" name="image">
            <Upload
              action={`${API_URL}/mobile-notifications/upload-image`}
              headers={{
                Authorization: `Bearer ${token}`,
              }}
              listType="picture-card"
              onChange={handleChangeImage}
              maxCount={1}
              fileList={image}
              onRemove={onRemoveImage}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        )}

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
