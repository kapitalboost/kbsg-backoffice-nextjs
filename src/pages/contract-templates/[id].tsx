import { Api } from '@/api/api'
import {
  BlockOutlined,
  CheckCircleFilled,
  FileSearchOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from 'antd'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ContractAttachmentEditorForm from './components/attachmentEditor'
import DetailContract from './components/DetailContract'
import ContractEditorForm from './components/mainEditor'
import ContractEditorSignForm from './components/signEditor'

interface IProps {
  user: any
}

const { Text } = Typography

const ContractTemplateEdit = ({ user }: IProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [tabSelected, setTabSelected] = useState('detail-contract')
  const [campaigns, setCampaigns] = useState<any>(null)
  const [contractTemplate, setContractTemplate] = useState<any>(null)

  const param_id = router.query.id

  const initContract = () => {
    setLoading(true)

    Api.get(`contract-templates/${param_id}`, user?.token)
      .then((res: any) => {
        setContractTemplate(res.data)
      })
      .catch((err) => {
        message.error({ content: 'Failed to get data contract template.' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initContract()
  }, [])

  const onTachChange = (val: string) => {
    setTabSelected(val)
  }

  const onSave = () => {
    setSaveLoading(true)
    Api.post(
      `contract-templates/edit/${contractTemplate?.id}`,
      user.token,
      user.id,
      {
        ...contractTemplate,
        main_content: contractTemplate.content,
      }
    )
      .then((res: any) => {
        notification.success({ message: 'Success to update contract detail' })

        setContractTemplate(res.data)
      })
      .catch((err: any) => {
        notification.error({ message: err.message })
      })
      .finally(() => setSaveLoading(false))
  }

  return (
    <Card>
      {loading ? (
        <div className="text-center my-5">
          <LoadingOutlined style={{ fontSize: '2.5rem' }} />
          <h3>Loading..</h3>
        </div>
      ) : (
        <>
          <Space className="space-between">
            <h2 className={`m-0 fw-300`}>
              Edit Contact Template
              <small className="d-block">
                <Text type="secondary" italic>
                  {contractTemplate?.name}
                </Text>
              </small>
            </h2>
            <Space className="space-end" style={{ width: '300px' }}>
              <Button icon={<FileSearchOutlined />} size="middle">
                Preview
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleFilled />}
                size="middle"
                disabled={tabSelected === 'detail-contract'}
                onClick={onSave}
                loading={saveLoading}
              >
                Save Contract
              </Button>
            </Space>
          </Space>

          <Divider orientation="left" dashed />

          <Tabs
            defaultActiveKey="1"
            style={{ marginBottom: 32 }}
            tabPosition={'right'}
            onChange={onTachChange}
            items={[
              {
                label: `Detail Contract`,
                key: 'detail-contract',
                children: (
                  <DetailContract
                    user={user}
                    contract={contractTemplate}
                    onChangeContract={(data: any) => setContractTemplate(data)}
                  />
                ),
              },
              {
                label: `Main Content`,
                key: 'main-content',
                children: (
                  <ContractEditorForm
                    content={contractTemplate?.content}
                    onChangeContent={(val: any) =>
                      setContractTemplate({
                        ...contractTemplate,
                        content: val,
                      })
                    }
                  />
                ),
              },
              {
                label: `Sign Content`,
                key: 'sign content',
                children: (
                  <ContractEditorSignForm
                    user={user}
                    content={contractTemplate?.sign_content}
                    onChangeContent={(val: any) =>
                      setContractTemplate({
                        ...contractTemplate,
                        sign_content: val,
                      })
                    }
                  />
                ),
              },
              {
                label: `Attachment Content`,
                key: 'attachment-content',
                children: (
                  <ContractAttachmentEditorForm
                    content={contractTemplate?.attachment_content}
                    onChangeContent={(val: any) =>
                      setContractTemplate({
                        ...contractTemplate,
                        attachment_content: val,
                      })
                    }
                  />
                ),
              },
              // {
              //   label: (
              //     <Tooltip
              //       title={
              //         campaignSelected === null
              //           ? `Please select a campaign to access preview contract`
              //           : ''
              //       }
              //     >
              //       Preview Contract
              //     </Tooltip>
              //   ),
              //   key: 'preview-contract',
              //   disabled: campaignSelected === null,
              //   children: <span>Preview Contract</span>,
              // },
            ]}
          />
        </>
      )}
    </Card>
  )
}

export default ContractTemplateEdit

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
