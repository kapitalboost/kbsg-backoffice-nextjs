/* eslint-disable @next/next/no-img-element */
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Grid,
  InputNumber,
  message,
  Modal,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TabsProps } from 'antd'
import { useEffect, useState } from 'react'
import FormTransaction from '../components/formTransaction'
import FormWithdrawal from '../components/formWithdrawal'
import { Api } from '@/api/api'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { currency } from '@/utils/helpers'
import type { MenuProps } from 'antd'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

const { useBreakpoint } = Grid

interface IProps {
  user: any
}

const UserTransaction = ({ user }: IProps) => {
  const router = useRouter()
  const [modal, contextHolder] = Modal.useModal()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAction, setModalOpenAction] = useState('')
  const [walletTransaction, setWalletTransaction] = useState<any>({})
  const [modalWithdrawal, setModalWithdrawal] = useState(false)
  const [modalWithdrawalAction, setModalWithdrawalAction] = useState('')
  const [walletWithdrawal, setWalletWithdrawal] = useState<any>({})
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const [loadingTransaction, setLoadingTransaction] = useState(false)
  const [loadingWithdraw, setLoadingWithdraw] = useState(false)
  const [userName, setUserName] = useState<any>(null)
  const [transactions, setTransactions] = useState<any>(null)
  const [walletAmount, setWalletAmount] = useState(0)
  const [withdraws, setWithdraws] = useState<any>(null)
  const [paginateTransaction, setPaginateTransaction] = useState({
    per_page: 10,
    current_page: 1,
    page: 1,
    last_page: 0,
    total: 0,
    from: 0,
    to: 0,
  })
  const [paginateWithdraw, setPaginateWithdraw] = useState({
    per_page: 10,
    current_page: 1,
    page: 1,
    last_page: 0,
    total: 0,
    from: 0,
    to: 0,
  })

  const user_id = router.query.id
  const screens = useBreakpoint()

  const initTransaction = (pagination?: any) => {
    setLoadingTransaction(true)

    const pagin = pagination
      ? {
          page: pagination?.current,
          per_page: pagination?.pageSize,
        }
      : paginateTransaction

    Api.get(`transactions/${user_id}`, user?.token, pagin)
      .then((res: any) => {
        const { transactions, wallate_balance, user_name } = res.data
        setTransactions(transactions.data)
        setWalletAmount(wallate_balance)
        setUserName(user_name)

        setPaginateTransaction({
          ...paginateTransaction,
          per_page: transactions.per_page,
          current_page: transactions.current_page,
          last_page: transactions.last_page,
          total: transactions.total,
          from: transactions.from,
          to: transactions.to,
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingTransaction(false))
  }

  const initWithdraw = (pagination?: any) => {
    setLoadingWithdraw(true)

    const pagin = pagination
      ? {
          page: pagination?.current,
          per_page: pagination?.pageSize,
        }
      : paginateWithdraw

    Api.get(`withdraw/${user_id}`, user?.token, pagin)
      .then((res: any) => {
        const { data } = res
        setWithdraws(data.data)

        setPaginateWithdraw({
          ...paginateWithdraw,
          per_page: data.per_page,
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoadingWithdraw(false))
  }

  useEffect(() => {
    initTransaction()
    initWithdraw()
  }, [])

  const onChange = (key: string) => {
    // console.log(key)
    return
  }

  const handleCancel = () => {
    setPreviewImage('')
    setPreviewOpen(false)
    setPreviewTitle('')
  }

  const confirmDeleteTransaction = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete transaction ${
        data.title
      } with amount ${currency(data.amount)} `,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`transactions/${data.id}?_method=delete`, user?.token)
          .then((res: any) => {
            message.success(`Trancation deleted`)
            initTransaction()
          })
          .catch((err) => {
            message.error('Failed to delete data, please try again')
          })
      },
    })
  }

  const onChangeTableTransaction = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setPaginateTransaction({
      ...paginateTransaction,
      current_page: pagination.current,
      page: pagination.current,
      per_page: pagination.pageSize,
    })

    initTransaction(pagination)
  }

  const onChangeTableWithdraw = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setPaginateWithdraw({
      ...paginateWithdraw,
      current_page: pagination.current,
      page: pagination.current,
      per_page: pagination.pageSize,
    })

    initWithdraw(pagination)
  }

  // columns for data transaction
  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{paginateTransaction.from + idx}</>
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Tag color={`${amount < 0 ? 'red' : 'green'}`}>{currency(amount)}</Tag>
      ),
    },
    {
      title: 'Created',
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
          <Tooltip title="Edit transaction">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setWalletTransaction(data)
                setModalOpenAction('edit')
                setModalOpen(true)
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Delete transaction">
            <Button
              size="small"
              danger
              onClick={() => confirmDeleteTransaction(data)}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const openImage = (data: any) => {
    setPreviewImage('')
    setPreviewOpen(true)
    setPreviewTitle('Preview : proof requested at ' + data.created_at)

    setTimeout(() => {
      setPreviewImage(data.proof)
    }, 500)
  }

  const confirmDeleteWithdraw = (data: any) => {
    modal.confirm({
      title: 'Delete Action',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure want to delete withdraw request amount ${currency(
        data.amount
      )} `,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        Api.post(`withdraw/${data.id}?_method=delete`, user?.token)
          .then((res: any) => {
            message.success(`Withdraw request deleted`)
            initWithdraw()
          })
          .catch((err) => {
            message.error('Failed to delete data, please try again')
          })
      },
    })
  }

  const columnsWithdrawal = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, data: any, idx: number) => {
        return <>{paginateWithdraw.from + idx}</>
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => currency(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={`${status ? 'success' : 'warning'}`}>
          {status ? 'Paid' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Requested at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Transfered at',
      dataIndex: 'transfer_at',
      key: 'transfer_at',
      render: (transfer_at: string) => <>{transfer_at ? transfer_at : '-'}</>,
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      width: '150px',
      render: (data: any) => (
        <Space size={`small`} className="space-end">
          <Tooltip title="See Transfer Proof">
            <Button
              type="primary"
              size="small"
              disabled={!data.status || data.proof === null}
              onClick={() => openImage(data)}
            >
              <FileSearchOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Edit withdrawal">
            <Button
              size="small"
              onClick={() => {
                setWalletWithdrawal(data)
                setModalWithdrawalAction('edit')
                setModalWithdrawal(true)
              }}
              disabled={data.status}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Delete withdraw request">
            <Button
              size="small"
              danger
              onClick={() => confirmDeleteWithdraw(data)}
              disabled={data.status}
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const itemsTab: TabsProps['items'] = [
    {
      key: '1',
      label: `Wallet Transaction`,
      children: (
        <>
          <Space className="space-between">
            <span>&nbsp;</span>
            <Tooltip title="Add new transaction">
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setWalletTransaction({})
                  setModalOpenAction('new')
                  setModalOpen(true)
                }}
              >
                Add Transaction
              </Button>
            </Tooltip>
          </Space>

          <Table
            className="mt-1"
            dataSource={transactions}
            columns={columns}
            loading={loadingTransaction}
            scroll={{ x: 800 }}
            onChange={onChangeTableTransaction}
            pagination={{
              position: ['bottomCenter'],
              current: paginateTransaction.current_page,
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, 200],
              pageSize: paginateTransaction.per_page,
              total: paginateTransaction.total,
            }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: `Wallet Withdrawal`,
      children: (
        <Table
          dataSource={withdraws}
          columns={columnsWithdrawal}
          loading={loadingWithdraw}
          scroll={{ x: 800 }}
          onChange={onChangeTableWithdraw}
          pagination={{
            position: ['bottomCenter'],
            current: paginateWithdraw.current_page,
            defaultPageSize: 10,
            pageSizeOptions: [10, 50, 100, 200],
            pageSize: paginateWithdraw.per_page,
            total: paginateWithdraw.total,
          }}
        />
      ),
    },
  ]

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href={`/users/${user_id}`}>Edit user</Link>,
    },
    {
      key: '2',
      label: <Link href={`/users/${user_id}/banks`}>Bank account</Link>,
    },
  ]

  return (
    <>
      <Breadcrumb style={{ margin: '0 0 16px' }}>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/users`}>List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Transactions
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <Space className="space-between" align="center">
            <Typography.Title level={5} className="m-0">
              Data Wallet {userName && `- ${userName}`}
            </Typography.Title>

            <h3 className="m-0 fw-300">
              Wallet balance : <b>{currency(walletAmount)}</b>
            </h3>
          </Space>
        }
      >
        <Tabs
          tabPosition={screens.xl ? 'right' : 'top'}
          defaultActiveKey="1"
          items={itemsTab}
          onChange={onChange}
        />
      </Card>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        style={{ top: 20 }}
      >
        {previewImage === '' ? (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2rem' }} />
          </div>
        ) : (
          <img
            alt={previewTitle}
            style={{ width: '100%', marginTop: '15px' }}
            src={previewImage}
            loading={'lazy'}
          />
        )}
      </Modal>

      <FormTransaction
        modalOpen={modalOpen}
        handleCloseModal={() => setModalOpen(false)}
        wallet_transaction={walletTransaction}
        onReloadData={initTransaction}
        action={modalOpenAction}
        token={user?.token}
        user_id={user_id}
      />

      <FormWithdrawal
        modalOpen={modalWithdrawal}
        handleCloseModal={() => setModalWithdrawal(false)}
        wallet_withdrawal={walletWithdrawal}
        onReloadData={initWithdraw}
        action={modalWithdrawalAction}
        token={user?.token}
        user_id={user_id}
      />

      {contextHolder}
    </>
  )
}

export default UserTransaction

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
