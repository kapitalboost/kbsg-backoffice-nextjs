import { Api } from '@/api/api'
import {
  Button,
  Card,
  Grid,
  InputNumber,
  notification,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { currency } from '@/utils/helpers'

const { useBreakpoint } = Grid

const columns = [
  {
    title: 'Name',
    dataIndex: 'user_full_name',
    key: 'user_full_name',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: any) => <>{currency(amount)}</>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: boolean) => {
      return (
        <>
          {status ? (
            <Tag color="green">Paid</Tag>
          ) : (
            <Tag color="red">Unpaid</Tag>
          )}
        </>
      )
    },
  },
]

interface IProps {
  token: string
  title: string
}

const WithdrawalRequests = ({ token, title }: IProps) => {
  const screens = useBreakpoint()
  const [withdraw, setWithdraw] = useState<any>({
    data: [],
  })
  const [loading, setLoading] = useState(false)
  const [day, setDay] = useState(1)

  const iniWithdraw = async (page: number) => {
    setLoading(true)

    Api.get(`dashboard/withdraw-requests`, token, { day: day, page: page })
      .then((res: any) => {
        setWithdraw(res.data)
      })
      .catch((err) => {
        notification.error(err.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    iniWithdraw(1)
  }, [day])

  const handleTableChange = (pagination: any) => {
    console.log(pagination)
    iniWithdraw(pagination.current)
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
        dataSource={withdraw.data}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          total: withdraw?.total,
          current: withdraw?.current_page,
          pageSize: 5,
          showSizeChanger: false,
        }}
      />
    </Card>
  )
}

export default WithdrawalRequests
