import { useCallback, useState } from "react"
import getNextConfig from "next/config"
import { createAlchemyWeb3, Nft } from "@alch/alchemy-web3"
import request from "./request"
import { IGroup } from "src/models/group"

const alchemyKey = getNextConfig().publicRuntimeConfig.alchemyKey
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
)

type ReturnParameters = {
  usersNftList: (account: string) => Promise<Nft[] | null>
  checkUsersStatus: (account: string, grouptype: string ,nft: Nft) => Promise<boolean | null>
  checkGroupsStatus: (grouptype: string, nft: Nft) => Promise<boolean| null>
  groupstatusMsg?: string
}

export default function getUsersNFT(): ReturnParameters {
  const [_message, setGroupStatusMsg] = useState<string>()

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
    async (account: string, grouptype: string , nft: Nft): Promise<boolean | null> => {
    if(grouptype === "poh")
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
    else
      {
        const timestamp = (new Date(nft.timeLastUpdated)).getTime()
        const timespend_sec = Math.floor((Date.now() - timestamp)/1000)
        if(timespend_sec > 86400){
          return true
        }else{
          return false
        }
      }
    },[]
  )

  const checkGroupsStatus = useCallback(
    async (grouptype: string, nft: Nft): Promise<boolean | null> => {
      const response = await request('/api/groups') as IGroup[]
      const filteredResponse = response.filter(nftgroup => nftgroup.contract.includes(nft.contract.address))
      
      if(filteredResponse.length > 1){
        setGroupStatusMsg("Both groups general and poh have already been created.")
        return false
      }

      if(grouptype === "poh")
      {
        if(filteredResponse.length && filteredResponse.at(0)?.isPOH){
          setGroupStatusMsg("poh group has already been created.")
          return false
        }else{
          setGroupStatusMsg("you can create a poh group for this nft.")
          return true
        }
      }
      //General group
      else
      {
        if(filteredResponse.length && !filteredResponse.at(0)?.isPOH){
          setGroupStatusMsg("general group has already been created.")
          return false
        }else{
          setGroupStatusMsg("you can create a general group for this nft.")
          return true
        }
      }
    },[]
  )

  return {
    usersNftList,
    checkUsersStatus,
    checkGroupsStatus,
    groupstatusMsg: _message
  }
}
