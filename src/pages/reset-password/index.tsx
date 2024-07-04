import { Api } from '@/api/api'
import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import { getSession, signOut } from 'next-auth/react'
import { useState } from 'react'

interface IProps {
  user: any
}

const ResetPassword = ({ user }: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: any) => {
    console.log('Success:', user)
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
    <Card>
      <Row justify={'center'}>
        <Col span={10}>
          <p className="" style={{ fontSize: '1.25rem' }}>
            Reset your password periodically to maintain the security of this
            system
          </p>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {`Change password & re-login`}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
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
