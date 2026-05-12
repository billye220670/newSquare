import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Image, InfiniteScroll, DotLoading } from 'antd-mobile'
import { SoundOutline, SoundMuteOutline, LeftOutline } from 'antd-mobile-icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/autoplay'

import {
  VIDEO_URLS, IMG, COVER_IMAGES,
  VIDEO_CONTENT, MAGAZINE_CONTENT, STORY_CONTENT, SPACE_CONTENT, LIST_CONTENT,
  GALLERY_CONTENT
} from './data'

const cycle = (arr, i) => arr[i % arr.length]

const WEEK_DAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/* 期次 → 标题 / 日期。offset: 0=Today, -1=Yesterday, 其余按月日 */
function getIssueMeta(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const dateStr = `${WEEK_DAYS[d.getDay()]}  ${d.getMonth() + 1}月${d.getDate()}日`
  let title
  if (offset === 0) title = 'Today'
  else if (offset === -1) title = 'Yesterday'
  else title = `${d.getMonth() + 1}月${d.getDate()}日`
  return { title, dateStr }
}

/* 期次轴：[-29, ..., -1, 0]，Today 在末位。
   中间期次拖动时，Today 在右侧 peek；Yesterday 在 Today 左侧。
   默认 Today 需强制左对齐 → 依靠 slidesOffsetAfter 在末尾补空间，
   使 Swiper 允许最后一张 slide 也能贴到容器左缘。 */
const ISSUE_COUNT = 30
const ISSUES = Array.from({ length: ISSUE_COUNT }, (_, i) => -(ISSUE_COUNT - 1 - i))
const offsetToIndex = off => ISSUE_COUNT - 1 + off

