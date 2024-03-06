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
  Grid,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
const { useBreakpoint } = Grid

interface DataType {
  key: string
  title: string
  tags: any
  image: string
  is_enable: boolean
  created_at: string
}

type DataIndex = keyof DataType

interface IProps {
  user: any
}

const Blogs = ({ user }: IProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const screens = useBreakpoint()

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

  const init = () => {
    setLoading(true)

    Api.get(`blogs`, user?.token)
      .then((res: any) => {
        setBlogs(res.data)
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

  const confirmDeleteBlog = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Typography.Text>
          {`Are you sure want to delete blog `} <b>{data.title}</b>
        </Typography.Text>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.post(`blogs/${data?.id}?_method=delete`, user?.token)
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
        {dataIndex === 'is_enable' ? (
          <Select
            allowClear
            placeholder="Select Payment Method"
            style={{ marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
            options={[
              { value: true, label: 'Enable' },
              { value: false, label: 'Disable' },
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
      console.log(typeof record[dataIndex], typeof value)
      console.log(dataIndex, record[dataIndex] === value)

      return record[dataIndex]
        ? dataIndex === 'is_enable'
          ? record[dataIndex].toString() === value.toString()
          : record[dataIndex]
              .toString()
              .toLowerCase()
              .includes((value as string).toLowerCase())
        : false
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => text,
  })

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      ...getColumnSearchProps('tags'),
      render: (tags: any) =>
        tags ? (
          <Space size={[0, 8]} wrap>
            {tags.map((item: string, idx: number) => (
              <Tag color={`silver`} key={idx}>
                {item}
              </Tag>
            ))}
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) =>
        image ? <img alt={`image`} src={image} height={65} /> : '-',
    },
    {
      title: 'Visibility',
      dataIndex: 'is_enable',
      key: 'is_enable',
      ...getColumnSearchProps('is_enable'),
      render: (is_enable: boolean) => (
        <>{is_enable ? <Tag color={'blue'}>Enable</Tag> : <Tag>Disable</Tag>}</>
      ),
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      ...getColumnSearchProps('created_at'),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Edit data blog">
            <Link href={`/blogs/${data.id}`}>
              <Button size="small" disabled={!screens.md}>
                <EditOutlined />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Delete data blog">
            <Button size="small" danger onClick={() => confirmDeleteBlog(data)}>
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
        <Breadcrumb.Item>Blogs</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bodyStyle={!screens.lg ? { padding: '0' } : {}}
        title={
          <Space className="space-between">
            <Typography.Title level={5} className={`m-0`}>
              List of Blogs
            </Typography.Title>

            <Tooltip title="Add new blog">
              <Link href={`/blogs/add`}>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  disabled={!screens.md}
                >
                  Add a New Blog
                </Button>
              </Link>
            </Tooltip>
          </Space>
        }
      >
        <Table
          dataSource={blogs}
          columns={columns}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>

      {contextHolder}
    </>
  )
}

export default Blogs

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
