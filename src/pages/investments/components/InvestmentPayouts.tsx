import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  Button,
  Grid,
  message,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface IProps {
  investment: any
  token: string
}

const InvestmentPayouts = ({ investment, token }: IProps) => {
  const [payouts, setPayouts] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const screens = useBreakpoint()

  const init = () => {
    setLoading(true)

    Api.get(`investments/${investment?.id}/payouts`, token)
      .then((res: any) => {
        setPayouts(res.data)
      })
      .catch((err) => {
        message.error({ content: err.data.message })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [investment])

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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(Date.parse(date)).format('YYYY-MM-DD'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => currency(amount),
    },
    {
      title: 'Final Amount',
      dataIndex: 'final_amount',
      key: 'final_amount',
      render: (final_amount: number) => currency(final_amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'on-going' ? 'gold' : status === 'paid' ? 'green' : 'red'
          }
        >
          {status === 'on-going'
            ? 'On Going'
            : status === 'paid'
            ? 'Paid'
            : 'Delayed'}
        </Tag>
      ),
    },
  ]

  return (
    <>
      <Typography.Title level={4} className="m-0 pb-1">
        Payout Schedule
      </Typography.Title>

      <Table
        dataSource={payouts}
        columns={columns}
        loading={loading}
        scroll={{ x: 600 }}
      />
    </>
  )
}

export default InvestmentPayouts
