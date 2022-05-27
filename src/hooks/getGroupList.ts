import request from "./request"

export default async function getGroupList() {

  const groupList = await request("/api/groups")

  return groupList
}