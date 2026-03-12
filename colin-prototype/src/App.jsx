import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Conversation script data ────────────────────────────────────────
const INITIAL_MESSAGES = [
  { type: 'ai', text: 'Who should we offer this free round of martinis to?' },
  {
    type: 'suggestions',
    label: 'Suggested',
    items: [
      { icon: '👥', label: 'All guests' },
      { icon: '🍺', label: 'Big drinkers' },
      { icon: '🎯', label: 'Millennials' },
      { icon: '🎂', label: 'March birthdays' },
    ],
    hasMore: true,
  },
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── Sub-components ──────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="status-bar">
    </div>
  )
}

function Header({ onReset }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 20px 12px', flexShrink: 0,
    }}>
      <HeaderBtn onClick={onReset}>‹</HeaderBtn>
      <span style={{ fontSize: 17, fontWeight: 600 }}>Define eligible guests</span>
      <HeaderBtn onClick={onReset}>×</HeaderBtn>
    </div>
  )
}

function HeaderBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e0e0',
      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 18, color: '#333',
    }}>{children}</button>
  )
}

function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div style={{ padding: '12px 20px 0', flexShrink: 0, background: '#fff' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', background: '#f5f5f5',
        borderRadius: 20, padding: '12px 16px 8px',
      }}>
        <textarea
          style={{
            border: 'none', background: 'transparent', fontSize: 15, outline: 'none',
            width: '100%', resize: 'none', fontFamily: 'inherit', color: '#1a1a1a',
          }}
          placeholder="Describe your audience..."
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          disabled={disabled}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <InputBtn>+</InputBtn>
          <div style={{ display: 'flex', gap: 4 }}>
            <InputBtn>🎙</InputBtn>
            <InputBtn active={!!text.trim()} onClick={send}>↑</InputBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputBtn({ children, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      width: 30, height: 30, borderRadius: '50%', border: 'none',
      background: 'transparent', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: active ? '#1a1a1a' : '#999', fontSize: 18,
    }}>{children}</button>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 8, height: 8, background: '#ccc', borderRadius: '50%',
          animation: `dotBounce 1.4s infinite ease-in-out both`,
          animationDelay: `${-0.32 + i * 0.16}s`,
        }} />
      ))}
    </div>
  )
}

function Chip({ icon, label, onClick, selected, dark, dashed }) {
  return (
    <span onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '8px 14px', borderRadius: 20,
      border: `1px ${dashed ? 'dashed' : 'solid'} ${dark || selected ? '#1a1a1a' : '#e0e0e0'}`,
      background: dark || selected ? '#1a1a1a' : '#fff',
      color: dark || selected ? '#fff' : '#1a1a1a',
      fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all 0.15s',
    }}>
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      {label}
      {selected && <span style={{ fontSize: 12, marginLeft: 2, opacity: 0.7 }}>✕</span>}
    </span>
  )
}

function AudienceCard({ html, reach, tags }) {
  return (
    <div className="anim-in" style={{
      background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12,
      padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 15, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: html }} />
        <span style={{ color: '#999', cursor: 'pointer', flexShrink: 0, marginLeft: 8 }}>⤢</span>
      </div>
      {tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 14, border: '1px solid #e0e0e0',
              fontSize: 13, background: '#fff',
            }}>
              {t.emoji && <span style={{ fontSize: 12 }}>{t.emoji}</span>}
              {t.label}
            </span>
          ))}
        </div>
      )}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 8, borderTop: '1px solid #f0f0f0',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Estimated reach</span>
        <span style={{ fontSize: 14 }}>{reach}</span>
      </div>
    </div>
  )
}

