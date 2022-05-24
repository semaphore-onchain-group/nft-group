import Group from "src/models/group"
import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "src/utils/backend/mongodb"

export const write = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const group = new Group(req.body)

  await group.save()
}

export const list = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const groups = await Group.find().exec()
  
  res.status(200).send({ data: groups })
}
