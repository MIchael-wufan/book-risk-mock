import { useMemo, useState } from 'react'
import {
  Card, Table, Button, Input, DatePicker, Space, Tag, Form,
  Modal, Radio, message, Popconfirm, TimePicker,
  Cascader, Drawer, Descriptions, Badge,
} from 'antd'
import type { TableColumnsType } from 'antd'
import {
  PlusOutlined, UploadOutlined, EditOutlined, StopOutlined,
  PlayCircleOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import type { BlockRecord, DateType, RecordStatus } from '../../types/risk'
import { DATE_TYPE_OPTIONS, dateTypeLabel, statusLabel } from '../../types/risk'
import { REGION_OPTIONS } from '../../data/regions'
import { useRiskStore, applyRiskFilter } from '../../stores/riskStore'
import { findBook } from '../../mock/risk'
import ImportModal from './ImportModal'
import PolicyModal from './PolicyModal'

const { RangePicker } = DatePicker

// ── 搜索表单 ───────────────────────────────────────────────────────
function SearchForm() {
  const { setFilter, resetFilter } = useRiskStore()
  const [form] = Form.useForm()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    setFilter({
      bookId: v.bookId?.trim(),
      bookName: v.bookName?.trim(),
      isbn: v.isbn?.trim(),
      taskName: v.taskName?.trim(),
      dateType: v.dateType ?? 'all',
      region: v.region ? v.region[v.region.length - 1] : undefined,
      status: v.status ?? 'all',
      createdStart: v.createdAtRange?.[0]?.format('YYYY-MM-DD'),
      createdEnd: v.createdAtRange?.[1]?.format('YYYY-MM-DD'),
    })
  }

  const handleReset = () => {
    form.resetFields()
    resetFilter()
  }

  const labelStyle = { minWidth: 70 }
  const inputStyle = { width: '100%' }

  return (
    <Form form={form} layout="inline" style={{ padding: '16px 24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 12, width: '100%' }}>
        <Form.Item label={<span style={labelStyle}>图书ID</span>} name="bookId">
          <Input placeholder="请输入图书ID，多个用空格或逗号分隔" style={inputStyle} allowClear />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>书名</span>} name="bookName">
          <Input placeholder="请输入书名" style={inputStyle} allowClear />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>ISBN</span>} name="isbn">
          <Input placeholder="请输入ISBN" style={inputStyle} allowClear />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>任务名称</span>} name="taskName">
          <Input placeholder="请输入任务名称" style={inputStyle} allowClear />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>屏蔽日期</span>} name="dateType" initialValue="all">
          <Radio.Group>
            <Radio value="all">全部</Radio>
            <Radio value="daily">每日</Radio>
            <Radio value="workday">工作日</Radio>
            <Radio value="holiday">节假日</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>屏蔽地区</span>} name="region">
          <Cascader
            placeholder="请选择省份或城市"
            style={inputStyle}
            options={REGION_OPTIONS}
            changeOnSelect
            allowClear
            showSearch
          />
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>状态</span>} name="status" initialValue="all">
          <Radio.Group>
            <Radio value="all">全部</Radio>
            <Radio value="active">生效中</Radio>
            <Radio value="stopped">已停止</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={<span style={labelStyle}>创建时间</span>} name="createdAtRange">
          <RangePicker placeholder={['开始日期', '截至日期']} style={inputStyle} />
        </Form.Item>
        <div style={{ paddingBottom: 16, gridColumn: '1 / -1' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginRight: 8 }}>查询</Button>
          <Button onClick={handleReset}>重置</Button>
        </div>
      </div>
    </Form>
  )
}

const dateTypeColor: Record<DateType, string> = {
  daily: 'blue', workday: 'cyan', holiday: 'orange',
}

const statusColor: Record<RecordStatus, string> = {
  active: 'success', stopped: 'default',
}

