import { useCallback } from "react"
import getNextConfig from "next/config"
import { createAlchemyWeb3, Nft } from "@alch/alchemy-web3"

const alchemyKey = getNextConfig().publicRuntimeConfig.alchemyKey
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
)

type ReturnParameters = {
  usersNftList: (account: string) => Promise<Nft[] | null>
}

export default function getUsersNFT(): ReturnParameters {
  //add DB to find existing group
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

  return {
    usersNftList
  }
}
