import { Api } from '@/api/api'
import {
  Button,
  Card,
  Grid,
  notification,
  Space,
  Table,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

const columns = [
  {
    title: 'Name',
    dataIndex: 'firstname',
    key: 'firstname',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
]

interface IProps {
  token: string
  title: string
}

const DataNewUsers = ({ token, title }: IProps) => {
  const screens = useBreakpoint()
  const [user, setUser] = useState<any>({
    data: [],
  })
  const [loading, setLoading] = useState(false)
  const [day, setDay] = useState(1)

  const initUser = async (page: number) => {
    setLoading(true)

    Api.get(`dashboard/user-to-review`, token, { day: day, page: page })
      .then((res: any) => {
        setUser(res.data)
      })
      .catch((err) => {
        if (err) {
          notification.error(err.data.message)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initUser(1)
  }, [day])

  const handleTableChange = (pagination: any) => {
    console.log(pagination)
    initUser(pagination.current)
  }

  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: '0', overflow: 'hidden' }}
      title={
        <Space align={`center`} size={`small`} className="space-between">
          {screens.xs ? (
            <Typography.Text strong>{title}</Typography.Text>
          ) : (
            <Typography.Title level={5}>{title}</Typography.Title>
          )}
          <Space wrap>
            <Button
              size="small"
              type={day === 1 ? 'primary' : 'default'}
              onClick={() => setDay(1)}
            >
              Today
            </Button>
            <Button
              size="small"
              type={day === 3 ? 'primary' : 'default'}
              onClick={() => setDay(3)}
            >
              3 days
            </Button>
            {!screens.xs && (
              <Button
                size="small"
                type={day === 7 ? 'primary' : 'default'}
                onClick={() => setDay(7)}
              >
                7 days
              </Button>
            )}
          </Space>
        </Space>
      }
    >
      <Table
        loading={loading}
        dataSource={user.data}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          total: user?.total,
          current: user?.current_page,
          pageSize: 5,
          showSizeChanger: false,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              console.log(record)
            },
          }
        }}
      />
    </Card>
  )
}

export default DataNewUsers