// ── 主页面 ─────────────────────────────────────────────────────────
export default function RiskControl() {
  const { records, filter, stopRecords, resumeRecords, deleteRecords } = useRiskStore()
  // zustand selector 不能每次返回新引用，改为 useMemo 派生过滤结果
  const filtered = useMemo(() => applyRiskFilter(records, filter), [records, filter])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const [detailRecord, setDetailRecord] = useState<BlockRecord | null>(null)
  const [editRecord, setEditRecord] = useState<BlockRecord | null>(null)
  const [policyRecords, setPolicyRecords] = useState<BlockRecord[] | null>(null)

  const columns: TableColumnsType<BlockRecord> = [
    { title: 'ID', dataIndex: 'id', width: 60, fixed: 'left' },
    { title: '任务名称', dataIndex: 'taskName', width: 150, ellipsis: true },
    { title: '图书ID', dataIndex: 'bookId', width: 90 },
    { title: '书名', dataIndex: 'bookName', width: 180, ellipsis: true },
    { title: 'ISBN', dataIndex: 'isbn', width: 130 },
    { title: '屏蔽原因', dataIndex: 'reason', width: 200, ellipsis: true, render: v => v || '-' },
    {
      title: '屏蔽日期', dataIndex: 'dateType', width: 90,
      render: (v: DateType) => <Tag color={dateTypeColor[v]}>{dateTypeLabel[v]}</Tag>,
    },
    {
      title: '屏蔽时间', key: 'time', width: 110,
      render: (_, r) => `${r.timeStart}-${r.timeEnd}`,
    },
    {
      title: '屏蔽地区', dataIndex: 'regions', width: 220,
      render: (regions: string[]) => {
        if (regions.includes('全国')) return <Tag color="purple">全国</Tag>
        return (
          <Space size={[4, 4]} wrap>
            {regions.map(region => <Tag key={region}>{region}</Tag>)}
          </Space>
        )
      },
    },
    {
      title: '状态', dataIndex: 'status', width: 85,
      render: (v: RecordStatus) => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 140 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 140, render: v => v || '-' },
    {
      title: '操作', key: 'action', width: 200, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <a style={{ color: '#1890ff' }} onClick={() => setDetailRecord(r)}>详情</a>
          {r.status === 'active' ? (
            <a style={{ color: '#fa8c16' }} onClick={() => { stopRecords([r.id]); message.success('已停止') }}>停止</a>
          ) : (
            <a style={{ color: '#52c41a' }} onClick={() => { resumeRecords([r.id]); message.success('已恢复') }}>恢复</a>
          )}
          <a style={{ color: '#1890ff' }} onClick={() => setEditRecord(r)}>编辑</a>
          <a style={{ color: '#1890ff' }} onClick={() => setPolicyRecords([r])}>改策略</a>
          <Popconfirm title="确认删除该封控记录？" onConfirm={() => { deleteRecords([r.id]); setSelectedIds(ids => ids.filter(i => i !== r.id)); message.success('已删除') }}>
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (keys: React.Key[]) => setSelectedIds(keys as number[]),
  }

  const handleBatchStop   = () => { if (!selectedIds.length) return message.warning('请先勾选记录'); stopRecords(selectedIds); message.success(`已停止 ${selectedIds.length} 条`) }
  const handleBatchResume = () => { if (!selectedIds.length) return message.warning('请先勾选记录'); resumeRecords(selectedIds); message.success(`已恢复 ${selectedIds.length} 条`) }
  const handleBatchDelete = () => {
    if (!selectedIds.length) return message.warning('请先勾选记录')
    Modal.confirm({
      title: '批量删除确认',
      content: `将删除选中的 ${selectedIds.length} 条封控记录，删除后不可恢复。`,
      okButtonProps: { danger: true },
      onOk: () => { deleteRecords(selectedIds); setSelectedIds([]); message.success('删除成功') },
    })
  }

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* 页面标题栏 */}
      <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>风险图书封控列表</span>
        <span style={{ color: '#999', fontSize: 13 }}>管理图书屏蔽任务与风控策略</span>
      </div>

      {/* 搜索表单 */}
      <Card bordered={false} style={{ margin: '12px 0 0', borderRadius: 4 }} styles={{ body: { padding: 0 } }}>
        <SearchForm />
      </Card>

      {/* 工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 0 8px' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
            添加屏蔽任务
          </Button>
          <Button icon={<UploadOutlined />} onClick={() => setImportOpen(true)} style={{ background: '#1890ff', color: '#fff', borderColor: '#1890ff' }}>
            批量导入
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <Card bordered={false} style={{ margin: '0', borderRadius: 4 }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          scroll={{ x: 1700 }}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t) => `共${t}条数据`,
          }}
          footer={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: 13 }}>选中{selectedIds.length}条数据</span>
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => {
                  if (!selectedIds.length) return message.warning('请先勾选记录')
                  setPolicyRecords(records.filter(r => selectedIds.includes(r.id)))
                }}>批量修改策略</Button>
                <Button size="small" icon={<StopOutlined />} onClick={handleBatchStop}>批量停止</Button>
                <Button size="small" icon={<PlayCircleOutlined />} onClick={handleBatchResume}>批量恢复</Button>
                <Button size="small" danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>批量删除</Button>
              </Space>
            </div>
          )}
        />
      </Card>

      {/* 新增任务弹窗 */}
      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* 批量导入弹窗 */}
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />

      {/* 修改策略弹窗（单条 / 批量） */}
      <PolicyModal records={policyRecords} onClose={() => setPolicyRecords(null)} />

      {/* 编辑任务信息弹窗 */}
      <EditTaskModal record={editRecord} onClose={() => setEditRecord(null)} />

      {/* 详情抽屉 */}
      <Drawer
        title="封控记录详情"
        open={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        width={480}
      >
        {detailRecord && (
          <Descriptions column={1} bordered size="small" labelStyle={{ width: 110 }}>
            <Descriptions.Item label="ID">{detailRecord.id}</Descriptions.Item>
            <Descriptions.Item label="任务名称">{detailRecord.taskName}</Descriptions.Item>
            <Descriptions.Item label="任务ID">{detailRecord.taskId}</Descriptions.Item>
            <Descriptions.Item label="图书ID">{detailRecord.bookId}</Descriptions.Item>
            <Descriptions.Item label="书名">{detailRecord.bookName}</Descriptions.Item>
            <Descriptions.Item label="ISBN">{detailRecord.isbn}</Descriptions.Item>
            <Descriptions.Item label="作者/出版方">{detailRecord.author}</Descriptions.Item>
            <Descriptions.Item label="屏蔽原因">{detailRecord.reason || '-'}</Descriptions.Item>
            <Descriptions.Item label="屏蔽日期">
              <Tag color={dateTypeColor[detailRecord.dateType]}>{dateTypeLabel[detailRecord.dateType]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="屏蔽时间">{detailRecord.timeStart} - {detailRecord.timeEnd}</Descriptions.Item>
            <Descriptions.Item label="屏蔽地区">
              <Space size={[4, 4]} wrap>
                {detailRecord.regions.map(region => <Tag key={region}>{region}</Tag>)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge status={detailRecord.status === 'active' ? 'processing' : 'default'} text={statusLabel[detailRecord.status]} />
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailRecord.createdAt}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{detailRecord.updatedAt || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

// ── 新增屏蔽任务弹窗 ───────────────────────────────────────────────
function AddTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addRecords } = useRiskStore()
  const [form] = Form.useForm()

  const handleOk = async () => {
    try { await form.validateFields() } catch { return }
    const v = form.getFieldsValue()
    const rows = v.books.map((b: { bookId: string; isbn: string }) => {
      const book = findBook(b.bookId) ?? findBook(b.isbn)
      return {
        bookId: book ? String(book.bookId) : b.bookId,
        isbn: book ? book.isbn : b.isbn,
        dateType: v.dateType,
        timeStart: v.timeRange[0].format('HH:mm'),
        timeEnd: v.timeRange[1].format('HH:mm'),
        regions: v.regions.map((p: string[]) => p.length === 1 ? p[0] : p.join('/')),
      }
    })
    addRecords(rows, v.taskName ?? '', v.reason ?? '')
    message.success(`已添加 ${rows.length} 条封控记录`)
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="添加屏蔽任务" open={open} onOk={handleOk} onCancel={() => { form.resetFields(); onClose() }}
      okText="确认" cancelText="取消" width={640} destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ flex: '90px' }} initialValues={{
        dateType: 'daily',
        books: [{}],
        timeRange: [dayjs().hour(0).minute(0), dayjs().hour(23).minute(59)] as [Dayjs, Dayjs],
      }}>
        <Form.Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入屏蔽任务名称" maxLength={50} allowClear />
        </Form.Item>
        <Form.Item label="屏蔽原因" name="reason">
          <Input.TextArea placeholder="请输入屏蔽原因备注（可选）" rows={2} maxLength={200} showCount />
        </Form.Item>

        <Form.Item label="封控图书" required style={{ marginBottom: 0 }}>
          <Form.List name="books">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4, color: '#666', fontSize: 13, fontWeight: 500 }}>
                  <span style={{ flex: 1 }}>图书ID 或 ISBN <span style={{ color: '#ff4d4f' }}>*</span></span>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'bookId']}
                      noStyle
                      rules={[{ required: true, message: '请输入图书ID或ISBN' }]}
                    >
                      <Input placeholder="图书ID 或 ISBN（自动识别书名）" style={{ width: 320 }} allowClear />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button type="text" size="small" danger style={{ width: 32, padding: 0 }} onClick={() => remove(name)}>✕</Button>
                    )}
                  </Space>
                ))}
                <Button type="dashed" block onClick={() => add()} style={{ marginTop: 4 }}>+ 添加一本图书</Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="屏蔽日期" name="dateType" rules={[{ required: true }]} style={{ marginTop: 8 }}>
          <Radio.Group>
            {DATE_TYPE_OPTIONS.map(o => <Radio key={o.value} value={o.value}>{o.label}</Radio>)}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="屏蔽时间" name="timeRange" rules={[{ required: true, message: '请选择屏蔽时间段' }]}>
          <TimePicker.RangePicker format="HH:mm" style={{ width: 240 }} />
        </Form.Item>
        <Form.Item label="屏蔽地区" name="regions" rules={[{ required: true, message: '请选择屏蔽地区' }]}>
          <Cascader
            options={REGION_OPTIONS}
            multiple
            changeOnSelect
            showSearch
            maxTagCount="responsive"
            style={{ width: '100%' }}
            placeholder="选择省份 / 城市，可选「全国」"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ── 编辑任务信息（名称 / 原因）弹窗 ────────────────────────────────
function EditTaskModal({ record, onClose }: { record: BlockRecord | null; onClose: () => void }) {
  const { updateRecord } = useRiskStore()
  const [form] = Form.useForm()

  const afterOpenChange = (visible: boolean) => {
    if (visible && record) form.setFieldsValue({ taskName: record.taskName, reason: record.reason })
  }

  const handleOk = async () => {
    try { await form.validateFields() } catch { return }
    const v = form.getFieldsValue()
    if (record) updateRecord(record.id, { taskName: v.taskName, reason: v.reason ?? '' })
    message.success('已更新')
    onClose()
  }

  return (
    <Modal
      title="编辑任务信息" open={!!record} onOk={handleOk} onCancel={onClose}
      afterOpenChange={afterOpenChange}
      okText="保存" cancelText="取消" width={520}
    >
      <Form form={form} layout="horizontal" labelCol={{ flex: '80px' }}>
        <Form.Item label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input maxLength={50} allowClear />
        </Form.Item>
        <Form.Item label="屏蔽原因" name="reason">
          <Input.TextArea rows={2} maxLength={200} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
}
