import { Api } from '@/api/api'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Grid,
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
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
const { useBreakpoint } = Grid

interface DataType {
  key: string
  name: string
  email: number
  created_at: string
}
type DataIndex = keyof DataType

const { TextArea } = Input

interface IProps {
  user: any
}

const Contacts = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState<any>({})
  const [contacts, setContacts] = useState<any>([])

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const screens = useBreakpoint()

  const init = () => {
    setLoading(true)
    Api.get(`contacts`, user?.token)
      .then((res: any) => {
        setContacts(res.data)
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

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

  const confirmDeleteContact = (data: any) => {
    modal.confirm({
      title: 'Delete Contact',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data contact from `} <b>{data.name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.post(`contacts/${data?.id}?_method=delete`, user?.token)
          .then((res: any) => {
            notification.success({ message: res.message })

            init()
          })
          .catch((err) => {
            message.error({ content: err.data.message })
          })
          .finally(() => setLoading(false))
      },
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      ...getColumnSearchProps('created_at'),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Open detail">
            <Button
              size="small"
              onClick={() => {
                setSelectedData(data)
                setIsModalOpen(true)
              }}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Delete master payout">
            <Button
              size="small"
              danger
              onClick={() => confirmDeleteContact(data)}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Contacts</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Typography.Title level={5} className="m-0">
            List of Contacts
          </Typography.Title>
        }
      >
        <Table
          dataSource={contacts}
          columns={columns}
          loading={loading}
          scroll={{ x: 800 }}
        />

        <Modal
          title={`Detail of Message`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          width={860}
          footer={
            <a href={`mailto:${selectedData?.email}`}>
              <Button type="primary" size="small" icon={<SendOutlined />}>
                Reply Message
              </Button>
            </a>
          }
        >
          <p>
            From : {selectedData?.name} ({selectedData?.email})
          </p>

          <TextArea
            className="mt-1"
            value={selectedData?.info}
            rows={14}
            readOnly
            bordered={false}
          />
        </Modal>
      </Card>

      {contextHolder}
    </>
  )
}

export default Contacts

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
