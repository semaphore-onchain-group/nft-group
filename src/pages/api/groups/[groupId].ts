import nc from "next-connect"
import { read } from "src/controllers/groups.ctrl"
import { NextApiRequest, NextApiResponse } from "next"

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) =>
  read(req, res)
)

export default handler
