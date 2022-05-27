import { Wallet, providers } from "ethers"
import getNextConfig from "next/config"
import { GroupType } from "src/types/group"

const GENERAL_ADMIN = getNextConfig().publicRuntimeConfig.generalAdminPrivateKey
const POH_ADMIN = getNextConfig().publicRuntimeConfig.pohAdminPrivateKey
const POAP_ADMIN = getNextConfig().publicRuntimeConfig.poapAdminPrivateKey

const ADMIN_PRIVATE_KEY = {
  [GroupType.GENERAL]: GENERAL_ADMIN,
  [GroupType.POH]: POH_ADMIN,
  [GroupType.POAP]: POAP_ADMIN
} as const

const provider = new providers.JsonRpcProvider(
  `https://kovan.infura.io/v3/${
    getNextConfig().publicRuntimeConfig.infuraApiKey
  }` // kovan
)

export function getGroupAdmin(groupType: GroupType): Wallet | undefined {
  const adminPrivateKey = ADMIN_PRIVATE_KEY[groupType]

  return adminPrivateKey && new Wallet(adminPrivateKey, provider)
}
