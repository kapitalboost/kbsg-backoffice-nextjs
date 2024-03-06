import { Api } from '@/api/api'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Grid, InputNumber, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface IProps {
  token: string
  getData: string
  title: string
}

const CardReportDevice = ({ token, getData, title }: IProps) => {
  const screens = useBreakpoint()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const initData = () => {
    Api.get('dashboard', token, {
      type: getData,
    })
      .then((res: any) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    initData()
  }, [])

  return (
    <Card
      bodyStyle={screens.xs ? { padding: '5px 10px' } : {}}
      style={{ height: '165px' }}
    >
      <Typography.Title level={5} className="m-0 mb-0-1">
        {title}
      </Typography.Title>

      {loading ? (
        <>
          <div className="text-center">
            <LoadingOutlined
              style={{ fontSize: '1.5rem', padding: '1rem 0' }}
            />
          </div>
        </>
      ) : (
        <>
          {data !== null && (
            <>
              <p className="m-0">From Website : {data.website}</p>
              <p className="m-0">From Android : {data.android}</p>
              <p className="m-0">From IOS : {data.ios}</p>
            </>
          )}
        </>
      )}
    </Card>
  )
}

export default CardReportDevice
