import { useState } from 'react'
import * as XLSX from 'xlsx'
import { Modal, Tabs, Button, Input, Upload, message, Table, Alert } from 'antd'
import type { TableColumnsType } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { DateType } from '../../types/risk'
import { dateTypeLabel } from '../../types/risk'
import { useRiskStore, type ImportRow } from '../../stores/riskStore'
import { PROVINCE_VALUES } from '../../data/regions'

const { Dragger } = Upload

// ── 文件解析 ───────────────────────────────────────────────────────
const DATE_TYPE_ALIAS: Record<string, DateType> = {
  '每日': 'daily', '每天': 'daily', 'daily': 'daily',
  '工作日': 'workday', 'workday': 'workday',
  '节假日': 'holiday', 'holiday': 'holiday', '假期': 'holiday',
}

const parseDateType = (raw: string): DateType | null => {
  const v = DATE_TYPE_ALIAS[raw.trim()]
  return v ?? null
}

/** 'HH:mm' 校验 */
const isValidTime = (s: string): boolean => /^([01]?\d|2[0-3]):[0-5]\d$/.test(s.trim())

export interface ParsedRow extends ImportRow {
  _rowNo: number
  _errors: string[]
}

const normalizeTime = (raw: string): string => {
  const m = raw.trim().match(/^(\d{1,2}):(\d{1,2})$/)
  if (!m) return ''
  return `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}`
}

export interface ParsedRow extends ImportRow {
  reason: string
  _rowNo: number
  _errors: string[]
}

