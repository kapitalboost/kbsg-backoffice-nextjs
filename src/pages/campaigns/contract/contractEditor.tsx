import { Api } from '@/api/api'
import { contract_types } from '@/utils/contract-types'
import {
  BlockOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  DotChartOutlined,
  DownloadOutlined,
  EyeFilled,
  EyeTwoTone,
  FileDoneOutlined,
  FilePdfOutlined,
  LoadingOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  RetweetOutlined,
  SaveFilled,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Grid,
  Input,
  List,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import ListOfFileContracts from './components/listOfFileContracts'
import ContractEditorForm from './editor'
import type { SelectProps } from 'antd'
const { useBreakpoint } = Grid

interface IProps {
  user: any
  contract: any
  slug: any
}

const { Search } = Input

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const ContractEditor = ({ user, slug }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [savePreviewLoading, setSavePreviewLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])

  const [fileContract, setFileContract] = useState<any>(null)
  const [mainContent, setMainContent] = useState('')
  const [signContent, setSignContent] = useState('')
  const [attachmentContent, setAttachmentContent] = useState('')
  const [signerPosition, setSignerPosition] = useState('')

  const [investmentOption, setInvestmentOption] = useState<
    SelectProps['options']
  >([])
  const [investorId, setInvestorId] = useState('')

  const [contractType, setContractType] = useState<any>(null)
  const [campaignContracts, setCampaignContracts] = useState([])
  const [openModalFileContract, setOpenModalFileContract] = useState(false)

  const [isModalOpenInvestor, setIsModalOpenInvestor] = useState<any>(null)
  const [isModalPassword, setIsModalPassword] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [btnPasswordLoading, setBtnPasswordLoading] = useState(false)
  const [isPasswordFalse, setIsPasswordFalse] = useState(false)
  const [isPreviewAfterSave, setIsPreviewAfterSave] = useState(false)

  const screens = useBreakpoint()

  const initContracts = () => {
    Api.get(`campaign/file-contract/${slug}`, user?.token).then((res: any) => {
      setCampaignContracts(res.data)
    })
  }

  const initTemplate = () => {
    Api.get(`campaign/contract/templates`, user?.token)
      .then((res: any) => {
        setTemplates(res.data)
        setFilteredTemplates(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const initInvestments = () => {
    setLoading(true)

    Api.get(`campaign/investors/${slug}/option`, user?.token)
      .then((res: any) => {
        setInvestmentOption(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    initContracts()
    initTemplate()
    initInvestments()
  }, [])

  const onRefresh = () => {
    initTemplate()
    initInvestments()
  }

  const selectTemplate = (template: any) => {
    setLoading(true)
    Api.get(`campaign/contract/template/select/${template.id}`, user?.token)
      .then((res: any) => {
        setMainContent(res.data.content)
        setSignContent(res.data.sign_content)
        setAttachmentContent(res.data.attachment_content)
        setSignerPosition(res.data.signer_json)
      })
      .finally(() => setLoading(false))
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSave = () => {
    setSaveLoading(true)

    Api.post(`campaign/file-contract/${slug}`, user?.token, user?.id, {
      file_contract_id: fileContract?.id,
      contract_type: contractType,
      main_content: mainContent,
      signature_content: signContent,
      appendix_content: attachmentContent,
      signer_position: signerPosition,
    })
      .then((res: any) => {
        const { file_contract, contract_content } = res.data
        message.success({ content: res.message })
        // re init data contracts
        initContracts()
        setMainContent(contract_content.main)
        setSignContent(contract_content.signature)
        setAttachmentContent(contract_content.appendix)
        setFileContract(file_contract)

        if (isPreviewAfterSave) {
          if (fileContract.type.toLowerCase().includes('investor')) {
            setIsModalOpenInvestor(true)
          } else {
            window.open(
              `${BE_URL}/preview-file-contract/${file_contract.id}?token=${user?.token}&campaign_contract_id=${file_contract.id}`,
              '_blank'
            )
          }
        }
      })
      .catch((err) => {
        if (err) {
          message.error({ content: err.data.message })
        } else {
          message.error({ content: 'Fatal Error : Something went wrong' })
        }
      })
      .finally(() => setSaveLoading(false))
  }

  const handleChangeType = (value: string) => {
    setContractType(value)
  }

  const handleSelectInvestor = (value: string) => {
    console.log('Investor ID : ', value)
    setInvestorId(value)
  }

  const changeContractContent = (id: any) => {
    setOpenModalFileContract(false)
    setLoading(true)

    Api.get(`campaign/file-contract/detail/${id}`, user?.token)
      .then((res: any) => {
        const { file_contract, contract_content } = res.data

        setMainContent(contract_content.main)
        setSignContent(contract_content.signature)
        setAttachmentContent(contract_content.appendix)
        setSignerPosition(
          contract_content.signer_position
            ? contract_content.signer_position
            : ''
        )
        setFileContract(file_contract)
        setContractType(file_contract.type)
      })
      .finally(() => setLoading(false))
  }

  const newContract = () => {
    setLoading(true)

    setMainContent('')
    setSignContent('')
    setAttachmentContent('')
    setFileContract(null)
    setContractType(null)

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const onNextPreview = () => {
    window.open(
      `${BE_URL}/preview-file-contract/${fileContract.id}?token=${user?.token}&campaign_contract_id=${fileContract.id}&preview_investment_id=${investorId}`,
      '_blank'
    )

    setTimeout(() => {
      setIsModalOpenInvestor(false)
    }, 500)
  }

  const generateContract = () => {
    setLoading(true)

    Api.post(
      `campaign/file-contract/generate/${fileContract?.id}`,
      user?.token,
      null,
      {
        investment_id: investorId,
      }
    )
      .then((res: any) => {
        message.success({ content: 'Contract was successfully generated' })

        setFileContract(res.data)
        downloadFile(res.data.generated_url)
      })
      .catch((err: any) => {
        message.error({ content: 'Ops, Failed to generate Contract' })
      })
      .finally(() => setLoading(false))
  }

  const downloadFile = (file_url: string) => {
    window.open(file_url, '_blank')
  }

  const items = [
    {
      key: '01',
      label: (
        <span onClick={newContract}>
          <Space size={10}>
            <PlusOutlined />
            <>{`New Contract`}</>
          </Space>
        </span>
      ),
    },
    {
      key: '0',
      label: (
        <span onClick={() => setOpenModalFileContract(true)}>
          <Space size={10}>
            <RetweetOutlined />
            <>{`Change Contract`}</>
          </Space>
        </span>
      ),
    },
  ]

  // add new menu items when file contract is not null
  if (fileContract) {
    items.push(
      {
        key: '1',
        label: (
          <span
            onClick={() => {
              setIsModalPassword(true)
              setIsPreviewAfterSave(true)
            }}
          >
            <Space size={10}>
              <FileDoneOutlined />
              <>{`Save & Preview`}</>
            </Space>
          </span>
        ),
      },
      {
        key: '2',
        label: (
          <>
            {fileContract ? (
              <span onClick={generateContract}>
                <Space size={10}>
                  <FilePdfOutlined />
                  <>{`Generate`}</>
                </Space>
              </span>
            ) : (
              <Button type="link" disabled>
                Generate
              </Button>
            )}
          </>
        ),
      },
      {
        key: '3',
        label: (
          <>
            {fileContract?.generated_url ? (
              <span onClick={() => downloadFile(fileContract.generated_url)}>
                <Space size={10}>
                  <DownloadOutlined />
                  <>{`Download`}</>
                </Space>
              </span>
            ) : (
              <Button type="link" disabled>
                Download
              </Button>
            )}
          </>
        ),
      }
    )
  }

  const onSearch = (value: string) => {
    // console.log(value)
    const result = templates.filter((template: any) => {
      return (template?.name ?? '').includes(value)
    })
    setFilteredTemplates(result)

    console.log(result)
  }

  const checkPassword = () => {
    setBtnPasswordLoading(true)

    Api.post(`auth/check`, user?.token, user?.id, {
      email: user.email,
      password: adminPassword,
    })
      .then((res: any) => {
        onSave()
        setIsModalPassword(false)
      })
      .catch((err) => {
        message.error({ content: err.data.message })

        setIsPasswordFalse(true)
      })
      .finally(() => {
        setAdminPassword('')
        setBtnPasswordLoading(false)
      })
  }

  return (
    <>
      {screens.xs || screens.sm ? (
        <div className="text-center">
          <CloseCircleOutlined
            style={{ fontSize: '6rem', color: 'red', paddingTop: '35px' }}
          />
          <Typography.Title level={4}>
            You cannot edit the contract on a mobile device
          </Typography.Title>
        </div>
      ) : (
        <>
          {!loading && (
            <>
              <Divider orientation="left" dashed />
              <Row>
                <Col span={12}>
                  <Space size={15}>
                    <Button icon={<BlockOutlined />} onClick={showModal}>
                      Change Template
                    </Button>
                    <Select
                      showSearch
                      allowClear
                      value={contractType}
                      placeholder="Select Type of Contract"
                      style={{ width: 200 }}
                      onChange={handleChangeType}
                      filterOption={(input, option) =>
                        (option?.label ?? '').includes(input)
                      }
                      options={contract_types}
                    />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space className="space-end">
                    <Button
                      type="primary"
                      loading={saveLoading}
                      disabled={savePreviewLoading || contractType === null}
                      // onClick={() => onSave(false)}
                      onClick={() => {
                        setIsModalPassword(true)
                        setIsPreviewAfterSave(false)
                      }}
                      icon={<CheckOutlined />}
                    >{`Save Contract`}</Button>

                    <Dropdown menu={{ items }} placement="bottomRight">
                      <Tooltip title={`More menu`}>
                        <Button icon={<MoreOutlined />}></Button>
                      </Tooltip>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </>
          )}
          {loading ? (
            <div className="text-center my-5">
              <LoadingOutlined style={{ fontSize: '2.5rem' }} />
              <h3>Please Wait</h3>
            </div>
          ) : (
            <>
              <Divider orientation="left" dashed />
              <Tabs
                defaultActiveKey="1"
                style={{ marginBottom: 32 }}
                items={[
                  {
                    label: `Main Content`,
                    key: 'main-content',
                    children: (
                      <ContractEditorForm
                        content={mainContent}
                        onChangeContent={(content: string) =>
                          setMainContent(content)
                        }
                      />
                    ),
                  },
                  {
                    label: `Sign Content`,
                    key: 'sign content',
                    children: (
                      <ContractEditorForm
                        content={signContent}
                        onChangeContent={(content: string) =>
                          setSignContent(content)
                        }
                      />
                    ),
                  },
                  {
                    label: `Attachment Content`,
                    key: 'attachment-content',
                    children: (
                      <ContractEditorForm
                        content={attachmentContent}
                        onChangeContent={(content: string) =>
                          setAttachmentContent(content)
                        }
                      />
                    ),
                  },
                ]}
              />
            </>
          )}
        </>
      )}

      <Modal
        title={`Select Contract Template`}
        footer={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={640}
      >
        <Space
          align="end"
          style={{ width: '100%', justifyContent: 'end', marginBottom: '15px' }}
        >
          <Search
            allowClear
            placeholder="Search contract name"
            onSearch={onSearch}
            style={{ width: 250 }}
          />
        </Space>
        <List
          dataSource={filteredTemplates}
          pagination={{
            pageSize: 8,
          }}
          renderItem={(item: any) => (
            <List.Item onClick={handleOk}>
              <Button
                type="text"
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => selectTemplate(item)}
              >
                <Space className="space-between">
                  {item.name}
                  <Typography.Text>
                    <small>{item.updated_at}</small>
                  </Typography.Text>
                </Space>
              </Button>
            </List.Item>
          )}
        />
      </Modal>

      <ListOfFileContracts
        fileContracts={campaignContracts}
        isOpen={openModalFileContract}
        closeModal={() => setOpenModalFileContract(false)}
        selectContract={changeContractContent}
      />

      <Modal
        title="Select Investor"
        open={isModalOpenInvestor}
        onCancel={() => setIsModalOpenInvestor(false)}
        footer={null}
        centered
        width={375}
      >
        <Space direction="vertical" size={15} style={{ marginTop: 15 }}>
          <Select
            showSearch
            allowClear
            placeholder="Select investor"
            style={{ width: 325 }}
            onChange={handleSelectInvestor}
            filterOption={(input, option) =>
              (option?.label ? option.label.toString() : '').includes(input)
            }
            options={investmentOption}
          />

          <Button type="primary" onClick={onNextPreview}>
            Next to Preview
          </Button>
        </Space>
      </Modal>

      <Modal
        title="Password Confirmation"
        open={isModalPassword}
        onCancel={() => setIsModalPassword(false)}
        footer={false}
        width={350}
        centered
      >
        <p>Please enter your account password for confirmation.</p>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <Input.Password
            autoComplete="false"
            status={`${isPasswordFalse ? 'error' : ''}`}
            placeholder="Enter your password"
            style={{ width: '100%' }}
            onChange={(e) => {
              setAdminPassword(e.target.value)
              setIsPasswordFalse(false)
            }}
          />
          <Button
            icon={<CheckOutlined />}
            onClick={checkPassword}
            loading={btnPasswordLoading}
            disabled={adminPassword === ''}
          >
            Submit
          </Button>
        </Space>
      </Modal>
    </>
  )
}

export default ContractEditor
