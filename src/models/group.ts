import mongoose from "mongoose"

const { Schema } = mongoose

export interface IGroup {
  groupId: string
  name: string
  thumbnailImg: string
  contract: string
  memberCount: number
  isPOH: boolean
}

const GroupSchema = new Schema<IGroup>({
  groupId: String,
  name: String,
  thumbnailImg: String,
  contract: String,
  memberCount: Number,
  isPOH: Boolean
})

const Group = mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema)
export default Group
