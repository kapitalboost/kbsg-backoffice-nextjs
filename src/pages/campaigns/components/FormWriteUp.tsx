import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Grid,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tooltip,
  Upload,
  message,
  notification,
} from 'antd'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

import type { UploadFile } from 'antd/es/upload/interface'
import type { UploadProps } from 'antd'
import { Api } from '@/api/api'

import weekday from 'dayjs/plugin/weekday'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import TeamInspector from '../components/teamInspector'
import Link from 'next/link'

import type { MenuProps } from 'antd'
import { GetServerSidePropsContext } from 'next'
import dayjs from 'dayjs'
import { PlusOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Singapore')

const API_URL = process.env.NEXT_PUBLIC_API_URL
const tiny_api_key = process.env.NEXT_PUBLIC_TINY_KEY
const { useBreakpoint } = Grid

const { Option } = Select

interface IProps {
  form: any
  campaign: any
  slug: any
  user: any
  loadCampaign: any
  campaignOptions: any
}

const FormWriteUp = ({
  slug,
  user,
  loadCampaign,
  campaign,
  form,
  campaignOptions,
}: IProps) => {
  const editorRef = useRef<any>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [fetchError, setFetchError] = useState({
    show: false,
    message: '',
  })
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState<UploadFile[]>([])
  const [cover, setCover] = useState<UploadFile[]>([])

  const onFinish = (values: any) => {
    setLoading(true)

    Api.post(`campaign/update/${slug}`, user?.token, user.id, {
      ...values,
    })
      .then((res: any) => {
        notification.success({ message: 'Success to update campaign' })

        setTimeout(() => {
          loadCampaign(slug)
        }, 500)
      })
      .catch((err: any) => {
        notification.error({ message: 'error' })
      })
  }

  const handleEditorChange = (content: any, editor: any) => {
    // console.log('Content was updated:', content)
    // setDescription(content)
    form.setFieldValue('description', content)
  }

  const handleChangeLogo: UploadProps['onChange'] = ({ file, fileList }) => {
    // let newFileList = [...info.fileList]
    if (file.status === 'done') {
      form.setFieldValue('logo', file.response.data.file_path)
    }
  }

  const handleChangeCover: UploadProps['onChange'] = ({ file, fileList }) => {
    // let newFileList = [...info.fileList]
    if (file.status === 'done') {
      form.setFieldValue('cover_image', file.response.data.file_path)
    }
  }

  const regeneratePassword = () => {
    setPasswordLoading(true)
    setTimeout(() => {
      Api.get(`campaign/generate-password`, user?.token)
        .then((res: any) => {
          console.log(res)
          form.setFieldValue('password', res.password)
        })
        .catch((err: any) => {
          console.log(err)
          notification.error({ message: 'failed to generate password' })
        })
        .finally(() => setPasswordLoading(false))
    }, 1000)
  }

  const onFinishFailed = () => {
    message.error('Submit failed! Please check the required field.')
  }

  return (
    <Form
      form={form}
      scrollToFirstError
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      size="large"
    >
      <Divider orientation="left" dashed>
        Company Information
      </Divider>

      <Row gutter={[20, 0]}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Company Name"
            name="company_name"
            rules={[
              {
                required: true,
                message: 'Please enter company name!',
              },
            ]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <Form.Item
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: 'Please select country',
              },
            ]}
          >
            <Select placeholder="Select country" allowClear>
              <Option value="INDONESIA">INDONESIA</Option>
              <Option value="SINGAPORE">SINGAPORE</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <Form.Item
            label="Industry"
            name="industry"
            rules={[{ required: true, message: 'Please enter industry!' }]}
          >
            <Input placeholder="Enter industry" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Company Director"
            name="company_director"
            rules={[
              {
                required: true,
                message: 'Please enter the director!',
              },
            ]}
          >
            <Input placeholder="Enter the director" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Company Director's Email"
            name="company_director_email"
            rules={[
              {
                required: true,
                message: "Please enter the director's email!",
              },
            ]}
          >
            <Input placeholder="Enter the director's email" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" dashed>
        Campaign Details
      </Divider>

      <Row gutter={[20, 0]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Campaign Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter campaign name!',
              },
            ]}
          >
            <Input placeholder="Enter campaign name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Acronim"
            name="acronim"
            rules={[
              {
                required: true,
                message: 'Please enter campaign acronim!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            label="Project Type"
            name="type"
            rules={[
              {
                required: true,
                message: 'Please select project type!',
              },
            ]}
          >
            <Select placeholder="Select project type" allowClear>
              <Option value="sme">SME Crowdfunding</Option>
              <Option value="donation">Donation</Option>
              <Option value="private">Private Crowdfunding</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            label="SME Sub Type"
            name="subtype"
            rules={[{ required: true, message: 'Please select subtype!' }]}
          >
            <Select placeholder="Select SME subtype" allowClear>
              <Option value="ASSET PURCHASE FINANCING">
                ASSET PURCHASE FINANCING
              </Option>
              <Option value="INVOICE FINANCING">INVOICE FINANCING</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Password">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item noStyle name="password">
                <Input readOnly />
              </Form.Item>
              <Form.Item noStyle>
                <Tooltip title="Regenerate password">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => regeneratePassword()}
                    loading={passwordLoading}
                  />
                </Tooltip>
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </Col>

        <Divider dashed />

        <Col xs={12} sm={12} md={8} lg={8}>
          <Form.Item
            label="Tenor"
            name="tenor"
            rules={[
              {
                required: true,
                message: 'Please enter the tenor',
              },
            ]}
            getValueProps={(i) => ({ value: parseFloat(i) })}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <Form.Item
            label="Project Return"
            name="return"
            rules={[
              {
                required: true,
                message: 'Please enter project return',
              },
            ]}
            getValueProps={(i) => ({ value: parseFloat(i) })}
          >
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={0}
              stringMode
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Risk"
            name="risk"
            rules={[
              {
                required: true,
                message: 'Please select risk of campaign!',
              },
            ]}
          >
            <Select
              placeholder="Select risk of campaign"
              // onChange={onGenderChange}
              allowClear
            >
              <Option value="N/A">N/A</Option>
              <Option value="A">A</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Minimum Investment Amount"
            name="minimum_invest_amount"
            rules={[
              {
                required: true,
                message: 'Please enter the minimum invest amount',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={200}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Total Funding Amount"
            name="total_invest_amount"
            rules={[
              {
                required: true,
                message: 'Please enter funding amount',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={100000}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Funded" name="funded">
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              disabled
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label={`Release Date & Time`} name="release_datetime">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label={`Close Date & Time`} name="expiry_datetime">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            label="Status"
            name="is_enable"
            rules={[
              {
                required: true,
                message: 'Please select campaign status!',
              },
            ]}
          >
            <Select
              placeholder="Select campaign status"
              // onChange={onGenderChange}
              allowClear
            >
              <Option value={true}>Online</Option>
              <Option value={false}>Offline</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            label="Email Payout Reminder"
            name="send_payout_reminder"
            rules={[
              {
                required: true,
                message: 'Please select status payout reminder!',
              },
            ]}
          >
            <Select
              placeholder="Select status payout reminder"
              // onChange={onGenderChange}
              allowClear
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Disable</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item
            label="Email Requirements"
            name="requirement_reminder"
            rules={[
              {
                required: true,
                message: 'Please select status email requirement!',
              },
            ]}
          >
            <Select
              placeholder="Select status email requirement"
              // onChange={onGenderChange}
              allowClear
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Disable</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Form.Item label={`Snippet`} name="snippet" required>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item label="Upload Logo" name="logo">
            <Upload
              action={`${API_URL}/campaign/upload-image/${campaign?.slug}`}
              headers={{
                Authorization: `Bearer ${user?.token}`,
              }}
              listType="picture-circle"
              onChange={handleChangeLogo}
              maxCount={1}
              defaultFileList={logo}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item label="Upload Cover" name="cover_image">
            <Upload
              action={`${API_URL}/campaign/upload-image/${campaign?.slug}`}
              headers={{
                Authorization: `Bearer ${user?.token}`,
              }}
              listType="picture-card"
              maxCount={1}
              onChange={handleChangeCover}
              defaultFileList={cover}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Row className="mt-1 mb-1">
        <Col span={24}>
          <Form.Item
            label="Description"
            name={`description`}
            style={{ display: loading ? 'block' : 'none' }}
          >
            <Input style={{ visibility: 'hidden' }} />
            <div
              style={{
                height: 400,
                overflow: 'hidden',
                borderRadius: '10px',
                border: '2px solid #f1f1f1',
                padding: '15px',
              }}
              dangerouslySetInnerHTML={{
                __html: form?.getFieldValue('description'),
              }}
            ></div>
          </Form.Item>
          {!loading && (
            <Form.Item>
              <Editor
                apiKey={tiny_api_key}
                onInit={(evt, editor) => (editorRef.current = editor)}
                ref={editorRef}
                initialValue={description}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  width: '100%',
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Divider orientation="left" dashed>
        Related Campaigns
      </Divider>

      <Row className="mt-1" gutter={20}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Campaign 1" name="related_campaign_id_1">
            <Select
              showSearch
              filterOption={(input, option: any) =>
                (option?.label.toLowerCase() ?? '').includes(input)
              }
              placeholder="Select campaign"
              // onChange={onGenderChange}
              allowClear
              options={campaignOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Campaign 2" name="related_campaign_id_2">
            <Select
              showSearch
              filterOption={(input, option: any) =>
                (option?.label.toLowerCase() ?? '').includes(input)
              }
              placeholder="Select campaign"
              // onChange={onGenderChange}
              allowClear
              options={campaignOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Campaign 3" name="related_campaign_id_3">
            <Select
              showSearch
              filterOption={(input, option: any) =>
                (option?.label.toLowerCase() ?? '').includes(input)
              }
              placeholder="Select campaign"
              // onChange={onGenderChange}
              allowClear
              options={campaignOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" dashed></Divider>

      <Row>
        <Col span={12}>
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
            <Button onClick={() => loadCampaign(slug)}>Reset</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default FormWriteUp