/* ---------- 头部 ---------- */
function TopHeader({ hidden, issueOffset, onIssueChange, onTitleClick }) {
  const swiperRef = useRef(null)

  // 外部 issueOffset 变化（如从归档页选期）→ 同步 Swiper
  useEffect(() => {
    const sw = swiperRef.current
    if (!sw || sw.destroyed) return
    const target = offsetToIndex(issueOffset)
    if (sw.activeIndex !== target) sw.slideTo(target, 320)
  }, [issueOffset])

  const meta = getIssueMeta(issueOffset)

  return (
    <header className={'top-header' + (hidden ? ' hide' : '')}>
      <div className="header-left">
        <div key={meta.dateStr} className="header-date">{meta.dateStr}</div>
        <Swiper
          className="title-swiper"
          slidesPerView="auto"
          spaceBetween={28}
          slidesOffsetAfter={600}
          initialSlide={offsetToIndex(issueOffset)}
          speed={320}
          resistance
          resistanceRatio={0.45}
          threshold={4}
          onSwiper={sw => { swiperRef.current = sw }}
          onSlideChange={sw => {
            const off = ISSUES[sw.activeIndex]
            if (off !== undefined && off !== issueOffset) onIssueChange(off)
          }}
        >
          {ISSUES.map((off, i) => {
            const { title } = getIssueMeta(off)
            return (
              <SwiperSlide key={off} style={{ width: 'auto' }}>
                {({ isActive }) => (
                  <span
                    className={'title-slide' + (isActive ? ' active' : '')}
                    onClick={() => {
                      if (isActive) onTitleClick()
                      else swiperRef.current?.slideTo(i, 320)
                    }}
                  >
                    {title}
                  </span>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <Avatar
        className="avatar-img"
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=70&auto=format"
        style={{ '--size': '42px', '--border-radius': '50%' }}
      />
    </header>
  )
}

/* ---------- 期刊封面网格页（沉浸式、图片撞满、顶部黑色渐变覆层）---------- */
function ArchivePage({ current, onPick, onClose }) {
  const issues = Array.from({ length: 14 }, (_, i) => -i) // 0, -1, ..., -13
  const scrollRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrollY(el.scrollTop)
        ticking = false
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // intro 渐隐：在滚动 0→160px 内从 1 → 0，同时轻微上推
  const introOpacity = Math.max(0, 1 - scrollY / 160)
  const introTranslate = -Math.min(scrollY * 0.4, 60)

  return (
    <div className="archive-page">
      {/* 最底层：grid 图片区，全幅、无间隙、无圆角 */}
      <div className="archive-scroll" ref={scrollRef}>
        <div className="archive-grid">
          {issues.map(off => {
            const { title, dateStr } = getIssueMeta(off)
            const img = IMG(cycle(COVER_IMAGES, Math.abs(off)), 800)
            return (
              <button
                key={off}
                type="button"
                className={'archive-tile' + (off === current ? ' current' : '')}
                onClick={() => onPick(off)}
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="archive-tile-shade" />
                <div className="archive-tile-meta">
                  <div className="archive-tile-date">{dateStr}</div>
                  <div className="archive-tile-title">{title}</div>
                </div>
                {off === current && <div className="archive-current-tag">当前</div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* 顶部黑色渐变覆层 + 白字标题（不随页面滚动） */}
      <div className="archive-top-fade">
        {/* 黑色渐变背景独立一层，随 intro 一起渐隐 */}
        <div className="archive-top-grad" style={{ opacity: introOpacity }} />
        <header className="archive-header">
          <button type="button" className="archive-close" onClick={onClose}>
            <LeftOutline /> 返回
          </button>
          <div className="archive-header-title">期刊封面</div>
          <div className="archive-header-spacer" />
        </header>
        <div
          className="archive-intro"
          style={{
            opacity: introOpacity,
            transform: `translate3d(0, ${introTranslate}px, 0)`
          }}
        >
          <div className="archive-intro-eyebrow">ARCHIVE · 历期回顾</div>
          <div className="archive-intro-title">每一天，<br/>都是一本新刊。</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- 1. 视频卡 ---------- */
function VideoCard({ idx }) {
  const c = cycle(VIDEO_CONTENT, idx)
  const v = cycle(VIDEO_URLS, idx)
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 尝试首次播放（个别手机浏览器需要手动 trigger）
    const tryPlay = () => el.play().catch(() => {})
    tryPlay()
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) tryPlay()
        else el.pause()
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <article className="tcard tcard-video">
      {/* 底层 poster 兑底：视频加载中或失败都能看到美图 */}
      <div
        className="video-poster"
        style={{ backgroundImage: `url(${v.poster})` }}
      />
      {!failed && (
        <video
          ref={ref}
          src={v.url}
          poster={v.poster}
          muted={muted}
          autoPlay
          loop
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5-page"
          x5-video-player-fullscreen="false"
          preload="auto"
          crossOrigin="anonymous"
          onError={() => setFailed(true)}
        />
      )}
      <button className="video-mute" onClick={() => setMuted(m => !m)}>
        {muted ? <SoundMuteOutline /> : <SoundOutline />}
      </button>
      <div className="video-overlay">
        <div className="eyebrow">{c.eyebrow}</div>
        <div className="t-title-lg">{c.title}</div>
        <div className="t-sub">{c.sub}</div>
      </div>
      <div className="bottom-bar">
        <div className="brand-icon" style={{ background: c.iconBg }}>{c.icon}</div>
        <div className="brand-text">
          <div className="brand-name">{c.brand}</div>
          <div className="brand-desc">{c.desc}</div>
        </div>
        <Button className="pill-cta" size="small">{c.cta}</Button>
      </div>
    </article>
  )
}

/* ---------- 2. 杂志封面 ---------- */
function MagazineCard({ idx }) {
  const c = cycle(MAGAZINE_CONTENT, idx)
  const img = IMG(cycle(COVER_IMAGES, idx))
  return (
    <article className="tcard tcard-magazine">
      <div className="bg" style={{ backgroundImage: `url(${img})` }} />
      <div className="badge">{c.badge}</div>
      <div className="overlay">
        <div className="eyebrow">{c.eyebrow}</div>
        <div className="t-title-xl">{c.title}</div>
        <div className="t-sub">{c.sub}</div>
      </div>
      <div className="bottom-bar">
        <div className="brand-icon" style={{ background: c.iconBg }}>{c.brand[0]}</div>
        <div className="brand-text">
          <div className="brand-name">{c.brand}</div>
          <div className="brand-desc">{c.desc}</div>
        </div>
        <Button className="pill-cta" size="small">{c.cta}</Button>
      </div>
    </article>
  )
}

/* ---------- 3. 单品故事（封面 + 自动滚单品列表） ---------- */
function StoryCard({ idx }) {
  const c = cycle(STORY_CONTENT, idx)
  return (
    <article className="tcard tcard-story">
      <div className="hero" style={{ backgroundImage: `url(${IMG(c.cover)})` }}>
        <div className="hero-text">
          <div className="eyebrow">{c.eyebrow}</div>
          <div className="t-title-md">{c.title}</div>
          <div className="t-sub">{c.sub}</div>
        </div>
      </div>
      <div className="product-strip">
        <div className="product-strip-title">
          <span>{c.listTitle}</span>
          <span className="more">查看全部 ›</span>
        </div>
        <Swiper
          className="swiper-product"
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={12}
          freeMode={true}
          loop={true}
          loopAdditionalSlides={2}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
          speed={3500}
          allowTouchMove={true}
        >
          {c.items.map((it, i) => (
            <SwiperSlide key={i} style={{ width: 110 }}>
              <div className="product-item">
                <div className="pi-img" style={{ backgroundImage: `url(${IMG(it.img, 320)})` }} />
                <div className="pi-name">{it.name}</div>
                <div className="pi-price">{it.price}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </article>
  )
}

/* ---------- 4. 静态空间封面 ---------- */
function SpaceCard({ idx }) {
  const c = cycle(SPACE_CONTENT, idx)
  return (
    <article className={'tcard tcard-space' + (c.textBottom ? ' text-bottom' : '')}>
      <div className="bg" style={{ backgroundImage: `url(${IMG(c.img)})` }} />
      <div className="gradient-top" />
      <div className="text-block">
        <div className="t-eyebrow-up">{c.eyebrow}</div>
        <div className="t-title-space">{c.title}</div>
        <div className="t-sub-space">{c.sub}</div>
      </div>
    </article>
  )
}

/* ---------- 5. 列表榜单 / 设计师 ---------- */
function ListCard({ idx }) {
  const c = cycle(LIST_CONTENT, idx)
  return (
    <article className="tcard tcard-list">
      <div className="list-header">
        <div className="list-eyebrow">{c.eyebrow}</div>
        <div className="list-title">{c.title}</div>
        <div className="list-sub">{c.sub}</div>
      </div>
      {c.items.map((it, i) => (
        <div key={i} className={'list-item' + (c.type === 'designer' ? ' li-designer' : '')}>
          {c.type === 'product' && <div className="li-rank">{i + 1}</div>}
          <Image
            src={IMG(it.img, 240)}
            width={56}
            height={56}
            fit="cover"
            style={{
              borderRadius: c.type === 'designer' ? '50%' : 13,
              flexShrink: 0
            }}
          />
          <div className="li-text">
            <div className="li-name">{it.name}</div>
            <div className="li-desc">{it.desc}</div>
          </div>
          <Button className="pill-action" size="mini">
            {c.cta}
          </Button>
        </div>
      ))}
    </article>
  )
}

/* ---------- 6. 横向滚动案例卡 ---------- */
function GalleryCard({ idx }) {
  const g = cycle(GALLERY_CONTENT, idx)
  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <span className="gallery-title">{g.sectionTitle}</span>
        <span className="gallery-more">查看全部 ›</span>
      </div>
      <Swiper
        className="gallery-swiper"
        slidesPerView="auto"
        spaceBetween={14}
        grabCursor={true}
        cssMode={true}
      >
        {g.cards.map((c, i) => (
          <SwiperSlide key={i} style={{ width: '75vw', maxWidth: 340 }}>
            <article className="gcard">
              <div className="gcard-cover" style={{ backgroundImage: `url(${IMG(c.img)})` }}>
                <div className="gcard-gradient" />
                <div className="gcard-text">
                  <div className="eyebrow">{c.eyebrow}</div>
                  <div className="t-title-lg">{c.title}</div>
                  <div className="t-sub">{c.sub}</div>
                </div>
              </div>
              <div className="gcard-bar">
                <div className="brand-icon" style={{ background: c.iconBg }}>{c.icon}</div>
                <div className="brand-text">
                  <div className="brand-name">{c.brand}</div>
                  <div className="brand-desc">{c.desc}</div>
                </div>
                <Button className="pill-cta" size="small">{c.cta}</Button>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

/* ---------- 卡片调度 ---------- */
const ORDER = [0, 2, 5, 1, 3, 4, 1, 0, 5, 4, 3, 2] // 6 类卡片混合顺序
const BUILDERS = [VideoCard, MagazineCard, StoryCard, SpaceCard, ListCard, GalleryCard]

/* 以期次 seed 偏移内容，使每一期都「不一样」 */
function makeBatch(seed, startIndex, count = 5) {
  const shift = Math.abs(seed)
  const arr = []
  for (let i = 0; i < count; i++) {
    const orderIdx = (shift * 3 + startIndex + i) % ORDER.length
    const typeIdx = ORDER[orderIdx]
    const idx = startIndex + i + shift * 2
    arr.push({ key: `${seed}-${startIndex}-${i}`, type: typeIdx, idx })
  }
  return arr
}

/* ---------- 主体 ---------- */
export default function App() {
  const [view, setView] = useState('feed') // 'feed' | 'archive'
  const [issueOffset, setIssueOffset] = useState(0)
  const [items, setItems] = useState(() => makeBatch(0, 0, 6))
  const [hasMore, setHasMore] = useState(true)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 60) setHidden(false)
        else if (y > lastY.current + 4) setHidden(true)
        else if (y < lastY.current - 4) setHidden(false)
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* 期次切换：重刷瀑布流并回顶 */
  const switchIssue = nextOffset => {
    if (nextOffset > 0) return // 不能超出今天
    if (nextOffset === issueOffset) return
    setIssueOffset(nextOffset)
    setItems(makeBatch(nextOffset, 0, 6))
    setHasMore(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const loadMore = async () => {
    await new Promise(r => setTimeout(r, 400))
    setItems(prev => [...prev, ...makeBatch(issueOffset, prev.length, 5)])
    if (items.length > 60) setHasMore(false)
  }

  if (view === 'archive') {
    return (
      <ArchivePage
        current={issueOffset}
        onPick={off => { switchIssue(off); setView('feed') }}
        onClose={() => setView('feed')}
      />
    )
  }

  return (
    <>
      <TopHeader
        hidden={hidden}
        issueOffset={issueOffset}
        onIssueChange={switchIssue}
        onTitleClick={() => setView('archive')}
      />
      <main className="feed" key={issueOffset}>
        {items.map(it => {
          const C = BUILDERS[it.type]
          return <C key={it.key} idx={it.idx} />
        })}
      </main>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        {hasMore ? (
          <div className="loader"><DotLoading /></div>
        ) : (
          <div className="loader">— 你已看完本期精选 —</div>
        )}
      </InfiniteScroll>
    </>
  )
}
