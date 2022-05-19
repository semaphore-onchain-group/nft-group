import { GroupType } from "../types/group"
import logo from "../img/logo.png"

const groupListForTest: GroupType[] = [
  { groupName: "Group1", imgSrc: logo },
  { groupName: "Group2", imgSrc: logo },
  { groupName: "Group3", imgSrc: logo },
  { groupName: "Group4", imgSrc: logo },
  { groupName: "Group5", imgSrc: logo },
  { groupName: "Group6", imgSrc: logo },
  { groupName: "Group7", imgSrc: logo }
]

export default function getGroupList() {
  return groupListForTest
}
