'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Droplets,
  FileText,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react'

type Organ = {
  id: string
  organ: string
  donor: string
  blood: string
  location: string
  distance: string
  preservation: string
  expires: string
  urgency: 'Critical' | 'Priority' | 'Routine'
  center: string
}

const inventory: Organ[] = [
  { id: 'ORG-4821', organ: 'Kidney', donor: 'Anonymous donor', blood: 'O+', location: 'Pune Procurement Centre', distance: '14 km', preservation: 'Hypothermic storage', expires: '05h 42m', urgency: 'Critical', center: 'Pune PPC' },
  { id: 'ORG-4818', organ: 'Liver', donor: 'Anonymous donor', blood: 'A+', location: 'Ruby Hall Transplant Unit', distance: '22 km', preservation: 'Hypothermic storage', expires: '11h 18m', urgency: 'Priority', center: 'Ruby Hall' },
  { id: 'ORG-4815', organ: 'Heart', donor: 'Anonymous donor', blood: 'B+', location: 'Noble Hospital Centre', distance: '31 km', preservation: 'Perfusion maintained', expires: '03h 09m', urgency: 'Critical', center: 'Noble Hospital' },
  { id: 'ORG-4809', organ: 'Kidney', donor: 'Anonymous donor', blood: 'AB+', location: 'Sahyadri Hospitals', distance: '38 km', preservation: 'Hypothermic storage', expires: '19h 36m', urgency: 'Routine', center: 'Sahyadri' },
  { id: 'ORG-4804', organ: 'Pancreas', donor: 'Anonymous donor', blood: 'O-', location: 'Jehangir Transplant Unit', distance: '41 km', preservation: 'Hypothermic storage', expires: '09h 04m', urgency: 'Priority', center: 'Jehangir' },
]

const initialRequests = [
  { id: 'REQ-2094', organ: 'Kidney', blood: 'O+', hospital: 'Sahyadri Hospitals', age: '8 min ago', status: 'Awaiting payment', urgent: true },
  { id: 'REQ-2091', organ: 'Liver', blood: 'A+', hospital: 'Ruby Hall Clinic', age: '42 min ago', status: 'Confirmed', urgent: false },
  { id: 'REQ-2088', organ: 'Heart', blood: 'B+', hospital: 'Noble Hospital', age: '1 hr ago', status: 'In transit', urgent: true },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Find organs', icon: Search },
  { label: 'My requests', icon: FileText },
  { label: 'Messages', icon: Inbox },
]

function StatusBadge({ status }: { status: Organ['urgency'] | string }) {
  const critical = status === 'Critical' || status === 'Awaiting payment'
  const priority = status === 'Priority' || status === 'In transit'
  return <span className={`status-badge ${critical ? 'status-critical' : priority ? 'status-priority' : 'status-routine'}`}><span className="status-dot" />{status}</span>
}

