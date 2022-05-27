import mongoose from "mongoose"
import { Group as GroupType } from "src/types/group"

const { Schema } = mongoose

interface IGroup extends GroupType {
  members: Array<string>
  members2: Array<string>
}

const GroupSchema = new Schema<IGroup>({
  groupId: String,
  name: String,
  thumbnailImg: String,
  contract: String,
  groupType: String,
  members: { type: [String] },
})

const Group =
  mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema)
export default Group
