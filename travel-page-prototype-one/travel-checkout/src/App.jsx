import { useState } from 'react'
import './App.css'

const tabs = [
  { icon: 'calendar', label: 'Itinerary' },
  { icon: 'hotel', label: 'Hotel' },
  { icon: 'plane', label: 'Flights' },
  { icon: 'bell', label: 'Advisory' },
]

const tabIcons = {
  calendar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.15" />
      <path d="M1.5 7H14.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1.5V3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 1.5V3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  hotel: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 12V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 9H14V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 9V7C14 6.44772 13.5523 6 13 6H8V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 12H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  plane: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L8 6L3 9V10L8 8.5V12L6.5 13V14L8 13.5L9.5 14V13L8 12V8.5L13 10V9L8 6V2C8 1.44772 7.77614 1 7.5 1H8.5C8.22386 1 8 1.44772 8 2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  ),
  bell: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 12H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 12V8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8V12" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="3" r="1" fill="currentColor" />
      <path d="M2 12.5C2 12.5 3 14 8 14C13 14 14 12.5 14 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
}

function FlightLeg({ departTime, arriveTime, from, fromTerminal, fromCity, to, toTerminal, toCity, duration }) {
  return (
    <div className="flight-leg">
      <div className="flight-times">
        <span className="time-label">{departTime}</span>
        <span className="time-label">{arriveTime}</span>
      </div>
      <div className="flight-route">
        <div className="airport-col left">
          <span className="airport-code">{from}</span>
          {fromTerminal && <span className="terminal">{fromTerminal}</span>}
          <span className="city-name">{fromCity}</span>
        </div>
        <div className="flight-path">
          <div className="path-line" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="plane-svg">
            <path d="M10 4V8L5 11V12L10 10.5V14L8.5 15V16L10 15.5L11.5 16V15L10 14V10.5L15 12V11L10 8V4C10 3.44772 9.77614 3 9.5 3H10.5C10.2239 3 10 3.44772 10 4Z" fill="#8B7535" stroke="#8B7535" strokeWidth="0.3" />
          </svg>
          <div className="path-line" />
        </div>
        <div className="airport-col right">
          <span className="airport-code">{to}</span>
          {toTerminal && <span className="terminal">{toTerminal}</span>}
          <span className="city-name">{toCity}</span>
        </div>
      </div>
      <div className="duration-label">{duration}</div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Flights')
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="phone-frame">
      {/* Status Bar */}
      <div className="status-bar" />

      {/* Toolbar */}
      <div className="toolbar">
        <button className="icon-circle" aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button className="icon-circle" aria-label="Share">
          <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
            <path d="M7.5 1V10M7.5 1L4 4.5M7.5 1L11 4.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 10.5V14C1 15.1046 1.89543 16 3 16H12C13.1046 16 14 15.1046 14 14V10.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="scroll-content">
        {/* Destination Heading */}
        <div className="heading-section">
          <h1 className="destination">Tokyo, Japan</h1>
          <div className="trip-meta">
            <span className="meta-item">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="meta-icon">
                <rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="#666" strokeWidth="1.3" />
                <path d="M1.5 7H14.5" stroke="#666" strokeWidth="1.2" />
                <path d="M5 1.5V3.5" stroke="#666" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M11 1.5V3.5" stroke="#666" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Nov 4 - Nov 18
            </span>
            <span className="meta-item">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="meta-icon">
                <circle cx="5.5" cy="5.5" r="2.5" stroke="#666" strokeWidth="1.3" />
                <circle cx="10.5" cy="5.5" r="2.5" stroke="#666" strokeWidth="1.3" />
                <path d="M1 14C1 11.7909 2.79086 10 5 10H6" stroke="#666" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M10 10H11C13.2091 10 15 11.7909 15 14" stroke="#666" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              2 people
            </span>
          </div>
        </div>

        {/* Tab Rail */}
        <div className="tab-rail-wrapper">
          <div className="tab-rail">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`tab-chip ${activeTab === tab.label ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.label)}
              >
                <span className="chip-icon">{tabIcons[tab.icon]}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Car Service Banner */}
        {showBanner && (
          <div className="banner" onClick={() => {}}>
            <div className="banner-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 17L7 10.5C7.35 9.4 8.35 8.5 9.5 8.5H18.5C19.65 8.5 20.65 9.4 21 10.5L23 17" stroke="#8B7535" strokeWidth="1.6" strokeLinecap="round" />
                <rect x="4" y="17" width="20" height="5" rx="1.5" stroke="#8B7535" strokeWidth="1.6" />
                <circle cx="8" cy="24" r="1.5" stroke="#8B7535" strokeWidth="1.3" />
                <circle cx="20" cy="24" r="1.5" stroke="#8B7535" strokeWidth="1.3" />
              </svg>
            </div>
            <div className="banner-text">
              <span className="banner-title">Add car service to hotel</span>
              <span className="banner-sub">Tap to book now</span>
            </div>
            <button className="banner-close" onClick={(e) => { e.stopPropagation(); setShowBanner(false) }} aria-label="Dismiss">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Flight Card */}
        <div className="flight-card">
          <div className="airline-header">
            <div className="airline-info">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <polygon points="14,4 24,22 4,22" fill="#C41230" />
              </svg>
              <span className="airline-name">Delta Air Lines</span>
            </div>
            <button className="pnr-badge">
              <span>PNR123</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="4.5" width="7.5" height="7.5" rx="1.5" stroke="#8B7535" strokeWidth="1.2" />
                <path d="M5 4.5V3C5 1.89543 5.89543 1 7 1H11C12.1046 1 13 1.89543 13 3V7C13 8.10457 12.1046 9 11 9H9.5" stroke="#8B7535" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <FlightLeg
            departTime="9:05 AM"
            arriveTime="12:45 PM"
            from="LGA"
            fromTerminal="T1"
            fromCity="New York"
            to="NAP"
            toTerminal="T2"
            toCity="Naples"
            duration="12h 23m (Nonstop)"
          />

          <div className="card-divider" />

          <FlightLeg
            departTime="9:05 AM"
            arriveTime="12:45 PM"
            from="NAP"
            fromTerminal=""
            fromCity="Naples"
            to="LGA"
            toTerminal=""
            toCity="New York"
            duration="12h 23m (Nonstop)"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="booking-info">
          <div className="booked-row">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#5E7A3A" />
              <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="booked-label">Booked</span>
          </div>
          <span className="passenger-count">2 passengers</span>
        </div>
        <button className="manage-btn">Manage</button>
      </div>

      {/* Home Indicator */}
      <div className="home-indicator">
        <div className="indicator-pill" />
      </div>
    </div>
  )
}
