import nc from "next-connect"
import { read } from "src/controllers/groups.ctrl"
import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "src/utils/backend/mongodb"

const handler = nc()
  .use(connectToDatabase)
  .get(async (req: NextApiRequest, res: NextApiResponse) => read(req, res))

export default handler
