import { useEffect, useRef, useState } from 'react'
import { Button, Image, InfiniteScroll, DotLoading } from 'antd-mobile'
import { SoundOutline, SoundMuteOutline, LeftOutline } from 'antd-mobile-icons'
import { Search as SearchIcon, X as CloseIcon, Clock as ClockIcon, TrendingUp as TrendingIcon, Flame as FlameIcon, ArrowLeft as ArrowLeftIcon, User as UserIcon, Heart as HeartIcon, Bookmark as BookmarkIcon, Settings as SettingsIcon, ChevronRight as ChevronRightIcon, Home as HomeIcon, Briefcase as BriefcaseIcon, LayoutGrid as LayoutGridIcon, LogOut as LogOutIcon } from 'lucide-react'
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
const HEADER_TABS = [
  { key: 'current',   label: '当期' },
  { key: 'recommend', label: '推荐' },
  { key: 'hot',       label: '热门' },
  { key: 'me',        label: '我' }
]
const ALT_TITLES = { recommend: '当下编辑推荐', hot: '热门杂志' }

function TopHeader({ hidden, issueOffset, onIssueChange, onTitleClick, activeTab, onTabChange, searchOpen, searchQuery, onSearchQueryChange, onSearchToggle }) {
  const swiperRef = useRef(null)
  const isCurrent = activeTab === 'current'
  const searchInputRef = useRef(null)

  // 外部 issueOffset 变化（如从归档页选期）→ 同步 Swiper
  useEffect(() => {
    const sw = swiperRef.current
    if (!sw || sw.destroyed) return
    const target = offsetToIndex(issueOffset)
    if (sw.activeIndex !== target) sw.slideTo(target, 320)
  }, [issueOffset, isCurrent])

  // 展开搜索时自动聚焦
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    }
  }, [searchOpen])

  const meta = getIssueMeta(issueOffset)

  return (
    <header className={'top-header' + (hidden ? ' hide' : '') + (searchOpen ? ' searching' : '') + (activeTab === 'me' ? ' me-mode' : '')}>
      <div className={'header-tabs-row' + (searchOpen ? ' searching' : '')}>
        <div className="header-tabs" aria-hidden={searchOpen}>
          {HEADER_TABS.map(t => (
            <button
              key={t.key}
              type="button"
              className={'header-tab' + (activeTab === t.key ? ' active' : '')}
              onClick={() => onTabChange(t.key)}
              tabIndex={searchOpen ? -1 : 0}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={'header-search' + (searchOpen ? ' open' : '')}>
          <button
            type="button"
            className="header-search-back"
            aria-label="返回"
            onClick={() => onSearchToggle(false)}
            tabIndex={searchOpen ? 0 : -1}
          >
            <ArrowLeftIcon size={20} strokeWidth={2.2} />
          </button>
          <input
            ref={searchInputRef}
            className="header-search-input"
            type="search"
            placeholder="搜索设计师、品牌、单品…"
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
          <button
            type="button"
            className="header-search-toggle"
            aria-label={searchOpen ? (searchQuery ? '清空' : '关闭搜索') : '打开搜索'}
            onClick={() => {
              if (searchOpen) {
                if (searchQuery) {
                  onSearchQueryChange('')
                } else {
                  onSearchToggle(false)
                }
              } else {
                onSearchToggle(true)
              }
            }}
          >
            {searchOpen
              ? <CloseIcon size={20} strokeWidth={2.2} />
              : <SearchIcon size={20} strokeWidth={2.2} />}
          </button>
        </div>
      </div>
      <div className="header-body">
        <div className="header-left">
          <div className={'header-issue' + (isCurrent ? '' : ' collapsed')} aria-hidden={!isCurrent}>
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
              allowTouchMove={isCurrent}
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
          <div className={'header-alt' + (!isCurrent ? ' show' : '')} aria-hidden={isCurrent}>
            {ALT_TITLES[activeTab] || ''}
          </div>
        </div>
      </div>
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
function VideoCard({ idx, onOpen }) {
  const c = cycle(VIDEO_CONTENT, idx)
  const v = cycle(VIDEO_URLS, idx)
  const ref = useRef(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  const handleOpen = e => {
    const origin = e.currentTarget.getBoundingClientRect()
    onOpen?.(origin, {
      variant: 'single',
      payload: {
        eyebrow: c.eyebrow, title: c.title, sub: c.sub,
        heroImg: v.poster, brand: c.brand, desc: c.desc,
        icon: c.icon, iconBg: c.iconBg, cta: c.cta
      }
    })
  }

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
    <article className="tcard tcard-video clickable" onClick={handleOpen}>
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
      <button className="video-mute" onClick={e => { e.stopPropagation(); setMuted(m => !m) }}>
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
function MagazineCard({ idx, onOpen }) {
  const c = cycle(MAGAZINE_CONTENT, idx)
  const img = IMG(cycle(COVER_IMAGES, idx))
  const handleOpen = e => {
    const origin = e.currentTarget.getBoundingClientRect()
    onOpen?.(origin, {
      variant: 'single',
      payload: {
        eyebrow: c.eyebrow, title: c.title, sub: c.sub,
        heroImg: img, brand: c.brand, desc: c.desc,
        icon: c.brand[0], iconBg: c.iconBg, cta: c.cta, badge: c.badge
      }
    })
  }
  return (
    <article className="tcard tcard-magazine clickable" onClick={handleOpen}>
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
function StoryCard({ idx, onOpen }) {
  const c = cycle(STORY_CONTENT, idx)
  const heroRef = useRef(null)
  const handleOpen = () => {
    const el = heroRef.current
    if (!el) return
    const origin = el.getBoundingClientRect()
    onOpen?.(origin, {
      variant: 'story',
      payload: {
        eyebrow: c.eyebrow, title: c.title, sub: c.sub,
        heroImg: IMG(c.cover),
        listTitle: c.listTitle,
        items: c.items,
        featured: c.items && c.items[0]
      }
    })
  }
  return (
    <article className="tcard tcard-story">
      <div ref={heroRef} className="hero clickable" onClick={handleOpen} style={{ backgroundImage: `url(${IMG(c.cover)})` }}>
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
function SpaceCard({ idx, onOpen }) {
  const c = cycle(SPACE_CONTENT, idx)
  const handleOpen = e => {
    const origin = e.currentTarget.getBoundingClientRect()
    onOpen?.(origin, {
      variant: 'single',
      payload: {
        eyebrow: c.eyebrow, title: c.title, sub: c.sub,
        heroImg: IMG(c.img)
      }
    })
  }
  return (
    <article onClick={handleOpen} className={'tcard tcard-space clickable' + (c.textBottom ? ' text-bottom' : '')}>
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
function GalleryCard({ idx, onOpen }) {
  const g = cycle(GALLERY_CONTENT, idx)
  const handleOpenItem = (c, e) => {
    const origin = e.currentTarget.getBoundingClientRect()
    onOpen?.(origin, {
      variant: 'single',
      payload: {
        eyebrow: c.eyebrow, title: c.title, sub: c.sub,
        heroImg: IMG(c.img), brand: c.brand, desc: c.desc,
        icon: c.icon, iconBg: c.iconBg, cta: c.cta
      }
    })
  }
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
            <article className="gcard clickable" onClick={e => handleOpenItem(c, e)}>
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

/* ---------- 详情页（点击卡片撑开到全屏） ---------- */
const DETAIL_PLACEHOLDER = [
  '一款由编辑团队精挑细选的内容，融合空间美学、生活方式与细节工艺。从第一眼开始，就给日子注入微妙的仪式感。',
  '我们相信，家不仅是住所，更是时间与情绪的容器。从光影、材质到动线，每一个选择都指向“更适合当下的你”——无需炫耀，也无需妥协。',
  '走进空间，你会察觉那些被温柔安放的细节：原木的纹理、布艺的褶皱、金属件冷静的反射。它们彼此呼应，又各自独立，像一场不急不缓的对话。',
  '每一件物、每一束光，都有自己的节奏。让空间替你慢下来，让生活在细节里生长。'
]
const DETAIL_QUOTE = '把日子过成诗，也把诗过成日常。'

function DetailOverlay({ detail, onClose }) {
  const rootRef = useRef(null)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)

  // 打开动画：从 origin rect 放大到全屏
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const { origin } = detail
    const vw = window.innerWidth
    const vh = window.innerHeight
    const sx = Math.max(origin.width / vw, 0.001)
    const sy = Math.max(origin.height / vh, 0.001)
    el.style.transformOrigin = '0 0'
    el.style.transition = 'none'
    el.style.transform = `translate(${origin.left}px, ${origin.top}px) scale(${sx}, ${sy})`
    el.style.borderRadius = '22px'
    // 双 rAF 确保首帧布局生效后再启动过渡
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'transform .46s cubic-bezier(.22,.8,.36,1), border-radius .46s cubic-bezier(.22,.8,.36,1)'
        el.style.transform = 'none'
        el.style.borderRadius = '0px'
      })
    })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = prev
    }
  }, [])

  const handleClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    const el = rootRef.current
    if (!el) { onClose(); return }
    const { origin } = detail
    const vw = window.innerWidth
    const vh = window.innerHeight
    const sx = Math.max(origin.width / vw, 0.001)
    const sy = Math.max(origin.height / vh, 0.001)
    // 向上滚到顶部再收，保证 origin 视觉位置准确
    const scroller = el.querySelector('.detail-scroll')
    if (scroller) scroller.scrollTop = 0
    el.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1), border-radius .4s cubic-bezier(.4,0,.2,1)'
    el.style.transformOrigin = '0 0'
    el.style.transform = `translate(${origin.left}px, ${origin.top}px) scale(${sx}, ${sy})`
    el.style.borderRadius = '22px'
    const onEnd = ev => {
      if (ev.propertyName !== 'transform') return
      el.removeEventListener('transitionend', onEnd)
      onClose()
    }
    el.addEventListener('transitionend', onEnd)
    // 兼容兼底：万一 transitionend 未触发
    setTimeout(() => { onClose() }, 520)
  }

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const { variant, payload } = detail
  const items = payload.items || []
  const featured = payload.featured

  return (
    <div
      ref={rootRef}
      className={'detail-overlay' + (closing ? ' closing' : '')}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="detail-close"
        aria-label="关闭"
        onClick={handleClose}
      >
        <CloseIcon size={18} strokeWidth={2.6} />
      </button>
      <div className="detail-scroll">
        <div
          className={'detail-hero detail-hero-' + variant}
          style={{ backgroundImage: `url(${payload.heroImg})` }}
        >
          <div className="detail-hero-grad" />
          <div className="detail-hero-text">
            {payload.eyebrow && <div className="detail-eyebrow">{payload.eyebrow}</div>}
            <div className="detail-title">{payload.title}</div>
            {payload.sub && <div className="detail-sub">{payload.sub}</div>}
          </div>
        </div>

        {variant === 'story' && featured && (
          <div className="detail-get-card">
            <div
              className="dgc-icon"
              style={{ backgroundImage: `url(${IMG(featured.img, 240)})` }}
            />
            <div className="dgc-text">
              <div className="dgc-name">{featured.name}</div>
              <div className="dgc-sub">{payload.listTitle || '本期精选'}</div>
            </div>
            <div className="dgc-action">
              <Button className="pill-get" size="small">查看</Button>
            </div>
          </div>
        )}

        <div className="detail-body">
          <p>{DETAIL_PLACEHOLDER[0]}</p>
          <p>{DETAIL_PLACEHOLDER[1]}</p>
          <blockquote className="detail-quote">
            <span className="detail-quote-mark left">&ldquo;</span>
            <span className="detail-quote-text">{DETAIL_QUOTE}</span>
            <span className="detail-quote-mark right">&rdquo;</span>
          </blockquote>
          <p>{DETAIL_PLACEHOLDER[2]}</p>

          {variant === 'story' && items.length > 0 && (
            <div className="detail-thumb-row">
              {items.slice(0, 8).map((it, i) => (
                <div key={i} className="dtr-item">
                  <div
                    className="dtr-img"
                    style={{ backgroundImage: `url(${IMG(it.img, 320)})` }}
                  />
                  <div className="dtr-name">{it.name}</div>
                  {it.price && <div className="dtr-price">{it.price}</div>}
                </div>
              ))}
            </div>
          )}

          <p>{DETAIL_PLACEHOLDER[3]}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- 卡片调度 ---------- */
const ORDER = [0, 2, 5, 1, 3, 4, 1, 0, 5, 4, 3, 2] // 6 类卡片混合顺序
const BUILDERS = [VideoCard, MagazineCard, StoryCard, SpaceCard, ListCard, GalleryCard]

/* ---------- 搜索页 ---------- */
const SEARCH_HISTORY = ['北欧风', '小户型改造', '莫兰迪色', '开放式厨房', '卧室收纳', '侘寂风']

const SEARCH_TRENDING = [
  { rank: 1, tag: '日式极简', desc: '侘寂美学 · 天然材质', hot: '1.2M', img: '1493809842364-78817add7ffb', badge: 'HOT' },
  { rank: 2, tag: '奶油风客厅', desc: '柔和色调 · 圆润语感', hot: '986K', img: '1505691938895-1758d7feb511', badge: 'NEW' },
  { rank: 3, tag: '岩板岛台', desc: '中岛厨房 · 全屋中心', hot: '742K', img: '1556909114-f6e7ad7d3136' },
  { rank: 4, tag: '旧房改造', desc: '老房重生记', hot: '655K', img: '1486946255434-2466348c2166' },
  { rank: 5, tag: '无主灯客厅', desc: '线型灯 · 极简吊顶', hot: '521K', img: '1574739782594-db4ead022697' },
  { rank: 6, tag: '治愈系卧室', desc: '柔光 · 布艺 · 疗愈系', hot: '410K', img: '1618220179428-22790b461013' }
]

function SearchPage({ query, onPick }) {
  const pick = (word) => onPick && onPick(word)
  return (
    <main className="search-page">
      <section className="search-section">
        <div className="search-section-head">
          <div className="search-section-title">
            <ClockIcon size={16} strokeWidth={2.2} />
            <span>搜索历史</span>
          </div>
          <button type="button" className="search-section-action">清空</button>
        </div>
        <div className="search-chips">
          {SEARCH_HISTORY.map(w => (
            <button key={w} type="button" className="search-chip" onClick={() => pick(w)}>{w}</button>
          ))}
        </div>
      </section>

      <section className="search-section">
        <div className="search-section-head">
          <div className="search-section-title">
            <TrendingIcon size={16} strokeWidth={2.2} />
            <span>当下热搜</span>
          </div>
          <span className="search-section-hint">每日更新</span>
        </div>
        <ul className="trending-list">
          {SEARCH_TRENDING.map(t => (
            <li key={t.rank} className="trending-item" onClick={() => pick(t.tag)}>
              <div
                className="trending-cover"
                style={{ backgroundImage: `url(${IMG(t.img, 280)})` }}
              />
              <div className="trending-text">
                <div className="trending-tag">
                  <span>{t.tag}</span>
                  {t.badge && <em className={'trending-badge badge-' + t.badge.toLowerCase()}>{t.badge}</em>}
                </div>
                <div className="trending-desc">{t.desc}</div>
              </div>
              <div className="trending-hot">
                <FlameIcon size={13} strokeWidth={2.4} />
                <span>{t.hot}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {query && (
        <div className="search-query-hint">
          输入中：<b>{query}</b>
        </div>
      )}
    </main>
  )
}

/* ---------- 个人中心（“我” tab）---------- */
const ME_AVATAR_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=70&auto=format'
const ME_STATS = [
  { label: '收藏',   value: 36 },
  { label: '浏览',   value: 128 },
  { label: '关注',   value: 12 },
  { label: '粉丝',   value: 5 }
]
const ME_RECENT = [
  { title: '北欧轻奢全案', img: '1600210492486-724fe5c67fb0' },
  { title: '92㎡ 极简日子', img: '1505691938895-1758d7feb511' },
  { title: '原木客厅',     img: '1486946255434-2466348c2166' },
  { title: '侘寂风卧室',   img: '1574739782594-db4ead022697' },
  { title: '奶油风餐厅',   img: '1493809842364-78817add7ffb' },
  { title: '开放岛台厨房', img: '1556909114-f6e7ad7d3136' },
  { title: '日式玄关',     img: '1618220179428-22790b461013' }
]
const ME_MENU = [
  { icon: HomeIcon,       label: '我的空间', extra: '3 个' },
  { icon: BriefcaseIcon,  label: '我的全案', extra: '8 份' },
  { icon: LayoutGridIcon, label: '我的模板', extra: '12 套' }
]
function MePage() {
  return (
    <main className="me-page">
      <section className="me-card">
        <div className="me-hero">
          <div
            className="me-avatar"
            style={{ backgroundImage: `url(${ME_AVATAR_URL})` }}
          />
          <div className="me-info">
            <div className="me-name">林墨</div>
            <div className="me-sub">Cuba Zone · 会员</div>
          </div>
          <button type="button" className="me-logout-btn" aria-label="登出">
            <LogOutIcon size={15} strokeWidth={2.2} />
            <span>登出</span>
          </button>
        </div>
        <div className="me-stats">
          {ME_STATS.map(s => (
            <div key={s.label} className="me-stat">
              <div className="me-stat-value">{s.value}</div>
              <div className="me-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="me-recent-section">
        <div className="me-section-head">
          <div className="me-section-title">
            <ClockIcon size={16} strokeWidth={2.2} />
            <span>最近浏览</span>
          </div>
          <span className="me-section-more">查看全部 ›</span>
        </div>
        <Swiper
          className="me-recent-swiper"
          slidesPerView="auto"
          spaceBetween={10}
          freeMode={true}
          grabCursor={true}
        >
          {ME_RECENT.map((r, i) => (
            <SwiperSlide key={i} style={{ width: 110 }}>
              <div
                className="me-recent-card"
                style={{ backgroundImage: `url(${IMG(r.img, 320)})` }}
              >
                <div className="me-recent-shade" />
                <div className="me-recent-title">{r.title}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <ul className="me-menu">
        {ME_MENU.map(m => {
          const I = m.icon
          return (
            <li key={m.label} className="me-menu-item">
              <I size={18} strokeWidth={2} className="me-menu-icon" />
              <span className="me-menu-label">{m.label}</span>
              {m.extra && <span className="me-menu-extra">{m.extra}</span>}
              <ChevronRightIcon size={16} strokeWidth={2} className="me-menu-arrow" />
            </li>
          )
        })}
      </ul>

      <div className="me-footer">Cuba Zone v0.0.1</div>
    </main>
  )
}

/* 不同 tab 用不同的 seed 偏移，以模拟「切换到不同页面」的内容洗牌 */
const TAB_SEED_OFFSET = { current: 0, recommend: 97, hot: 211 }
const seedFor = (tab, offset) => offset + (TAB_SEED_OFFSET[tab] || 0)

/* 以 seed 偏移内容，使每一期 / 每一 tab 都「不一样」 */
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
  const [activeTab, setActiveTab] = useState('current') // 'current' | 'recommend' | 'hot'
  const [items, setItems] = useState(() => makeBatch(seedFor('current', 0), 0, 6))
  const [hasMore, setHasMore] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [detail, setDetail] = useState(null)
  const lastY = useRef(0)
  const ticking = useRef(false)

  const openDetail = (origin, spec) => {
    setDetail({ origin, ...spec })
  }

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
    setItems(makeBatch(seedFor(activeTab, nextOffset), 0, 6))
    setHasMore(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  /* Tab 切换：重刷底部所有卡片，模拟切换到不同页面 */
  const switchTab = nextTab => {
    if (nextTab === activeTab) return
    setActiveTab(nextTab)
    if (nextTab !== 'me') {
      setItems(makeBatch(seedFor(nextTab, issueOffset), 0, 6))
      setHasMore(true)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const loadMore = async () => {
    await new Promise(r => setTimeout(r, 400))
    setItems(prev => [...prev, ...makeBatch(seedFor(activeTab, issueOffset), prev.length, 5)])
    if (items.length > 60) setHasMore(false)
  }

  const toggleSearch = next => {
    if (next) {
      setSearchOpen(true)
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else {
      setSearchOpen(false)
      setSearchQuery('')
    }
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
        activeTab={activeTab}
        onTabChange={switchTab}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchToggle={toggleSearch}
      />
      {searchOpen ? (
        <SearchPage
          query={searchQuery}
          onPick={word => setSearchQuery(word)}
        />
      ) : activeTab === 'me' ? (
        <MePage />
      ) : (
        <>
          <main className="feed" key={activeTab + '-' + issueOffset}>
            {items.map(it => {
              const C = BUILDERS[it.type]
              return <C key={it.key} idx={it.idx} onOpen={openDetail} />
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
      )}
      {detail && (
        <DetailOverlay detail={detail} onClose={() => setDetail(null)} />
      )}
    </>
  )
}
