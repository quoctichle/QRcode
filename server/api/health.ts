export default defineEventHandler(async (event) => {
  try {
    const mongoose = await import('mongoose')
    
    if (mongoose.default.connection.readyState === 1) {
      return {
        status: 'connected',
        message: 'MongoDB is connected successfully',
        database: mongoose.default.connection.name,
      }
    } else {
      return {
        status: 'disconnected',
        message: 'MongoDB is not connected',
      }
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to check MongoDB connection',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
