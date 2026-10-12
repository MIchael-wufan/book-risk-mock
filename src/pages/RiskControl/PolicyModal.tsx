import { Modal, Form, Radio, TimePicker, Cascader, message, Alert } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type { BlockRecord } from '../../types/risk'
import { DATE_TYPE_OPTIONS, dateTypeLabel } from '../../types/risk'
import { REGION_OPTIONS } from '../../data/regions'
import { useRiskStore } from '../../stores/riskStore'

/** '省/市' 字符串 → Cascader 路径数组；'全国' 等单级 → 单元素数组 */
const stringToPath = (s: string): string[] => s.split('/')

interface Props {
  records: BlockRecord[] | null   // null = 关闭；单条或批量
  onClose: () => void
}

/** 修改屏蔽策略（日期 / 时间 / 地区），支持单条与批量 */
export default function PolicyModal({ records, onClose }: Props) {
  const { updatePolicy } = useRiskStore()
  const [form] = Form.useForm()

  const open = !!records
  const isBatch = (records?.length ?? 0) > 1

  const afterOpenChange = (visible: boolean) => {
    if (visible && records) {
      const first = records[0]
      const [sh, sm] = first.timeStart.split(':').map(Number)
      const [eh, em] = first.timeEnd.split(':').map(Number)
      form.setFieldsValue({
        dateType: first.dateType,
        timeRange: [dayjs().hour(sh).minute(sm).second(0), dayjs().hour(eh).minute(em).second(0)] as [Dayjs, Dayjs],
        regions: first.regions.map(stringToPath),
      })
    }
  }

  const handleOk = async () => {
    try { await form.validateFields() } catch { return }
    const v = form.getFieldsValue()
    updatePolicy(
      records!.map(r => r.id),
      {
        dateType: v.dateType,
        timeStart: v.timeRange[0].format('HH:mm'),
        timeEnd: v.timeRange[1].format('HH:mm'),
        regions: v.regions.map((p: string[]) => p.join('/')),
      },
    )
    message.success(`已更新 ${records!.length} 条记录的策略`)
    onClose()
  }

  return (
    <Modal
      title={isBatch ? `批量修改屏蔽策略（${records!.length} 条）` : '修改屏蔽策略'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      afterOpenChange={afterOpenChange}
      okText="保存" cancelText="取消" width={560}
      destroyOnClose
    >
      {isBatch && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="批量修改将覆盖所有选中记录的当前策略"
        />
      )}
      <Form form={form} layout="horizontal" labelCol={{ flex: '80px' }}>
        <Form.Item label="屏蔽日期" name="dateType" rules={[{ required: true }]}>
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
        {!isBatch && records && (
          <div style={{ color: '#999', fontSize: 12, marginLeft: 80 }}>
            当前策略：{dateTypeLabel[records[0].dateType]} {records[0].timeStart}-{records[0].timeEnd}（{records[0].regions.join('、')}）
          </div>
        )}
      </Form>
    </Modal>
  )
}
