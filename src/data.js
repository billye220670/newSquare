// 数据池 - 家装方向素材
// 视频使用本地 public 目录下的 webm 文件，开发服务器直接伺服，手机访问零延迟
export const VIDEO_URLS = [
  {
    url: '/vid1.webm',
    poster: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=70'
  },
  {
    url: '/vid2.webm',
    poster: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=70'
  },
  {
    url: '/vid3.webm',
    poster: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=70'
  },
  {
    url: '/vid4.webm',
    poster: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=70'
  }
]

export const IMG = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const COVER_IMAGES = [
  '1600210492486-724fe5c67fb0',
  '1505691938895-1758d7feb511',
  '1486946255434-2466348c2166',
  '1574739782594-db4ead022697',
  '1493809842364-78817add7ffb'
]

export const VIDEO_CONTENT = [
  { eyebrow: '主打灵感', title: '让光，住进家里', sub: '一个朝南三居的全屋光影改造',
    brand: '光屋设计', desc: '住宅 · 空间美学 · 案例', cta: '查看', icon: '光',
    iconBg: 'linear-gradient(135deg,#b6e0c4,#6cc090)' },
  { eyebrow: '全屋实拍', title: '92㎡ 的极简日子', sub: '原木 × 灰白，一对夫妻的低噪生活',
    brand: 'MUJI 风格集', desc: '日式 · 极简 · 软装搭配', cta: '进入', icon: 'M',
    iconBg: 'linear-gradient(135deg,#f5d7a3,#cba36b)' },
  { eyebrow: '本期主推', title: '把客厅留给自己', sub: '不要电视的 110㎡，到底香不香？',
    brand: '一宅一物', desc: '生活方式 · 视频专栏', cta: '关注', icon: '宅',
    iconBg: 'linear-gradient(135deg,#a8c0ff,#3f74e8)' },
  { eyebrow: '特别企划', title: '小家也能住豪宅感', sub: '60㎡ 老破小逆袭实录',
    brand: '住艺 LiveArt', desc: '改造 · 旧房翻新', cta: '查看', icon: '艺',
    iconBg: 'linear-gradient(135deg,#ffb1b1,#e85a5a)' }
]

export const MAGAZINE_CONTENT = [
  { badge: '本期精选', eyebrow: '编辑荐赏', title: '十种当代客厅美学',
    sub: '从奶油风到侘寂，2026 客厅趋势全收录',
    brand: 'Casa Mag', desc: '杂志 · 第 042 期', cta: '阅读',
    iconBg: 'linear-gradient(135deg,#fbb,#f57)' },
  { badge: '专题', eyebrow: '材质美学', title: '关于"木"的一切想象',
    sub: '把森林搬进家：12 个设计师的回答',
    brand: '素材笔记', desc: '专题 · 木作 · 自然系', cta: '查看',
    iconBg: 'linear-gradient(135deg,#d4b48c,#7a5a3a)' },
  { badge: '专辑', eyebrow: '色彩研究', title: '把莫兰迪穿在墙上',
    sub: '6 种灰调，6 种性格，6 个家',
    brand: '色研所', desc: '色彩 · 软装 · 涂料', cta: '查看',
    iconBg: 'linear-gradient(135deg,#c9b6e4,#8a6dbe)' }
]

