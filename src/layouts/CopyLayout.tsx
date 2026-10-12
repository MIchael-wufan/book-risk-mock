import { Layout, Menu, Breadcrumb } from 'antd'
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Sider, Content } = Layout

const SIDER_MENU = [
  {
    key: 'copy-group',
    label: '在线抄写',
    icon: <AppstoreOutlined />,
    children: [
      { key: '/online-copy/book-list',      label: '抄写图书列表', icon: <UnorderedListOutlined /> },
      { key: '/online-copy/risk-control',   label: '风险图书封控', icon: <SafetyCertificateOutlined /> },
    ],
  },
]

const SIDER_BG = '#1a1f2e'

export default function CopyLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout style={{ minHeight: 'calc(100vh - 48px)' }}>
      {/* 左侧 Sider */}
      <Sider
        width={200}
        style={{
          background: SIDER_BG,
          position: 'fixed',
          top: 48,        // 和顶部 AppLayout Header 对齐
          left: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 100,
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            抄
          </div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
            在线抄写中心
          </span>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['copy-group']}
          onClick={({ key }) => navigate(key)}
          items={SIDER_MENU}
          style={{
            background: SIDER_BG,
            border: 'none',
            marginTop: 4,
          }}
        />
      </Sider>

      {/* 右侧主体 */}
      <Layout style={{ marginLeft: 200, minHeight: 'calc(100vh - 48px)', background: '#f0f2f5' }}>
        {/* Tab 标签栏 */}
        <div
          style={{
            background: '#fff',
            padding: '0 16px',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                fontSize: 13,
                color: '#1890ff',
                borderBottom: '2px solid #1890ff',
                cursor: 'default',
                fontWeight: 500,
                gap: 6,
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: 12 }} />
              风险图书封控
            </div>
          </div>
          {/* 右侧面包屑 */}
          <Breadcrumb
            style={{ marginLeft: 'auto', fontSize: 12 }}
            items={[
              { title: '在线抄写' },
              { title: '风险图书封控' },
            ]}
          />
        </div>

        <Content style={{ padding: '0 16px 24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
