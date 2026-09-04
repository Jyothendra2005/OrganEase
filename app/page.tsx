'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ClipboardPlus,
  Clock3,
  Droplets,
  FileText,
  HeartPulse,
  LockKeyhole,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  Upload,
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
]

const regions = ['Pune region', 'Mumbai region', 'Nashik region', 'Nagpur region']
type HospitalForm = 'availability' | 'request'

function StatusBadge({ status }: { status: Organ['urgency'] | string }) {
  const critical = status === 'Critical' || status === 'Awaiting payment'
  const priority = status === 'Priority' || status === 'In transit'
  return <span className={`status-badge ${critical ? 'status-critical' : priority ? 'status-priority' : 'status-routine'}`}><span className="status-dot" />{status}</span>
}

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [email, setEmail] = useState('arjun.kapoor@example.com')
  const [password, setPassword] = useState('organ-ease-demo')
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [region, setRegion] = useState('Pune region')
  const [regionOpen, setRegionOpen] = useState(false)
  const [hospitalForm, setHospitalForm] = useState<HospitalForm | null>(null)

  useEffect(() => {
    const savedSession = window.sessionStorage.getItem('organease-session')
    const savedRole = window.sessionStorage.getItem('organease-role')
    const requestedRole = new URLSearchParams(window.location.search).get('role')
    if (savedSession === 'signed-in') setIsSignedIn(true)
    if (requestedRole === 'procurement') {
      setRole('center')
      window.sessionStorage.setItem('organease-role', 'center')
    } else if (requestedRole === 'recipient') {
      setRole('recipient')
      window.sessionStorage.setItem('organease-role', 'recipient')
    } else if (savedRole === 'center') {
      setRole('center')
    }
  }, [])

  const signIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.sessionStorage.setItem('organease-session', 'signed-in')
    setIsSignedIn(true)
  }

  const filtered = useMemo(() => inventory.filter((item) =>
    (region === 'Pune region' || item.location.toLowerCase().includes(region.replace(' region', '').toLowerCase())) &&
    (organFilter === 'All organs' || item.organ === organFilter) &&
    (bloodFilter === 'All blood groups' || item.blood === bloodFilter) &&
    (!urgencyOnly || item.urgency === 'Critical') &&
    (!searchQuery || `${item.organ} ${item.location} ${item.center} ${item.blood}`.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [organFilter, bloodFilter, urgencyOnly, searchQuery, region])

  if (!isSignedIn) {
    return <SignInPage email={email} password={password} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={signIn} />
  }

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
  const submitHospitalForm = (event: React.FormEvent<HTMLFormElement>, form: HospitalForm) => {
    event.preventDefault()
    setHospitalForm(null)
    setNotice(form === 'availability' ? 'Organ availability submitted for verification.' : 'Organ request submitted to the regional network.')
  }
  const navigateTo = (label: string) => {
    setActiveNav(label)
    setNotice(`${label} selected`)
    setMobileOpen(false)
    if (label === 'Overview') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(label === 'Find organs' ? 'find-organs' : label === 'My requests' ? 'my-requests' : 'messages')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}<span>{sidebarCollapsed ? 'Expand menu' : 'Collapse menu'}</span></button>
        <div className="brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div>
        <div className="workspace"><div className="workspace-icon"><Stethoscope /></div><div><strong>{role === 'recipient' ? 'My OrganEase account' : 'Pune Procurement Centre'}</strong><span>{role === 'recipient' ? 'Recipient account' : 'Procurement account'}</span></div><ChevronDown /></div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'nav-active' : ''}`} onClick={() => navigateTo(label)}><Icon />{label}{label === 'My requests' && <span className="nav-count">3</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setNotice('Compliance centre selected')}><ShieldCheck />Compliance centre</button><button className="nav-item" onClick={() => { window.sessionStorage.removeItem('organease-session'); window.sessionStorage.removeItem('organease-role'); setIsSignedIn(false); setMobileOpen(false) }}><LogOut />Sign out</button><div className="user-chip"><div className="avatar">AK</div><div><strong>Arjun Kapoor</strong><span>OrganEase member</span></div><ChevronDown /></div></div>
      </aside>
      {mobileOpen && <button className="nav-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <section className="main-area">
        <header className="topbar"><button className="mobile-menu menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation" aria-expanded={mobileOpen}><span /><span /><span /></button><div className="breadcrumb"><span>OrganEase</span><span>/</span><strong>{role === 'recipient' ? 'Recipient dashboard' : 'Procurement centre'}</strong></div><div className="top-actions"><div className="global-search"><Search /><input aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search organs, centres, requests..." /></div><button className="icon-button" aria-label="Notifications"><Bell /><span className="notification-dot" /></button><button className="top-avatar">DM</button></div></header>
        <div className="content">
          <div className="page-heading"><div><p className="eyebrow">{role === 'recipient' ? 'Tuesday, 28 August 2026' : 'Operations console'}</p><h1>{role === 'recipient' ? 'Welcome back to OrganEase' : 'Procurement centre dashboard'}</h1><p className="heading-sub">{role === 'recipient' ? 'Find compatible organs faster. Every minute matters.' : 'Review incoming requests and keep transfers moving.'}</p></div><div className="heading-actions"><div className="hospital-actions"><Link className="outline-button" href="/availability"><ClipboardPlus />Add availability</Link><Link className="primary-button" href="/request"><ClipboardPlus />Request organ</Link></div><div className="role-switcher"><span>Viewing as</span><Link className={role === 'recipient' ? 'role-active' : ''} href="/?role=recipient" onClick={() => { setRole('recipient'); window.sessionStorage.setItem('organease-role', 'recipient') }}><UserRound />Recipient</Link><Link className={role === 'center' ? 'role-active' : ''} href="/?role=procurement" onClick={() => { setRole('center'); window.sessionStorage.setItem('organease-role', 'center') }}><PackageCheck />Procurement</Link></div></div></div>
          {notice && <div className="toast"><Check /><span>{notice}</span><button onClick={() => setNotice('')}><X /></button></div>}

          {role === 'recipient' ? <>
            <div className="metrics"><div className="metric-card metric-primary"><div className="metric-icon"><Droplets /></div><div><span>Available nearby</span><strong>24 <small>organs</small></strong><em><ArrowUpRight /> 12% from yesterday</em></div></div><div className="metric-card"><div className="metric-icon soft-blue"><Clock3 /></div><div><span>Avg. response time</span><strong>18 <small>min</small></strong><em className="neutral">Across 8 centres</em></div></div><div className="metric-card"><div className="metric-icon soft-amber"><Activity /></div><div><span>Active requests</span><strong>03</strong><em className="neutral">1 needs attention</em></div></div><div className="metric-card"><div className="metric-icon soft-green"><ShieldCheck /></div><div><span>Transfers completed</span><strong>18</strong><em>98% success rate</em></div></div></div>
            <div id="find-organs" className="section-head"><div><h2>Find available organs</h2><p>Real-time inventory from verified regional centres</p></div><div className="region-picker"><button className="outline-button" onClick={() => setRegionOpen(!regionOpen)} aria-expanded={regionOpen} aria-haspopup="listbox"><MapPin />{region}<ChevronDown /></button>{regionOpen && <div className="region-menu" role="listbox" aria-label="Select region">{regions.map((option) => <button key={option} role="option" aria-selected={region === option} className={region === option ? 'region-selected' : ''} onClick={() => { setRegion(option); setRegionOpen(false); setNotice(`${option} selected`) }}>{option}<Check /></button>)}</div>}</div></div>
            <div className="filter-row"><div className="filter-search"><Search /><input aria-label="Search available organs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by organ or centre" /></div><select value={organFilter} onChange={(e) => setOrganFilter(e.target.value)} aria-label="Filter by organ"><option>All organs</option><option>Kidney</option><option>Liver</option><option>Heart</option><option>Pancreas</option></select><select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} aria-label="Filter by blood group"><option>All blood groups</option><option>O+</option><option>A+</option><option>B+</option><option>AB+</option><option>O-</option></select><button className={`filter-button ${urgencyOnly ? 'selected' : ''}`} onClick={() => setUrgencyOnly(!urgencyOnly)}><SlidersHorizontal />Urgent only</button></div>
            <div className="inventory-table"><div className="table-header"><span>Organ & status</span><span>Compatibility</span><span>Location</span><span>Preservation window</span><span /></div>{filtered.map((item) => <div className="organ-row" key={item.id}><div className="organ-cell"><div className={`organ-symbol ${item.organ.toLowerCase()}`}>{item.organ === 'Heart' ? <HeartPulse /> : <Droplets />}</div><div><strong>{item.organ}</strong><span>{item.id} · {item.donor}</span><StatusBadge status={item.urgency} /></div></div><div><strong className="blood-pill">{item.blood}</strong><span className="cell-muted">Compatible group</span></div><div><strong>{item.location}</strong><span className="cell-muted"><MapPin />{item.distance} away</span></div><div><strong className={item.urgency === 'Critical' ? 'time-critical' : ''}>{item.expires}</strong><span className="cell-muted">{item.preservation}</span></div><button className="request-button" onClick={() => openRequest(item)}>View & request <ArrowUpRight /></button></div>)}{filtered.length === 0 && <div className="empty-state"><Search /><strong>No organs match these filters</strong><span>Try clearing an eligibility or urgency filter.</span></div>}</div>
            <div className="below-grid"><div id="my-requests" className="panel"><div className="panel-head"><div><h2>Recent requests</h2><p>Track your active organ requests</p></div><button className="text-button" onClick={() => navigateTo('My requests')}>View all <ArrowUpRight /></button></div>{requests.slice(0, 3).map((request) => <div className="request-row" key={request.id}><div className="request-icon"><FileText /></div><div className="request-main"><strong>{request.organ} · {request.blood}</strong><span>{request.id} · {request.hospital}</span></div><span className="request-age">{request.age}</span><StatusBadge status={request.status} /></div>)}</div><div id="messages" className="help-card"><div className="help-icon"><ShieldCheck /></div><h3>Need help coordinating?</h3><p>Our transfer desk is available for urgent cases and centre coordination.</p><button className="outline-button">Contact transfer desk <ArrowUpRight /></button></div></div>
          </> : <ProcurementView requests={requests} onConfirm={confirmRequest} />}
          <footer>OrganEase is a coordination prototype for transplant networks. <span>Privacy & compliance</span><span>Support</span><span>v0.8.2</span></footer>
        </div>
      </section>
      {hospitalForm && <HospitalFormDrawer form={hospitalForm} onClose={() => setHospitalForm(null)} onSubmit={submitHospitalForm} />}
      {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><section className="request-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">{selected.id} · {selected.center}</span><h2>Request {selected.organ}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close request"><X /></button></div><div className="drawer-organ"><div className={`organ-symbol large ${selected.organ.toLowerCase()}`}><Droplets /></div><div><strong>{selected.organ} from {selected.location}</strong><span>Verified procurement centre · {selected.distance}</span></div><StatusBadge status={selected.urgency} /></div><div className="detail-grid"><div><span>Blood group</span><strong>{selected.blood}</strong></div><div><span>Window remaining</span><strong className="time-critical">{selected.expires}</strong></div><div><span>Storage method</span><strong>{selected.preservation}</strong></div><div><span>Transfer route</span><strong>Ground · Pune region</strong></div></div><div className="drawer-note"><ShieldCheck /><div><strong>Compatibility pre-check passed</strong><span>Based on the recipient profile for Sahyadri Hospitals. Final clinical approval remains with your transplant team.</span></div></div>{paid ? <div className="payment-success"><Check /><strong>Token payment confirmed</strong><span>Request sent to {selected.center}. The centre will confirm the transfer shortly.</span></div> : <><div className="payment-box"><div><span>Token confirmation payment</span><strong>₹ 2,500</strong></div><span>Refundable if the centre cannot confirm the transfer.</span></div><button className="primary-button full" onClick={() => { setPaid(true); setNotice('Payment confirmed. Your request is now with the procurement centre.') }}>Pay token & continue <ArrowUpRight /></button><button className="text-button full" onClick={submitRequest}>Create request without payment</button></>}</section></div>}
    </main>
  )
}

function ProcurementView({ requests, onConfirm }: { requests: typeof initialRequests; onConfirm: (id: string) => void }) {
  return <><div className="center-hero"><div><p className="eyebrow">Pune regional network · Live</p><h2>Requests to confirm</h2><p>Review hospital requests and confirm available transfers from your centre.</p></div><div className="center-status"><span className="live-dot" />Centre online<strong>12 organs listed</strong></div></div><div className="center-metrics"><div><span>Awaiting confirmation</span><strong>{requests.filter((r) => r.status === 'Awaiting payment').length + 2}</strong><em>Needs review</em></div><div><span>In active transfer</span><strong>04</strong><em>Across the region</em></div><div><span>Centre response time</span><strong>11 min</strong><em>18% faster this week</em></div></div><div className="panel requests-panel"><div className="panel-head"><div><h2>Incoming requests</h2><p>Requests are prioritized by preservation window</p></div><button className="outline-button"><SlidersHorizontal />Filter</button></div>{requests.map((request) => <div className="incoming-row" key={request.id}><div className="priority-bar" data-urgent={request.urgent} /><div className="request-icon"><FileText /></div><div className="request-main"><div><strong>{request.organ} · {request.blood}</strong>{request.urgent && <StatusBadge status="Critical" />}</div><span>{request.id} · {request.hospital} · {request.age}</span></div><div className="incoming-status"><span>Status</span><strong>{request.status}</strong></div>{request.status === 'Awaiting payment' ? <button className="primary-button small" onClick={() => onConfirm(request.id)}>Confirm request <Check /></button> : <span className="confirmed"><Check />Confirmed</span>}</div>)}</div><div className="center-bottom"><div className="panel mini-panel"><div className="panel-head"><div><h2>Storage overview</h2><p>Current centre inventory</p></div><button className="text-button">Manage <ArrowUpRight /></button></div><div className="storage-line"><span>Kidneys</span><strong>08</strong><div><i style={{ width: '62%' }} /></div></div><div className="storage-line"><span>Livers</span><strong>03</strong><div><i style={{ width: '38%' }} /></div></div><div className="storage-line"><span>Other</span><strong>05</strong><div><i style={{ width: '48%' }} /></div></div></div><div className="help-card"><div className="help-icon"><Bell /></div><h3>Keep your centre visible</h3><p>Update storage availability so hospitals can find organs without making calls.</p><button className="outline-button">Update inventory <ArrowUpRight /></button></div></div></>
}

function HospitalFormDrawer({ form, onClose, onSubmit }: { form: HospitalForm; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>, form: HospitalForm) => void }) {
  const availability = form === 'availability'
  return <div className="drawer-backdrop" onClick={onClose}><section className="request-drawer hospital-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Verified hospital portal</span><h2>{availability ? 'Share organ availability' : 'Request an organ'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close form"><X /></button></div><div className="form-trust"><ShieldCheck /><span>Only verified hospitals can submit clinical information to the regional network.</span></div><form className="hospital-form" onSubmit={(event) => onSubmit(event, form)}>{availability ? <><div className="form-grid"><label>Hospital name<input name="hospitalName" placeholder="Sahyadri Hospitals" required /></label><label>Contact person<input name="contactPerson" placeholder="Dr. Ananya Rao" required /></label><label>Contact email<input name="contactEmail" type="email" placeholder="transplant@hospital.org" required /></label><label>Contact phone<input name="contactPhone" type="tel" placeholder="+91 98765 43210" required /></label><label>Organ type<select name="organType" defaultValue="Kidney" required><option>Kidney</option><option>Liver</option><option>Heart</option><option>Lung</option><option>Pancreas</option><option>Cornea</option></select></label><label>Blood group<select name="bloodGroup" defaultValue="O+" required><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></label><label>Donor age<input name="donorAge" type="number" min="0" max="120" placeholder="42" required /></label><label>Donor gender<select name="donorGender" defaultValue="Not specified" required><option>Female</option><option>Male</option><option>Intersex</option><option>Not specified</option></select></label><label>Availability status<select name="availabilityStatus" defaultValue="Available" required><option>Available</option><option>Pending verification</option><option>Reserved</option><option>Unavailable</option></select></label><label>Location<input name="location" placeholder="Pune Procurement Centre" required /></label><label>Available date<input name="availableDate" type="date" required /></label><label>Available time<input name="availableTime" type="time" required /></label></div><label>Medical and compatibility details<textarea name="compatibilityDetails" placeholder="HLA markers, tissue match, infectious disease screening, and other clinical details" required /></label><label className="file-field">Medical report<input name="medicalReport" type="file" accept=".pdf,.png,.jpg,.jpeg" required /><span><Upload />Choose PDF or image report</span></label><label>Additional notes<textarea name="notes" placeholder="Transport, preservation, or coordination notes" /></label></> : <><div className="form-grid"><label>Hospital name<input name="hospitalName" placeholder="Sahyadri Hospitals" required /></label><label>Contact details<input name="contactDetails" placeholder="transplant@hospital.org / +91 98765 43210" required /></label><label>Patient ID<input name="patientId" placeholder="PT-20481" required /></label><label>Required organ<select name="requiredOrgan" defaultValue="Kidney" required><option>Kidney</option><option>Liver</option><option>Heart</option><option>Lung</option><option>Pancreas</option><option>Cornea</option></select></label><label>Blood group<select name="bloodGroup" defaultValue="O+" required><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></label><label>Urgency<select name="urgency" defaultValue="Priority" required><option>Critical</option><option>Priority</option><option>Routine</option></select></label></div><label>Compatibility details<textarea name="compatibilityDetails" placeholder="HLA profile, crossmatch status, medical history, and recipient requirements" required /></label><label>Additional notes<textarea name="notes" placeholder="Preferred location, timing, or transport requirements" /></label></>}<div className="form-actions"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{availability ? 'Submit availability' : 'Submit organ request'} <ArrowUpRight /></button></div></form></section></div>
}

function SignInPage({ email, password, onEmailChange, onPasswordChange, onSubmit }: { email: string; password: string; onEmailChange: (value: string) => void; onPasswordChange: (value: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <main className="auth-shell"><section className="auth-panel"><div className="brand auth-brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div><div className="auth-copy"><p className="eyebrow">Transplant coordination, simplified</p><h1>Welcome back</h1><p>Sign in to find compatible organs and keep urgent transfers moving.</p></div><form className="auth-form" onSubmit={onSubmit}><label htmlFor="email">Work email</label><div className="auth-input"><Mail /><input id="email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} required /></div><label htmlFor="password">Password</label><div className="auth-input"><LockKeyhole /><input id="password" type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} required /></div><button className="primary-button auth-submit" type="submit">Sign in <ArrowUpRight /></button></form><p className="auth-demo"><ShieldCheck /> Demo access is enabled. Use any valid email and password.</p></section><aside className="auth-aside"><div className="auth-aside-mark"><HeartPulse /></div><h2>Every minute matters.</h2><p>One connected workspace for recipients, hospitals, and procurement centres.</p><div className="auth-stat"><strong>24</strong><span>organs available nearby</span></div></aside></main>
}
