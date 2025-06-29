import mongoose from 'mongoose'
export const connectDatabase = () =>
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    serverSelectionTimeoutMS: 10000
  })
