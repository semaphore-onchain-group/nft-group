import { GroupType } from "../types/group"

const groupListForTest: GroupType[] = [
    {groupName:"Group1"},
    {groupName:"Group2"},
    {groupName:"Group3"},
    {groupName:"Group4"},
    {groupName:"Group5"},
    {groupName:"Group6"},
    {groupName:"Group7"},
]

export default function getGroupList() {
    return groupListForTest
}