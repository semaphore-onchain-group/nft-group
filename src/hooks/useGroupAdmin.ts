import { Wallet, providers } from "ethers"
import getNextConfig from "next/config"

const GENERAL_ADMIN = getNextConfig().publicRuntimeConfig.generalAdminPrivateKey
const POH_ADMIN = getNextConfig().publicRuntimeConfig.pohAdminPrivateKey

const provider = new providers.JsonRpcProvider(
  `https://kovan.infura.io/v3/${
    getNextConfig().publicRuntimeConfig.infuraApiKey
  }` // kovan
)

function connectAdminWallet(adminPrivateKey: string): Wallet | undefined {
  const wallet = adminPrivateKey && new Wallet(adminPrivateKey, provider)
  if (wallet) {
    return wallet
  }
}

type ReturnParameters = {
  getGroupAdmin: (groupType: string) => Promise<Wallet | undefined>
}

export default function useGroupAdmin(): ReturnParameters {
  async function getGroupAdmin(groupType: string) {
    if (groupType === "general") {
      return connectAdminWallet(GENERAL_ADMIN)
    } else if (groupType === "poh") {
      return connectAdminWallet(POH_ADMIN)
    }
  }

  return { getGroupAdmin }
}
