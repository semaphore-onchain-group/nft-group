import mongoose from "mongoose"
import { Group as IGroup } from "src/types/group"

const { Schema } = mongoose

const GroupSchema = new Schema<IGroup>({
  groupId: String,
  name: String,
  thumbnailImg: String,
  contract: String,
  memberCount: Number,
  groupType: String
})

const Group =
  mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema)
export default Group
