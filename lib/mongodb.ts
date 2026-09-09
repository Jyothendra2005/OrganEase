import { MongoClient } from 'mongodb'

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

export default async function getMongoClient() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI environment variable')

  const existingClientPromise = globalWithMongo._mongoClientPromise
  if (existingClientPromise) return existingClientPromise

  const promise = new MongoClient(uri).connect()
  if (process.env.NODE_ENV !== 'production') globalWithMongo._mongoClientPromise = promise
  return promise
}