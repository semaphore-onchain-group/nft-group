export interface Group {
  groupId: string
  name: string
  thumbnailImg: string
  contract: string
  memberCount: number
  groupType: GroupType
}
export enum GroupType {
  GENERAL = "GENERAL",
  POH = "POH",
  POAP = "POAP"
}
