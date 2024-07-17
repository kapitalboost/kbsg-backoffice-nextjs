import {
  CopyOutlined,
  DownOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SendOutlined,
  WarningOutlined,
} from '@ant-design/icons'

import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tabs,
  Upload,
  notification,
  Tooltip,
  Breadcrumb,
  Dropdown,
  Card,
  Typography,
  Grid,
  message,
} from 'antd'
import CampaignGallery from '../components/galleries'
import PdfCampaign from '../components/pdf'
import { Editor } from '@tinymce/tinymce-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Api } from '@/api/api'
import { getSession } from 'next-auth/react'
import dayjs from 'dayjs'
import type { UploadFile } from 'antd/es/upload/interface'
import type { UploadProps } from 'antd'

import weekday from 'dayjs/plugin/weekday'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import TeamInspector from '../components/teamInspector'
import Link from 'next/link'

import type { MenuProps } from 'antd'
import { GetServerSidePropsContext } from 'next'
import FormWriteUp from '../components/FormWriteUp'
import FormWriteUpTwo from '../components/FormWriteUp2'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Singapore')

const API_URL = process.env.NEXT_PUBLIC_API_URL
const tiny_api_key = process.env.NEXT_PUBLIC_TINY_KEY
const { useBreakpoint } = Grid

const { Option } = Select

interface IProps {
  user: any
}

const NewCampaign = ({ user }: IProps) => {
  const editorRef = useRef<any>(null)
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [fetchError, setFetchError] = useState({
    show: false,
    message: '',
  })
  const [campaign, setCampaign] = useState<any>(null)
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState<UploadFile[]>([])
  const [cover, setCover] = useState<UploadFile[]>([])
  const [campaignOptions, setCampaignOptions] = useState([])

  const id = router.query.id
  const screens = useBreakpoint()

  const loadCampaign = (id: any) => {
    setCampaign(null)
    setLoading(true)
    Api.get(`campaign/detail/${id}`, user.token)
      .then((res: any) => {
        const params = {
          ...res.data,
          release_datetime: res.data.release_datetime
            ? dayjs(res.data.release_datetime).utcOffset(8, true)
            : null,
          expiry_datetime: res.data.expiry_datetime
            ? dayjs(dayjs(res.data.expiry_datetime).utcOffset(8, true))
            : null,
          logo: res.data.logo === null ? '' : res.data.logo,
        }

        form.setFieldsValue(params)
        setDescription(params.description)
        setCampaign(params)

        // set logo & cover
        if (params.logo !== null) {
          let files: any = []

          let itemLogo = {
            uid: Math.floor(1000 + Math.random() * 9000),
            name: `file-logo`,
            status: 'done',
            url: params.logo,
          }

          files.push(itemLogo)
          setLogo(files)
        }

        if (params.cover_image !== null) {
          let files: any = []

          let item = {
            uid: Math.floor(1000 + Math.random() * 9000),
            name: `file-logo`,
            status: 'done',
            url: params.cover_image,
          }

          files.push(item)
          setCover(files)
        }
      })
      .catch((err) => {
        setFetchError({
          show: true,
          message: err.data.message,
        })
      })
      .finally(() => setLoading(false))
  }

  const loadCampaignOptions = () => {
    Api.get(`campaign/options`, user.token)
      .then((res: any) => {
        setCampaignOptions(res.data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  useEffect(() => {
    loadCampaignOptions()
    loadCampaign(id)
  }, [])

  const onFinish = (values: any) => {
    setLoading(true)

    Api.post(`campaign/update/${id}`, user.token, user.id, {
      ...values,
    })
      .then((res: any) => {
        notification.success({ message: 'Success to update campaign' })

        setTimeout(() => {
          loadCampaign(id)
        }, 500)
      })
      .catch((err: any) => {
        notification.error({ message: 'error' })
      })
  }

  const handleEditorChange = (content: any, editor: any) => {
    // console.log('Content was updated:', content)
    // setDescription(content)
    form.setFieldValue('description', content)
  }

  const handleChangeLogo: UploadProps['onChange'] = ({ file, fileList }) => {
    // let newFileList = [...info.fileList]
    if (file.status === 'done') {
      form.setFieldValue('logo', file.response.data.file_path)
    }
  }

  const handleChangeCover: UploadProps['onChange'] = ({ file, fileList }) => {
    // let newFileList = [...info.fileList]
    if (file.status === 'done') {
      form.setFieldValue('cover_image', file.response.data.file_path)
    }
  }

  const regeneratePassword = () => {
    setPasswordLoading(true)
    setTimeout(() => {
      Api.get(`campaign/generate-password`, user.token)
        .then((res: any) => {
          console.log(res)
          form.setFieldValue('password', res.password)
        })
        .catch((err: any) => {
          console.log(err)
          notification.error({ message: 'failed to generate password' })
        })
        .finally(() => setPasswordLoading(false))
    }, 1000)
  }

  const onFinishFailed = () => {
    message.error('Submit failed! Please check the required field.')
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Link href={`/campaigns/contract/${campaign?.slug}`}>Contract</Link>
      ),
    },
    {
      key: '1',
      label: (
        <Link href={`/campaigns/investment-report/${campaign?.slug}`}>
          Investment Report
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link href={`/campaigns/payout-report/${campaign?.slug}`}>
          Payout Report
        </Link>
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
                Edit
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Typography.Title level={4} className="m-0 mb-1">
          Edit Campaign
        </Typography.Title>

        {loading ? (
          <div className="text-center my-5">
            <LoadingOutlined style={{ fontSize: '2.5rem' }} />
            <h3>Loading..</h3>
          </div>
        ) : (
          <Tabs
            tabPosition={screens.xl ? 'right' : 'top'}
            items={[
              {
                label: `Campaign Writeup`,
                key: 'campaign-form',
                children: (
                  <FormWriteUpTwo
                    form={form}
                    loadCampaign={loadCampaign}
                    user={user}
                    id={id}
                    campaign={campaign}
                    campaignOptions={campaignOptions}
                    logo={logo}
                    cover={cover}
                  />
                ),
              },
              {
                label: `Galleries`,
                key: 'campaign-gallery',
                children: <CampaignGallery user={user} campaign={campaign} />,
                disabled: campaign === null,
              },
              {
                label: `PDFs`,
                key: 'campaign-pdf',
                children: <PdfCampaign user={user} campaign={campaign} />,
                disabled: campaign === null,
              },
              {
                label: `BD/Analyst`,
                key: 'team-inspector',
                children: <TeamInspector user={user} slug={campaign?.slug} />,
                disabled: campaign === null,
              },
            ]}
          />
        )}
      </Card>
    </>
  )
}

export default NewCampaign

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
