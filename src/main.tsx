import "./global.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppLayout from './layouts/AppLayout'
import CopyLayout from './layouts/CopyLayout'
import RiskControl from './pages/RiskControl'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1890ff' } }}>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* 默认直接进入风控页 */}
            <Route index element={<Navigate to="/online-copy/risk-control" replace />} />
            <Route path="/online-copy/risk-control" element={<CopyLayout />}>
              <Route index element={<RiskControl />} />
            </Route>
            {/* 其余导航项占位 */}
            <Route path="/online-copy" element={<Navigate to="/online-copy/risk-control" replace />} />
            <Route path="/exam-platform" element={<Placeholder title="试卷平台" />} />
            <Route path="/exercise-bank" element={<Placeholder title="练习题库" />} />
            <Route path="/human-qa" element={<Placeholder title="人工问答" />} />
            <Route path="/book-crawl/list" element={<Placeholder title="图书抓取" />} />
            <Route path="*" element={<Navigate to="/online-copy/risk-control" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  </StrictMode>
)

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, color: '#999', fontSize: 16 }}>
      {title}（待开发）
    </div>
  )
}
