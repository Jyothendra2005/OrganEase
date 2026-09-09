import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import getMongoClient from '@/lib/mongodb'

function withTimeout<T>(promise: Promise<T>, milliseconds: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Database request timed out')), milliseconds)),
  ])
}

export async function GET() {
  try {
    const client = await getMongoClient()
    const collection = client.db(process.env.MONGODB_DB ?? 'organease').collection('availability')
    const availability = (await collection.find({}).sort({ createdAt: -1 }).toArray()).map(({ _id, ...item }) => ({ id: item.id ?? _id.toString(), ...item }))
    return NextResponse.json(availability)
  } catch {
    return NextResponse.json({ error: 'Unable to load availability' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'A valid availability payload is required' }, { status: 400 })
    }

    const fields = ['hospitalName', 'contactPerson', 'contactEmail', 'contactPhone', 'organType', 'bloodGroup', 'location', 'availableDate', 'compatibilityDetails'] as const
    const values = Object.fromEntries(fields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : ''])) as Record<(typeof fields)[number], string>
    const missingField = fields.find((field) => !values[field])
    if (missingField) return NextResponse.json({ error: `${missingField} is required` }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) return NextResponse.json({ error: 'A valid contact email is required' }, { status: 400 })
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.availableDate) || Number.isNaN(Date.parse(`${values.availableDate}T00:00:00`))) {
      return NextResponse.json({ error: 'A valid available date is required' }, { status: 400 })
    }

    const availability = { id: `AVL-${Date.now().toString().slice(-8)}`, ...values, status: 'Pending verification', createdAt: new Date() }
    await withTimeout((async () => {
      const client = await getMongoClient()
      const collection = client.db(process.env.MONGODB_DB ?? 'organease').collection('availability')
      await collection.insertOne(availability)
    })(), 12000)

    return NextResponse.json({ id: availability.id, message: 'Availability submitted for verification' }, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    console.error('[availability] submission failed', error instanceof Error ? error.message : 'Unknown database error')
    return NextResponse.json({ error: 'Unable to submit availability. Please try again.' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Availability id is required' }, { status: 400 })

    const client = await getMongoClient()
    const database = client.db(process.env.MONGODB_DB ?? 'organease')
    const availabilityCollection = database.collection('availability')
    const inventoryCollection = database.collection('inventory')
    const query = ObjectId.isValid(id) ? { $or: [{ id }, { _id: new ObjectId(id) }] } : { id }
    const item = await availabilityCollection.findOne(query)
    if (!item) return NextResponse.json({ error: 'Availability record not found' }, { status: 404 })

    await availabilityCollection.updateOne({ _id: item._id }, { $set: { status: 'Available', verifiedAt: new Date() } })
    const inventoryItem = {
      id: `ORG-${Date.now().toString().slice(-8)}`,
      availabilityId: item.id ?? item._id.toString(),
      organ: item.organType,
      donor: 'Anonymous donor',
      blood: item.bloodGroup,
      location: item.location,
      distance: 'Regional centre',
      preservation: 'Pending clinical verification',
      expires: '24h',
      urgency: 'Priority',
      center: item.hospitalName,
    }
    await inventoryCollection.updateOne({ availabilityId: inventoryItem.availabilityId }, { $setOnInsert: inventoryItem }, { upsert: true })
    return NextResponse.json({ id: item.id ?? item._id.toString(), status: 'Available', inventoryId: inventoryItem.id })
  } catch {
    return NextResponse.json({ error: 'Unable to verify availability' }, { status: 500 })
  }
}