function AudienceFullCard({ label, html, reach }) {
  return (
    <div className="anim-in" style={{
      background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12,
      padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {label && <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>}
      <div style={{ fontSize: 15, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: html }} />
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 8, borderTop: '1px solid #f0f0f0',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Estimated reach</span>
        <span style={{ fontSize: 14 }}>{reach}</span>
      </div>
    </div>
  )
}

// ─── Overlay: Tag picker ─────────────────────────────────────────────

function TagPicker({ onClose, onSelect }) {
  const [search, setSearch] = useState('high spenders')
  const [selected, setSelected] = useState(new Set(['$$$', 'High spenders - Cucina Alba']))

  const groups = [
    { name: "Colin's favorite tags", tags: ['Spenderzzz', 'high rollers'] },
    { name: 'Spending Habits', tags: ['$$$', '$$', '$'] },
    { name: 'High spenders (12)', tags: ['Tag name', 'Tag', 'Long tag name', 'Tag2', 'High spenders - Cucina Alba', 'Tag name2', 'Tag3', 'Long tag name2', 'Tag4'] },
  ]

  const toggle = (tag) => setSelected(prev => {
    const next = new Set(prev)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    return next
  })

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', animation: 'slideUp .3s ease-out',
    }}>
      <div style={{ background: 'rgba(0,0,0,.3)', height: 80, flexShrink: 0 }} onClick={onClose} />
      <div style={{
        flex: 1, background: '#fff', borderRadius: '20px 20px 0 0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
          <RoundBtn onClick={onClose}>×</RoundBtn>
          <span style={{ fontSize: 17, fontWeight: 600 }}>Select tags</span>
          <div style={{ width: 32 }} />
        </div>
        <div style={{ margin: '0 20px 16px', display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tags..."
            style={{
              flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 10,
              fontSize: 15, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button style={{
            width: 40, height: 40, border: '1px solid #e0e0e0', borderRadius: 10,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16,
          }}>⫏</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {groups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>▾ {g.name}</span>
                <span style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>Select all</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {g.tags.map((t, ti) => (
                  <Chip key={ti} label={t} selected={selected.has(t)} onClick={() => toggle(t)} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 20px 34px' }}>
          <button onClick={() => onSelect([...selected])} style={{
            width: '100%', padding: 16, borderRadius: 14, border: 'none',
            background: '#1a1a1a', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>Select {selected.size} tags</button>
        </div>
      </div>
    </div>
  )
}

// ─── Overlay: Spend picker ───────────────────────────────────────────

function SpendPicker({ onClose, onSave }) {
  const [amount, setAmount] = useState(500)
  const presets = [100, 500, 1000, 10000]

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: '#fff', borderRadius: '20px 20px 0 0',
      boxShadow: '0 -10px 40px rgba(0,0,0,.1)', padding: '20px 20px 34px',
      animation: 'slideUp .3s ease-out',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <RoundBtn onClick={onClose}>×</RoundBtn>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Set minimum spend</span>
        <div style={{ width: 32 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 8 }}>
        <StepBtn onClick={() => setAmount(Math.max(0, amount - 100))}>−</StepBtn>
        <span style={{ fontSize: 48, fontWeight: 700 }}>${amount.toLocaleString()}</span>
        <StepBtn onClick={() => setAmount(amount + 100)}>+</StepBtn>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 24, cursor: 'pointer' }}>Show keypad</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {presets.map(p => (
          <Chip key={p} label={`Over $${p.toLocaleString()}`} selected={amount === p} onClick={() => setAmount(p)} />
        ))}
        <Chip label="Custom" onClick={() => {}} />
      </div>
      <button onClick={() => onSave(amount)} style={{
        width: '100%', padding: 16, borderRadius: 14, border: 'none',
        background: '#1a1a1a', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
      }}>Save & update audience</button>
    </div>
  )
}

function RoundBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: '50%', border: '1px solid #e0e0e0',
      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 16,
    }}>{children}</button>
  )
}

function StepBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 48, height: 48, borderRadius: '50%', border: '1px solid #e0e0e0',
      background: '#fff', fontSize: 24, cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: '#1a1a1a',
    }}>{children}</button>
  )
}

