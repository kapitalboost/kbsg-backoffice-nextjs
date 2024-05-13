import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
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
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'

import type { InputRef } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { Api } from '@/api/api'
import { GetServerSidePropsContext } from 'next'

const { useBreakpoint } = Grid

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
  const screens = useBreakpoint()

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

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Partners</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Typography.Title level={5} className={`m-0`}>
            Partners
          </Typography.Title>
        }
      >
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>

      {contextHolder}
    </>
  )
}

export default Affiliations

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { resolvedUrl } = context
  const session: any = await getSession(context)
  const user = session?.user

  let menuKey: any[] = []
  const path = resolvedUrl?.split('/')
  if (path) {
    path.slice(0, 1)

    menuKey = path
  }

  return {
    props: {
      user: user,
      menuKey,
    },
  }
}
