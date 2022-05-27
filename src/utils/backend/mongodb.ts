import mongoose from "mongoose"
import getNextConfig from "next/config"

export async function connectToDatabase() {
  const mongoURL = getNextConfig().publicRuntimeConfig.mongoURL
  const connectionState = mongoose.connection.readyState

  if (!mongoURL || !!connectionState) return

  const db = await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connected to MongoDB")
    })
    .catch((e) => {
      console.error(e)
    })
}
