'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, HeartPulse, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)

  return <main className="profile-page"><section className="profile-page-inner"><Link className="text-button" href="/"><ArrowLeft /> Back to dashboard</Link><div className="profile-page-heading"><div className="profile-large-avatar">AK</div><div><p className="eyebrow">OrganEase member</p><h1>My profile</h1><p>Manage your account details and communication preferences.</p></div></div>{saved && <div className="profile-success"><Check /><span>Profile changes saved successfully.</span></div>}<form className="profile-card" onSubmit={(event) => { event.preventDefault(); setSaved(true) }}><div className="profile-card-head"><div><h2>Personal information</h2><p>Keep your contact details up to date.</p></div><UserRound /></div><div className="profile-form-grid"><label>Full name<input defaultValue="Arjun Kapoor" required /></label><label>Role<select defaultValue="Recipient"><option>Recipient</option><option>Hospital coordinator</option><option>Procurement centre</option></select></label><label><Mail />Email address<input type="email" defaultValue="arjun.kapoor@example.com" required /></label><label><Phone />Phone number<input type="tel" defaultValue="+91 98765 43210" required /></label><label className="profile-form-wide"><MapPin />Location<input defaultValue="Pune, Maharashtra" required /></label></div><div className="profile-card-section"><h2>Notifications</h2><label className="profile-check"><input type="checkbox" checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} /><span><strong>Email updates</strong><small>Receive updates about requests, transfers, and account activity.</small></span></label></div><div className="profile-actions"><Link className="text-button" href="/">Cancel</Link><button className="primary-button" type="submit">Save changes <Check /></button></div></form><p className="auth-demo"><ShieldCheck /> Your profile information is protected and shared only with verified network members.</p></section></main>
}
