import { Api } from '@/api/api'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import FormTeam from './components/form'
import { render } from 'react-dom'

interface IProps {
  user: any
}

const Teams = ({ user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formAction, setFormAction] = useState('')
  const [dataId, setDataId] = useState(0)

  const init = async () => {
    setLoading(true)

    await Api.get(`team-analyzers`, user?.token)
      .then((res: any) => {
        console.log(res)
        setData(res.data)
      })
      .catch((err) => {
        message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

  const showModal = (action: string, id: number) => {
    setFormAction(action)
    setDataId(id)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? `green` : `orange`}>
          {status ? 'Active' : 'Not Active'}
        </Tag>
      ),
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space>
          <Tooltip title="Edit data">
            <Button size="small" onClick={() => showModal('edit', data.id)}>
              <EditOutlined />
            </Button>
          </Tooltip>

          {/* <Tooltip title="Delete data">
            <Button size="small" danger>
              <DeleteOutlined />
            </Button>
          </Tooltip> */}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Teams</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <h3 className="m-0 fw-300">
            <strong>List of Teams</strong>
          </h3>
        }
        extra={
          <Button
            type="primary"
            onClick={() => showModal('create', 0)}
            size="small"
            icon={<PlusOutlined />}
          >
            Create
          </Button>
        }
        style={{ overflow: 'hidden' }}
        bodyStyle={{ padding: '0' }}
      >
        <Table
          dataSource={data}
          columns={columns}
          className={'mt-1'}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>

      <FormTeam
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        action={formAction}
        token={user?.token}
        id={dataId}
        onReloadData={init}
      />
    </>
  )
}

export default Teams

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
