import Group from "src/models/group"
import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "src/utils/backend/mongodb"

export const write = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const group = new Group(req.body)

  try {
    await group.save()

    res.status(200).end()
  } catch (e) {
    res.status(500).end()
  }
}

export const list = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const groups = (await Group.find().exec()).map((group) => ({
    ...group._doc,
    memberCount: group.members?.length
  }))

  res.status(200).send({ data: groups })
}

export const read = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const groupId = req.query.groupId
  const group = await Group.findOne({ groupId }).exec()

  res
    .status(200)
    .send({ data: { ...group._doc, memberCount: group.members?.length } })
}

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  const { groupId, identityCommitment } = req.body

  try {
    identityCommitment &&
      (await Group.updateOne(
        { groupId },
        {
          $addToSet: { members: [identityCommitment] }
        }
      ).exec())

    res.status(200).end()
  } catch (e) {
    res.status(500).end()
  }
}
