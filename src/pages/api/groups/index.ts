import nc from "next-connect"
import { write, list, read, update } from "src/controllers/groups.ctrl"
import { NextApiRequest, NextApiResponse } from "next"

const handler = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => write(req, res))
  .get(async (req: NextApiRequest, res: NextApiResponse) => list(req, res))
  .patch(async (req: NextApiRequest, res: NextApiResponse) => update(req, res))
export default handler
