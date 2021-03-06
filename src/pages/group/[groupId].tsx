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
  Snackbar,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useStyles, theme } from "src/styles"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import request from "src/hooks/request"
import getUsersNFT from "src/hooks/getUsersNFT"
import { Group, GroupType } from "src/types/group"
import useOnChainGroups from "src/hooks/useOnChainGroups"
import useSigner from "src/hooks/useSigner"
import CircleImage from "src/components/CircleImage"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ){
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  })

type Props = Group

type Query = {
  groupId?: string
}

const GroupPage: NextPage<Props> = ({ contract, groupType, thumbnailImg, name, memberCount }) => {
  const router = useRouter()
  const classes = useStyles()
  const { account } = useWeb3React<providers.Web3Provider>()
  const { groupId } = router.query as unknown as Query

  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const [_openWarning, setOpenWarning] = useState(false)
  const [_identityCommitment, setIdentityCommitment] = useState<string>()
  const { usersNftList, checkUsersStatus } = getUsersNFT()
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

      if(_activeStep === 1 && account){
        const nftList = await usersNftList(account)
        const filteredResponse = (groupType === GroupType.POAP)
          ? nftList?.filter(nft => nft.title.includes(name) && nft.contract.address.includes(contract))
          : nftList?.filter(nft => nft.contract.address.includes(contract))

        if (!filteredResponse?.length) {
          if(hasjoined) {
            setOpenWarning(true)
            setActiveStep(2)
            return
          }
          setError({ errorStep: 1, message: "You don't have this group's Nft." })
          setActiveStep(1)
          return
        }
        const userStatus = await checkUsersStatus(account, groupType, filteredResponse)
          
        if (!userStatus) {
          setError({ errorStep: 1, message: "You are not eligible to join this group.(check your NFT status)"})
          setActiveStep(1)
          return
        }

        setActiveStep(2)
      }
    })()
  }, [_activeStep, account])

  const handleAlertClose = () => {
    setOpenWarning(false)
  }

  const generateIdentity = async () => {
    try {
      const identityCommitment =
        _signer && groupId && (await retrieveIdentityCommitment(_signer, groupId))

      if (!identityCommitment) return

      setIdentityCommitment(identityCommitment)
      identityCommitment && setActiveStep(1)
    } catch (e) {
      setError({errorStep: _activeStep, message: "generate identity Failed - " + e })
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
          <Typography variant="subtitle1">
            Semaphore On-chain NFT group
          </Typography>
          <Typography variant="h4">
            {name}
          </Typography>
          <Typography variant="subtitle1">
            {memberCount} members
          </Typography>
          <CircleImage src={thumbnailImg} alt={name} />
          <Stepper activeStep={_activeStep} orientation="vertical">
            <Step>
              <StepLabel error={_error?.errorStep === 0}>
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
              <StepLabel error={_error?.errorStep === 1}>
                Check NFT ownership
              </StepLabel>
              <StepContent style={{ width: 400 }}>
                <Paper sx={{ p: 3 }}>
                  To join this group, you have to possess the Nft.
                </Paper>
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
                    <Button fullWidth onClick={()=>router.push("/")} variant="outlined">
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
          {_error && (
            <Paper className={classes.results}>
              {_error.message && (
                <Typography variant="body1" sx={{ p: 3 }}>{_error.message}</Typography>
              )}
            </Paper>
          )}
          <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={_openWarning} autoHideDuration={5000} onClose={handleAlertClose}>
            <Alert severity="warning" sx={{width:'100%'}}>Warning: You should leave this group because you don't have nft</Alert>
          </Snackbar>
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
