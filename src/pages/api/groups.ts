import nc from "next-connect"
import { write, list } from "src/controllers/groups.ctrl"
import { NextApiRequest, NextApiResponse } from "next"

const handler = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => write(req, res))
  .get(async (req: NextApiRequest, res: NextApiResponse) => list(req, res))

export default handler