export const STORY_CONTENT = [
  { eyebrow: '单品故事', title: '一盏灯的温度', sub: '北欧手工玻璃灯具精选 12 件',
    cover: '1540574163026-643ea20ade25',
    listTitle: '本期收录',
    items: [
      { name: '黄铜阅读落地灯', price: '¥1,280', img: '1540574163026-643ea20ade25' },
      { name: '玻璃球吊灯 · 暖白', price: '¥899', img: '1513506003901-1e6a229e2d15' },
      { name: '陶瓷台灯 · 米色', price: '¥568', img: '1567016526105-22da7c13161a' },
      { name: '羊皮纸壁灯', price: '¥420', img: '1517705008128-361805f42e86' },
      { name: '手工竹编灯笼', price: '¥780', img: '1493663284031-b7e3aefcae8e' },
      { name: '极简金属夹灯', price: '¥199', img: '1532372320572-cda25653a26d' }
    ] },
  { eyebrow: '失重叙事', title: '在引力之外住下', sub: '6 个可以推门走进去的远方',
    cover: '1567016432779-094069958ea5',
    coverUrl: '/spaceTemplate/spaceTemplateMain.jpg',
    listTitle: '推门进去',
    items: [
      { name: '月球基地起居舱',   price: '漫游 12 min', img: '1493663284031-b7e3aefcae8e', imgUrl: '/spaceTemplate/spaceTemplate%20%281%29.jpg' },
      { name: '火星沙丘观景舱',   price: '漫游 18 min', img: '1555041469-a586c61ea9bc', imgUrl: '/spaceTemplate/spaceTemplate%20%285%29.jpg' },
      { name: '零重力睡眠舱',       price: '漫游 8 min',  img: '1532372320572-cda25653a26d', imgUrl: '/spaceTemplate/spaceTemplate%20%286%29.jpg' },
      { name: '银河观星书房',       price: '漫游 15 min', img: '1567016526105-22da7c13161a', imgUrl: '/spaceTemplate/spaceTemplate%20%287%29.jpg' },
      { name: '深空科研工作舱', price: '漫游 20 min', img: '1567016432779-094069958ea5', imgUrl: '/spaceTemplate/spaceTemplate%20%288%29.jpg' },
      { name: '轨道空间站客厅', price: '漫游 25 min', img: '1540574163026-643ea20ade25', imgUrl: '/spaceTemplate/spaceTemplate%20%289%29.jpg' }
    ] },
  { eyebrow: '产业带特辑', title: '佛山制造', sub: '奢侣品家具同源工厂，1/5 的价格拥有同等品质',
    cover: '1600585154340-be6161a56a0c',
    listTitle: '平替好物',
    items: [
      { name: 'Poliform 同源真皮沙发', price: '¥4,980', img: '1555041469-a586c61ea9bc' },
      { name: 'Minotti 同款大理石茶几', price: '¥2,680', img: '1567016526105-22da7c13161a' },
      { name: 'B&B 工厂模块转角沙发', price: '¥6,800', img: '1586023492125-27b2c045efd7' },
      { name: 'Flos 同线铓铜落地灯', price: '¥780', img: '1540574163026-643ea20ade25' },
      { name: 'Cassina 同源胡桃木餐椅', price: '¥1,280', img: '1567016432779-094069958ea5' },
      { name: 'Roche Bobois 同款丝绒单人椅', price: '¥2,380', img: '1517705008128-361805f42e86' },
      { name: 'Kartell 同厂透明餐椅', price: '¥380', img: '1532372320572-cda25653a26d' },
      { name: 'Molteni 同源岞台吹制吐司架', price: '¥960', img: '1493663284031-b7e3aefcae8e' }
    ] }
]

// 横向滚动案例卡
export const GALLERY_CONTENT = [
  { sectionTitle: '本周改造案例',
    cards: [
      { eyebrow: '全屋改造', title: '老破小的逆袭人生',
        sub: '58㎡ 南京老城区学区房，三口之家的重生',
        img: '1502672260266-1c1ef2d93688',
        brand: '居觉设计', desc: '住宅改造 · 小户型', cta: '查看',
        iconBg: 'linear-gradient(135deg,#ffd6a0,#f5a623)', icon: '觉' },
      { eyebrow: '精装房改造', title: '把精装房住成自己的家',
        sub: '不砸不拆，只用软装就能脱胎换骨',
        img: '1600585154340-be6161a56a0c',
        brand: '好好住家', desc: '软装 · 不动硬装', cta: '进入',
        iconBg: 'linear-gradient(135deg,#a8e6cf,#56ab8e)', icon: '住' },
      { eyebrow: '别墅设计', title: '山里有座透明的房子',
        sub: '莫干山脉下的 280㎡ 玻璃屋，让自然住进来',
        img: '1600210492486-724fe5c67fb0',
        brand: 'ARC 建筑事务所', desc: '别墅 · 自然光 · 极简', cta: '查看',
        iconBg: 'linear-gradient(135deg,#c4b5fd,#7c3aed)', icon: 'A' },
      { eyebrow: '一人居', title: '独居也要仪式感',
        sub: '35㎡ 单身公寓，把生活过成诗',
        img: '1618220179428-22790b461013',
        brand: '一人住研究所', desc: '小户型 · 独居 · 极简', cta: '关注',
        iconBg: 'linear-gradient(135deg,#fbbf24,#d97706)', icon: '一' },
      { eyebrow: '中古风', title: '把宋朝的美学带回家',
        sub: '新中式全屋案例：木、石、水的三重唱',
        img: '1486946255434-2466348c2166',
        brand: '木石居', desc: '新中式 · 传统工艺', cta: '查看',
        iconBg: 'linear-gradient(135deg,#a1887f,#5d4037)', icon: '木' }
    ] }
]

