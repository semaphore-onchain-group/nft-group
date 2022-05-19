import { GroupType } from "src/types/group"
import logo from "src/img/logo.png"

const groupListForTest: GroupType[] = [
  { index: 1, groupName: "Group1", imgSrc: logo },
  { index: 2, groupName: "Group2", imgSrc: logo },
  { index: 3, groupName: "Group3", imgSrc: logo },
  { index: 4, groupName: "Group4", imgSrc: logo },
  { index: 5, groupName: "Group5", imgSrc: logo },
  { index: 6, groupName: "Group6", imgSrc: logo },
  { index: 7, groupName: "Group7", imgSrc: logo }
]

export default function getGroupList() {
  return groupListForTest
}
