# 风险图书封控后台 Mock

「在线抄写」子 Tab —— 风险图书封控列表管理页面的交互原型（Mock）。

## 在线预览

https://michael-wufan.github.io/book-risk-mock/

## 功能

- **封控列表**：展示被封控图书与风控策略（屏蔽日期/时间/地区），支持按图书ID、书名、ISBN、任务名称、日期类型、地区、状态、创建时间筛选
- **屏蔽任务增删改**：添加任务（任务名称 + 屏蔽原因备注 + 多本图书 + 策略）、编辑任务信息、删除（单条/批量）
- **风控策略**：屏蔽日期（每日/工作日/节假日）、屏蔽时间（00:00-23:59）、屏蔽地点（省/市级联多选，支持「全国」）；单条与批量修改
- **批量导入**：上传 XLSX/CSV 文件批量新增/修改封控记录，带行级校验（错误行标红可跳过）、模板下载
- 启停控制：单条/批量停止与恢复

## 技术栈

React 19 + Vite + TypeScript + Ant Design 6 + Zustand

## 本地开发

```bash
npm install
npm run dev      # 开发
npm run build    # 构建
npm run deploy   # 构建并发布到 GitHub Pages
```