export const SPACE_CONTENT = [
  { eyebrow: 'SPACE OF THE DAY', title: '光与影栖息的客厅',
    sub: '一面落地窗与一张沙发，构成日子里最长的诗。',
    img: '1505691938895-1758d7feb511', textBottom: true },
  { eyebrow: '卧室提案', title: '让卧室，安静下来',
    sub: '减少装饰，留出呼吸——三种极简卧室方案。',
    img: '1618220179428-22790b461013', textBottom: false },
  { eyebrow: '厨房灵感', title: '岛台是家的中心',
    sub: '从早餐到深夜小酌，开放式厨房的十种用法。',
    img: '1556909114-f6e7ad7d3136', textBottom: true },
  { eyebrow: '玄关美学', title: '回家的第一眼',
    sub: '5 ㎡ 的玄关，也能成为生活的序章。',
    img: '1493809842364-78817add7ffb', textBottom: true }
]

export const LIST_CONTENT = [
  { eyebrow: '本周榜单', title: '热销家具 TOP 6', sub: '编辑团队亲测好物', type: 'product', cta: '加购',
    items: [
      { name: '云朵模块沙发', desc: '可拆洗 · 三色可选', img: '1555041469-a586c61ea9bc' },
      { name: '北欧实木餐椅', desc: '原木色 · 加厚坐垫', img: '1567016432779-094069958ea5' },
      { name: '岩板茶几', desc: '极简意式风格', img: '1567016526105-22da7c13161a' },
      { name: '电动升降桌', desc: '居家办公必备', img: '1517705008128-361805f42e86' },
      { name: '羊毛地毯 · 厚款', desc: '冬日治愈系', img: '1586023492125-27b2c045efd7' },
      { name: '收纳边几', desc: '小空间利器', img: '1538688525198-9b88f6f53126' }
    ] },
  { eyebrow: '编辑呈现', title: '本期主理设计师', sub: '6 位值得收藏的住宅建筑师', type: 'designer', cta: '关注',
    items: [
      { name: '林墨 · MoStudio', desc: '极简 · 住宅 · 上海', img: '1494790108377-be9c29b29330' },
      { name: '陈一 · 一筑设计', desc: '日式侘寂 · 杭州', img: '1438761681033-6461ffad8d80' },
      { name: 'Ada Liu · A.A.L', desc: '现代东方 · 北京', img: '1500648767791-00dcc994a43e' },
      { name: '周野 · 野人事务所', desc: '自然系 · 大理', img: '1506794778202-cad84cf45f1d' },
      { name: 'Kenji 黑泽', desc: '日式极简 · 深圳', img: '1544005313-94ddf0286df2' }
    ] },
  { eyebrow: '本月精选', title: '小户型救星单品', sub: '5 件让家变大的好物', type: 'product', cta: '加购',
    items: [
      { name: '可折叠餐桌', desc: '展开变 1.4m 大桌', img: '1567016526105-22da7c13161a' },
      { name: '镜面玄关柜', desc: '收纳 + 全身镜', img: '1538688525198-9b88f6f53126' },
      { name: '床下抽屉箱', desc: '高度 18cm', img: '1583845112203-29329902332e' },
      { name: '壁挂折叠书桌', desc: '不用时收起', img: '1517705008128-361805f42e86' },
      { name: '多功能脚凳', desc: '收纳 + 坐凳', img: '1586023492125-27b2c045efd7' }
    ] }
]
