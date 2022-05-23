import Group from "src/models/group"
import { NextApiRequest, NextApiResponse } from "next"

export const write = async (req: NextApiRequest, res: NextApiResponse) => {
  const group = new Group(req.body)

  await group.save()
}

export const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const groups = await Group.find().exec()
  
  res.status(200).send({ data: groups })
}
