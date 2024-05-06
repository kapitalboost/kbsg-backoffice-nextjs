import { Api } from '@/api/api'
import {
  BlockOutlined,
  CheckOutlined,
  DashOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  notification,
} from 'antd'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import ModalFormMobileNotification from './components/modalForm'
import type { InputRef, TableColumnsType, TableColumnType } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'

interface IProps {
  token: string
}

interface DataType {
  key: string
  title: string
  message: number
  is_sent: number
}

type DataIndex = keyof DataType

const MobileNotification = ({ token }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [filteredData, setFilteredData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [isOpenDetail, setIsOpenDetail] = useState(false)

  const init = () => {
    setLoading(true)
    Api.get(`mobile-notifications`, token)
      .then((res: any) => {
        setData(res)
        setFilteredData(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
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
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === 'is_sent' ? (
          <Select
            allowClear
            placeholder="Select status"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: 1, label: 'Sent' },
              { value: 0, label: 'Draft' },
            ]}
            onChange={(val) => setSelectedKeys(val !== undefined ? [val] : [])}
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
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === 'is_sent') {
        return record[dataIndex].toString().includes(value as string)
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => text,
  })

  const handleSendNotification = (data: any) => {
    // console.log(data)
    setLoading(true)
    Api.post(`mobile-notifications/${data.id}/send`, token, null, {})
      .then((res: any) => {
        message.success(res.message)
        init()
      })
      .catch((err: any) => {
        message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{idx + 1}</>
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ...getColumnSearchProps('message'),
    },
    {
      title: 'Is sent?',
      dataIndex: 'is_sent',
      key: 'is_sent',
      ...getColumnSearchProps('is_sent'),
      render: (is_sent: boolean) => (
        <Tag
          color={is_sent ? `blue` : `cyan`}
          icon={is_sent ? <CheckOutlined /> : <EditOutlined />}
        >
          {is_sent ? `Sent` : `Draft`}
        </Tag>
      ),
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
          <Tooltip title="Open details">
            <Button
              size="small"
              onClick={() => {
                setSelectedData(data)
                setIsOpenDetail(true)
              }}
            >
              <BlockOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Send notification">
            <Button
              size="small"
              onClick={() => {
                handleSendNotification(data)
              }}
              disabled={data.is_sent}
            >
              <SendOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Edit data message">
            <Button
              size="small"
              onClick={() => {
                setSelectedData(data)
                setIsModalOpen(true)
              }}
              disabled={data.is_sent}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Delete data message" placement="topRight">
            <Button size="small" danger onClick={() => confirmDeleteUser(data)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedData(null)
    init()
  }

  const confirmDeleteUser = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete data message `} <b>{data.title}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`mobile-notifications/${data?.id}?_method=delete`, token)
          .then((res: any) => {
            message.success(res.message)
          })
          .catch((err) => {
            message.error('Failed to remove the message, please try again.')
            console.log(err)
          })

        init()
      },
    })
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Mobile Notification</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Mobile Notification"
        extra={
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedData(null)
              setIsModalOpen(true)
            }}
          >
            Create Message
          </Button>
        }
      >
        <Table
          rowKey={`id`}
          dataSource={filteredData}
          columns={columns}
          className={'mt-1'}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>

      <ModalFormMobileNotification
        token={token}
        isOpen={isModalOpen}
        handleClose={handleCancel}
        data={selectedData}
      />

      {contextHolder}

      <Modal
        title="Detail Message"
        open={isOpenDetail}
        onCancel={() => setIsOpenDetail(false)}
        footer={false}
      >
        {selectedData?.image && (
          <img src={selectedData?.image} alt="image notif" width={`100%`} />
        )}
        <h3>{selectedData?.title}</h3>
        <p>{selectedData?.message}</p>
      </Modal>
    </>
  )
}

export default MobileNotification

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const token = session?.user.token

  return {
    props: {
      token,
    }, // will be passed to the page component as props
  }
}
