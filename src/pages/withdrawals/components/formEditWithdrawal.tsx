import {
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Upload,
} from 'antd'
import { PlusOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import { Api } from '@/api/api'
import type { UploadProps } from 'antd'

import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'

const { useBreakpoint } = Grid

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Singapore')

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Props {
  isShow: boolean
  withdraw: any
  handleHide: any
  token: string
  reinitData: any
}

const FormEditWithdrawal = ({
  isShow,
  withdraw,
  handleHide,
  token,
  reinitData,
}: Props) => {
  const [form] = Form.useForm()

  const [userOptions, setUserOptions] = useState<any>(null)
  const [userBankOptions, setUserBankOptions] = useState<any>(null)
  const [onLoadBank, setOnLoadBank] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const screens = useBreakpoint()

  useEffect(() => {
    if (!isShow) {
      form.resetFields()
    } else {
      form.setFieldsValue(withdraw)

      const transfer_at = withdraw?.transfer_at
        ? dayjs(withdraw?.transfer_at)
        : null
      form.setFieldValue('transfer_at', transfer_at)

      form.setFieldValue('proof_file', [
        {
          uid: '1',
          name: 'proof_file',
          status: 'done',
          url: withdraw?.proof,
        },
      ])
    }
  }, [form, isShow])

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
  }

  const onFinish = (values: any) => {
    console.log(values)

    setSubmitLoading(true)

    Api.post(`withdraw/${withdraw?.id}?_method=put`, token, null, {
      ...values,
      transfer_at: dayjs(values.transfer_at).format('YYYY-MM-DD H:mm:ss'),
    })
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
        title={`Edit withdrawal - ${withdraw?.user_full_name}`}
        open={isShow}
        onCancel={handleHide}
        footer={false}
        style={{ top: '15px' }}
        centered
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
          size="large"
        >
          <Form.Item
            label="Bank ID"
            name="bank_account_id"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              disabled
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status" allowClear>
              <Select.Option value={true}>Paid</Select.Option>
              <Select.Option value={false}>Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Transfer at"
            name="transfer_at"
            rules={[{ required: true, message: 'Date transfer is required' }]}
          >
            <DatePicker
              showTime
              format={`YYYY-MM-DD H:mm:ss`}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Proof" name="proof" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Proof"
            name="proof_file"
            rules={[{ required: true, message: 'Proof file is required' }]}
          >
            <Upload
              action={`${API_URL}/withdraw/upload?email=${withdraw?.user_email}`}
              headers={{
                Authorization: `Bearer ${token}`,
              }}
              listType="picture-card"
              onChange={handleUpload}
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

export default FormEditWithdrawal
