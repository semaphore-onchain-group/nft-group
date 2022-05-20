import { useCallback, useState } from "react"
import { Signer, Contract, providers, Wallet, utils } from "ethers"
import createIdentity from "src/utils/createIdentity"
import Semaphore_contract from "contract-artifacts/Semaphore.json"
import onchainAPI from "./OnchainAPI"
import getNextConfig from "next/config"
import { generateMerkleProof } from "@zk-kit/protocols"
import { HashZero } from "@ethersproject/constants"
import { toUtf8Bytes, concat, hexlify } from "ethers/lib/utils"
import { Bytes31 } from "soltypes"

function formatUint248String(text: string): string {
  const bytes = toUtf8Bytes(text)

  if (bytes.length > 30) {
    throw new Error("byte31 string must be less than 31 bytes")
  }

  const hash = new Bytes31(hexlify(concat([bytes, HashZero]).slice(0, 31)))
  return hash.toUint().toString()
}

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

const ADMIN = getNextConfig().publicRuntimeConfig.adminprivatekey_1
const adminWallet = ADMIN && new Wallet(ADMIN, provider)
//add multiple admin wallet
const DEPTH = 20

type ReturnParameters = {
  createNftGroup: (groupName: string) => Promise<true | null>
  signMessage: (signer: Signer, message: string) => Promise<string | null>
  retrieveIdentityCommitment: (signer: Signer, groupId: string) => Promise<string | null>
  joinGroup: (groupId: string, identityCommitment: string) => Promise<true | null>
  leaveGroup: (groupId: string, identityCommitment: string) => Promise<true | null>
  memberCount: (groupId: string) => Promise<number | null>
  etherscanLink?: string
  transactionstatus?: boolean
  hasjoined: boolean
  loading: boolean
}

export default function useOnChainGroups(): ReturnParameters {
  const [_loading, setLoading] = useState<boolean>(false)
  const [_link, setEtherscanLink] = useState<string>()
  const [_transactionStatus, setTransactionStatus] = useState<boolean>()
  const [_hasjoined, setHasjoined] = useState<boolean>(false)

  const createNftGroup = useCallback(
    async (groupName: string): Promise<true | null> => {
      if (!adminWallet) return null

      setLoading(true)

      const groupId = formatUint248String(groupName)

      const transaction = await SemaphoreContract.connect(
        adminWallet
      ).createGroup(groupId, DEPTH, adminWallet.address)

      const receipt = await provider.waitForTransaction(transaction.hash)

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
    async (groupId: string, identityCommitment: string): Promise<true | null> => {
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
    async (groupId: string, IdentityCommitment: string): Promise<true | null> => {
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
