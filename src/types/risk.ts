export type DateType = 'daily' | 'workday' | 'holiday'

export type RecordStatus = 'active' | 'stopped'

/** 一条封控记录 = 屏蔽任务 × 图书 */
export interface BlockRecord {
  id: number              // 封控记录 ID
  taskId: number          // 所属屏蔽任务 ID
  taskName: string        // 任务名称
  reason: string          // 屏蔽原因备注
  bookId: number
  bookName: string
  isbn: string
  author: string
  dateType: DateType      // 屏蔽日期：每日 / 工作日 / 节假日
  timeStart: string       // 屏蔽开始时间 HH:mm
  timeEnd: string         // 屏蔽结束时间 HH:mm
  regions: string[]       // 屏蔽地点，如 '广东省/深圳市'、'全国'
  status: RecordStatus
  createdAt: string
  updatedAt?: string
}

export interface RiskFilter {
  bookId: string
  bookName: string
  isbn: string
  taskName: string
  dateType: DateType | 'all'
  region: string | undefined   // 省份或 省/市
  status: RecordStatus | 'all'
  createdStart: string | undefined
  createdEnd: string | undefined
}

/** 新增/编辑表单值 */
export interface BlockFormValues {
  taskName: string
  reason: string
  books: Array<{ bookId: string; isbn: string }>
  dateType: DateType
  timeRange: [string, string] | null
  regions: string[]   // Cascader multiple 的 value 路径数组
}

export const DATE_TYPE_OPTIONS: Array<{ value: DateType; label: string }> = [
  { value: 'daily',   label: '每日' },
  { value: 'workday', label: '工作日' },
  { value: 'holiday', label: '节假日' },
]

export const dateTypeLabel: Record<DateType, string> = {
  daily: '每日', workday: '工作日', holiday: '节假日',
}

export const statusLabel: Record<RecordStatus, string> = {
  active: '生效中', stopped: '已停止',
}