// ─── Main App ────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [overlay, setOverlay] = useState(null)
  const chatRef = useRef(null)
  const initRef = useRef(false)

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
    })
  }, [])

  const pushMessages = useCallback(async (items) => {
    for (const item of items) {
      setTyping(true)
      scrollBottom()
      await wait(500 + Math.random() * 500)
      setTyping(false)
      setMessages(prev => [...prev, item])
      scrollBottom()
      await wait(80)
    }
  }, [scrollBottom])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    pushMessages(INITIAL_MESSAGES)
  }, [pushMessages])

  useEffect(scrollBottom, [messages, typing, scrollBottom])

  // Responsive frame scaling
  useEffect(() => {
    function scaleFrame() {
      const frame = document.querySelector('.phone-frame')
      if (!frame) return
      const sx = (window.innerWidth - 60) / 410
      const sy = (window.innerHeight - 60) / 882
      frame.style.setProperty('--frame-scale', Math.min(1, sx, sy))
    }
    window.addEventListener('resize', scaleFrame)
    scaleFrame()
    return () => window.removeEventListener('resize', scaleFrame)
  }, [])

  // ── Handlers ─────────────────────────────────────────────

  const handleChipClick = async (label) => {
    if (label === 'Skip for now') return

    setMessages(prev => [...prev, { type: 'user', text: label }])

    if (['All guests', 'Big drinkers', 'Millennials', 'March birthdays'].includes(label)) {
      await pushMessages([
        { type: 'audience', html: `Guests that are <strong>${label}</strong>.`, reach: '~1,240' },
        { type: 'ai', text: 'Add an event trigger? Offers sent after a specific action tend to convert better.' },
        { type: 'suggestions', label: 'Suggested', items: [
          { icon: '☆', label: 'After a bad review' },
          { icon: '📋', label: 'First visit' },
          { icon: '📅', label: 'Fulfillment of other offer' },
        ], showSkip: true },
      ])
      return
    }

    if (['After a bad review', 'First visit', 'Fulfillment of other offer'].includes(label)) {
      await pushMessages([
        { type: 'ai', text: 'Audience updated!' },
        { type: 'ai', text: 'Do you want to add an event trigger to narrow this audience further?' },
      ])
      await wait(300)
      await pushMessages([
        { type: 'user', text: 'Can we trigger after they visit 10 times?' },
      ])
      await wait(400)
      await pushMessages([
        { type: 'audienceFull', label: 'Audience',
          html: 'Guests tagged 🏷 <strong>Millennials</strong>, 🏷 <strong>$$$</strong> and spent more than <strong>$500</strong>, triggered after they 😊 <strong>left a review</strong>',
          reach: '~346',
        },
      ])
      return
    }

    if (label.startsWith('Over $')) {
      setOverlay('spend')
      return
    }
  }

  const handleSend = async (text) => {
    setMessages(prev => [...prev, { type: 'user', text }])
    const lower = text.toLowerCase()

    if (lower.includes('dont care') || lower.includes("don't care") || lower.includes('i dont care')) {
      await pushMessages([
        { type: 'ai', html: 'Your <span style="color:#b8860b;font-weight:600">Millennial Alcoholics</span> crowd hasn\'t been around a lot lately, maybe this is just the thing to get them in the door?' },
        { type: 'browse', text: 'Browse saved audiences' },
      ])
    } else if (lower.includes('do it for me') || lower.includes('whatever do it')) {
      await pushMessages([
        { type: 'audience', html: 'Guests that are <strong>Millennials</strong> and <strong>Big Drinkers</strong>.', reach: '~346' },
        { type: 'ai', text: 'Add an event trigger? Offers sent after a specific action tend to convert better.' },
        { type: 'suggestions', label: 'Suggested', items: [
          { icon: '☆', label: 'After a bad review' },
          { icon: '📋', label: 'First visit' },
          { icon: '📅', label: 'Fulfillment of other offer' },
        ], showSkip: true },
      ])
    } else if (lower.includes('high spend')) {
      await pushMessages([
        { type: 'ai', text: 'Found a few matches for "high spenders", or define new filters?' },
        { type: 'tagPreview' },
      ])
    } else if (lower.includes('trigger') || lower.includes('visit')) {
      await pushMessages([
        { type: 'ai', text: 'Audience updated!' },
        { type: 'audienceFull', label: 'Audience',
          html: 'Guests tagged 🏷 <strong>Millennials</strong>, 🏷 <strong>$$$</strong> and spent more than <strong>$500</strong>, triggered after they 😊 <strong>left a review</strong>',
          reach: '~346',
        },
      ])
    } else {
      await pushMessages([
        { type: 'ai', text: `I'll look into "${text}" for your audience. Would you like to refine further?` },
      ])
    }
  }

  const handleTagsSelected = async (tags) => {
    setOverlay(null)
    setMessages(prev => prev.filter(m => m.type !== 'tagPreview'))
    setMessages(prev => [...prev, {
      type: 'selectedTags',
      tags: ['$$$', 'High spenders - Cucina Alba', 'High spenders', 'high rollers', '+15 more →'],
    }])
    await wait(300)
    setMessages(prev => [...prev, { type: 'divider', text: 'And/or' }])
    await wait(200)
    setMessages(prev => [...prev, { type: 'customFilter' }])
    scrollBottom()
  }

  const handleSpendSave = async (amount) => {
    setOverlay(null)
    await pushMessages([
      { type: 'ai', text: 'Audience updated!' },
      {
        type: 'audience',
        html: `Guests that are <strong>Millennials</strong>, <strong>$$$</strong> and spent more than <strong>$${amount.toLocaleString()}</strong>.`,
        reach: '~346',
        tags: [
          { emoji: '🏷', label: 'Millennials' },
          { emoji: '🏷', label: '$$$' },
          { label: 'High spenders' },
          { label: 'high rollers' },
        ],
      },
      { type: 'ai', text: 'Do you want to add an event trigger to narrow this audience further?' },
      { type: 'trigger-arrow' },
      { type: 'suggestions', label: '', items: [
        { icon: '☆', label: 'After a bad review' },
        { icon: '📋', label: 'First visit' },
        { icon: '📅', label: 'Fulfillment of other offer' },
      ], showSkip: true },
    ])
  }

  const handleReset = () => {
    setMessages([])
    setOverlay(null)
    initRef.current = false
    setTimeout(() => {
      initRef.current = true
      pushMessages(INITIAL_MESSAGES)
    }, 200)
  }

  // ── Render each message type ─────────────────────────────

  const renderMsg = (msg, idx) => {
    switch (msg.type) {
      case 'ai':
        return (
          <div key={idx} className="anim-in" style={{ fontSize: 16, lineHeight: 1.5, color: '#1a1a1a' }}
            dangerouslySetInnerHTML={{ __html: msg.html || msg.text }} />
        )
      case 'user':
        return (
          <div key={idx} className="anim-in" style={{
            alignSelf: 'flex-end', background: '#1a1a1a', color: '#fff',
            padding: '10px 18px', borderRadius: 20, fontSize: 15, maxWidth: '80%',
          }}>{msg.text}</div>
        )
      case 'suggestions':
        return (
          <div key={idx} className="anim-in" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {msg.label && <div style={{ fontSize: 13, color: '#888' }}>{msg.label}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {msg.items.map((item, i) => (
                <Chip key={i} icon={item.icon} label={item.label} onClick={() => handleChipClick(item.label)} />
              ))}
              {msg.showSkip && <span style={{ fontSize: 14, color: '#888', cursor: 'pointer', padding: '8px 4px' }}>Skip for now</span>}
              {msg.hasMore && <span style={{ fontSize: 14, color: '#888', padding: '8px 4px' }}>...</span>}
            </div>
          </div>
        )
      case 'audience':
        return <AudienceCard key={idx} html={msg.html} reach={msg.reach} tags={msg.tags} />
      case 'audienceFull':
        return <AudienceFullCard key={idx} label={msg.label} html={msg.html} reach={msg.reach} />
      case 'browse':
        return (
          <div key={idx} className="anim-in">
            <span style={{ color: '#b8860b', fontSize: 14, cursor: 'pointer' }}>{msg.text} ↗</span>
          </div>
        )
      case 'tagPreview':
        return (
          <div key={idx} className="anim-in">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              <Chip label="$$$" dark onClick={() => {}} />
              <Chip label="High spenders - Cucina Alba" onClick={() => {}} />
              <Chip label="High spenders" onClick={() => {}} />
              <Chip label="high rollers" onClick={() => {}} />
              <span style={{ fontSize: 14, color: '#888', padding: '8px 4px' }}>+15 more →</span>
            </div>
            <Chip label="Browse all tags" dashed onClick={() => setOverlay('tags')} />
          </div>
        )
      case 'selectedTags':
        return (
          <div key={idx} className="anim-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {msg.tags.map((t, i) => (
              <Chip key={i} label={t} dark={i === 0} />
            ))}
          </div>
        )
      case 'divider':
        return <div key={idx} className="anim-in" style={{ fontSize: 13, color: '#999', padding: '4px 0' }}>{msg.text}</div>
      case 'customFilter':
        return (
          <div key={idx} className="anim-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Custom filter</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Minimum spend to qualify?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Over $100', 'Over $500', 'Over $1,000', 'Over $10,000', 'Custom'].map(p => (
                <Chip key={p} label={p} onClick={() => setOverlay('spend')} />
              ))}
            </div>
          </div>
        )
      case 'trigger-arrow':
        return <div key={idx} style={{ textAlign: 'center', color: '#ccc', fontSize: 20, padding: '4px 0' }}>↓</div>
      default:
        return null
    }
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
          display: flex; justify-content: center; align-items: center;
          height: 100vh; overflow: hidden;
          background: #1a2332 url('${import.meta.env.BASE_URL}Hero.png') center/cover no-repeat fixed;
          -webkit-font-smoothing: antialiased;
        }
        .phone-frame {
          width: 402px;
          height: 874px;
          background: #fff;
          border-radius: 55px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 4px solid #d6d6d8;
          box-shadow:
            0 0 0 1px #bbbbbe,
            0 30px 90px rgba(0,0,0,0.35),
            0 12px 36px rgba(0,0,0,0.2),
            inset 0 0 0 1px rgba(255,255,255,0.5);
          transform-origin: center center;
          transform: scale(var(--frame-scale, 1));
        }
        .status-bar {
          height: 54px;
          flex-shrink: 0;
          background: url('${import.meta.env.BASE_URL}status-bar.png') center/contain no-repeat;
        }
        .home-indicator {
          display: flex;
          justify-content: center;
          padding: 8px 0 10px;
          flex-shrink: 0;
        }
        .indicator-pill {
          width: 140px;
          height: 5px;
          background: #1a1a1a;
          border-radius: 999px;
        }
        button {
          border: none;
          background: none;
          padding: 0;
          font-family: inherit;
          cursor: pointer;
        }
        button:focus-visible {
          outline: 2px solid #4A90D9;
          outline-offset: 2px;
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .anim-in { animation: fadeInUp .3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes dotBounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>

      <div className="phone-frame">
        <StatusBar />
        <Header onReset={handleReset} />

        <div ref={chatRef} style={{
          flex: 1, overflowY: 'auto', padding: '0 20px 20px',
          display: 'flex', flexDirection: 'column', gap: 16, scrollBehavior: 'smooth',
        }}>
          {messages.map(renderMsg)}
          {typing && <TypingDots />}
        </div>

        <InputBar onSend={handleSend} disabled={typing} />

        <div className="home-indicator">
          <div className="indicator-pill"></div>
        </div>

        {overlay === 'tags' && <TagPicker onClose={() => setOverlay(null)} onSelect={handleTagsSelected} />}
        {overlay === 'spend' && <SpendPicker onClose={() => setOverlay(null)} onSave={handleSpendSave} />}
      </div>
    </>
  )
}
