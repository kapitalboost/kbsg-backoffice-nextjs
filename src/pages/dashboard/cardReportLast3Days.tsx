import { Api } from '@/api/api'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Grid, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const { useBreakpoint } = Grid

interface IProps {
  token: string
  getData: string
  title: string
}

const CardReportLast3Days = ({ token, getData, title }: IProps) => {
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
              <p className="m-0">Get funded : {data.get_funded}</p>
              <p className="m-0">Contact us : {data.contact_us}</p>
              <p className="m-0">Enquiry : {data.enquiry}</p>
            </>
          )}
        </>
      )}
    </Card>
  )
}

export default CardReportLast3Days
