import type { NextPage, GetServerSideProps } from "next"
import React, { useState, useEffect } from 'react'
import { ThemeProvider } from "@mui/material/styles"
import { useRouter } from "next/router"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"

import {
  Paper,
  Box,
  Typography,
  Button,
  Stepper,
  StepLabel,
  Step,
  StepContent,
  Link,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useStyles, theme } from "src/styles"
import request from "src/hooks/request"
import getUsersNFT from "src/hooks/getUsersNFT"
import { Group } from "src/types/group"
import { AxiosRequestConfig } from "axios"
import useOnChainGroups from "src/hooks/useOnChainGroups"
import useSigner from "src/hooks/useSigner"
import ConnectWalletInfo from "src/components/ConnectWalletInfo"

type Props = Group

type Query = {
  groupId?: string
}

const GroupPage: NextPage<Props> = ({ contract, groupType }) => {
  const router = useRouter()
  const classes = useStyles()
  const { account } = useWeb3React<providers.Web3Provider>()
  const { groupId } = router.query as unknown as Query

  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const [_identityCommitment, setIdentityCommitment] = useState<string>()
  const { usersNftList } = getUsersNFT()
  const _signer = useSigner()
  const {
    signMessage,
    retrieveIdentityCommitment,
    joinGroup,
    leaveGroup,
    hasjoined,
    loading,
    etherscanLink,
    transactionstatus
  } = useOnChainGroups()

  useEffect(() => {
    ; (async () => {
      setError(undefined)

      if (!account) {
        setError({ errorStep: 0, message: "Connect your Wallet first" })
        setActiveStep(0)
        return
      }

      const nftList = await usersNftList(account)
      const isOwnNft = nftList?.some(nft => nft.contract.address === contract)

      if (!isOwnNft) {
        setError({ errorStep: 0, message: "You don't have this group's Nft." })
        setActiveStep(0)
        return
      }

      setActiveStep(1)
    })()
  }, [account])

  const generateIdentity = async () => {
    try {
      const identityCommitment =
        _signer && groupId && (await retrieveIdentityCommitment(_signer, groupId))

      if (!identityCommitment) return

      setIdentityCommitment(identityCommitment)
      identityCommitment && setActiveStep(2)
    } catch (e) {
      setError({
        errorStep: _activeStep,
        message: "generate identity Failed - " + e
      })
    }
  }

  const joinOnChainGroup = async () => {
    try {
      if (!_signer || !_identityCommitment || !groupId) return

      const userSignature = await signMessage(_signer, _identityCommitment)

      if (userSignature) {
        await joinGroup(groupId, groupType, _identityCommitment)
      }
    } catch (e) {
      setError({ errorStep: _activeStep, message: "join group Failed - " + e })
    }
  }

  const leaveOnchainGroup = async () => {
    try {
      if (!_signer || !_identityCommitment || !groupId) return

      const userSignature = await signMessage(_signer, _identityCommitment)

      if (userSignature) {
        await leaveGroup(groupId, groupType, _identityCommitment)
      }
    } catch (e) {
      setError({ errorStep: _activeStep, message: "leave group Failed - " + e })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container} elevation={0} square={true}>
        <Box className={classes.content}>
          <Typography variant="h5">
            Semaphore On-chain NFT group
          </Typography>
          <Typography variant="h2">
            {groupId}
          </Typography>
          <Stepper activeStep={_activeStep} orientation="vertical">
            <Step>
              <StepLabel error={_error?.errorStep === 0}>
                Check NFT ownership
              </StepLabel>
              <StepContent style={{ width: 400 }}>
                <Paper sx={{ p: 3 }}>
                  To join this group, you have to possess the Nft.
                </Paper>
              </StepContent>
            </Step>
            <Step>
              <StepLabel error={_error?.errorStep === 1}>
                Generate your Semaphore identity
              </StepLabel>
              <StepContent style={{ width: 400 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={generateIdentity}
                >
                  Generate Identity
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel error={_error?.errorStep === 2}>
                {hasjoined ? "Leave" : "Join"} Group
              </StepLabel>
              <StepContent style={{ width: 400 }}>
                {transactionstatus !== undefined ? (
                  <Box>
                    <Typography variant="body1">
                      Transaction{" "}
                      {!!transactionstatus ? "Successful" : "Failed"} (Check
                      the&nbsp;
                      <Link
                        href={etherscanLink}
                        underline="hover"
                        rel="noreferrer"
                        target="_blank"
                      >
                        transaction
                      </Link>
                      )
                    </Typography>
                    <Button fullWidth onClick={window.location.reload} variant="outlined">
                      Home
                    </Button>
                  </Box>
                ) : (
                    <LoadingButton
                      fullWidth
                      onClick={hasjoined ? leaveOnchainGroup : joinOnChainGroup}
                      variant="outlined"
                      loading={loading}
                    >
                      {hasjoined ? "Leave" : "Join"} Group
                    </LoadingButton>
                  )}
              </StepContent>
            </Step>
          </Stepper>
          {!account && <ConnectWalletInfo />}
          {_error && (
            <Paper className={classes.results} sx={{ p: 3 }}>
              {_error.message && (
                <Typography variant="body1">{_error.message}</Typography>
              )}
            </Paper>
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const origin = new URL(req.headers.referer || '').origin
  const groupInfo = await request(`${origin}/api/groups/${query.groupId}`)

  return {
    props: {
      ...groupInfo
    },
  }
}

export default GroupPage
