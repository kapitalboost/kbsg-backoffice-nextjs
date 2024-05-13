import React, { useEffect, useState } from 'react'
import { Api } from '@/api/api'
import { getSession } from 'next-auth/react'
import { Breadcrumb, Card, Grid, message, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import DetailInvestment from './components/DetailInvestment'
import InvestmentPayouts from './components/InvestmentPayouts'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

const { useBreakpoint } = Grid

interface IProps {
  user: any
}

const Detail = ({ user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [dataInvestment, setDataInvestment] = useState<any>(null)

  const id = router.query.id

  const screens = useBreakpoint()

  const init = () => {
    setLoading(true)

    Api.get(`investments/${id}`, user?.token)
      .then((res: any) => {
        setDataInvestment(res.data)
      })
      .catch((err) => {
        message.error(err.data.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Investment</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/investments`}>List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Tabs
          tabPosition={screens.xl ? 'right' : 'top'}
          items={[
            {
              label: `Detail`,
              key: '1',
              children: (
                <DetailInvestment
                  investment={dataInvestment}
                  token={user?.token}
                  reloadData={init}
                />
              ),
            },
            {
              label: `Payouts`,
              key: '2',
              children: (
                <InvestmentPayouts
                  investment={dataInvestment}
                  token={user?.token}
                />
              ),
            },
          ]}
        />
      </Card>
    </>
  )
}

export default Detail

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
