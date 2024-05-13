import { Api } from '@/api/api'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Grid,
  Input,
  message,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import type { InputRef } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { GetServerSidePropsContext } from 'next'

const { useBreakpoint } = Grid

interface DataType {
  key: React.Key
  user_name: string
  vendor_name: string
}

type DataIndex = keyof DataType

interface IProps {
  user: any
}

const Affiliations = ({ user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const screens = useBreakpoint()

  const init = () => {
    setLoading(true)

    Api.get(`affiliations`, user?.token)
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
      width: 50,
    },
    {
      title: 'Investor',
      dataIndex: 'user_name',
      key: 'user_name',
      ...getColumnSearchProps('user_name'),
      width: 400,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      ...getColumnSearchProps('vendor_name'),
      width: 300,
    },
    {
      title: 'Description',
      dataIndex: 'investment_id',
      key: 'investment_id',
      render: (investment_id: number, data: any) => (
        <>
          {investment_id !== null
            ? `Invest to campaign ${data.campaign_name}`
            : `Registration`}
        </>
      ),
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Affiliations</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Typography.Title level={5} className={`m-0`}>
            Affiliations
          </Typography.Title>
        }
      >
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          scroll={{ x: 600 }}
        />
      </Card>
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
    menuKey.push(path[1])
  }

  return {
    props: {
      user: user,
      menuKey,
    },
  }
}
