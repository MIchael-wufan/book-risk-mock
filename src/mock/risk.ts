import type { BlockRecord } from '../types/risk'

// ── 封控记录 mock（覆盖各日期类型 / 状态 / 地区组合）───────────────
export const MOCK_RECORDS: BlockRecord[] = [
  { id: 1,  taskId: 3001, taskName: '教材教辅专项治理', reason: '内容审核未通过，含违规插图', bookId: 4785173, bookName: '语文七年级上册（人教版）', isbn: '9787107321456', author: '人民教育出版社', dateType: 'daily',   timeStart: '00:00', timeEnd: '23:59', regions: ['全国'], status: 'active',  createdAt: '2026-09-28 10:15' },
  { id: 2,  taskId: 3001, taskName: '教材教辅专项治理', reason: '内容审核未通过，含违规插图', bookId: 4801022, bookName: '英语高一全册（北师大版）', isbn: '9787107256301', author: '北京师范大学出版社', dateType: 'daily',   timeStart: '00:00', timeEnd: '23:59', regions: ['全国'], status: 'active',  createdAt: '2026-09-28 10:15' },
  { id: 3,  taskId: 3002, taskName: '广东地区监管要求', reason: '接到属地监管通知，需临时屏蔽', bookId: 4820011, bookName: '历史七年级下册（人教版）', isbn: '9787107245678', author: '人民教育出版社', dateType: 'workday', timeStart: '08:00', timeEnd: '18:00', regions: ['广东省/深圳市', '广东省/广州市'], status: 'active', createdAt: '2026-10-08 14:30' },
  { id: 4,  taskId: 3002, taskName: '广东地区监管要求', reason: '接到属地监管通知，需临时屏蔽', bookId: 4830456, bookName: '数学八年级下册（人教版）', isbn: '9787107298745', author: '人民教育出版社', dateType: 'workday', timeStart: '08:00', timeEnd: '18:00', regions: ['广东省/深圳市', '广东省/广州市'], status: 'active', createdAt: '2026-10-08 14:30' },
  { id: 5,  taskId: 3003, taskName: '寒假内容安全加固', reason: '寒假期间青少年使用高峰，预防性屏蔽', bookId: 4840912, bookName: '物理九年级上册（人教版）', isbn: '9787107312789', author: '人民教育出版社', dateType: 'holiday', timeStart: '00:00', timeEnd: '23:59', regions: ['北京市/北京市', '上海市/上海市'], status: 'active', createdAt: '2026-09-15 09:00' },
  { id: 6,  taskId: 3003, taskName: '寒假内容安全加固', reason: '寒假期间青少年使用高峰，预防性屏蔽', bookId: 4851230, bookName: '化学高二下册（苏教版）', isbn: '9787107334512', author: '江苏凤凰教育出版社', dateType: 'holiday', timeStart: '00:00', timeEnd: '23:59', regions: ['北京市/北京市', '上海市/上海市'], status: 'active', createdAt: '2026-09-15 09:00' },
  { id: 7,  taskId: 3003, taskName: '寒假内容安全加固', reason: '寒假期间青少年使用高峰，预防性屏蔽', bookId: 4862011, bookName: '生物八年级上册（人教版）', isbn: '9787107278934', author: '人民教育出版社', dateType: 'holiday', timeStart: '00:00', timeEnd: '23:59', regions: ['北京市/北京市', '上海市/上海市'], status: 'active', createdAt: '2026-09-15 09:00' },
  { id: 8,  taskId: 3004, taskName: '版权方投诉处理', reason: '版权方发函投诉，核实中', bookId: 4873045, bookName: '地理高一上册（粤教版）', isbn: '9787107356789', author: '广东教育出版社', dateType: 'daily',   timeStart: '00:00', timeEnd: '23:59', regions: ['浙江省/杭州市', '江苏省/南京市'], status: 'stopped', createdAt: '2026-08-20 11:20', updatedAt: '2026-09-30 16:45' },
  { id: 9,  taskId: 3005, taskName: '高考专项保障', reason: '高考期间按上级要求暂停相关教辅展示', bookId: 4884022, bookName: '政治九年级全册（人教版）', isbn: '9787107301234', author: '人民教育出版社', dateType: 'workday', timeStart: '07:00', timeEnd: '12:00', regions: ['全国'], status: 'stopped', createdAt: '2026-06-01 08:00', updatedAt: '2026-06-15 18:00' },
  { id: 10, taskId: 3005, taskName: '高考专项保障', reason: '高考期间按上级要求暂停相关教辅展示', bookId: 4895011, bookName: '数学高三练习册（北师大版）', isbn: '9787107389012', author: '北京师范大学出版社', dateType: 'workday', timeStart: '07:00', timeEnd: '12:00', regions: ['全国'], status: 'stopped', createdAt: '2026-06-01 08:00', updatedAt: '2026-06-15 18:00' },
]

// ── 图书查询 mock（供表单按 ID/ISBN 查书名）────────────────────────
export const MOCK_BOOKS: Array<{ bookId: number; bookName: string; isbn: string; author: string }> = [
  ...MOCK_RECORDS.map(r => ({ bookId: r.bookId, bookName: r.bookName, isbn: r.isbn, author: r.author })),
  { bookId: 5001001, bookName: '语文五年级上册（部编版）', isbn: '9787107345671', author: '人民教育出版社' },
  { bookId: 5001002, bookName: '数学六年级下册（苏教版）', isbn: '9787534398765', author: '江苏凤凰教育出版社' },
  { bookId: 5001003, bookName: '英语三年级起点（外研版）', isbn: '9787513590123', author: '外语教学与研究出版社' },
  { bookId: 5001004, bookName: '初中物理竞赛教程', isbn: '9787308012345', author: '浙江大学出版社' },
  { bookId: 5001005, bookName: '高中生物奥赛讲义', isbn: '9787312012345', author: '中国科学技术大学出版社' },
]

export const findBook = (key: string): { bookId: number; bookName: string; isbn: string; author: string } | undefined =>
  MOCK_BOOKS.find(b => String(b.bookId) === key || b.isbn === key)
