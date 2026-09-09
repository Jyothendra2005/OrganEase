import { NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import { demoInventory } from '@/lib/demo-data'

export async function GET() {
  try {
    const client = await getMongoClient()
    const collection = client.db(process.env.MONGODB_DB ?? 'organease').collection('inventory')
    if (await collection.countDocuments() === 0) await collection.insertMany(demoInventory)
    const inventory = await collection.find({}, { projection: { _id: 0 } }).toArray()
    return NextResponse.json(inventory)
  } catch {
    return NextResponse.json({ error: 'Unable to load inventory' }, { status: 500 })
  }
}