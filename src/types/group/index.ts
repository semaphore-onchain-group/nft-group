export interface Group {
  groupId: string
  name: string
  thumbnailImg: string
  contract: string
  memberCount: number
  groupType: GroupType
}
export enum GroupType {
  POH = "POH",
  GENERAL = "GENERAL"
}
