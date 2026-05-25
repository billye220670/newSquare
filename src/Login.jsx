import { useEffect, useRef, useState } from 'react'
import { Popup } from 'antd-mobile'

/* 登录页：
   - 全屏循环视频背景（loginVid.webm）
   - Stage 1：沉浸式封面，整屏可点
   - Stage 2：点击后弹出底部 Popup，承载邮箱 + 第三方登录表单
   - 视频背景在两个阶段都保持播放，Popup 不遮挡底部封面 */
export default function Login({ onLogin }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  // stage: 'account' = 邮箱/手机号输入；'verify' = 验证码输入；'signup' = 注册（邀请制）；'enterprise' = 企业账户登录
  const [stage, setStage] = useState('account')
  const [account, setAccount] = useState('')
  const [invite, setInvite] = useState('')
  const [entAccount, setEntAccount] = useState('')
  const [entPassword, setEntPassword] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [resendLeft, setResendLeft] = useState(0)
  // 'idle' | 'checking' | 'error'：用于驱动摇头动画与微反馈文案
  const [verifyState, setVerifyState] = useState('idle')
  const videoRef = useRef(null)
  const codeRefs = useRef([])

  // 原型阶段：写死正确验证码 123456
  const CORRECT_CODE = '123456'

  // 移动端 Safari 偶发自动播放被拦截：首帧用户交互后兜底播一次
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => { v.play().catch(() => {}) }
    tryPlay()
    const onFirstTouch = () => { tryPlay() }
    window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true })
    window.addEventListener('click', onFirstTouch, { once: true })
    return () => {
      window.removeEventListener('touchstart', onFirstTouch)
      window.removeEventListener('click', onFirstTouch)
    }
  }, [])

  // 进入验证码阶段后启动重发倒计时
  useEffect(() => {
    if (stage !== 'verify' || !sheetOpen) return
    setResendLeft(10)
    const t = setInterval(() => {
      setResendLeft(s => {
        if (s <= 1) { clearInterval(t); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [stage, sheetOpen])

  // 立即进入：关闭抽屉 → 切到验证码 → 重新弹出
  const submit = () => {
    if (!account.trim()) return
    setSheetOpen(false)
    setTimeout(() => {
      setStage('verify')
      setCode(['', '', '', '', '', ''])
      setSheetOpen(true)
      setTimeout(() => codeRefs.current[0]?.focus(), 280)
    }, 360)
  }

  // 输完 6 位后自动校验：正确则进入；错误则摇头并清空
  const autoVerify = (codeArr) => {
    const codeStr = codeArr.join('')
    if (codeStr.length < 6) return
    setVerifyState('checking')
    // 原型阶段：缩短模拟延迟走快一点
    setTimeout(() => {
      if (codeStr === CORRECT_CODE) {
        setVerifyState('idle')
        onLogin?.({ method: 'account', account, code: codeStr })
      } else {
        setVerifyState('error')
        // 摇头动画后清空 + 复位焦点
        setTimeout(() => {
          setCode(['', '', '', '', '', ''])
          setVerifyState('idle')
          codeRefs.current[0]?.focus()
        }, 480)
      }
    }, 180)
  }

  const handleCodeChange = (idx, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    let nextArr
    setCode(prev => {
      const next = [...prev]
      next[idx] = v
      nextArr = next
      return next
    })
    if (verifyState === 'error') setVerifyState('idle')
    if (v && idx < 5) codeRefs.current[idx + 1]?.focus()
    if (v && idx === 5) {
      // 末位填写完触发自动校验
      setTimeout(() => autoVerify(nextArr), 0)
    }
  }

  const handleCodeKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus()
    }
  }

  const handleCodePaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = ['', '', '', '', '', '']
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setCode(next)
    if (verifyState === 'error') setVerifyState('idle')
    const focusIdx = Math.min(text.length, 5)
    codeRefs.current[focusIdx]?.focus()
    if (text.length === 6) setTimeout(() => autoVerify(next), 0)
  }

  const backToAccount = () => {
    setSheetOpen(false)
    setTimeout(() => {
      setStage('account')
      setVerifyState('idle')
      setSheetOpen(true)
    }, 360)
  }

  // 立刻加入：关闭抽屉 → 切到注册 → 重新弹出
  const goSignup = () => {
    setSheetOpen(false)
    setTimeout(() => {
      setStage('signup')
      setSheetOpen(true)
    }, 360)
  }

  // 注册提交：原型阶段直接进入
  const submitSignup = () => {
    if (!account.trim() || !invite.trim()) return
    onLogin?.({ method: 'signup', account, invite })
  }

  // 企业登录提交：原型阶段直接进入
  const submitEnterprise = () => {
    if (!entAccount.trim() || !entPassword.trim()) return
    onLogin?.({ method: 'enterprise', account: entAccount, password: entPassword })
  }

  // 进入企业登录：关闭抽屉 → 切到企业登录 → 重新弹出
  const goEnterprise = () => {
    setSheetOpen(false)
    setTimeout(() => {
      setStage('enterprise')
      setSheetOpen(true)
    }, 360)
  }

  const resendCode = () => {
    if (resendLeft > 0) return
    setResendLeft(10)
    const t = setInterval(() => {
      setResendLeft(s => {
        if (s <= 1) { clearInterval(t); return 0 }
        return s - 1
      })
    }, 1000)
  }

  return (
    <div className="login-page">
      <video
        ref={videoRef}
        className="login-bg-video"
        src="/loginVid.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* 底部柔和暗化，提升前景文字可读性，不遮挡画面整体氛围 */}
      <div className="login-bg-vignette" />

      {/* Stage 1：封面 + 任意处可点 */}
      {!sheetOpen && (
        <button
          type="button"
          className="login-cover"
          onClick={() => setSheetOpen(true)}
          aria-label="进入登录"
        >
          <div className="login-cover-inner">
            <div className="login-brand">
              <span className="login-brand-line">Cuba</span>
              <span className="login-brand-line">Zone</span>
            </div>
            <div className="login-cover-tagline">家的灵感，每天一刊</div>
          </div>
          <div className="login-cover-hint">轻点任意处继续</div>
        </button>
      )}

      {/* Stage 2：底部登录面板（antd-mobile Popup） */}
      <Popup
        visible={sheetOpen}
        onMaskClick={() => setSheetOpen(false)}
        bodyStyle={{
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          // 磨玻璃：保留较高白度，背后视频隐约透出
          background: 'rgba(255, 255, 255, 0.58)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.45)',
          padding: '20px 24px 32px',
          boxShadow: '0 -8px 30px rgba(0, 30, 80, 0.18)',
          minHeight: '58vh'
        }}
        maskStyle={{ background: 'rgba(0,0,0,0.18)' }}
      >
        {stage === 'account' && (
          <div className="login-sheet">
            <h2 className="login-sheet-title">登录趣摆社</h2>
            <p className="login-sheet-terms">
              登录即代表您同意我们的<a className="login-link" href="#">使用条款</a>。
            </p>

            <label className="login-field-label" htmlFor="login-account">邮箱或手机号</label>
            <input
              id="login-account"
              className="login-field-input"
              type="text"
              placeholder="请输入邮箱或手机号"
              value={account}
              onChange={e => setAccount(e.target.value)}
              autoComplete="username"
              inputMode="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <button type="button" className="login-connect-btn" onClick={submit}>
              立即进入
            </button>

            <button
              type="button"
              className="login-signup-link"
              onClick={goSignup}
            >
              还没有账号？<span className="login-signup-link-strong">立刻加入！</span>
            </button>

            <div className="login-divider"><span>或</span></div>

            <button
              type="button"
              className="login-signup-link"
              onClick={goEnterprise}
            >
              <b className="login-ent-text">企业账户登录</b>
            </button>

            <p className="login-policy">
              了解更多信息，请参阅我们的<a className="login-link" href="#">隐私政策</a>。
            </p>
          </div>
        )}
        {stage === 'verify' && (
          <div className="login-sheet">
            <button
              type="button"
              className="login-sheet-back"
              onClick={backToAccount}
              aria-label="返回"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <h2 className="login-sheet-title">输入验证码</h2>
            <p className="login-sheet-terms login-sheet-terms--strong">
              验证码已发送至 <span className="login-verify-target">{account}</span>，请查收并输入 6 位验证码。
            </p>

            <div
              className={`login-otp${verifyState === 'error' ? ' is-error' : ''}${verifyState === 'checking' ? ' is-checking' : ''}`}
              onPaste={handleCodePaste}
            >
              {code.map((c, i) => (
                <input
                  key={i}
                  ref={el => (codeRefs.current[i] = el)}
                  className={`login-otp-input${c ? ' is-filled' : ''}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={c}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  autoComplete="one-time-code"
                  disabled={verifyState === 'checking'}
                />
              ))}
            </div>

            <div
              className={`login-otp-status login-otp-status--${verifyState}`}
              role="status"
              aria-live="polite"
            >
              {verifyState === 'checking' && '验证中…'}
              {verifyState === 'error' && '验证码不正确，请重试'}
              {verifyState === 'idle' && '\u00A0'}
            </div>

            <button
              type="button"
              className="login-signup-link login-signup-link--strong"
              onClick={resendCode}
              disabled={resendLeft > 0 || verifyState === 'checking'}
            >
              {resendLeft > 0 ? (
                <>{resendLeft}s 后可重新发送</>
              ) : (
                <>没收到验证码？<span className="login-signup-link-strong">重新发送</span></>
              )}
            </button>

            <div className="login-divider login-divider--strong"><span>或</span></div>

            <p className="login-policy login-policy--strong">
              遇到问题？联系<a className="login-link" href="#">客户支持</a>。
            </p>
          </div>
        )}
        {stage === 'enterprise' && (
          <div className="login-sheet">
            <button
              type="button"
              className="login-sheet-back"
              onClick={backToAccount}
              aria-label="返回"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <h2 className="login-sheet-title">企业账户登录</h2>
            <p className="login-sheet-terms">
              使用企业账号密码登录趣摆社。
            </p>

            <label className="login-field-label" htmlFor="ent-account">企业账号</label>
            <input
              id="ent-account"
              className="login-field-input"
              type="text"
              placeholder="请输入企业账号"
              value={entAccount}
              onChange={e => setEntAccount(e.target.value)}
              autoComplete="username"
              inputMode="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <label className="login-field-label" htmlFor="ent-password">密码</label>
            <input
              id="ent-password"
              className="login-field-input"
              type="password"
              placeholder="请输入密码"
              value={entPassword}
              onChange={e => setEntPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="login-connect-btn"
              onClick={submitEnterprise}
              disabled={!entAccount.trim() || !entPassword.trim()}
            >
              企业登录
            </button>

            <div className="login-divider login-divider--strong"><span>或</span></div>

            <p className="login-policy login-policy--strong">
              遇到问题？联系<a className="login-link" href="#">客户支持</a>。
            </p>
          </div>
        )}
        {stage === 'signup' && (
          <div className="login-sheet">
            <h2 className="login-sheet-title">加入趣摆社</h2>
            <p className="login-sheet-terms">
              加入即代表您同意我们的<a className="login-link" href="#">使用条款</a>。
            </p>

            <label className="login-field-label" htmlFor="signup-account">邮箱或手机号</label>
            <input
              id="signup-account"
              className="login-field-input"
              type="text"
              placeholder="请输入邮箱或手机号"
              value={account}
              onChange={e => setAccount(e.target.value)}
              autoComplete="username"
              inputMode="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <label className="login-field-label" htmlFor="signup-invite">邀请码</label>
            <input
              id="signup-invite"
              className="login-field-input"
              type="text"
              placeholder="请输入邀请码（必填）"
              value={invite}
              onChange={e => setInvite(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <button
              type="button"
              className="login-connect-btn"
              onClick={submitSignup}
              disabled={!account.trim() || !invite.trim()}
            >
              立即加入
            </button>

            <button
              type="button"
              className="login-signup-link"
              onClick={backToAccount}
            >
              已有账号？<span className="login-signup-link-strong">立即登录！</span>
            </button>
          </div>
        )}
      </Popup>
    </div>
  )
}
