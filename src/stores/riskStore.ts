import { create } from 'zustand'
import type { BlockRecord, RiskFilter, DateType } from '../types/risk'
import { MOCK_RECORDS } from '../mock/risk'

export interface ImportRow {
  bookId: string
  isbn: string
  dateType: DateType
  timeStart: string
  timeEnd: string
  regions: string[]   // '省/市' 字符串
}

interface RiskState {
  records: BlockRecord[]
  filter: RiskFilter
  setFilter: (f: Partial<RiskFilter>) => void
  resetFilter: () => void
  addRecords: (
    rows: ImportRow[],
    taskName: string,
    reason: string,
  ) => number
  updatePolicy: (ids: number[], patch: Partial<Pick<BlockRecord, 'dateType' | 'timeStart' | 'timeEnd' | 'regions'>>) => void
  updateRecord: (id: number, patch: Partial<Pick<BlockRecord, 'taskName' | 'reason'>>) => void
  stopRecords: (ids: number[]) => void
  resumeRecords: (ids: number[]) => void
  deleteRecords: (ids: number[]) => void
}

let nextId = MOCK_RECORDS.length + 100
let nextTaskId = 3006

// 支持空格 / 中英文逗号分隔的多值输入，任一命中即保留
const splitTokens = (raw: string): string[] => raw.split(/[\s,，]+/).filter(Boolean)
const matchesAny = (value: string, raw: string): boolean => {
  const tokens = splitTokens(raw)
  return tokens.length === 0 || tokens.some(token => value.includes(token))
}

const nowStr = () => new Date().toISOString().slice(0, 16).replace('T', ' ')

export const applyRiskFilter = (records: BlockRecord[], f: RiskFilter): BlockRecord[] => {
  let list = [...records]
  if (f.bookId)   list = list.filter(r => matchesAny(String(r.bookId), f.bookId))
  if (f.bookName) list = list.filter(r => matchesAny(r.bookName, f.bookName))
  if (f.isbn)     list = list.filter(r => matchesAny(r.isbn, f.isbn))
  if (f.taskName) list = list.filter(r => matchesAny(r.taskName, f.taskName))
  if (f.dateType && f.dateType !== 'all') list = list.filter(r => r.dateType === f.dateType)
  if (f.region) {
    const region = f.region
    list = list.filter(r => r.regions.some(rg =>
      rg === region || rg.startsWith(region + '/') || (region.length > 3 && rg.includes(region))
    ))
  }
  if (f.status && f.status !== 'all') list = list.filter(r => r.status === f.status)
  const start = f.createdStart
  const end = f.createdEnd
  if (start) list = list.filter(r => r.createdAt >= start)
  if (end)   list = list.filter(r => r.createdAt <= end + ' 23:59')
  return list
}

export const useRiskStore = create<RiskState>()((set) => ({
  records: [...MOCK_RECORDS],
  filter: { bookId: '', bookName: '', isbn: '', taskName: '', dateType: 'all', region: undefined, status: 'all', createdStart: undefined, createdEnd: undefined },

  setFilter: (f) => set(s => ({ filter: { ...s.filter, ...f } })),
  resetFilter: () => set({ filter: { bookId: '', bookName: '', isbn: '', taskName: '', dateType: 'all', region: undefined, status: 'all', createdStart: undefined, createdEnd: undefined } }),

  addRecords: (rows, taskName, reason) => {
    const now = nowStr()
    const taskId = nextTaskId++
    const newRecords: BlockRecord[] = rows.map(r => {
      const book = { 5001001: '语文五年级上册（部编版）', 5001002: '数学六年级下册（苏教版）', 5001003: '英语三年级起点（外研版）', 5001004: '初中物理竞赛教程', 5001005: '高中生物奥赛讲义' }[r.bookId]
      return {
        id: nextId++,
        taskId,
        taskName: taskName.trim(),
        reason: reason.trim(),
        bookId: Number(r.bookId) || 0,
        bookName: book ?? `图书${r.bookId}`,
        isbn: r.isbn,
        author: '—',
        dateType: r.dateType,
        timeStart: r.timeStart,
        timeEnd: r.timeEnd,
        regions: r.regions,
        status: 'active' as const,
        createdAt: now,
      }
    })
    set(s => ({ records: [...newRecords, ...s.records] }))
    return newRecords.length
  },

  updatePolicy: (ids, patch) => set(s => ({
    records: s.records.map(r => ids.includes(r.id) ? { ...r, ...patch, updatedAt: nowStr() } : r),
  })),

  updateRecord: (id, patch) => set(s => ({
    records: s.records.map(r => r.id === id ? { ...r, ...patch, updatedAt: nowStr() } : r),
  })),

  stopRecords: (ids) => set(s => ({
    records: s.records.map(r => ids.includes(r.id) && r.status === 'active' ? { ...r, status: 'stopped', updatedAt: nowStr() } : r),
  })),

  resumeRecords: (ids) => set(s => ({
    records: s.records.map(r => ids.includes(r.id) && r.status === 'stopped' ? { ...r, status: 'active', updatedAt: nowStr() } : r),
  })),

  deleteRecords: (ids) => set(s => ({
    records: s.records.filter(r => !ids.includes(r.id)),
  })),
}))

// 供组件直接取过滤结果
export const selectFiltered = (state: RiskState): BlockRecord[] =>
  applyRiskFilter(state.records, state.filter)
