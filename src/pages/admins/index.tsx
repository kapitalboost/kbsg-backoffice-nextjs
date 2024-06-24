import { Api } from '@/api/api'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RetweetOutlined,
  SearchOutlined,
  TwitterOutlined,
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
import FormAdmin from './components/formAdmin'
import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'

const { useBreakpoint } = Grid

interface IProps {
  user: any
}

interface DataType {
  key: string
  name: string
  email: string
  role: string
}

type DataIndex = keyof DataType

const Admins = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formAction, setFormAction] = useState('')
  const [admin, setAdmin] = useState({})
  const [admins, setAdmins] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const screens = useBreakpoint()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const initData = () => {
    setLoading(true)

    Api.get(`admins`, user?.token)
      .then((res: any) => {
        setAdmins(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initData()
  }, [])

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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Edit data admin">
            <Button size="small" onClick={() => onOpenForm('edit', data)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          {/* reset password button just active for super admin */}
          <Tooltip title="Reset password admin">
            <Button size="small" onClick={() => handleResetPassword(data)}>
              <RetweetOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Delete data admin">
            <Button size="small" danger onClick={() => confirmDeleteUser(data)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const onOpenForm = (action: string, data: any) => {
    setFormAction(action)
    setAdmin(data)
    setIsFormOpen(true)
  }

  const confirmDeleteUser = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data admin `} <b>{data.name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`admins/${data?.id}?_method=delete`, user?.token)
          .then((res: any) => {
            notification.success({ message: res.message })
          })
          .catch((err) => {
            console.log(err)
          })

        initData()
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

  const handleResetPassword = (data: any) => {
    setLoading(true)

    Api.post(`admins/${data?.id}`, user?.token)
      .then((res: any) => {
        notification.success({ message: res.message })
      })
      .catch((err) => {
        message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={{ padding: '0' }}
        title="List of Admins"
        extra={
          <Tooltip title="Add new admin" placement={'topRight'}>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onOpenForm('create', {})}
            >
              Create
            </Button>
          </Tooltip>
        }
      >
        <Table
          dataSource={admins}
          columns={columns}
          loading={loading}
          rowKey={`id`}
          scroll={{ x: 800 }}
          pagination={{
            position: ['bottomCenter'],
          }}
        />

        <FormAdmin
          isShow={isFormOpen}
          admin={admin}
          action={formAction}
          handleHide={() => setIsFormOpen(false)}
          token={user?.token}
          reloadData={initData}
        />
      </Card>
      {contextHolder}
    </>
  )
}

export default Admins

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
