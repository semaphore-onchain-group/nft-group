import { useCallback } from "react"
import getNextConfig from "next/config"
import { createAlchemyWeb3, Nft } from "@alch/alchemy-web3"

const alchemyKey = getNextConfig().publicRuntimeConfig.alchemyKey
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
)

type ReturnParameters = {
  usersNftList: (account: string) => Promise<Nft[] | null>
  checkUsersStatus: (account: string, grouptype: string ,nft: Nft) => Promise<boolean | null>
}

export default function getUsersNFT(): ReturnParameters {
  // Todo: add DB to find existing group
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

  return {
    usersNftList,
    checkUsersStatus
  }
}
