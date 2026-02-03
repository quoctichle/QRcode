import { QRCode } from '~/server/models/QRCode'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

  try {
    const body = await readBody(event)
    const { gmail, url, qrCode } = body

    if (!gmail || !url || !qrCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: gmail, url, qrCode',
      })
    }

    const newQRCode = new QRCode({
      gmail,
      url,
      qrCode,
      createdAt: new Date(),
    })

    await newQRCode.save()

    return {
      success: true,
      message: 'QR Code saved successfully',
      data: newQRCode,
    }
  } catch (error) {
    console.error('Error saving QR code:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${error.message}`,
    })
  }
})