export default function Page() {
  const [role, setRole] = useState<'recipient' | 'center'>('recipient')
  const [activeNav, setActiveNav] = useState('Overview')
  const [organFilter, setOrganFilter] = useState('All organs')
  const [bloodFilter, setBloodFilter] = useState('All blood groups')
  const [urgencyOnly, setUrgencyOnly] = useState(false)
  const [selected, setSelected] = useState<Organ | null>(null)
  const [requests, setRequests] = useState(initialRequests)
  const [paid, setPaid] = useState(false)
  const [notice, setNotice] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [noticeVisible, setNoticeVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => inventory.filter((item) =>
    (organFilter === 'All organs' || item.organ === organFilter) &&
    (bloodFilter === 'All blood groups' || item.blood === bloodFilter) &&
    (!urgencyOnly || item.urgency === 'Critical') &&
    (!searchQuery || `${item.organ} ${item.location} ${item.center} ${item.blood}`.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [organFilter, bloodFilter, urgencyOnly, searchQuery])

  const openRequest = (organ: Organ) => { setSelected(organ); setPaid(false) }
  const submitRequest = () => {
    if (!selected) return
    setRequests((current) => [{ id: `REQ-${2100 + current.length}`, organ: selected.organ, blood: selected.blood, hospital: 'Sahyadri Hospitals', age: 'Just now', status: 'Awaiting payment', urgent: selected.urgency === 'Critical' }, ...current])
    setNotice('Request created. Complete the token payment to notify the procurement centre.')
    setSelected(null)
  }
  const confirmRequest = (id: string) => {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status: 'Confirmed' } : request))
    setNotice(`${id} confirmed. The recipient has been notified.`)
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div>
        <div className="workspace"><div className="workspace-icon"><Stethoscope /></div><div><strong>{role === 'recipient' ? 'My OrganEase account' : 'Pune Procurement Centre'}</strong><span>{role === 'recipient' ? 'Recipient account' : 'Procurement account'}</span></div><ChevronDown /></div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'nav-active' : ''}`} onClick={() => { setActiveNav(label); setNotice(`${label} selected`); setMobileOpen(false) }}><Icon />{label}{label === 'My requests' && <span className="nav-count">3</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><ShieldCheck />Compliance centre</button><button className="nav-item"><LogOut />Sign out</button><div className="user-chip"><div className="avatar">AK</div><div><strong>Arjun Kapoor</strong><span>OrganEase member</span></div><ChevronDown /></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation"><Menu /></button><div className="breadcrumb"><span>OrganEase</span><span>/</span><strong>{role === 'recipient' ? 'Recipient dashboard' : 'Procurement centre'}</strong></div><div className="top-actions"><div className="global-search"><Search /><input aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search organs, centres, requests..." /></div><button className="icon-button" aria-label="Notifications"><Bell /><span className="notification-dot" /></button><button className="top-avatar">DM</button></div></header>
        <div className="content">
          {noticeVisible && <div className="demo-banner"><AlertTriangle /><span><strong>Demo environment</strong> &nbsp; This prototype uses simulated records. No real medical or payment transactions are processed.</span><button aria-label="Dismiss notice" onClick={() => setNoticeVisible(false)}><X /></button></div>}
          <div className="page-heading"><div><p className="eyebrow">{role === 'recipient' ? 'Tuesday, 28 August 2026' : 'Operations console'}</p><h1>{role === 'recipient' ? 'Welcome back to OrganEase' : 'Procurement centre dashboard'}</h1><p className="heading-sub">{role === 'recipient' ? 'Find compatible organs faster. Every minute matters.' : 'Review incoming requests and keep transfers moving.'}</p></div><div className="role-switcher"><span>Viewing as</span><button className={role === 'recipient' ? 'role-active' : ''} onClick={() => { setRole('recipient'); setActiveNav('Overview'); setMobileOpen(false) }}><UserRound />Recipient</button><button className={role === 'center' ? 'role-active' : ''} onClick={() => { setRole('center'); setActiveNav('Overview'); setMobileOpen(false) }}><PackageCheck />Procurement</button></div></div>
          {notice && <div className="toast"><Check /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}

          {role === 'recipient' ? <>
            <div className="metrics"><div className="metric-card metric-primary"><div className="metric-icon"><Droplets /></div><div><span>Available nearby</span><strong>24 <small>organs</small></strong><em><ArrowUpRight /> 12% from yesterday</em></div></div><div className="metric-card"><div className="metric-icon soft-blue"><Clock3 /></div><div><span>Avg. response time</span><strong>18 <small>min</small></strong><em className="neutral">Across 8 centres</em></div></div><div className="metric-card"><div className="metric-icon soft-amber"><Activity /></div><div><span>Active requests</span><strong>03</strong><em className="neutral">1 needs attention</em></div></div><div className="metric-card"><div className="metric-icon soft-green"><ShieldCheck /></div><div><span>Transfers completed</span><strong>18</strong><em>98% success rate</em></div></div></div>
            <div className="section-head"><div><h2>Find available organs</h2><p>Real-time inventory from verified regional centres</p></div><button className="outline-button"><MapPin />Pune region <ChevronDown /></button></div>
            <div className="filter-row"><div className="filter-search"><Search /><input placeholder="Search by organ or centre" /></div><select value={organFilter} onChange={(e) => setOrganFilter(e.target.value)} aria-label="Filter by organ"><option>All organs</option><option>Kidney</option><option>Liver</option><option>Heart</option><option>Pancreas</option></select><select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} aria-label="Filter by blood group"><option>All blood groups</option><option>O+</option><option>A+</option><option>B+</option><option>AB+</option><option>O-</option></select><button className={`filter-button ${urgencyOnly ? 'selected' : ''}`} onClick={() => setUrgencyOnly(!urgencyOnly)}><SlidersHorizontal />Urgent only</button></div>
            <div className="inventory-table"><div className="table-header"><span>Organ & status</span><span>Compatibility</span><span>Location</span><span>Preservation window</span><span /></div>{filtered.map((item) => <div className="organ-row" key={item.id}><div className="organ-cell"><div className={`organ-symbol ${item.organ.toLowerCase()}`}>{item.organ === 'Heart' ? <HeartPulse /> : <Droplets />}</div><div><strong>{item.organ}</strong><span>{item.id} · {item.donor}</span><StatusBadge status={item.urgency} /></div></div><div><strong className="blood-pill">{item.blood}</strong><span className="cell-muted">Compatible group</span></div><div><strong>{item.location}</strong><span className="cell-muted"><MapPin />{item.distance} away</span></div><div><strong className={item.urgency === 'Critical' ? 'time-critical' : ''}>{item.expires}</strong><span className="cell-muted">{item.preservation}</span></div><button className="request-button" onClick={() => openRequest(item)}>View & request <ArrowUpRight /></button></div>)}{filtered.length === 0 && <div className="empty-state"><Search /><strong>No organs match these filters</strong><span>Try clearing an eligibility or urgency filter.</span></div>}</div>
            <div className="below-grid"><div className="panel"><div className="panel-head"><div><h2>Recent requests</h2><p>Track your active organ requests</p></div><button className="text-button" onClick={() => setActiveNav('My requests')}>View all <ArrowUpRight /></button></div>{requests.slice(0, 3).map((request) => <div className="request-row" key={request.id}><div className="request-icon"><FileText /></div><div className="request-main"><strong>{request.organ} · {request.blood}</strong><span>{request.id} · {request.hospital}</span></div><span className="request-age">{request.age}</span><StatusBadge status={request.status} /></div>)}</div><div className="help-card"><div className="help-icon"><ShieldCheck /></div><h3>Need help coordinating?</h3><p>Our transfer desk is available for urgent cases and centre coordination.</p><button className="outline-button">Contact transfer desk <ArrowUpRight /></button></div></div>
          </> : <ProcurementView requests={requests} onConfirm={confirmRequest} />}
          <footer>OrganEase is a coordination prototype for transplant networks. <span>Privacy & compliance</span><span>Support</span><span>v0.8.2</span></footer>
        </div>
      </section>
      {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><section className="request-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">{selected.id} · {selected.center}</span><h2>Request {selected.organ}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close request"><X /></button></div><div className="drawer-organ"><div className={`organ-symbol large ${selected.organ.toLowerCase()}`}><Droplets /></div><div><strong>{selected.organ} from {selected.location}</strong><span>Verified procurement centre · {selected.distance}</span></div><StatusBadge status={selected.urgency} /></div><div className="detail-grid"><div><span>Blood group</span><strong>{selected.blood}</strong></div><div><span>Window remaining</span><strong className="time-critical">{selected.expires}</strong></div><div><span>Storage method</span><strong>{selected.preservation}</strong></div><div><span>Transfer route</span><strong>Ground · Pune region</strong></div></div><div className="drawer-note"><ShieldCheck /><div><strong>Compatibility pre-check passed</strong><span>Based on the recipient profile for Sahyadri Hospitals. Final clinical approval remains with your transplant team.</span></div></div>{paid ? <div className="payment-success"><Check /><strong>Token payment confirmed</strong><span>Request sent to {selected.center}. The centre will confirm the transfer shortly.</span></div> : <><div className="payment-box"><div><span>Token confirmation payment</span><strong>₹ 2,500</strong></div><span>Refundable if the centre cannot confirm the transfer.</span></div><button className="primary-button full" onClick={() => { setPaid(true); setNotice('Payment confirmed. Your request is now with the procurement centre.') }}>Pay token & continue <ArrowUpRight /></button><button className="text-button full" onClick={submitRequest}>Create request without payment</button></>}</section></div>}
    </main>
  )
}

function ProcurementView({ requests, onConfirm }: { requests: typeof initialRequests; onConfirm: (id: string) => void }) {
  return <><div className="center-hero"><div><p className="eyebrow">Pune regional network · Live</p><h2>Requests to confirm</h2><p>Review hospital requests and confirm available transfers from your centre.</p></div><div className="center-status"><span className="live-dot" />Centre online<strong>12 organs listed</strong></div></div><div className="center-metrics"><div><span>Awaiting confirmation</span><strong>{requests.filter((r) => r.status === 'Awaiting payment').length + 2}</strong><em>Needs review</em></div><div><span>In active transfer</span><strong>04</strong><em>Across the region</em></div><div><span>Centre response time</span><strong>11 min</strong><em>18% faster this week</em></div></div><div className="panel requests-panel"><div className="panel-head"><div><h2>Incoming requests</h2><p>Requests are prioritized by preservation window</p></div><button className="outline-button"><SlidersHorizontal />Filter</button></div>{requests.map((request) => <div className="incoming-row" key={request.id}><div className="priority-bar" data-urgent={request.urgent} /><div className="request-icon"><FileText /></div><div className="request-main"><div><strong>{request.organ} · {request.blood}</strong>{request.urgent && <StatusBadge status="Critical" />}</div><span>{request.id} · {request.hospital} · {request.age}</span></div><div className="incoming-status"><span>Status</span><strong>{request.status}</strong></div>{request.status === 'Awaiting payment' ? <button className="primary-button small" onClick={() => onConfirm(request.id)}>Confirm request <Check /></button> : <span className="confirmed"><Check />Confirmed</span>}</div>)}</div><div className="center-bottom"><div className="panel mini-panel"><div className="panel-head"><div><h2>Storage overview</h2><p>Current centre inventory</p></div><button className="text-button">Manage <ArrowUpRight /></button></div><div className="storage-line"><span>Kidneys</span><strong>08</strong><div><i style={{ width: '62%' }} /></div></div><div className="storage-line"><span>Livers</span><strong>03</strong><div><i style={{ width: '38%' }} /></div></div><div className="storage-line"><span>Other</span><strong>05</strong><div><i style={{ width: '48%' }} /></div></div></div><div className="help-card"><div className="help-icon"><Bell /></div><h3>Keep your centre visible</h3><p>Update storage availability so hospitals can find organs without making calls.</p><button className="outline-button">Update inventory <ArrowUpRight /></button></div></div></>
}
