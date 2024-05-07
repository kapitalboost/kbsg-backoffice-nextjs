import { Api } from '@/api/api'
import { currency } from '@/utils/helpers'
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FieldNumberOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  OrderedListOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Timeline,
  Tooltip,
  Typography,
} from 'antd'
import moment from 'moment'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const { Text, Link } = Typography
const BE_URL = process.env.NEXT_PUBLIC_BE_URL

interface Iprops {
  user: any
  slug: any
}

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

const InvestmentReport = ({ user, slug }: Iprops) => {
  const [investors, setInvestors] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openLogLoading, setOpenLogLoading] = useState(false)
  const [contractFileId, setContractFileId] = useState<any>(null)
  const [investorsId, setInvestorsId] = useState<any>([])
  const [contractsOption, setContractsOption] = useState<any>([])
  const [contractLog, setContractLog] = useState<any>(null)
  const [contractSelected, setContractSelected] = useState<any>(null)

  const initContracts = () => {
    Api.get(`campaign/file-contract/${slug}/investor-option`, user?.token)
      .then((res: any) => {
        setContractsOption(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const initData = () => {
    setLoading(true)

    Api.get(`campaign/investors/${slug}`, user?.token)
      .then((res: any) => {
        setInvestors(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initData()
    initContracts()
  }, [])

  const sendContract = (data: any) => {
    setLoading(true)

    Api.post(
      `campaign/contract/investor/${data.id}/send/${contractSelected}`,
      user?.token,
      user?.id,
      {}
    )
      .then((res) => {
        message.success({ content: 'contract successfully sent' })
        console.log(res)
      })
      .catch((err) =>
        message.error({ content: 'Failed to send contract, please try again' })
      )
      .finally(() => initData())
  }

  const openLogs = (data: any) => {
    // api to get the data of logs
    setIsModalOpen(true)
    setOpenLogLoading(true)

    Api.adminV1Get(
      `${BE_URL}/api/admin/esign/documents/${data?.document_hash}`,
      user?.token,
      user?.id
    )
      .then((res: any) => {
        console.log('RESPONSE > ', res.data)
        setContractLog(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setOpenLogLoading(false))
  }

  const selectContract = (v: any) => {
    console.log(v)

    setContractSelected(v)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user',
      key: 'user',
      width: '25%',
      render: (user: any) => user?.ic_name,
    },
    {
      title: 'Email',
      dataIndex: 'user',
      key: 'user',
      width: '25%',
      render: (user: any) => user?.email,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      render: (amount: number) => currency(amount),
    },
    {
      title: 'Invest Date',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip
            title={
              data.has_contract
                ? data.sent_contract
                  ? 'Contract has been sent'
                  : 'Send contract to user'
                : 'The contract has not been made'
            }
          >
            <Button
              type="primary"
              size="small"
              disabled={
                contractSelected === null
                  ? true
                  : data.has_contract
                  ? true
                  : data.sent_contract
                  ? true
                  : false
              }
              onClick={() => sendContract(data)}
            >
              <SendOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Contract logs">
            <Button
              size="small"
              onClick={() => openLogs(data)}
              disabled={data.sent_contract === false}
            >
              <FieldTimeOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  const createTimeline = (data: any) => {
    const items: any = []
    // const logs = data.log.short((a: any, b: any) => a.timestamp - b.timestamp)
    if (data.log.length > 0) {
      data.log.map((log: any, idx: number) => {
        const signer = data.signers[log.signer - 1]
        const event = log.event.replace(/_/g, ' ')
        const time = moment.unix(log.timestamp).format('DD-MM-YYYY h:m:s')

        items.push({
          color: 'blue',
          children: (
            <>
              <p className="p-0 m-0">
                {signer
                  ? `${event.toUpperCase()} - ${signer.name}`
                  : event.toUpperCase()}
              </p>
              <Text type="secondary">
                {/* <small style={{ fontStyle: 'italic' }}>{time}</small> */}
                <small>{time}</small>
              </Text>
            </>
          ),
        })
      })
    }

    return items
  }

  return (
    <>
      <Row>
        <Col span={12}>
          <Space size={15}>
            <Select
              showSearch
              allowClear
              placeholder="Select Contract"
              style={{ width: 200 }}
              options={contractsOption}
              onChange={selectContract}
            />
          </Space>
        </Col>
        <Col span={12}>
          <Space className="space-end">
            {/* <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={contractFileId === null || investorsId.length === 0}
            >{`Send Contract`}</Button> */}
            <Button
              onClick={initData}
              icon={<ReloadOutlined />}
            >{`Refresh`}</Button>
          </Space>
        </Col>
      </Row>

      <Divider orientation="left" dashed>
        Campaign Investors
      </Divider>

      <Table
        rowKey={`id`}
        // rowSelection={{
        //   type: 'checkbox',
        //   ...rowSelection,
        // }}
        dataSource={investors}
        columns={columns}
        loading={loading}
      />

      <Modal
        title={contractLog ? contractLog.filename : 'Sign Document Log'}
        open={isModalOpen}
        onCancel={() => {
          setContractLog(null)
          setIsModalOpen(false)
        }}
        footer={false}
      >
        {openLogLoading ? (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2.5rem' }} />
            <h3>Fetching data..</h3>
          </div>
        ) : (
          <>
            {contractLog === null ? (
              <div className="text-center my-5">
                <CloseCircleOutlined style={{ fontSize: '4.5rem' }} />
                <h3>Log not found</h3>
              </div>
            ) : (
              <>
                <h4>Signer</h4>
                <ol>
                  {contractLog.signers.map((value: any, index: number) => {
                    return (
                      <li key={index}>
                        {value.email}{' '}
                        {value.status === 'completed' ? (
                          <strong style={{ color: 'green' }}>
                            {' '}
                            [{value.status}]{' '}
                          </strong>
                        ) : (
                          <strong style={{ color: 'orange' }}>
                            {' '}
                            [on process]{' '}
                          </strong>
                        )}
                      </li>
                    )
                  })}
                </ol>
                {/* <ol className="mt-0 mb-2">
                  {contractLog.signers.map((signer: any, idx: number) => (
                    <li key={idx}>
                      {signer.name}{' '}
                      <Text type={signer.signed ? 'success' : 'danger'}>
                        {signer.signed ? '[signed]' : '[not signed yet]'}
                      </Text>
                    </li>
                  ))}
                </ol> */}
                {/* <h4>Logs</h4>
                <Timeline items={createTimeline(contractLog)} /> */}
              </>
            )}
          </>
        )}
      </Modal>
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
