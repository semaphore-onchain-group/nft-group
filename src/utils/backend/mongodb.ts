import mongoose from "mongoose"
import getNextConfig from "next/config"
import { NextApiRequest, NextApiResponse } from "next"

export async function connectToDatabase(
  _req: NextApiRequest,
  _res: NextApiResponse,
  next: () => void
) {
  const mongoURL = getNextConfig().publicRuntimeConfig.mongoURL
  const connectionState = mongoose.connection.readyState

  if (!mongoURL || !!connectionState) return

  await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connected to MongoDB")
    })
    .catch((e) => {
      console.error(e)
    })

  next()
}
