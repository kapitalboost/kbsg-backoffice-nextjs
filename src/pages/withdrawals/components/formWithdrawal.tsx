import {
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Select,
  Space,
  Upload,
} from 'antd'
import { PlusOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import { Api } from '@/api/api'
import type { UploadProps } from 'antd'

const fileList: UploadFile[] = []

const { useBreakpoint } = Grid

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Props {
  isShow: boolean
  handleHide: any
  token: string
  reinitData: any
}

const FormWithdrawal = ({ isShow, handleHide, token, reinitData }: Props) => {
  const [form] = Form.useForm()
  const [proof, setProof] = useState<UploadFile[]>([])
  const [userOptions, setUserOptions] = useState<any>(null)
  const [userBankOptions, setUserBankOptions] = useState<any>(null)
  const [onLoadBank, setOnLoadBank] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const screens = useBreakpoint()

  useEffect(() => {
    if (!isShow) {
      form.resetFields()
    }
  }, [form, isShow])

  const getUserOptions = (filter: string) => {
    if (filter.length > 3) {
      Api.get(`users/option?filter=${filter}`, token).then((res: any) => {
        setUserOptions(res.data)
      })
    }
  }

  const getUserBankAccounts = () => {
    setOnLoadBank(true)
    form.setFieldValue('bank_account_id', undefined)
    Api.get(`users/${form.getFieldValue('user_id')}/banks/option`, token)
      .then((res: any) => {
        setUserBankOptions(res.data)
      })
      .finally(() => setOnLoadBank(false))
  }

  const handleUpload: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        const { data } = file.response

        file.uid = Math.random().toString()
        file.name = Math.random().toString()
        file.url = data.file_path

        form.setFieldValue('proof', data.file_path)
      }
      return file
    })

    setProof(newFileList)
  }

  const onFinish = (values: any) => {
    setSubmitLoading(true)

    Api.post(`withdraw`, token, null, values)
      .then((res: any) => {
        notification.success({ message: res.message })

        setTimeout(() => {
          reinitData()
          handleHide()
        }, 250)
      })
      .catch((err) => {
        if (err === 'ERR_NETWORK') {
          message.error({
            content:
              'Internal Server Error, Please try again later or contact admin',
          })
        } else {
          message.error({ content: err.data.message })
        }
      })
      .finally(() => setSubmitLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Modal
        title="Add withdrawal"
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
          <Form.Item name="user_id" label="User" rules={[{ required: true }]}>
            <Select
              placeholder="Select user"
              allowClear
              showSearch
              filterOption={false}
              onSearch={(value) => {
                getUserOptions(value)
              }}
              defaultActiveFirstOption={false}
              options={userOptions}
              onSelect={getUserBankAccounts}
            ></Select>
          </Form.Item>

          <Form.Item
            name="bank_account_id"
            label="Bank Account"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select user bank account"
              allowClear
              filterOption={false}
              options={userBankOptions}
              disabled={
                onLoadBank || form.getFieldValue('user_id') === undefined
              }
            ></Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status" allowClear>
              <Select.Option value={1}>Paid</Select.Option>
              <Select.Option value={0}>Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Proof"
            name="proof"
            rules={[{ required: true, message: 'Please upload the proof!' }]}
          >
            <Upload
              action={`${API_URL}/withdraw/upload`}
              headers={{
                Authorization: `Bearer ${token}`,
              }}
              listType="picture-card"
              onChange={handleUpload}
              defaultFileList={[...proof]}
              maxCount={1}
            >
              {/* <Button icon={<UploadOutlined />}>Upload</Button> */}
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
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
                loading={submitLoading}
                icon={<SendOutlined />}
                style={{ width: '150px' }}
              >
                Submit
              </Button>
              <Button
                onClick={() => form.resetFields()}
                disabled={submitLoading}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FormWithdrawal
