import {
  Badge,
  Button,
  Divider,
  Grid,
  Modal,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd'
import type { TabsProps } from 'antd'
import UserInformation from './userInformation'
import ResultVeriff from './resultVeriff'
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Api } from '@/api/api'
import { setColorStatus } from '@/utils/userStatus'

const { useBreakpoint } = Grid

interface IProps {
  isModalOpen: boolean
  handleCancel: any
  userSession: any
  userId: number
}

const ModalDetailUser = ({
  isModalOpen,
  handleCancel,
  userSession,
  userId,
}: IProps) => {
  const [loading, setLoading] = useState(false)
  const [tabActive, setTabActive] = useState('1')
  const [dataUser, setDataUser] = useState<any>(null)

  const statusToBeDesabled = ['approved', 'rejected', 'blacklisted']

  const screens = useBreakpoint()

  const initUser = () => {
    setLoading(true)

    Api.get(`users/${userId}`, userSession?.token)
      .then((res: any) => {
        setDataUser(res.data)
      })
      .catch((err: any) => {
        message.error({ content: err.message })
      })
      .finally(() => setLoading(false))
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `User Information`,
      children: <UserInformation user={dataUser} />,
    },
    {
      key: '2',
      label: `Verif Information`,
      children: (
        <ResultVeriff
          veriff={dataUser?.veriff}
          token={userSession?.token}
          initUser={initUser}
        />
      ),
    },
  ]

  useEffect(() => {
    if (userId !== null) {
      initUser()
    } else {
      setDataUser(null)
    }
  }, [isModalOpen])

  const onChangeTab = (key: string) => {
    setTabActive(key)
  }

  const onSetStatus = (status: string) => {
    setLoading(true)
    Api.post(`users/${userId}/set-status`, userSession?.token, null, {
      status: status,
    })
      .then((res: any) => {
        message.success({
          content: `Success to set status user to ${status.toUpperCase()}`,
        })
        initUser()
      })
      .catch((err) => {
        console.log(err)
        message.error({ content: 'Failed to change status' })
        setLoading(false)
      })
  }

  return (
    <Modal
      title={
        dataUser && (
          <Space
            className="space-between"
            align="end"
            style={{ height: '50px' }}
          >
            <Typography.Title level={4} className="m-0">
              Detail User
            </Typography.Title>
            <Tag color={setColorStatus(dataUser?.status)}>
              {dataUser.status.toUpperCase()}
            </Tag>
          </Space>
        )
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="mt-2">
        {loading ? (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2.5rem' }} />
            <h3>Loading..</h3>
          </div>
        ) : (
          <>
            <Tabs
              tabPosition={screens.xl ? 'right' : 'top'}
              defaultActiveKey={tabActive}
              items={items}
              onChange={onChangeTab}
            />

            {tabActive === '1' && (
              <>
                <Divider orientation="left" dashed />

                <Space size={10} className="space-between">
                  <Space size={10}>
                    <Button
                      disabled={statusToBeDesabled.includes(dataUser?.status)}
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => onSetStatus('rejected')}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      REJECT
                    </Button>
                    <Button
                      disabled={statusToBeDesabled.includes(dataUser?.status)}
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => onSetStatus('blacklisted')}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      BLACKLIST
                    </Button>
                  </Space>
                  <Tooltip title="Veriff has not been approved">
                    <Button
                      disabled={
                        !dataUser?.has_veriff ||
                        statusToBeDesabled.includes(dataUser?.status)
                      }
                      type="primary"
                      icon={<CheckOutlined />}
                      style={{ width: screens.xs ? 'auto' : '200px' }}
                      onClick={() => onSetStatus('approved')}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      APPROVE
                    </Button>
                  </Tooltip>
                </Space>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

export default ModalDetailUser
