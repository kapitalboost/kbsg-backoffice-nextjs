import Link from 'next/link'
import type { MenuProps } from 'antd'
import {
  PieChartOutlined,
  UserOutlined,
  BarsOutlined,
  MoneyCollectOutlined,
  ApartmentOutlined,
  RadiusSettingOutlined,
  DiffOutlined,
  FileDoneOutlined,
} from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

export const menuItems: MenuItem[] = [
  getItem(<Link href="/">Dashboard</Link>, 'dashboard', <PieChartOutlined />),
  getItem(
    <Link href="/campaigns">Campaigns</Link>,
    'campaigns',
    <BarsOutlined />
  ),
  getItem(
    <Link href="/get-fundeds">Get Fundeds</Link>,
    'get-fundeds',
    <DiffOutlined />
  ),
  getItem(<Link href="/users">Users</Link>, 'users', <UserOutlined />),
  getItem(
    <Link href="/investments">Investments</Link>,
    'investments',
    <FileDoneOutlined />
  ),
  getItem(
    <Link href="/withdrawals">Withdrawals</Link>,
    'withdrawals',
    <MoneyCollectOutlined />
  ),
  getItem('Partnering', 'partner-menu', <ApartmentOutlined />, [
    getItem(
      <Link href="/partners/affiliations">Affiliations</Link>,
      'affiliations'
    ),
    getItem(<Link href="/partners">Partners</Link>, 'partnets'),
    getItem(<Link href="/partners/referals">Referals</Link>, 'referal'),
  ]),
  getItem('Main Setting', 'main-setting', <RadiusSettingOutlined />, [
    getItem(<Link href="/admins">Admins</Link>, 'admins'),
    getItem(<Link href="/banks">Banks</Link>, 'banks'),
    // getItem(<Link href="/banners">Banners</Link>, 'banners'),
    getItem(<Link href="/blogs">Blogs</Link>, 'blogs'),
    getItem(
      <Link href="/contract-templates">Contract Templates</Link>,
      'contract-templates'
    ),
    getItem(<Link href="/contacts">Contact Form</Link>, 'contact-form'),
    getItem(
      <Link href="/mobile-notification">Mobile Notification</Link>,
      'mobile-notification'
    ),
  ]),
]
