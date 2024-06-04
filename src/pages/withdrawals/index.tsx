import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import FormWithdrawal from './components/formWithdrawal'

import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { Api } from '@/api/api'
import { getSession } from 'next-auth/react'
import { currency } from '@/utils/helpers'
import moment from 'moment'
import FormEditWithdrawal from './components/formEditWithdrawal'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

interface DataType {
  key: string
  user_full_name: number
  amount: number
  bank_name: string
  account_name: string
  account_number: string
  swift_code: string
  iban_code: string
  status: number
  created_at: string
}

type DataIndex = keyof DataType
const { useBreakpoint } = Grid

interface IProps {
  user: any
}

const Withdrawals = ({ user }: IProps) => {
  const [form] = Form.useForm()

  const fileList: UploadFile[] = []
  const [loading, setLoading] = useState(false)
  const [withdrawals, setWithdrawals] = useState<any>(null)
  const [withdrawSelected, setWithdrawSelected] = useState<any>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataSelected, setDataSelected] = useState<any>(null)
  const [addWithdrawalModalOpen, setAddWithdrawalModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [userOptions, setUserOptions] = useState<any>(null)
  const [filter, setFilter] = useState({
    user_id: '',
    amount: '',
    status: '',
    created_at: '',
  })

  const screens = useBreakpoint()

  const init = async () => {
    setLoading(true)

    await Api.get(`withdraw`, user?.token, filter)
      .then((res: any) => {
        setWithdrawals(res.data)
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

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields()
    } else {
      form.setFieldsValue(dataSelected)
    }
  }, [form, isModalOpen, dataSelected])

  const handleClosePreview = () => {
    setPreviewImage('')
    setPreviewOpen(false)
    setPreviewTitle('')
  }

  const openImage = (data: any) => {
    setPreviewImage(data.proof)
    setPreviewOpen(true)
    setPreviewTitle('Preview : proof withdrawal')
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

    switch (dataIndex) {
      case 'user_full_name':
        setFilter({
          ...filter,
          user_id: selectedKeys[0],
        })
        break
      case 'status':
        setFilter({
          ...filter,
          status: selectedKeys[0],
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
        {dataIndex === 'user_full_name' ? (
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
        ) : dataIndex === 'status' ? (
          <Select
            allowClear
            placeholder="Select Status Payment"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
            ]}
            onChange={(val) => setSelectedKeys(val !== undefined ? [val] : [])}
          />
        ) : dataIndex === 'created_at' ? (
          <DatePicker
            placeholder={'Select request date'}
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
      <>
        {dataIndex !== 'status' ? (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ) : (
          <FilterOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        )}
      </>
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
      width: 70,
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
    },
    {
      title: 'User',
      dataIndex: 'user_full_name',
      key: 'user_full_name',
      ...getColumnSearchProps('user_full_name'),
      render: (user_full_name: string, data: any) => (
        <Link href={`users/${data?.user_id}`} target={`_blank`}>
          {user_full_name}
        </Link>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
      render: (amount: number) => (
        <span style={{ display: 'block', textAlign: 'right' }}>
          {currency(amount)}
        </span>
      ),
    },
    {
      title: 'Bank name',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => (bank ? bank.bank_name : '-'),
    },
    {
      title: 'Account name',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => (bank ? bank.account_name : '-'),
    },
    {
      title: 'Account number',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => (bank ? bank.account_number : '-'),
    },
    {
      title: 'SWIFT Code',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => (bank?.swift ? bank.swift : '-'),
    },
    {
      title: 'IBAN code',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => <>{bank?.iban ? bank.iban : 'N/A'}</>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (sent_at: boolean) => (
        <>
          {sent_at ? (
            <Tag color="cyan">Paid</Tag>
          ) : (
            <Tag color="orange">Pending</Tag>
          )}
        </>
      ),
    },
    {
      title: 'Date requested',
      dataIndex: 'created_at',
      key: 'created_at',
      ...getColumnSearchProps('created_at'),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '120px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="See Transfer Proof">
            <Button
              type="primary"
              size="small"
              disabled={data.proof === null}
              onClick={() => openImage(data)}
            >
              <FileSearchOutlined />
            </Button>
          </Tooltip>
          {/* <Tooltip title="Detail bank">
            <Button size="small">
              <BankOutlined />
            </Button>
          </Tooltip> */}
          <Tooltip title="Edit">
            <Button
              size="small"
              onClick={() => {
                setWithdrawSelected(data)
                setTimeout(() => {
                  showModal()
                }, 200)
              }}
              disabled={data.status}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Card
      title={
        <Space className="space-between" align="center">
          <Typography.Title level={5} className="m-0">
            KB wallet withdrawals
          </Typography.Title>
          <Tooltip title="Add withdrawal request">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setAddWithdrawalModalOpen(true)}
            >
              Add new request
            </Button>
          </Tooltip>
        </Space>
      }
    >
      <Table
        dataSource={withdrawals}
        columns={columns}
        className={'mt-1'}
        loading={loading}
        scroll={{ x: 1300 }}
      />

      <FormWithdrawal
        isShow={addWithdrawalModalOpen}
        handleHide={() => setAddWithdrawalModalOpen(false)}
        token={user?.token}
        reinitData={init}
      />

      <FormEditWithdrawal
        isShow={isModalOpen}
        handleHide={handleCancel}
        withdraw={withdrawSelected}
        token={user?.token}
        reinitData={init}
      />

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleClosePreview}
        width={screens.lg ? `60%` : `95%`}
        style={{ top: 10 }}
      >
        <img
          alt={previewTitle}
          style={{ width: '100%', marginTop: '15px' }}
          src={previewImage}
          loading={'lazy'}
        />
      </Modal>
    </Card>
  )
}

export default Withdrawals

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
