import { Api } from '@/api/api'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tooltip,
} from 'antd'
// import Search from 'antd/es/input/Search'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const { Search } = Input

interface IProps {
  user: any
}

const Banks = ({ user }: IProps) => {
  const [loading, setLoading] = useState(false)
  const [getFundeds, setGetFundeds] = useState<any>(null)
  const [filteredGetFundeds, setFilteredGetFundeds] = useState<any>(null)

  const init = () => {
    setLoading(true)
    Api.get(`get-fundeds`, user?.token)
      .then((res: any) => {
        setGetFundeds(res.data)
        setFilteredGetFundeds(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    init()
  }, [])

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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone no',
      dataIndex: 'phone_no',
      key: 'phone_no',
    },
    {
      title: 'Company name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Company registration number',
      dataIndex: 'company_reg_number',
      key: 'company_reg_number',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Annual revenue',
      dataIndex: 'annual_revenue',
      key: 'annual_revenue',
    },
    {
      title: 'Financing Solution',
      dataIndex: 'financing_solution',
      key: 'financing_solution',
    },
  ]

  const onSearch = (value: string) => {
    const result = getFundeds.filter((contract: any) => {
      return (contract?.name ?? '').includes(value)
    })

    setFilteredGetFundeds(result)
  }

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Get funded</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Row>
          <Col span={24}>
            <Space className="space-between mb-1">
              <h3 className="m-0 fw-300">
                <strong>List of Get Funded</strong>
              </h3>
              <Search
                allowClear
                onSearch={onSearch}
                placeholder="Find by name"
              />
            </Space>

            <Table
              dataSource={filteredGetFundeds}
              columns={columns}
              className={'mt-1'}
              loading={loading}
              scroll={{ x: 800 }}
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default Banks

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  const user = session?.user

  return {
    props: {
      user: user,
    },
  }
}
