import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Grid,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
// import Search from 'antd/es/input/Search'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Link from 'next/link'
import CreateInvestmentModal from './components/CreateInvestmentModal'

const { useBreakpoint } = Grid

interface DataType {
  key: string
  campaign_name: string
  user_name: string
  payment_method: string
  amount: number
  is_paid: number
  is_signed: boolean
  created_at: boolean
}

type DataIndex = keyof DataType

const { Search } = Input

interface IProps {
  user: any
}

const Investments = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [investments, setInvestments] = useState<any>(null)
  const [campaignOptions, setCampaignOptions] = useState<any>(null)
  const [userOptions, setUserOptions] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [filter, setFilter] = useState({
    campaign_id: '',
    user_id: '',
    payment_method: '',
    amount: '',
    status: '',
  })

  const screens = useBreakpoint()

  const payMethod = (key: string) => {
    switch (key) {
      case 'bank-transfer':
        return 'Bank Transfer'
        break
      case 'kb-wallet':
        return 'KB Wallet'
        break
      case 'paypal':
        return 'Paypal'
        break

      default:
        return '--'
        break
    }
  }

  const init = async () => {
    setLoading(true)

    await Api.get(`investments`, user?.token, filter)
      .then((res: any) => {
        setInvestments(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    init()
  }, [filter])

  const handlePopupClose = (value: any, reload: any) => {
    setIsModalOpen(value)

    if (reload === true) {
      init()
    }
  }

  // component search
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

    switch (dataIndex) {
      case 'campaign_name':
        setFilter({
          ...filter,
          campaign_id: selectedKeys[0],
        })
        break
      case 'user_name':
        setFilter({
          ...filter,
          user_id: selectedKeys[0],
        })
        break

      default:
        setFilter({
          ...filter,
          [dataIndex]: selectedKeys[0],
        })
        break
    }
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getCampaignOptions = (filter: string) => {
    if (filter.length > 2) {
      Api.get(`campaign/options?filter=${filter}`, user?.token).then(
        (res: any) => {
          setCampaignOptions(res.data)
        }
      )
    }
  }

  const getUserOptions = (filter: string) => {
    if (filter.length > 3) {
      Api.get(`users/option?filter=${filter}`, user?.token).then((res: any) => {
        setUserOptions(res.data)
      })
    }
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
        {dataIndex === 'campaign_name' ? (
          // Custom filter for column campaign
          <Select
            showSearch
            allowClear
            style={{ display: 'block', marginBottom: 8 }}
            placeholder={'Search Campaign'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(value) => {
              getCampaignOptions(value)
            }}
            onChange={(val: string) => setSelectedKeys(val ? [val] : [])}
            notFoundContent={null}
            options={campaignOptions}
          />
        ) : dataIndex === 'user_name' ? (
          // Custom filter for column user
          <Select
            showSearch
            allowClear
            style={{ display: 'block', marginBottom: 8 }}
            placeholder={'Search User'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(value) => {
              getUserOptions(value)
            }}
            onChange={(val: string) => setSelectedKeys(val ? [val] : [])}
            notFoundContent={null}
            options={userOptions}
          />
        ) : dataIndex === 'payment_method' ? (
          <Select
            allowClear
            placeholder="Select Payment Method"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: 'bank-transfer', label: 'Bank Transfer' },
              { value: 'kb-wallet', label: 'KB Wallet' },
              { value: 'paypal', label: 'Paypal' },
              { value: 'xfers', label: 'Xfers' },
            ]}
            onChange={(val) => setSelectedKeys(val !== undefined ? [val] : [])}
          />
        ) : dataIndex === 'is_paid' ? (
          <Select
            allowClear
            placeholder="Select Status Payment"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: '0', label: 'Unpaid' },
              { value: '2', label: 'Pending Approval' },
              { value: '1', label: 'Paid' },
            ]}
            onChange={(val) => setSelectedKeys(val !== undefined ? [val] : [])}
          />
        ) : dataIndex === 'is_signed' ? (
          <Select
            allowClear
            placeholder="Select Status Contract"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: '0', label: 'Unsigned' },
              { value: '1', label: 'Signed' },
            ]}
            onChange={(val) => setSelectedKeys(val !== undefined ? [val] : [])}
          />
        ) : (
          // Default Custom filter
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
    onFilter: (value, record) => true,
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
      title: 'Campaign',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      render: (campaign_name, record) => {
        return campaign_name
      },
      ...getColumnSearchProps('campaign_name'),
    },
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (user_name, record) => user_name,
      ...getColumnSearchProps('user_name'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      ...getColumnSearchProps('payment_method'),
      render: (payment_method: string) => payMethod(payment_method),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ display: 'block', textAlign: 'right' }}>
          {currency(amount)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_paid',
      key: 'is_paid',
      ...getColumnSearchProps('is_paid'),
      render: (is_paid: number) => (
        <Tag color={is_paid === 1 ? 'green' : is_paid === 2 ? 'yellow' : 'red'}>
          {is_paid === 1 ? 'Paid' : is_paid === 2 ? 'Pending' : 'Unpaid'}
        </Tag>
      ),
    },
    {
      title: 'Contract Status',
      dataIndex: 'is_signed',
      key: 'is_signed',
      ...getColumnSearchProps('is_signed'),
      render: (is_signed: boolean) => (
        <Tag color={is_signed ? 'green' : 'orange'}>
          {is_signed ? 'Signed' : 'Unsigned'}
        </Tag>
      ),
    },
    {
      title: 'Date of Payment',
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
          <Tooltip title="Open details">
            <Link href={`/investments/${data?.id}`}>
              <Button size="small">
                <BlockOutlined />
              </Button>
            </Link>
          </Tooltip>

          <Tooltip title="Delete data investment">
            <Button size="small" onClick={() => confirmDeleteUser(data)} danger>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  // const onSearch = (value: string) => {
  //   const result = getFundeds.filter((contract: any) => {
  //     return (contract?.name ?? '').includes(value)
  //   })

  //   setFilteredGetFundeds(result)
  // }

  const confirmDeleteUser = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data investment `}{' '}
          <b>{data.user_name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.post(`investments/${data?.id}?_method=delete`, user?.token)
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

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Investment</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={'List of Investment'}
        extra={
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="small"
          >
            Add investment
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              rowKey={'id'}
              dataSource={investments}
              columns={columns}
              className={'mt-1'}
              loading={loading}
              scroll={{ x: 1300 }}
            />
          </Col>
        </Row>
      </Card>

      {contextHolder}

      <CreateInvestmentModal
        user={user}
        isModalOpen={isModalOpen}
        setIsModalOpen={handlePopupClose}
      />
    </>
  )
}

export default Investments

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
