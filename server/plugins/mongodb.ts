import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const mongodbUri = config.mongodbUri

  if (!mongodbUri) {
    console.warn('MONGODB_URI environment variable is not defined - MongoDB connection skipped')
    return
  }

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected')
      return
    }

    // Connect to MongoDB
    await mongoose.connect(mongodbUri)
    console.log('MongoDB connected successfully')
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
  }
})
