import { Breadcrumb, Col, Divider, Row } from 'antd'
import React from 'react'
import { getSession } from 'next-auth/react'
import DataNewUsers from './dashboard/dataNewUsers'
import CardReport from './dashboard/cardReport'
import CardReportLast3Days from './dashboard/cardReportLast3Days'
import CardReportAmountInvested from './dashboard/cardReportAmountInvested'
import CardReportKBWallet from './dashboard/cardReportKBWallet'
import CardReportDevice from './dashboard/cardReportDevice'
import CardReportCampaign from './dashboard/cardReportCampaign'
import WithdrawalRequests from './dashboard/withdrawalRequests'

const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' }

interface IProps {
  token: string
}

const Dashboard = ({ token }: IProps) => {
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Report</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[16, 16]}>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReport token={token} getData="user" title="Users" />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReport token={token} getData="investment" title="Investments" />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportCampaign
            token={token}
            getData="campaigns"
            title="Campaigns"
          />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportAmountInvested
            token={token}
            getData="amount invested"
            title="Amount invested"
          />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportKBWallet
            token={token}
            getData="kb wallet"
            title="KB Wallet"
          />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportLast3Days
            token={token}
            getData="last 3 days"
            title="Last 3 Days"
          />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportDevice
            token={token}
            getData="register from"
            title="Register Device"
          />
        </Col>
        <Col className="gutter-row" xs={12} md={8} xl={6}>
          <CardReportDevice
            token={token}
            getData="investment from"
            title="Investment Device"
          />
        </Col>
      </Row>

      <Divider dashed />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} xl={12}>
          <DataNewUsers token={token} title="New Users" />
        </Col>
        <Col xs={24} sm={24} md={12} xl={12}>
          <WithdrawalRequests token={token} title="Withdrawal Requests" />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const token = session?.user.token

  return {
    props: {
      token,
    }, // will be passed to the page component as props
  }
}
