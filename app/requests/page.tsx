import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, FileText, HeartPulse, ShieldCheck } from 'lucide-react'

const requests = [
	{ id: 'REQ-2094', organ: 'Kidney', blood: 'O+', hospital: 'Sahyadri Hospitals', age: '8 min ago', status: 'Awaiting payment', urgent: true },
	{ id: 'REQ-2091', organ: 'Liver', blood: 'A+', hospital: 'Ruby Hall Clinic', age: '42 min ago', status: 'Confirmed', urgent: false },
	{ id: 'REQ-2088', organ: 'Heart', blood: 'B+', hospital: 'Noble Hospital', age: '1 hr ago', status: 'In transit', urgent: true },
]

function statusClass(status: string) {
	return status === 'Awaiting payment' ? 'status-critical' : status === 'In transit' ? 'status-priority' : 'status-routine'
}

export default function RequestsPage() {
	return <main className="auth-shell requests-shell"><section className="auth-panel requests-page"><Link className="text-button" href="/"><ArrowLeft /> Back to dashboard</Link><div className="brand auth-brand"><div className="brand-mark"><HeartPulse /></div><span>Organ<span className="brand-accent">Ease</span></span></div><div className="auth-copy"><p className="eyebrow">Recipient workspace</p><h1>My requests</h1><p>Track every request and stay up to date on active transfers.</p></div><div className="panel requests-list">{requests.map((request) => <div className="request-entry" key={request.id}><div className="request-row"><div className="request-icon"><FileText /></div><div className="request-main"><strong>{request.organ} · {request.blood}</strong><span>{request.id} · {request.hospital}</span></div><span className="request-age">{request.age}</span><span className={`status-badge ${statusClass(request.status)}`}><span className="status-dot" />{request.status}</span>{request.urgent && <span className="request-urgent">Urgent</span>}</div>{request.status === 'Confirmed' && <div className="request-confirmation"><ShieldCheck /><span><strong>Request confirmed.</strong> The procurement centre accepted this transfer and your transplant team has been notified.</span></div>}</div>)}</div><Link className="primary-button" href="/request">Create new request <ArrowUpRight /></Link><p className="auth-demo"><ShieldCheck /> Request updates are shared with your transplant coordination team.</p></section></main>
}
