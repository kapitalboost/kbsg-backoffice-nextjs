import {
  BlockOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Dropdown,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Api } from '@/api/api'
import { getSession } from 'next-auth/react'
import moment from 'moment'
import ModalDetailUser from './components/detailUser'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { InputRef } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { setColorStatus } from '@/utils/userStatus'
import dayjs from 'dayjs'
import { currency } from '@/utils/helpers'

const { RangePicker } = DatePicker

interface IProps {
  user: any
}

interface DataType {
  key: React.Key
  name: string
  email: string
  country: string
  phone_number: string
  status: string
  wallet_amount: number
  created_at: Date
}

type DataIndex = keyof DataType

const Users = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any>(null)
  const [userId, setUserId] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [filter, setFilter] = useState<any>(null)

  const searchInput = useRef<InputRef>(null)

  const initUser = () => {
    setLoading(true)

    Api.get(`users`, user?.token, filter)
      .then((res: any) => {
        setUsers(res.data)
      })
      .catch((err) => {
        notification.error({ message: 'Failed to fetch data user' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initUser()
  }, [filter])

  const showModal = (data: any) => {
    setIsModalOpen(true)
    setUserId(data.id)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setUserId(null)
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

    const current_filter = filter
      ? {
          ...filter,
          [dataIndex]: selectedKeys[0],
        }
      : { [dataIndex]: selectedKeys[0] }

    setFilter(current_filter)
  }

  const handleReset = (dataIndex: string, clearFilters: () => void) => {
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
        {dataIndex === 'status' ? (
          <Select
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
            style={{ marginBottom: 8, display: 'block' }}
          >
            {/* <Select.Option value="new">New</Select.Option> */}
            <Select.Option value="new">New</Select.Option>
            <Select.Option value="reviewing">In Review</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
            <Select.Option value="blacklisted">Blacklisted</Select.Option>
          </Select>
        ) : (
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
        )}
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
            onClick={() => clearFilters && handleReset(dataIndex, clearFilters)}
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
      <>
        {dataIndex !== 'status' ? (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ) : (
          <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        )}
      </>
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
    },
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
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      ...getColumnSearchProps('country'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
      key: 'phone_no',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (status: string) => (
        <Tag color={setColorStatus(status)}>
          {status === 'reviewing' ? 'IN REVIEW' : status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Wallet Amount',
      dataIndex: 'wallet_amount',
      key: 'amount',
      render: (amount: number) => currency(amount),
    },
    {
      title: 'Registered at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) =>
        moment(created_at).format('DD-MM-YYYY h:m:s'),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Open details">
            <Button size="small" onClick={() => showModal(data)}>
              <BlockOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Edit user">
            <Link href={`/users/${data.id}`}>
              <Button size="small">
                <EditOutlined />
              </Button>
            </Link>
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                {
                  key: '2',
                  label: <Link href={`/users/${data.id}/banks`}>Banks</Link>,
                },
                {
                  key: '3',
                  label: (
                    <Link href={`/users/${data.id}/transactions`}>
                      Detail transaction
                    </Link>
                  ),
                },
                {
                  key: '4',
                  label: (
                    <Typography.Text
                      type="danger"
                      onClick={() => confirmDeleteUser(data)}
                    >
                      Delete User
                    </Typography.Text>
                  ),
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button size="small">
              <MoreOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ]

  const confirmDeleteUser = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data user `} <b>{data.name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        notification.success({ message: 'User Deleted' })
      },
    })
  }

  const onSelectDateRange = (values: any) => {
    if (values) {
      const current_filter = filter
        ? {
            ...filter,
            start_date: dayjs(values[0]).format('YYYY/MM/DD'),
            end_date: values[1] && dayjs(values[1]).format('YYYY/MM/DD'),
          }
        : {
            start_date: dayjs(values[0]).format('YYYY/MM/DD'),
            end_date: values[1] && dayjs(values[1]).format('YYYY/MM/DD'),
          }
      setFilter(current_filter)
    } else {
      const current_filter = filter
        ? {
            ...filter,
            start_date: null,
            end_date: null,
          }
        : {
            start_date: null,
            end_date: null,
          }
      setFilter(current_filter)
    }
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <Space className="space-between" size={'large'}>
            <Typography.Title level={5} className="m-0">
              Data Users
            </Typography.Title>
            <RangePicker
              placeholder={[`Register start date`, `Register end date`]}
              format={'YYYY/MM/DD'}
              onChange={(values) => onSelectDateRange(values)}
            />
          </Space>
        }
      >
        <Table
          dataSource={users}
          columns={columns}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>

      <ModalDetailUser
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        userSession={user}
        userId={userId}
      />

      {contextHolder}
    </>
  )
}

export default Users

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
