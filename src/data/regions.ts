export interface RegionOption {
  label: string
  value: string
  children?: RegionOption[]
}

/** 省市两级数据（mock 精简版：省级全量，地市为主要城市） */
export const REGION_OPTIONS: RegionOption[] = [
  { label: '全国', value: '全国' },
  { label: '北京市', value: '北京市', children: [
    { label: '北京市', value: '北京市' },
  ]},
  { label: '天津市', value: '天津市', children: [
    { label: '天津市', value: '天津市' },
  ]},
  { label: '上海市', value: '上海市', children: [
    { label: '上海市', value: '上海市' },
  ]},
  { label: '重庆市', value: '重庆市', children: [
    { label: '重庆市', value: '重庆市' },
  ]},
  { label: '广东省', value: '广东省', children: [
    { label: '广州市', value: '广州市' }, { label: '深圳市', value: '深圳市' },
    { label: '珠海市', value: '珠海市' }, { label: '佛山市', value: '佛山市' },
    { label: '东莞市', value: '东莞市' }, { label: '中山市', value: '中山市' },
    { label: '惠州市', value: '惠州市' }, { label: '汕头市', value: '汕头市' },
    { label: '湛江市', value: '湛江市' },
  ]},
  { label: '江苏省', value: '江苏省', children: [
    { label: '南京市', value: '南京市' }, { label: '苏州市', value: '苏州市' },
    { label: '无锡市', value: '无锡市' }, { label: '常州市', value: '常州市' },
    { label: '南通市', value: '南通市' }, { label: '徐州市', value: '徐州市' },
    { label: '扬州市', value: '扬州市' },
  ]},
  { label: '浙江省', value: '浙江省', children: [
    { label: '杭州市', value: '杭州市' }, { label: '宁波市', value: '宁波市' },
    { label: '温州市', value: '温州市' }, { label: '嘉兴市', value: '嘉兴市' },
    { label: '绍兴市', value: '绍兴市' }, { label: '金华市', value: '金华市' },
    { label: '台州市', value: '台州市' },
  ]},
  { label: '山东省', value: '山东省', children: [
    { label: '济南市', value: '济南市' }, { label: '青岛市', value: '青岛市' },
    { label: '淄博市', value: '淄博市' }, { label: '烟台市', value: '烟台市' },
    { label: '潍坊市', value: '潍坊市' }, { label: '临沂市', value: '临沂市' },
  ]},
  { label: '四川省', value: '四川省', children: [
    { label: '成都市', value: '成都市' }, { label: '绵阳市', value: '绵阳市' },
    { label: '德阳市', value: '德阳市' }, { label: '宜宾市', value: '宜宾市' },
    { label: '南充市', value: '南充市' }, { label: '泸州市', value: '泸州市' },
  ]},
  { label: '湖北省', value: '湖北省', children: [
    { label: '武汉市', value: '武汉市' }, { label: '宜昌市', value: '宜昌市' },
    { label: '襄阳市', value: '襄阳市' }, { label: '荆州市', value: '荆州市' },
    { label: '黄石市', value: '黄石市' },
  ]},
  { label: '湖南省', value: '湖南省', children: [
    { label: '长沙市', value: '长沙市' }, { label: '株洲市', value: '株洲市' },
    { label: '湘潭市', value: '湘潭市' }, { label: '衡阳市', value: '衡阳市' },
    { label: '岳阳市', value: '岳阳市' },
  ]},
  { label: '河南省', value: '河南省', children: [
    { label: '郑州市', value: '郑州市' }, { label: '洛阳市', value: '洛阳市' },
    { label: '开封市', value: '开封市' }, { label: '南阳市', value: '南阳市' },
    { label: '新乡市', value: '新乡市' },
  ]},
  { label: '河北省', value: '河北省', children: [
    { label: '石家庄市', value: '石家庄市' }, { label: '唐山市', value: '唐山市' },
    { label: '保定市', value: '保定市' }, { label: '廊坊市', value: '廊坊市' },
    { label: '沧州市', value: '沧州市' },
  ]},
  { label: '福建省', value: '福建省', children: [
    { label: '福州市', value: '福州市' }, { label: '厦门市', value: '厦门市' },
    { label: '泉州市', value: '泉州市' }, { label: '漳州市', value: '漳州市' },
    { label: '莆田市', value: '莆田市' },
  ]},
  { label: '安徽省', value: '安徽省', children: [
    { label: '合肥市', value: '合肥市' }, { label: '芜湖市', value: '芜湖市' },
    { label: '蚌埠市', value: '蚌埠市' }, { label: '安庆市', value: '安庆市' },
  ]},
  { label: '江西省', value: '江西省', children: [
    { label: '南昌市', value: '南昌市' }, { label: '九江市', value: '九江市' },
    { label: '赣州市', value: '赣州市' }, { label: '上饶市', value: '上饶市' },
  ]},
  { label: '辽宁省', value: '辽宁省', children: [
    { label: '沈阳市', value: '沈阳市' }, { label: '大连市', value: '大连市' },
    { label: '鞍山市', value: '鞍山市' }, { label: '锦州市', value: '锦州市' },
  ]},
  { label: '吉林省', value: '吉林省', children: [
    { label: '长春市', value: '长春市' }, { label: '吉林市', value: '吉林市' },
    { label: '四平市', value: '四平市' },
  ]},
  { label: '黑龙江省', value: '黑龙江省', children: [
    { label: '哈尔滨市', value: '哈尔滨市' }, { label: '齐齐哈尔市', value: '齐齐哈尔市' },
    { label: '大庆市', value: '大庆市' },
  ]},
  { label: '陕西省', value: '陕西省', children: [
    { label: '西安市', value: '西安市' }, { label: '宝鸡市', value: '宝鸡市' },
    { label: '咸阳市', value: '咸阳市' }, { label: '渭南市', value: '渭南市' },
  ]},
  { label: '山西省', value: '山西省', children: [
    { label: '太原市', value: '太原市' }, { label: '大同市', value: '大同市' },
    { label: '临汾市', value: '临汾市' },
  ]},
  { label: '云南省', value: '云南省', children: [
    { label: '昆明市', value: '昆明市' }, { label: '曲靖市', value: '曲靖市' },
    { label: '大理州', value: '大理州' }, { label: '丽江市', value: '丽江市' },
  ]},
  { label: '贵州省', value: '贵州省', children: [
    { label: '贵阳市', value: '贵阳市' }, { label: '遵义市', value: '遵义市' },
    { label: '六盘水市', value: '六盘水市' },
  ]},
  { label: '广西壮族自治区', value: '广西壮族自治区', children: [
    { label: '南宁市', value: '南宁市' }, { label: '柳州市', value: '柳州市' },
    { label: '桂林市', value: '桂林市' }, { label: '北海市', value: '北海市' },
  ]},
  { label: '海南省', value: '海南省', children: [
    { label: '海口市', value: '海口市' }, { label: '三亚市', value: '三亚市' },
  ]},
  { label: '甘肃省', value: '甘肃省', children: [
    { label: '兰州市', value: '兰州市' }, { label: '天水市', value: '天水市' },
  ]},
  { label: '青海省', value: '青海省', children: [
    { label: '西宁市', value: '西宁市' },
  ]},
  { label: '内蒙古自治区', value: '内蒙古自治区', children: [
    { label: '呼和浩特市', value: '呼和浩特市' }, { label: '包头市', value: '包头市' },
    { label: '鄂尔多斯市', value: '鄂尔多斯市' },
  ]},
  { label: '宁夏回族自治区', value: '宁夏回族自治区', children: [
    { label: '银川市', value: '银川市' },
  ]},
  { label: '新疆维吾尔自治区', value: '新疆维吾尔自治区', children: [
    { label: '乌鲁木齐市', value: '乌鲁木齐市' }, { label: '克拉玛依市', value: '克拉玛依市' },
  ]},
  { label: '西藏自治区', value: '西藏自治区', children: [
    { label: '拉萨市', value: '拉萨市' },
  ]},
  { label: '香港特别行政区', value: '香港特别行政区' },
  { label: '澳门特别行政区', value: '澳门特别行政区' },
  { label: '台湾省', value: '台湾省', children: [
    { label: '台北市', value: '台北市' }, { label: '高雄市', value: '高雄市' },
  ]},
]

/** Cascader value 路径 → '省/市' 字符串 */
export const regionPathToString = (path: string[]): string =>
  path.length === 1 ? path[0] : path.join('/')

/** '省/市' 或 '省' 字符串数组 */
export const regionStringsFromPaths = (paths: string[][]): string[] =>
  paths.map(regionPathToString)

/** 省份集合，用于地区列 Tag 提取 */
export const PROVINCE_VALUES = new Set(REGION_OPTIONS.map(o => o.value))
