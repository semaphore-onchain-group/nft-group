import { useCallback, useState } from "react"
import getNextConfig from "next/config"
import { createAlchemyWeb3, Nft } from "@alch/alchemy-web3"
import request from "./request"
import { Group, GroupType } from "src/types/group"

const alchemyKey = getNextConfig().publicRuntimeConfig.alchemyKey
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
)

type ReturnParameters = {
  usersNftList: (account: string) => Promise<Nft[] | null>
  checkUsersStatus: (account: string, grouptype: GroupType ,nft: Nft) => Promise<boolean | null>
  checkGroupsStatus: (grouptype: GroupType, nft: Nft) => Promise<boolean| null>
  groupstatusMsg?: string
}

export default function getUsersNFT(): ReturnParameters {
  const [_message, setGroupStatusMsg] = useState<string>("")

  const usersNftList = useCallback(
    async (account: string): Promise<Nft[] | null> => {
      const nfts = await web3.alchemy.getNfts({ owner: account })

      const nftList = nfts.ownedNfts
        .map((nft) => {
          const title = nft.title.includes("#")
            ? nft.title.substring(0, nft.title.indexOf("#"))
            : nft.title

          return { ...nft, title }
        })
        .filter((nft) => nft.title.length >= 2)

      return nftList
    },
    []
  )

  const checkUsersStatus = useCallback(
    async (account: string, groupType: GroupType , nft: Nft): Promise<boolean | null> => {
    if(groupType === GroupType.POH)
      {
        const minted = await web3.alchemy.getAssetTransfers({
          fromBlock: "0x0",
          fromAddress: "0x0000000000000000000000000000000000000000",
          toAddress: account,
          contractAddresses:[nft.contract.address],
          excludeZeroValue: true
        })

        return !!minted.transfers.length
      }
    //General nft time Holding check at least one day before the current time  
    else if(groupType === GroupType.GENERAL)
      {
        const timestamp = (new Date(nft.timeLastUpdated)).getTime()
        const timespend_sec = Math.floor((Date.now() - timestamp)/1000)
        if(timespend_sec > 86400){
          return true
        }else{
          return false
        }
      }
    else
    {
      return false
    }
    },[]
  )

  const checkGroupsStatus = useCallback(
    async (grouptype: GroupType, nft: Nft): Promise<boolean | null> => {
      const response = await request('/api/groups') as Group[]
      const filteredResponse = response.filter(nftgroup => nftgroup.contract.includes(nft.contract.address))

      if(filteredResponse.length > 1){
        setGroupStatusMsg("Both groups general and poh have already been created.")
        return false
      }

      const isGroupExist = filteredResponse.find(group => group.groupType === grouptype)
      const message = isGroupExist
        ? `${grouptype.toLowerCase()} group has already been created.`
        : `you can create a ${grouptype.toLowerCase()} group for this nft.`

      setGroupStatusMsg(message)
      return !isGroupExist
    },[]
  )

  return {
    usersNftList,
    checkUsersStatus,
    checkGroupsStatus,
    groupstatusMsg: _message
  }
}
