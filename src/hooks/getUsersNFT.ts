import { useCallback, useState } from "react"
import getNextConfig from "next/config"
import { createAlchemyWeb3 } from "@alch/alchemy-web3"

const alchemyKey = getNextConfig().publicRuntimeConfig.alchemyKey
const web3 = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,)

type ReturnParameters = {
    usersNftList: (account: string) => Promise<string[] | null>
}

export default function getUsersNFT(): ReturnParameters {

    const usersNftList = useCallback(
        async (account: string): Promise<string[] | null> => {
            const nfts = await web3.alchemy.getNfts({owner: account})
            const nftList = []
            for(const nft of nfts.ownedNfts){
              nftList.push(nft.title)
            }
            return nftList
        },[]
    )

    return {
        usersNftList
    }
}