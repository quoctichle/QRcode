import mongoose from 'mongoose'

const qrCodeSchema = new mongoose.Schema({
  gmail: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})

export const QRCode = mongoose.model('QRCode', qrCodeSchema)