const parseImportFile = (buffer: ArrayBuffer): ParsedRow[] => {
  const wb = XLSX.read(buffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' })
  if (!rows.length) return []
  // 跳过表头行（首列为非纯数字则认为是表头）
  const firstCell = String(rows[0][0] ?? '')
  const dataRows = /[^\d]/.test(firstCell) ? rows.slice(1) : rows
  return dataRows
    .filter(r => r.some(c => String(c ?? '').trim()))
    .map((r, i) => {
      const bookId   = String(r[0] ?? '').trim()
      const isbn     = String(r[1] ?? '').trim()
      const dateType = parseDateType(String(r[2] ?? ''))
      const timeStart = normalizeTime(String(r[3] ?? ''))
      const timeEnd   = normalizeTime(String(r[4] ?? ''))
      const regionsRaw = String(r[5] ?? '').trim()
      const reason   = String(r[6] ?? '').trim()

      const errors: string[] = []
      if (!bookId && !isbn) errors.push('图书ID与ISBN至少填一项')
      if (bookId && !/^\d+$/.test(bookId)) errors.push('图书ID须为数字')
      if (!dateType) errors.push('屏蔽日期须为 每日/工作日/节假日')
      if (!timeStart || !timeEnd) errors.push('时间格式应为 HH:mm')
      else if (!isValidTime(timeStart) || !isValidTime(timeEnd)) errors.push('时间不在 00:00-23:59 范围')
      else if (timeStart >= timeEnd) errors.push('开始时间须早于结束时间')
      if (!regionsRaw) errors.push('屏蔽地区不能为空')
      const regions = regionsRaw.split(/[;；、,，\s|]+/).filter(Boolean)
      regions.forEach(rg => {
        const prov = rg.split('/')[0]
        if (rg !== '全国' && !PROVINCE_VALUES.has(prov)) errors.push(`地区「${rg}」无法识别`)
      })

      return {
        bookId, isbn,
        dateType: dateType ?? 'daily',
        timeStart: timeStart || '00:00',
        timeEnd: timeEnd || '23:59',
        regions,
        reason,
        _rowNo: i + 2,   // +2：表头占 1 行，序号从 1 起
        _errors: errors,
      }
    })
}

// 预览表列
const previewColumns: TableColumnsType<ParsedRow> = [
  { title: '行号', dataIndex: '_rowNo', width: 60 },
  { title: '图书ID', dataIndex: 'bookId', width: 100, render: v => v || '-' },
  { title: 'ISBN', dataIndex: 'isbn', width: 130, render: v => v || '-' },
  { title: '屏蔽日期', dataIndex: 'dateType', width: 90, render: (v: DateType) => dateTypeLabel[v] },
  { title: '时间', key: 'time', width: 110, render: (_, r) => `${r.timeStart}-${r.timeEnd}` },
  { title: '屏蔽地区', dataIndex: 'regions', render: (regions: string[]) => regions.join('；') },
  { title: '屏蔽原因', dataIndex: 'reason', render: v => v || '-' },
  { title: '校验', dataIndex: '_errors', width: 240, render: (errs: string[]) =>
    errs.length
      ? <span style={{ color: '#ff4d4f', fontSize: 12 }}>{errs.join('；')}</span>
      : <span style={{ color: '#52c41a' }}>✓</span>,
  },
]

// ── 导入弹窗 ───────────────────────────────────────────────────────
export default function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addRecords } = useRiskStore()
  const [taskName, setTaskName] = useState('')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')

  const validRows = rows.filter(r => !r._errors.length)
  const errorCount = rows.length - validRows.length

  const resetAndClose = () => {
    setTaskName(''); setRows([]); setFileName(''); onClose()
  }

  const handleOk = () => {
    if (!taskName.trim()) { message.error('请输入任务名称'); return }
    if (!validRows.length) { message.warning('没有可导入的有效数据行'); return }
    addRecords(validRows, taskName.trim(), validRows[0].reason || '')
    message.success(`已导入 ${validRows.length} 条封控记录${errorCount ? `，跳过 ${errorCount} 条错误行` : ''}`)
    resetAndClose()
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['图书ID', 'ISBN', '屏蔽日期', '屏蔽开始时间', '屏蔽结束时间', '屏蔽地区', '屏蔽原因'],
      ['5001001', '', '每日', '00:00', '23:59', '全国', '示例：内容审核未通过'],
      ['5001002', '', '工作日', '08:00', '18:00', '广东省/深圳市；广东省/广州市', '示例：属地监管要求'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '封控导入模板')
    XLSX.writeFile(wb, '风险图书封控导入模板.xlsx')
  }

  const tabItems = [
    {
      key: 'upload',
      label: '上传文件',
      children: (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13 }}>任务名称 <span style={{ color: '#ff4d4f' }}>*</span></span>
            <Input
              style={{ width: 320 }}
              placeholder="请输入屏蔽任务名称"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              maxLength={50}
              allowClear
            />
          </div>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#888' }}>
            文件表头：<code>图书ID,ISBN,屏蔽日期,屏蔽开始时间,屏蔽结束时间,屏蔽地区,屏蔽原因</code>；
            屏蔽日期填「每日 / 工作日 / 节假日」；地区格式「广东省/深圳市」，多个用分号分隔，可填「全国」。支持 XLSX / CSV
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={downloadTemplate} style={{ padding: 0, marginLeft: 8 }}>
              下载模板
            </Button>
          </div>
          <Dragger
            accept=".xlsx,.csv,.tsv,.txt"
            showUploadList={false}
            beforeUpload={file => {
              const reader = new FileReader()
              reader.onload = e => {
                const parsed = parseImportFile(e.target?.result as ArrayBuffer)
                if (!parsed.length) { message.error('文件内容为空或格式不正确'); return }
                setRows(parsed); setFileName(file.name)
                const errN = parsed.filter(r => r._errors.length).length
                message.success(`已解析 ${parsed.length} 行${errN ? `，其中 ${errN} 行存在错误` : ''}`)
              }
              reader.readAsArrayBuffer(file)
              return false
            }}
          >
            <p className="ant-upload-text">点击或拖拽文件至此区域</p>
            <p className="ant-upload-hint">支持单次上传，XLSX / CSV / TSV 格式</p>
          </Dragger>
          {fileName && (
            <div style={{ marginTop: 8, fontSize: 13, color: validRows.length ? '#52c41a' : '#ff4d4f' }}>
              已选文件：{fileName}（解析 {rows.length} 行，有效 {validRows.length} 行{errorCount ? `，错误 ${errorCount} 行` : ''}）
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'preview',
      label: `数据预览${rows.length ? `（${rows.length}）` : ''}`,
      children: rows.length ? (
        <div>
          {errorCount > 0 && (
            <Alert
              type="warning" showIcon style={{ marginBottom: 12 }}
              message={`存在 ${errorCount} 行校验错误，导入时将自动跳过；点击行内错误信息可定位修正源文件`}
            />
          )}
          <Table
            rowKey="_rowNo"
            columns={previewColumns}
            dataSource={rows}
            size="small"
            scroll={{ x: 900, y: 360 }}
            pagination={false}
            rowClassName={r => r._errors.length ? 'error-row' : ''}
          />
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>请先在「上传文件」页签上传并解析文件</div>
      ),
    },
  ]

  return (
    <Modal
      title="批量导入封控记录" open={open} onOk={handleOk} onCancel={resetAndClose}
      okText="确认导入" cancelText="取消" width={960} destroyOnClose
    >
      <Tabs items={tabItems} />
    </Modal>
  )
}
