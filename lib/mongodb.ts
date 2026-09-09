import { MongoClient } from 'mongodb'

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

export default async function getMongoClient() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI environment variable')

  const existingClientPromise = globalWithMongo._mongoClientPromise
  if (existingClientPromise) return existingClientPromise

  const promise = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 10000,
    maxPoolSize: 10,
  }).connect()

  globalWithMongo._mongoClientPromise = promise
  promise.catch(() => {
    if (globalWithMongo._mongoClientPromise === promise) delete globalWithMongo._mongoClientPromise
  })

  return promise
}
