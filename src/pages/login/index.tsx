import {
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Alert,
  notification,
} from 'antd'
import { Nunito, Open_Sans } from '@next/font/google'
import { useState } from 'react'
import Head from 'next/head'
import ForgotPassword from './forgotPassword'

import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Router from 'next/router'

const nunito = Nunito({ subsets: ['latin'] })

interface Props {
  without_layout: boolean
}

const Login = ({ without_layout }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    })
    setLoading(false)

    if (result?.error === 'CredentialsSignin') {
      setError('Email or Password is Wrong')
    } else {
      notification.success({
        message: 'Login Success',
      })

      console.log(result)

      if (result?.url) {
        Router.push(result?.url)
      }
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Head>
        <title>Login | Kapital Boost</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-page="login">
        <Row gutter={8} align="middle" style={{ height: '100vh' }}>
          <Col span={16} className="text-center">
            <img
              src="https://res.cloudinary.com/kbas/image/upload/v1677120908/Illustration/illustration_opbic0.svg"
              alt="Illustration"
            />
          </Col>
          <Col span={8} className="login-form">
            <Space direction="vertical">
              <h1 className={`m-0 ${nunito.className}`}>
                Kapital Boost PTE LTD
              </h1>
              <p
                className={`m-0 ${nunito.className}`}
                style={{ fontSize: '18px' }}
              >{`Assalamu'alaikum KB's Team`}</p>

              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ marginTop: 25 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >
                {error !== '' && <Alert message={error} type="error" />}
                <br />
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="link"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                    className="p-0"
                  >
                    Forgot password?
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Col>
        </Row>

        <Modal
          title="Forgot Password"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <ForgotPassword handleClose={handleCancel} />
        </Modal>
      </main>
    </>
  )
}

export default Login

export const getServerSideProps = async () => {
  return {
    props: {
      without_layout: true,
    },
  }
}