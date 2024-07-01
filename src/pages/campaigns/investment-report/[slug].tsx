import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  InputNumber,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
} from 'antd'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import type { MenuProps } from 'antd'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

const dataSource = [
  {
    key: '1',
    full_name: 'AZMI BIN SALLEH',
    ic_number: 'S1634816C',
    nationality: 'SINGAPORE',
    amount: '3000',
    payout: '3063.00',
  },
  {
    key: '2',
    full_name: 'Ebadullah Bin Siddiq',
    ic_number: 'S2714048C',
    nationality: 'BANGLADESH',
    amount: '1640',
    payout: '1674.44',
  },
]

interface IProps {
  user: any
}

const InvestmentReport = ({ user }: IProps) => {
  const router = useRouter()
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [campaignId, setCampaignId] = useState('')
  const [report, setReport] = useState([])

  const slug = router.query.slug

  const initData = () => {
    setLoading(true)
    Api.get(`campaign/investment-report/${slug}`, user?.token)
      .then((res: any) => {
        setCampaignName(res.data.campaign_name)
        setCampaignId(res.data.campaign_id)
        setReport(res.data.report)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initData()
  }, [])

  const confirm = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete data investment ${currency(
        data.amount
      )} from ${data.user.ic_name} `,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        console.log('Deleting investment data for name ', data.user.ic_name)

        Api.post(`investment/delete/${data.id}`, user?.token, user?.id)
          .then((res: any) => {
            message.success(`Investment from ${data.user.ic_name} was deleted`)
            initData()
          })
          .catch((err) => {
            message.error('Failed to delete data, please try again')
          })
      },
    })
  }

  const exportToExcel = () => {
    setLoadingExport(true)
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    Api.get(`campaign/investment-report/${slug}/export`, user?.token)
      .then((res: any) => {
        const ws = XLSX.utils.json_to_sheet(res.data)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }

        const excelBuffer = XLSX.write(wb, {
          bookType: 'xlsx',
          type: 'array',
        })

        const blob = new Blob([excelBuffer], {
          type: fileType,
        })

        return FileSaver.saveAs(
          blob,
          `investment-report-${slug}` + fileExtension
        )
      })
      .catch((err) => {
        message.error({ content: 'Failed to export data' })
      })
      .finally(() => setLoadingExport(false))
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
      dataIndex: 'user',
      key: 'user',
      width: '30%',
      render: (user: any) => <>{user.ic_name}</>,
    },
    {
      title: 'IC Number',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => <>{user.nric}</>,
    },
    {
      title: 'Nationality',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => <>{user.nationality}</>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      render: (amount: number) => <>{currency(amount)}</>,
    },
    {
      title: 'Total Payout',
      dataIndex: 'payout',
      key: 'payout',
      width: '15%',
      render: (payout: number) => <>{currency(payout)}</>,
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="Delete data investment">
            <Button size="small" danger onClick={() => confirm(data)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: <Link href={`/campaigns/edit/${campaignId}`}>Edit</Link>,
    },
    {
      key: '1',
      label: <Link href={`/campaigns/contract/${slug}`}>Contract</Link>,
    },
    {
      key: '2',
      label: (
        <Link href={`/campaigns/payout-report/${slug}`}>Payout Report</Link>
      ),
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Campaign</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/campaigns`}>List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Investment report
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={`Investment Report - ${campaignName}`}
        extra={
          <Button
            size="small"
            icon={<DownloadOutlined />}
            loading={loadingExport}
            onClick={exportToExcel}
          >
            Export to Excel
          </Button>
        }
      >
        <Table
          dataSource={report}
          columns={columns}
          scroll={{ x: 800 }}
          loading={loading}
        />
        {contextHolder}
      </Card>
    </>
  )
}

export default InvestmentReport

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
