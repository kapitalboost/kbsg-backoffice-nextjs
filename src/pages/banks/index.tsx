import { Api } from '@/api/api'
import {
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
  Input,
  message,
  Modal,
  notification,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import FormBank from './components/formBank'

import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'

interface DataType {
  key: string
  bank_code: string
  bic_code: string
  iban_code: string
  bank_name: string
  currency: string
  country: string
}
type DataIndex = keyof DataType

interface IProps {
  user: any
}

const Banks = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formAction, setFormAction] = useState('')
  const [bank, setBank] = useState({})
  const [banks, setBanks] = useState<any>(null)

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const init = () => {
    setLoading(true)
    Api.get(`banks`, user?.token)
      .then((res: any) => {
        setBanks(res.data)
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
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : false,
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
      title: 'Name',
      dataIndex: 'bank_name',
      key: 'bank_name',
      width: 250,
      ...getColumnSearchProps('bank_name'),
    },
    {
      title: 'BIC / Swift Code',
      dataIndex: 'bic_code',
      key: 'bic_code',
      width: 200,
      ...getColumnSearchProps('bic_code'),
      render: (bic_code: string) => (bic_code ? bic_code : '-'),
    },
    {
      title: 'IBAN Code',
      dataIndex: 'iban_code',
      key: 'iban_code',
      width: 300,
      ...getColumnSearchProps('iban_code'),
      render: (iban_code: string) => (iban_code ? iban_code : '-'),
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      ...getColumnSearchProps('currency'),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      ...getColumnSearchProps('country'),
    },
    {
      title: 'Status',
      dataIndex: 'is_enable',
      key: 'is_enable',
      sorter: (a: any, b: any) => a.is_enable - b.is_enable,
      render: (is_enable: boolean) =>
        is_enable ? (
          <Tag color={`blue`}>Enable</Tag>
        ) : (
          <Tag color={`silver`}>Disable</Tag>
        ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Edit data bank">
            <Button size="small" onClick={() => onOpenForm('edit', data)}>
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Delete bank account">
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

  const onOpenForm = (action: string, data: any) => {
    setFormAction(action)
    setBank(data)
    setIsFormOpen(true)
  }

  const confirmDeleteContact = (data: any) => {
    modal.confirm({
      title: 'Delete Bank',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data bank `} <b>{data.bank_name}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.post(`banks/${data?.id}?_method=delete`, user?.token)
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

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Banks</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Space className="space-between mb-1">
          <Typography.Title
            level={4}
            className={`m-0`}
            style={{ fontWeight: '500' }}
          >
            List of Banks
          </Typography.Title>

          <Tooltip title="Add new bank account">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onOpenForm('create', {})}
            ></Button>
          </Tooltip>
        </Space>

        <Table
          dataSource={banks}
          columns={columns}
          className={'mt-1'}
          loading={loading}
          scroll={{ x: 800 }}
        />

        <FormBank
          isShow={isFormOpen}
          bank={bank}
          action={formAction}
          handleHide={() => setIsFormOpen(false)}
          token={user?.token}
          reInit={init}
        />

        {contextHolder}
      </Card>
    </>
  )
}

export default Banks

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
