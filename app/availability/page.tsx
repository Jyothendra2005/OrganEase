'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, HeartPulse, ShieldCheck } from 'lucide-react'

export default function AvailabilityPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error ?? 'Unable to submit organ availability.')
      }

      window.alert(result?.message ?? 'Organ availability submitted for verification.')
      form.reset()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to submit organ availability.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="auth-shell form-page-shell"><section className="auth-panel form-page-panel"><Link className="text-button" href="/"><ArrowLeft /> Back to dashboard</Link><div className="brand auth-brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div><div className="auth-copy"><p className="eyebrow">Verified hospital portal</p><h1>Share organ availability</h1><p>Submit a verified organ listing to the regional transplant network.</p></div><form className="hospital-form" onSubmit={submit}><div className="form-grid"><label>Hospital name<input name="hospitalName" required placeholder="Sahyadri Hospitals" /></label><label>Contact person<input name="contactPerson" required placeholder="Dr. Ananya Rao" /></label><label>Contact email<input name="contactEmail" required type="email" placeholder="transplant@hospital.org" /></label><label>Contact phone<input name="contactPhone" required type="tel" placeholder="+91 98765 43210" /></label><label>Organ type<select name="organType" defaultValue="Kidney"><option>Kidney</option><option>Liver</option><option>Heart</option><option>Lung</option><option>Pancreas</option></select></label><label>Blood group<select name="bloodGroup" defaultValue="O+"><option>O+</option><option>O-</option><option>A+</option><option>B+</option><option>AB+</option></select></label><label>Location<input name="location" required placeholder="Pune Procurement Centre" /></label><label>Available date<input name="availableDate" required type="date" /></label></div><label>Medical and compatibility details<textarea name="compatibilityDetails" required placeholder="HLA markers, crossmatch status, and clinical details" /></label><div className="form-actions"><Link className="text-button" href="/">Cancel</Link><button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit availability'} {!isSubmitting && <ArrowUpRight />}</button></div></form><p className="auth-demo"><ShieldCheck /> Only verified hospitals can submit clinical information.</p></section></main>
}
