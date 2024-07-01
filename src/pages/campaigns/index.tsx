/* eslint-disable react-hooks/exhaustive-deps */
import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  FileProtectOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Dropdown,
  Input,
  MenuProps,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
} from 'antd'
import moment from 'moment'

import { getSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DuplicateCampaignPopup from './components/DuplicateCampaign'
import ExpandedCampaign from './components/ExpandedCampaign'
import NewCampaignPopup from './components/NewCampaign'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import type { InputRef } from 'antd'
import { GetServerSidePropsContext } from 'next'

const { Search } = Input
const { Text } = Typography

interface IProps {
  user: any
}

interface DataType {
  key: string
  id: string
  acronim: string
  name: string
  type: string
  release_datetime: Date
  expiry_datetime: Date
  currenct_invest: number
  total_invest_amount: number
  is_enable: string
}

type DataIndex = keyof DataType

const Index = ({ user }: IProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const router = useRouter()
  const [modal, contextHolder] = Modal.useModal()
  const [campaigns, setCampaigns] = useState<any>({
    data: [],
  })
  const [filter, setFilter] = useState({
    acronim: '',
    name: '',
    type: '',
    release_datetime: '',
    expiry_datetime: '',
    is_enable: '',
    currenct_invest: '',
    total_invest_amount: '',
    per_page: 10,
    page: 1,
  })
  const [loading, setLoading] = useState(false)
  const [newCampaignPopup, setNewCampaignPopup] = useState(false)
  const [duplicateCampaignPopup, setDuplicateCampaignPopup] = useState(false)
  const [campaignToDuplicate, setCampaignToDuplicate] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const initCampaigns = async (params: any) => {
    setLoading(true)
    Api.get('campaign', user.token, params, user.id)
      .then((res: any) => {
        console.log(res.data)
        setCampaigns(res.data)
      })
      .catch((err) => {
        console.log(err)
        if (err.status === 401) {
          notification.error({ message: 'Your login session was expired' })

          signOut({
            callbackUrl: '/login',
          })
        } else {
          notification.error({ message: err.message })
        }
      })
      .finally(() => setLoading(false))
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    initCampaigns({
      ...filter,
      per_page: 10,
    })
  }, [filter])

  const onSearch = (value: string) => {
    setFilter({
      ...filter,
      // search: value,
    })
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    let current_filter = { ...filter }

    if (sorter) {
      if (sorter.field === 'total_invest_amount') {
        current_filter = {
          ...filter,
          [sorter.field]: sorter.order,
          currenct_invest: '',
        }
      } else {
        current_filter = {
          ...filter,
          [sorter.field]: sorter.order,
          total_invest_amount: '',
        }
      }
    }

    setFilter({
      ...current_filter,
      per_page: pagination.pageSize,
      page: pagination.current,
    })
  }

  const actionAfterCreateCampaign = (slug: string) => {
    router.push(`campaigns/edit/${slug}`)
  }

  const confirm = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete campaign ${data.name} `,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`campaign/delete/${data.slug}`, user?.token, user?.id)
          .then((res: any) => {
            message.success(`Campaign ${data.name} was deleted`)
            initCampaigns({
              ...filter,
              per_page: 10,
            })
          })
          .catch((err) => {
            message.error('Failed to delete data, please try again')
          })
      },
    })
  }

  // filter percolomn
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

    setFilter({
      ...filter,
      [dataIndex]: selectedKeys[0],
    })
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
        {dataIndex === 'type' ? (
          <Select
            allowClear
            placeholder="Select type"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: 'SME', label: 'SME' },
              { value: 'Donation', label: 'Donation' },
            ]}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          />
        ) : (
          <>
            {['release_datetime', 'expiry_datetime'].includes(dataIndex) ? (
              <DatePicker
                placeholder={
                  dataIndex === 'release_datetime'
                    ? 'Select release date'
                    : 'Select expiry date'
                }
                format={'YYYY-MM-DD'}
                style={{ display: 'block', marginBottom: '8px' }}
                onChange={(e: any) => {
                  if (e) {
                    const value = moment(e.$d).format('YYYY-MM-DD')
                    setSelectedKeys([value])
                  } else {
                    setSelectedKeys([])
                  }
                }}
              />
            ) : (
              <>
                {dataIndex === 'is_enable' ? (
                  <Select
                    allowClear
                    placeholder="Select status"
                    style={{ marginBottom: 8, display: 'block' }}
                    value={selectedKeys[0]}
                    options={[
                      { value: 'enable', label: 'Enable' },
                      { value: 'disable', label: 'Disable' },
                    ]}
                    onChange={(val) =>
                      setSelectedKeys(val !== undefined ? [val] : [])
                    }
                  />
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
              </>
            )}
          </>
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
      <>
        {['type', 'is_enable'].includes(dataIndex) ? (
          <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ) : (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        )}
      </>
    ),
    onFilter: (value, record) => {
      return true
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => text,
  })

  // end custom filter

  const columns: ColumnsType<DataType> = [
    {
      title: 'Acronim',
      dataIndex: 'acronim',
      key: 'acronim',
      ...getColumnSearchProps('acronim'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      ...getColumnSearchProps('type'),
      render: (type: string) => (
        <>
          {type === 'sme' ? (
            <Tag color={`#108ee9`}>SME</Tag>
          ) : (
            <Tag color={`#87d068`}>DONATION</Tag>
          )}
        </>
      ),
    },
    {
      title: 'Release date',
      dataIndex: 'release_datetime',
      key: 'release_datetime',
      ...getColumnSearchProps('release_datetime'),
    },
    {
      title: 'Closing date',
      dataIndex: 'expiry_datetime',
      key: 'expiry_datetime',
      ...getColumnSearchProps('expiry_datetime'),
    },
    {
      title: 'Current funding ($)',
      dataIndex: 'currenct_invest',
      key: 'currenct_invest',
      sorter: (a, b) => a.currenct_invest - b.currenct_invest,
      render: (currenct_invest: any) => (
        <div className="text-end">
          {currenct_invest ? currency(parseFloat(currenct_invest)) : '$0'}
        </div>
      ),
    },
    {
      title: 'Total funding ($)',
      dataIndex: 'total_invest_amount',
      key: 'total_invest_amount',
      sorter: true,
      render: (total_invest_amount: any) => (
        <div className="text-end">
          {total_invest_amount
            ? currency(parseFloat(total_invest_amount))
            : '$0'}
        </div>
      ),
    },
    {
      title: 'Enable',
      dataIndex: 'is_enable',
      key: 'is_enable',
      ...getColumnSearchProps('is_enable'),
      render: (is_enable: boolean) => (
        <>
          {is_enable ? (
            <Tag color={'blue'}>
              <CheckOutlined />
            </Tag>
          ) : (
            <Tag color={'orange'}>
              <CloseOutlined />
            </Tag>
          )}
        </>
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Link href={`/campaigns/edit/${data.id}`}>
            <Button size="small">
              <Tooltip title="Edit campaign">
                <EditOutlined />
              </Tooltip>
            </Button>
          </Link>
          <Link href={`/campaigns/contract/${data.slug}`}>
            <Button size="small">
              <Tooltip title="Contract Campaign">
                <FileProtectOutlined />
              </Tooltip>
            </Button>
          </Link>
          <Dropdown
            menu={{
              items: [
                {
                  key: '2',
                  label: (
                    <Link href={`/campaigns/investment-report/${data.slug}`}>
                      Investment Report
                    </Link>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <Link href={`/campaigns/payout-report/${data.slug}`}>
                      Payout Report
                    </Link>
                  ),
                },
                {
                  key: '6',
                  label: (
                    <span
                      style={{ display: 'block' }}
                      onClick={() => {
                        setCampaignToDuplicate(data)
                        setDuplicateCampaignPopup(true)
                      }}
                    >
                      Duplicate
                    </span>
                  ),
                },
                {
                  key: '7',
                  label: (
                    <span
                      style={{ display: 'block' }}
                      onClick={() => confirm(data)}
                    >
                      <Text type="danger">Delete</Text>
                    </span>
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

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Campaign</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={{ padding: '0' }}
        title={'Campaign'}
        extra={
          <Tooltip title="Create new campaign" placement={`topRight`}>
            <Button
              onClick={() => setNewCampaignPopup(true)}
              icon={<PlusOutlined />}
              size="small"
            >
              Create
            </Button>
          </Tooltip>
        }
        style={{ background: colorBgContainer }}
      >
        {/* <div className="card-title">
          <Space className="space-between">
            <p>Campaigns</p>
            <Space wrap>
              <Tooltip title="Create new campaign" placement={`topRight`}>
                <Button onClick={() => setNewCampaignPopup(true)}>
                  <PlusOutlined /> Create
                </Button>
              </Tooltip>
            </Space>
          </Space>
        </div> */}

        <div className="card-body">
          <Table
            bordered
            rowKey="id"
            loading={loading}
            dataSource={campaigns.data}
            columns={columns}
            onChange={handleTableChange}
            expandable={{
              expandedRowRender: (record) => (
                <ExpandedCampaign campaign={record} user={user} />
              ),
              rowExpandable: (record) => record.id !== 'Not Expandable',
            }}
            scroll={{ x: 1450 }}
            pagination={{
              position: ['bottomCenter'],
              total: campaigns?.total,
              current: campaigns?.current_page,
              pageSize: 10,
              showSizeChanger: false,
              style: { background: colorBgContainer },
            }}
          />
        </div>
      </Card>

      <NewCampaignPopup
        user={user}
        isModalOpen={newCampaignPopup}
        handleOk={actionAfterCreateCampaign}
        handleCancel={() => setNewCampaignPopup(false)}
      />

      <DuplicateCampaignPopup
        user={user}
        campaign={campaignToDuplicate}
        isModalOpen={duplicateCampaignPopup}
        handleOk={actionAfterCreateCampaign}
        handleCancel={() => setDuplicateCampaignPopup(false)}
      />

      {contextHolder}
    </>
  )
}

export default Index

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { resolvedUrl } = context
  const session: any = await getSession(context)

  let menuKey: any[] = []

  const user = session?.user
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
