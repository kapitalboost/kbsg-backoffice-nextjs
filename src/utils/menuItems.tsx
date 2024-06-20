import {
  ApartmentOutlined,
  BarsOutlined,
  DiffOutlined,
  FileDoneOutlined,
  MoneyCollectOutlined,
  PieChartOutlined,
  RadiusSettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

export const menuItemsLayout = [
  {
    title: 'Dashboard',
    key: 'dashboard',
    path: '/',
    icon: <PieChartOutlined />,
    children: false,
    // userFor: ['superadmin', 'admin', 'staff', 'teacher', 'student'],
  },
  {
    title: 'Campaigns',
    key: 'campaigns',
    path: '/campaigns',
    icon: <BarsOutlined />,
    children: false,
  },
  {
    title: 'Get Fundeds',
    key: 'get-fundeds',
    path: '/get-fundeds',
    icon: <DiffOutlined />,
    children: false,
  },
  {
    title: 'Users',
    key: 'users',
    path: '/users',
    icon: <UserOutlined />,
    children: false,
  },
  {
    title: 'Investments',
    key: 'investments',
    path: '/investments',
    icon: <FileDoneOutlined />,
    children: false,
  },
  {
    title: 'Withdrawals',
    key: 'withdrawals',
    path: '/withdrawals',
    icon: <MoneyCollectOutlined />,
    children: false,
  },
  {
    title: 'Partnering',
    key: 'partners',
    path: ``,
    icon: <ApartmentOutlined />,
    children: [
      {
        title: 'Partners',
        key: 'list',
        path: `/partners/list`,
      },
      {
        title: 'Affiliations',
        key: 'affiliations',
        path: `/partners/affiliations`,
      },
      {
        title: 'Referals',
        key: 'referals',
        path: `/partners/referals`,
      },
    ],
  },
  {
    title: 'Main Setting',
    key: 'setting',
    path: '',
    icon: <RadiusSettingOutlined />,
    children: [
      {
        title: 'Admins',
        key: 'admins',
        path: `/admins`,
      },
      {
        title: 'Banks',
        key: 'banks',
        path: `/banks`,
      },
      {
        title: 'Blogs',
        key: 'blogs',
        path: `/blogs`,
      },
      {
        title: 'Contract Templates',
        key: 'contract-templates',
        path: `/contract-templates`,
      },
      {
        title: 'Contact Form',
        key: 'contact-form',
        path: `/contact-form`,
      },
      {
        title: 'Mobile Notification',
        key: 'mobile-notification',
        path: `/mobile-notification`,
      },
      {
        title: 'Teams',
        key: 'teams',
        path: `/teams`,
      },
    ],
  },
]
