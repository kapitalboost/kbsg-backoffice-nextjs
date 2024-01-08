import {
  LogoutOutlined,
  ReloadOutlined,
  RetweetOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu, Space, Button, Dropdown } from 'antd'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

interface IProps {
  onChangeMode: any
}

const HeaderLayout = ({ onChangeMode }: IProps) => {
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Button type="link" size="small" onClick={onChangeMode}>
          <ReloadOutlined /> Switch Mode
        </Button>
      ),
    },
    {
      key: '1',
      label: (
        <Link href={`/reset-password`}>
          <Button type="link" size="small">
            <RetweetOutlined /> Reset Password
          </Button>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          type="link"
          size="small"
          onClick={() =>
            signOut({
              callbackUrl: '/login',
            })
          }
          danger
        >
          <LogoutOutlined /> Logout
        </Button>
      ),
    },
  ]

  return (
    <Space className="space-between">
      <h4 style={{ margin: 0 }}>{`Assalamu'alaikum`}</h4>
      <span>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Button shape="circle" type="dashed">
            <UserOutlined />
          </Button>
        </Dropdown>
      </span>
    </Space>
  )
}

export default HeaderLayout
