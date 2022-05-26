import { useCallback, useState } from "react"
import { Signer, Contract, providers, Wallet, utils } from "ethers"
import createIdentity from "src/utils/createIdentity"
import Semaphore_contract from "contract-artifacts/Semaphore.json"
import onchainAPI from "./OnchainAPI"
import getNextConfig from "next/config"
import { generateMerkleProof } from "@zk-kit/protocols"
import useGroupAdmin from "./useGroupAdmin"
import { Nft } from "@alch/alchemy-web3"
import request from "./request"
import { AxiosRequestConfig } from "axios"
import { Bytes32, Uint256 } from 'soltypes'
import { GroupType } from "src/types/group"

const provider = new providers.JsonRpcProvider(
  `https://kovan.infura.io/v3/${
    getNextConfig().publicRuntimeConfig.infuraApiKey
  }` // kovan
)
const SemaphoreContract = new Contract(
  "0x19722446e775d86f2585954961E23771d8758793",
  Semaphore_contract.abi,
  provider
)

const DEPTH = 20

type ReturnParameters = {
  createNftGroup: (nft: Nft, groupType: GroupType) => Promise<true | null>
  signMessage: (signer: Signer, message: string) => Promise<string | null>
  retrieveIdentityCommitment: (signer: Signer, groupId: string) => Promise<string | null>
  joinGroup: (groupId: string, groupType: string, identityCommitment: string) => Promise<true | null>
  leaveGroup: (groupId: string, groupType: string, identityCommitment: string) => Promise<true | null>
  memberCount: (groupId: string) => Promise<number | null>
  etherscanLink?: string
  transactionstatus?: boolean
  hasjoined: boolean
  loading: boolean
}

export default function useOnChainGroups(): ReturnParameters {
  const { getGroupAdmin } = useGroupAdmin()
  const [_loading, setLoading] = useState<boolean>(false)
  const [_link, setEtherscanLink] = useState<string>()
  const [_transactionStatus, setTransactionStatus] = useState<boolean>()
  const [_hasjoined, setHasjoined] = useState<boolean>(false)

  const createNftGroup = useCallback(
    async (nft: Nft, groupType: GroupType): Promise<true | null> => {
      const adminWallet = await getGroupAdmin(groupType).then((wallet) => {
        return wallet
      })
      
      if (!adminWallet) return null

      setLoading(true)

      let groupId = (new Bytes32(nft.contract.address)).toUint().val

      if(groupType === GroupType.POH){
        const flag = (new Bytes32("0x10000000000000000000000000000000000000000")).toUint().val
        groupId = (BigInt(groupId) + BigInt(flag)).toString()
      }

      const transaction = await SemaphoreContract.connect(
        adminWallet
      ).createGroup(groupId, DEPTH, adminWallet.address)

      const receipt = await provider.waitForTransaction(transaction.hash)

      if (!!receipt.status) {
        let img_url
        await fetch(`https://api.opensea.io/api/v1/asset_contract/${nft.contract.address}`, {method: 'GET'})
        .then(response => response.json())
        .then(response => img_url = response.image_url)
        .catch(err => console.error(err))

        const config: AxiosRequestConfig = {
          method: "post",
          data: {
            name: nft.title,
            thumbnailImg: img_url,
            contract: nft.contract.address,
            groupType,
            groupId,
          }
        }
        
        await request("/api/groups", config)
      }

      setTransactionStatus(!!receipt.status)

      setEtherscanLink("https://kovan.etherscan.io/tx/" + transaction.hash)
      setLoading(false)

      return true
    },
    []
  )

  const signMessage = useCallback(
    async (signer: Signer, message: string): Promise<string | null> => {
      try {
        setLoading(true)

        const signedMessage = await signer.signMessage(message)

        setLoading(false)
        return signedMessage
      } catch (error) {
        setLoading(false)
        return null
      }
    },
    []
  )

  const retrieveIdentityCommitment = useCallback(
    async (signer: Signer, groupId: string): Promise<string | null> => {
      setLoading(true)

      const identity = await createIdentity(
        (message) => signer.signMessage(message),
        groupId
      )
      const identityCommitment = identity.genIdentityCommitment()
      const api = new onchainAPI()
      const members = await api.getGroupMembers(groupId)

      const identityCommitments = members.map(
        (member: any) => member.identityCommitment
      )

      const hasJoined = identityCommitments.includes(
        identityCommitment.toString()
      )
      setHasjoined(hasJoined)
      setLoading(false)
      return identityCommitment.toString()
    },
    []
  )

  const joinGroup = useCallback(
    async (groupId: string, groupType: string, identityCommitment: string): Promise<true | null> => {
      const adminWallet = await getGroupAdmin(groupType).then((wallet) => {
        return wallet
      })
      
      if (!adminWallet) return null

      setLoading(true)

      const transaction = await SemaphoreContract.connect(
        adminWallet
      ).addMember(groupId, identityCommitment, {
        gasPrice: utils.parseUnits("3", "gwei"),
        gasLimit: 3000000
      })

      const receipt = await provider.waitForTransaction(transaction.hash)

      setTransactionStatus(!!receipt.status)

      setEtherscanLink("https://kovan.etherscan.io/tx/" + transaction.hash)
      setLoading(false)
      return true
    },
    []
  )

  const leaveGroup = useCallback(
    async (groupId: string, groupType: string, IdentityCommitment: string): Promise<true | null> => {
      const adminWallet = await getGroupAdmin(groupType).then((wallet) => {
        return wallet
      })
      
      if (!adminWallet) return null

      setLoading(true)

      const api = new onchainAPI()
      const { root } = await api.getGroup(groupId)
      const members = await api.getGroupMembers(groupId)

      const identityCommitments = members.map(
        (member: any) => member.identityCommitment
      )

      const merkleproof = generateMerkleProof(
        DEPTH,
        BigInt(0),
        identityCommitments,
        IdentityCommitment
      )

      if (merkleproof.root != root)
        throw "root different. your transaction must be failed"

      const transaction = await SemaphoreContract.connect(
        adminWallet
      ).removeMember(
        groupId,
        IdentityCommitment,
        merkleproof.siblings,
        merkleproof.pathIndices,
        { gasPrice: utils.parseUnits("3", "gwei"), gasLimit: 3000000 }
      )

      const receipt = await provider.waitForTransaction(transaction.hash)

      setTransactionStatus(!!receipt.status)

      setEtherscanLink("https://kovan.etherscan.io/tx/" + transaction.hash)
      setLoading(false)

      return true
    },
    []
  )

  const memberCount = useCallback(async (groupId: string) => {
    const api = new onchainAPI()
    const { size } = await api.getGroup(groupId)
    return size
  }, [])

  return {
    createNftGroup,
    retrieveIdentityCommitment,
    signMessage,
    joinGroup,
    leaveGroup,
    memberCount,
    etherscanLink: _link,
    transactionstatus: _transactionStatus,
    hasjoined: _hasjoined,
    loading: _loading
  }
}
