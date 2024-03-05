import { Api } from '@/api/api'
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  FileSearchOutlined,
  FileSyncOutlined,
  LoadingOutlined,
  MailOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Grid,
  message,
  Modal,
  notification,
  Row,
  Space,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

const { Text, Link } = Typography
const { useBreakpoint } = Grid

interface iProps {
  user: any
  slug: any
}

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const UkmContract = ({ user, slug }: iProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contractLog, setContractLog] = useState<any>(null)
  const [openLogLoading, setOpenLogLoading] = useState(false)

  const screens = useBreakpoint()

  const initContract = () => {
    setLoading(true)

    Api.get(`campaign/file-contract/${slug}/contract-ukm`, user?.token)
      .then((res: any) => {
        setContracts(res.data)
      })
      .catch((err: any) => {
        message.error({
          content: 'Ops, Failed to get data contract. Please try again.',
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initContract()
  }, [])

  const previewContract = (file_contract: any) => {
    if (file_contract.is_generated) {
      window.open(file_contract.generated_url, '_blank')
    } else {
      window.open(
        `${BE_URL}/preview-file-contract/${file_contract.id}?token=${user?.token}&campaign_contract_id=${file_contract.id}`,
        '_blank'
      )
    }
  }

  const generateContract = (fileContract: any) => {
    setLoading(true)

    Api.post(`campaign/file-contract/generate/${fileContract?.id}`, user?.token)
      .then((res: any) => {
        message.success({ content: 'Contract was successfully generated' })

        previewContract(res.data)
        initContract()
      })
      .catch((err: any) => {
        message.error({ content: 'Ops, Failed to generate Contract' })
      })
      .finally(() => setLoading(false))
  }

  const sendContract = (data: any) => {
    setLoading(true)

    Api.post(`campaign/contract/ukm/send`, user?.token, user?.id, {
      slug: slug,
      contract_file_id: data.id,
    })
      .then((res) => {
        message.success({ content: 'contract successfully sent' })
      })
      .catch((err) =>
        message.error({ content: 'Failed to send contract, please try again' })
      )
      .finally(() => initContract())
  }

  const openLogs = (data: any) => {
    // api to get the data of logs
    setIsModalOpen(true)
    setOpenLogLoading(true)

    Api.get(`eversign/document/${data?.document_hash}`, user?.token)
      .then((res: any) => {
        setContractLog(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setOpenLogLoading(false))
  }

  // const sendReminder = (document_hash: string) => {
  //   setLoading(true)

  //   Api.get(`eversign/document/${document_hash}/reminder`, user?.token)
  //     .then((res: any) => {
  //       notification.success({ message: 'Reminder sent' })
  //     })
  //     .catch((err) => {
  //       notification.error({
  //         message: 'Failed to send reminder, please try again',
  //       })
  //     })
  //     .finally(() => setLoading(false))
  // }

  const confirmToSendReminder = (document_hash: string) => {
    modal.confirm({
      title: 'Send reminder to UKM',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to send a reminder email?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true)

        Api.get(`eversign/document/${document_hash}/reminder`, user?.token)
          .then((res: any) => {
            notification.success({ message: 'Reminder sent' })
          })
          .catch((err) => {
            notification.error({
              message: 'Failed to send reminder, please try again',
            })
          })
          .finally(() => setLoading(false))
      },
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'type',
      key: 'type',
      fixed: screens.xs || screens.sm ? 'left' : false,
    },
    {
      title: 'Ready?',
      dataIndex: 'is_generated',
      key: 'is_generated',
      render: (is_generated: boolean) => (
        <Tooltip
          title={`${
            is_generated
              ? 'Contract ready'
              : 'The contract has not yet been generated'
          }`}
        >
          <Tag color={`${is_generated ? 'success' : 'orange'}`}>{`${
            is_generated ? 'ready' : 'not yet'
          }`}</Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'sent',
      key: 'sent',
      render: (sent: boolean) => (
        <Tag color={`${sent ? 'success' : 'orange'}`}>{`${
          sent ? 'sent' : 'unsent'
        }`}</Tag>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (id: any, data: any) => (
        <>
          <Space size={10}>
            <Tooltip title="Preview contract">
              <Button
                size="small"
                icon={<FileSearchOutlined />}
                onClick={() => previewContract(data)}
              ></Button>
            </Tooltip>
            <Tooltip
              title={`${
                data.is_generated ? 'Already generated' : 'Generate Contract'
              }`}
            >
              <Button
                size="small"
                icon={<FileSyncOutlined />}
                onClick={() => generateContract(data)}
                disabled={data.is_generated}
              ></Button>
            </Tooltip>
            <Tooltip title="Send contract">
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                disabled={data.sent || !data.is_generated}
                onClick={() => sendContract(data)}
              ></Button>
            </Tooltip>
            <Tooltip title="Logs eversign">
              <Button
                size="small"
                icon={<FieldTimeOutlined />}
                disabled={!data.sent}
                onClick={() => openLogs(data)}
              ></Button>
            </Tooltip>
            <Tooltip title="Send reminder">
              <Button
                size="small"
                icon={<MailOutlined />}
                disabled={!data.sent || data.document_hash === null}
                onClick={() => confirmToSendReminder(data.document_hash)}
              ></Button>
            </Tooltip>
          </Space>
        </>
      ),
    },
  ]

  const createTimeline = (data: any) => {
    const items: any = []

    if (data.log.length > 0) {
      data.log.map((log: any, idx: number) => {
        const signer = data.signers[log.signer - 1]
        const event = log.event.replace(/_/g, ' ')
        const time = moment.unix(log.timestamp).format('DD-MM-YYYY h:m:s')

        items.push({
          color: 'blue',
          children: (
            <div key={idx}>
              <p className="p-0 m-0">
                {signer
                  ? `${event.toUpperCase()} - ${signer.name}`
                  : event.toUpperCase()}
              </p>
              <Text type="secondary">
                <small>{time}</small>
              </Text>
            </div>
          ),
        })
      })
    }

    return items
  }

  return (
    <>
      <Divider orientation="left" dashed>
        {`Contract for UKM`}
      </Divider>

      <Row>
        <Col span={24}>
          <Table
            dataSource={contracts}
            columns={columns}
            loading={loading}
            scroll={{ x: 800 }}
          />
        </Col>
      </Row>

      <Modal
        title={contractLog ? contractLog.title : 'Eversign Document Log'}
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
                <h4 className="m-0">Signer</h4>
                <ol className="mt-0 mb-2">
                  {contractLog.signers.map((signer: any, idx: number) => (
                    <li key={idx}>
                      {signer.name}{' '}
                      <Text type={signer.signed ? 'success' : 'danger'}>
                        {signer.signed ? '[signed]' : '[not signed yet]'}
                      </Text>
                    </li>
                  ))}
                </ol>
                <h4>Logs</h4>
                <Timeline items={createTimeline(contractLog)} />
              </>
            )}
          </>
        )}
      </Modal>

      {contextHolder}
    </>
  )
}

export default UkmContract
