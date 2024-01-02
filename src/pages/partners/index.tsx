import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  notification,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import type { InputRef } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { Api } from '@/api/api'

interface DataType {
  key: React.Key
  name: string
  active: string
}

type DataIndex = keyof DataType

interface IProps {
  user: any
}

const Affiliations = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const init = () => {
    setLoading(true)

    Api.get(`partners`, user?.token)
      .then((res: any) => {
        setData(res.data)
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

  const confirmDeleteParner = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data partner `} <b>{data.name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.post(`partners/${data?.id}?_method=delete`, user?.token)
          .then((res: any) => {
            notification.success({ message: res.message })

            setTimeout(() => {
              init()
            }, 500)
          })
          .catch((err) => {
            message.error({ content: err.data.message })
          })
          .finally(() => setLoading(false))
      },
    })
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => text,
  })

  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <>{active ? <CheckOutlined /> : <CloseOutlined />}</>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Url',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => `/campaign?page=1&a=${id}`,
    },
    {
      title: 'Affiliation',
      dataIndex: 'affiliation_count',
      key: 'affiliation_count',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '70px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Delete affiliation">
            <Button
              size="small"
              danger
              onClick={() => confirmDeleteParner(data)}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const onFinish = (values: any) => {
    setSubmitLoading(true)

    Api.post(`partners`, user?.token, null, values)
      .then((res: any) => {
        message.success({
          content: res.message,
        })
        setIsModalOpen(false)
        init()
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => {
        setIsModalOpen(false)
        form.setFieldValue('name', '')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Card>
        <Space className="space-between mb-1">
          <Typography.Title level={3} className={`m-0`}>
            Partners
          </Typography.Title>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Partner
          </Button>
        </Space>

        <Table
          dataSource={data}
          columns={columns}
          className={'mt-1'}
          loading={loading}
        />
      </Card>

      <Modal
        title="Add New Partner"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form
          form={form}
          name="basic"
          style={{ marginTop: 25 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
    </>
  )
}

export default Affiliations

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
