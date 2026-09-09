import { NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import { demoRequests } from '@/lib/demo-data'

async function requestsCollection() {
  const client = await getMongoClient()
  return client.db(process.env.MONGODB_DB ?? 'organease').collection('requests')
}

export async function GET() {
  try {
    const collection = await requestsCollection()
    if (await collection.countDocuments() === 0) await collection.insertMany(demoRequests)
    const requests = await collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(requests)
  } catch {
    return NextResponse.json({ error: 'Unable to load requests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.organ || !body.blood || !body.hospital) return NextResponse.json({ error: 'Organ, blood group, and hospital are required' }, { status: 400 })
    const collection = await requestsCollection()
    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      organ: body.organ,
      blood: body.blood,
      hospital: body.hospital,
      age: 'Just now',
      status: 'Awaiting payment',
      urgent: body.urgent === true,
      createdAt: new Date(),
    }
    await collection.insertOne(newRequest)
    const { createdAt, ...response } = newRequest
    return NextResponse.json(response, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unable to create request' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const collection = await requestsCollection()
    const result = await collection.updateOne({ id: body.id }, { $set: { status: 'Confirmed' } })
    if (!result.matchedCount) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    return NextResponse.json({ id: body.id, status: 'Confirmed' })
  } catch {
    return NextResponse.json({ error: 'Unable to update request' }, { status: 500 })
  }
}