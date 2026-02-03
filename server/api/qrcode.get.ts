import { QRCode } from '~/server/models/QRCode'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

  try {
    const qrCodes = await QRCode.find().sort({ createdAt: -1 })

    return {
      success: true,
      count: qrCodes.length,
      data: qrCodes,
    }
  } catch (error) {
    console.error('Error fetching QR codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${error.message}`,
    })
  }
})
