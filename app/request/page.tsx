'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, HeartPulse, ShieldCheck } from 'lucide-react'

export default function RequestPage() {
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget).entries())
    const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ organ: values.requiredOrgan, blood: values.bloodGroup, hospital: values.hospitalName, ...values }) })
    if (response.ok) window.alert('Organ request submitted to the regional network.')
    else window.alert('Unable to submit the organ request.')
  }

  return <main className="auth-shell form-page-shell"><section className="auth-panel form-page-panel"><Link className="text-button" href="/"><ArrowLeft /> Back to dashboard</Link><div className="brand auth-brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div><div className="auth-copy"><p className="eyebrow">Recipient request portal</p><h1>Request an organ</h1><p>Send a clinical request to the verified regional procurement network.</p></div><form className="hospital-form" onSubmit={submit}><div className="form-grid"><label>Hospital name<input name="hospitalName" required placeholder="Sahyadri Hospitals" /></label><label>Contact details<input name="contactDetails" required placeholder="transplant@hospital.org / +91 98765 43210" /></label><label>Patient ID<input name="patientId" required placeholder="PT-20481" /></label><label>Required organ<select name="requiredOrgan" defaultValue="Kidney"><option>Kidney</option><option>Liver</option><option>Heart</option><option>Lung</option><option>Pancreas</option></select></label><label>Blood group<select name="bloodGroup" defaultValue="O+"><option>O+</option><option>O-</option><option>A+</option><option>B+</option><option>AB+</option></select></label><label>Urgency<select name="urgency" defaultValue="Priority"><option>Critical</option><option>Priority</option><option>Routine</option></select></label></div><label>Compatibility details<textarea name="compatibilityDetails" required placeholder="HLA profile, crossmatch status, medical history, and recipient requirements" /></label><div className="form-actions"><Link className="text-button" href="/">Cancel</Link><button type="submit" className="primary-button">Submit organ request <ArrowUpRight /></button></div></form><p className="auth-demo"><ShieldCheck /> Your request is shared only with verified procurement centres.</p></section></main>
}