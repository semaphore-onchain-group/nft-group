import mongoose from "mongoose"

const { Schema } = mongoose

interface IGroup {
  name: string
  thumbnailImg: string
  contract: string
  memberCount: number
  isPOH: boolean
}

const GroupSchema = new Schema<IGroup>({
  name: String,
  thumbnailImg: String,
  contract: String,
  memberCount: Number,
  isPOH: Boolean
})

const Group = mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema)
export default Group
