import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Grid,
  Input,
  InputNumber,
  message,
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

const { useBreakpoint } = Grid

interface DataType {
  key: React.Key
  upline_user_name: string
  upline_user_email: string
  user_name: string
  user_email: string
  campaign_name: string
}

type DataIndex = keyof DataType

interface IProps {
  user: any
}

const Referals = ({ user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const screens = useBreakpoint()

  const init = () => {
    setLoading(true)

    Api.get(`referals`, user?.token)
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
    },
    {
      title: 'Referer name',
      dataIndex: 'upline_user_name',
      key: 'upline_user_name',
      ...getColumnSearchProps('upline_user_name'),
    },
    {
      title: 'Referer email',
      dataIndex: 'upline_user_email',
      key: 'upline_user_email',
      ...getColumnSearchProps('upline_user_email'),
    },
    {
      title: 'Referal name',
      dataIndex: 'user_name',
      key: 'user_name',
      ...getColumnSearchProps('user_name'),
    },
    {
      title: 'Referal email',
      dataIndex: 'user_email',
      key: 'user_email',
      ...getColumnSearchProps('user_email'),
    },
    {
      title: 'Invest amount',
      dataIndex: 'invest_amount',
      key: 'invest_amount',
      render: (invest_amount: number) => currency(invest_amount),
    },
    {
      title: 'Campaign name',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      ...getColumnSearchProps('campaign_name'),
    },
    {
      title: 'Reward for referal',
      dataIndex: 'cashback',
      key: 'cashback',
      render: (cashback: number) => (cashback ? currency(cashback) : '-'),
    },
    {
      title: 'Reward for referer',
      dataIndex: 'ref_cashback',
      key: 'ref_cashback',
      render: (ref_cashback: number) =>
        ref_cashback ? currency(ref_cashback) : '-',
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Referals</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Typography.Title level={3} className={`m-0`}>
            Referals
          </Typography.Title>
        }
      >
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          scroll={{ x: 1300 }}
        />
      </Card>
    </>
  )
}

export default Referals

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
