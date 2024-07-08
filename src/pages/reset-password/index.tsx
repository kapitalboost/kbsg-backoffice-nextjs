import { Api } from '@/api/api'
import { CheckOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
} from 'antd'
import { getSession, signOut } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'

interface IProps {
  user: any
}

const ResetPassword = ({ user }: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: any) => {
    setLoading(true)

    Api.post(`auth/reset-password/${user?.token}`, user?.token, null, values)
      .then((res: any) => {
        message.success({
          content: 'Success to reset password, please to relogin',
        })

        setTimeout(() => {
          signOut({
            callbackUrl: '/login',
          })
        }, 1000)
      })
      .catch((err) => {
        message.error({
          content: 'Failed to reset password, please check you input',
        })
      })
      .finally(() => setLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Head>
        <title>Reset Password | Kapital Boost</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Row justify={'center'} className="mt-2">
        <Col span={10}>
          <h1>{`Hi ${user?.name}, Change your password`}</h1>
          <Alert
            message="You haven't changed your password in the last 3 months. You cannot carry out activities on this website if you have not updated your password"
            type="warning"
            showIcon
          />
          <br />
          <Alert
            message=" Reset your password periodically to maintain the security of this
            system"
            type="info"
            showIcon
          />
        </Col>
      </Row>

      <Row justify={'center'}>
        <Col span={10}>
          <Form
            form={form}
            name="basic"
            style={{ marginTop: 25 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Old Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your latest password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="new_password"
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Re-enter New Password"
              name="confirm_password"
              rules={[
                {
                  required: true,
                  message: 'Please input new password confirmation!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    )
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckOutlined />}
                  style={{ width: '160px' }}
                >
                  {`Submit`}
                </Button>
                <Button>{`Forgot Password`}</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default ResetPassword

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
      without_layout: true,
    },
  }
}
