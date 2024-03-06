import { Api } from '@/api/api'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Grid,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

const { Search } = Input

const Option = Select.Option

interface IProps {
  user: any
}

const ContractTemplates = ({ user }: IProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const [contracts, setContracts] = useState<any>([])
  const [filteredContracts, setFilteredContracts] = useState<any>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const screens = useBreakpoint()

  const initContract = () => {
    setLoading(true)

    Api.get(`contract-templates`, user?.token)
      .then((res: any) => {
        setContracts(res.data)
        setFilteredContracts(res.data)
      })
      .catch((err) => {
        message.error({ content: 'failed to load data' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initContract()
  }, [])

  const confirm = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete contract ${data.name} `,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`contract-templates/remove/${data.id}`, user?.token, user?.id)
          .then((res: any) => {
            message.success(`Contract ${data.name} was deleted`)
            initContract()
          })
          .catch((err) => {
            message.error('Failed to delete data, please try again')
          })
      },
    })
  }

  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <>
          {type == 'all'
            ? 'All'
            : type == 'murabaha'
            ? 'Murabaha'
            : type == 'invoice-financing'
            ? 'Invoice Financing'
            : '-'}
        </>
      ),
    },
    {
      title: 'Contract For',
      dataIndex: 'user_for',
      key: 'user_for',
    },
    {
      title: 'Status',
      dataIndex: 'is_show',
      key: 'is_show',
      render: (is_show: boolean) => (
        <>
          {is_show ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="orange">Not Active</Tag>
          )}
        </>
      ),
    },
    {
      title: 'Last update',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 175,
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Edit contract template">
            <Link href={`/contract-templates/${data?.id}`}>
              <Button size="small" disabled={!screens.md}>
                <EditOutlined />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Delete contract template">
            <Button size="small" danger onClick={() => confirm(data)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const onSearch = (value: string) => {
    const result = contracts.filter((contract: any) => {
      return (contract?.name ?? '').includes(value)
    })
    setFilteredContracts(result)
  }

  const onFinish = (values: any) => {
    setSubmitLoading(true)

    Api.post(`contract-templates/store`, user.token, user.id, {
      ...values,
    })
      .then((res: any) => {
        notification.success({ message: 'Success to update campaign' })

        setTimeout(() => {
          router.push(`contract-templates/${res.data.id}`)
        }, 500)
      })
      .catch((err: any) => {
        notification.error({ message: 'error' })
      })
      .finally(() => setSubmitLoading(false))
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Contact templates</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Space className="space-between">
            <Typography.Title level={5} className="m-0">
              Contact templates
            </Typography.Title>

            <Space wrap>
              <Search
                allowClear
                placeholder="Search contract"
                onSearch={onSearch}
                style={{ width: screens.xs ? '130px' : '200px' }}
              />
              <Tooltip title="Create new template" placement={`topRight`}>
                {/* <Link href={'/contract-templates/new'}> */}
                <Button
                  type="dashed"
                  onClick={() => setIsModalOpen(true)}
                  disabled={!screens.md}
                >
                  <PlusOutlined />
                </Button>
                {/* </Link> */}
              </Tooltip>
            </Space>
          </Space>
        }
      >
        <Table
          dataSource={filteredContracts}
          columns={columns}
          loading={loading}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Create new contract template"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        footer={false}
      >
        <Form
          layout="vertical"
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              placeholder="Select a option and change input text above"
              allowClear
              showSearch
            >
              <Option value={'all'}>All</Option>
              <Option value={'murabaha'}>Murabaha</Option>
              <Option value={'invoice-financing'}>Invoice Financing</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="user_for"
            label="Contract For"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a user type" allowClear>
              <Option value="Investor">Investor</Option>
              <Option value="UKM">UKM</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('gender') === 'other' ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Button type="primary" loading={submitLoading} htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      {contextHolder}
    </>
  )
}

export default ContractTemplates

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
