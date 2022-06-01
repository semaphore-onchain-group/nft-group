import nc from "next-connect"
import { write, list, update } from "src/controllers/groups.ctrl"
import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "src/utils/backend/mongodb"

const handler = nc()
  .use(connectToDatabase)
  .post(async (req: NextApiRequest, res: NextApiResponse) => write(req, res))
  .get(async (req: NextApiRequest, res: NextApiResponse) => list(req, res))
  .patch(async (req: NextApiRequest, res: NextApiResponse) => update(req, res))
export default handler
