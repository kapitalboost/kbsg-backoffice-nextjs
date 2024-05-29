import { Api } from '@/api/api'
import {
  CloseCircleOutlined,
  DownOutlined,
  LoadingOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import router from 'next/router'
import { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'

import weekday from 'dayjs/plugin/weekday'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import dayjs from 'dayjs'
import type { UploadFile } from 'antd/es/upload/interface'
import type { UploadProps } from 'antd'
import { GetServerSidePropsContext } from 'next'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Singapore')

const { Option } = Select
const API_URL = process.env.NEXT_PUBLIC_API_URL

interface IProps {
  user: any
}

const FormUser = ({ user }: IProps) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [dataUser, setDataUser] = useState<any>(null)
  const [countryOptions, setCountryOptions] = useState<any>(null)
  const [fileNric, setFileNric] = useState<UploadFile[]>([])
  const [fileNricBack, setFileNricBack] = useState<UploadFile[]>([])
  const [fileAddressProof, setFileAddressProof] = useState<UploadFile[]>([])

  // const user_id = router.query.id
  const { id } = router.query

  const initData = async () => {
    setLoading(true)

    await Api.get(`users/${id}`, user?.token)
      .then((res: any) => {
        const { data } = res

        if (data.nric_file) {
          let name = data.nric_file.split('/')
          let nric_file = fileNric

          nric_file = [
            {
              uid: Math.random().toString(),
              name: name[name.length - 1].toString(),
              status: 'done',
              url: data.nric_file,
            },
          ]

          setFileNric(nric_file)
        }

        if (data.nric_file_back) {
          let name = data.nric_file_back.split('/')
          let nric_file_back = fileNricBack

          nric_file_back = [
            {
              uid: Math.random().toString(),
              name: name[name.length - 1].toString(),
              status: 'done',
              url: data.nric_file_back,
            },
          ]

          setFileNricBack(nric_file_back)
        }

        if (data.address_proof) {
          let name = data.address_proof.split('/')
          let address_proof = fileAddressProof

          address_proof = [
            {
              uid: Math.random().toString(),
              name: name[name.length - 1].toString(),
              status: 'done',
              url: data.address_proof,
            },
          ]

          setFileAddressProof(address_proof)
        }

        const params = {
          ...data,
          dob: data.dob ? dayjs(data.dob) : null,
        }

        setDataUser(params)
        form.setFieldsValue(params)
        countryOption()
      })
      .catch((err) => {
        console.log(err)
        setDataUser(false)
        // message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  const countryOption = async () => {
    await Api.get(`countries-option`, user?.token)
      .then((res: any) => {
        setCountryOptions(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    initData()
  }, [id])

  const onFinish = (values: any) => {
    setButtonLoading(true)
    console.log('Success:', values)
    Api.post(`users/${dataUser.id}?_method=put`, user?.token, null, values)
      .then((res: any) => {
        notification.success({ message: res.message })
        initData()
      })
      .catch((err) => {
        notification.error({ message: err.data.message })
      })
      .finally(() => setButtonLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href={`/users/${id}/banks`}>Bank account</Link>,
    },
    {
      key: '2',
      label: <Link href={`/users/${id}/transactions`}>Transactions</Link>,
    },
  ]

  const handleUploadNric: UploadProps['onChange'] = ({
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

        form.setFieldValue('nric_file', data.file_path)
      }
      return file
    })

    setFileNric(newFileList)
  }

  const handleUploadNricBack: UploadProps['onChange'] = ({
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

        form.setFieldValue('nric_file_back', data.file_path)
      }
      return file
    })

    setFileNricBack(newFileList)
  }

  const handleUploadAddressProof: UploadProps['onChange'] = ({
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

        form.setFieldValue('address_proof', data.file_path)
      }
      return file
    })

    setFileAddressProof(newFileList)
  }

  return (
    <>
      <Breadcrumb style={{ margin: '0 0 16px' }}>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/users`}>List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Edit user
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        {loading ? (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2.5rem' }} />
            <h3>Loading..</h3>
          </div>
        ) : (
          <>
            {dataUser === false ? (
              <div className="text-center my-5">
                <Typography.Title level={2} type={'danger'}>
                  <CloseCircleOutlined style={{ fontSize: '5rem' }} />

                  <span style={{ display: 'block', marginTop: '0.565rem' }}>
                    User not found
                  </span>
                </Typography.Title>
                <br />
                <Link href={`/users`}>
                  <Button size="middle">BACK</Button>
                </Link>
              </div>
            ) : (
              <>
                <Typography.Title level={4} className="m-0">
                  Edit Data User : {dataUser?.full_name}
                </Typography.Title>
                <Form
                  form={form}
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="vertical"
                  className="mt-2"
                  size="large"
                >
                  <Row gutter={20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="First name"
                        name="firstname"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user first name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Last name"
                        name="lastname"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user last name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user email!',
                          },
                        ]}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Phone No."
                        name="phone_no"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user phone no!',
                          },
                        ]}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user birth date!',
                          },
                        ]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Country"
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user country!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Select country"
                          allowClear
                          options={countryOptions}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Nationality"
                        name="nationality"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user nationality!',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select country"
                          showSearch
                          allowClear
                          options={countryOptions}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Residential Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user residential!',
                          },
                        ]}
                      >
                        <Input.TextArea rows={2} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left" dashed>
                    Card Identity
                  </Divider>

                  <Row gutter={20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="IC Type"
                        name="ic_type"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user ic type!',
                          },
                        ]}
                      >
                        <Select placeholder="Select ic type" allowClear>
                          <Option value="Identity Card">Identity Card</Option>
                          <Option value="FIN">FIN</Option>
                          <Option value="Passport">Passport</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="IC Country"
                        name="ic_country"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user ic country!',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select country"
                          allowClear
                          showSearch
                          options={countryOptions}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Full name in IC"
                        name="ic_name"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user ic name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        label="Number NRIC / Passport"
                        name="nric"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the user ic number!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item label="Status verified" name="is_verified">
                        {/* <Input readOnly /> */}
                        <Select placeholder="Select status">
                          <Select.Option value={true}>Verified</Select.Option>
                          <Select.Option value={false}>
                            Not Verified
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item
                        label="ID Card/Passport (front)"
                        name={`nric_file`}
                      >
                        <Upload
                          action={`${API_URL}/users/upload/nric?email=${user?.email}`}
                          headers={{
                            Authorization: `Bearer ${user?.token}`,
                          }}
                          listType="picture-card"
                          maxCount={1}
                          fileList={fileNric}
                          onChange={handleUploadNric}
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item
                        label="ID Card/Passport (back)"
                        valuePropName="id_card_back"
                        name={`nric_file_back`}
                      >
                        <Upload
                          action={`${API_URL}/users/upload/nric_back?email=${user?.email}`}
                          headers={{
                            Authorization: `Bearer ${user?.token}`,
                          }}
                          listType="picture-card"
                          maxCount={1}
                          fileList={fileNricBack}
                          onChange={handleUploadNricBack}
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item
                        label="Proof of address"
                        valuePropName="proof_address"
                        name={`address_proof`}
                      >
                        <Upload
                          action={`${API_URL}/users/upload/address_proof?email=${user?.email}`}
                          headers={{
                            Authorization: `Bearer ${user?.token}`,
                          }}
                          listType="picture-card"
                          maxCount={1}
                          fileList={fileAddressProof}
                          onChange={handleUploadAddressProof}
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left" dashed>
                    Other
                  </Divider>

                  <Row gutter={20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item label="How you know us" name="how_you_know">
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item label="Status" name="status">
                        <Select placeholder="Select status" allowClear>
                          <Option value="new">New</Option>
                          <Option value="reviewing">
                            Waiting to be Reviewed
                          </Option>
                          <Option value="approved">Approved</Option>
                          <Option value="rejected">Rejected</Option>
                          <Option value="blacklisted">Blacklisted</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item label="Reset Password Link" name="reset_password_link">
                      <Select placeholder="Select" allowClear>
                        <Option value="Reset Password">Reset Password</Option>
                        <Option value="Verification">Verification</Option>
                        <Option value="Forgot Password">Forgot Password</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label="Reset Password Link (Web Migration, Uneditable)"
                      name="preview_link"
                    >
                      <Input.TextArea readOnly />
                    </Form.Item>
                  </Col> */}
                  </Row>
                  <Divider orientation="left" dashed />

                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ width: '185px' }}
                          loading={buttonLoading}
                          icon={<SendOutlined />}
                        >
                          Submit
                        </Button>
                        <Button onClick={initData}>Reset</Button>
                      </Space>
                    </Col>
                  </Row>
                </Form>
              </>
            )}
          </>
        )}
      </Card>
    </>
  )
}

export default FormUser

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { resolvedUrl } = context
  const session: any = await getSession(context)
  const user = session?.user

  let menuKey: any[] = []
  const path = resolvedUrl?.split('/')
  if (path) {
    menuKey.push(path[1])
  }

  return {
    props: {
      user: user,
      menuKey,
    },
  }
}
