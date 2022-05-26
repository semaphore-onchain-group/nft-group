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
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useStyles, theme } from "src/styles"
import request from "src/hooks/request"
import getUsersNFT from "src/hooks/getUsersNFT"
import { Group } from "src/types/group"

type Props = Group

const GroupPage: NextPage<Props> = ({ contract }) => {
  const router = useRouter()
  const classes = useStyles()
  const { account } = useWeb3React<providers.Web3Provider>()

  const { groupId } = router.query

  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const { usersNftList } = getUsersNFT()

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
                >
                  Generate Identity
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel error={_error?.errorStep === 2}>
                Join Group
              </StepLabel>
              <StepContent style={{ width: 400 }}>
                <LoadingButton
                  fullWidth
                  variant="outlined"
                >
                  Join Group
                </LoadingButton>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, query }) => {
  const protocol = req.headers.referer?.startsWith('https') ? 'https' : 'http'
  const groupInfo = await request(`${protocol}://${req.headers.host}/api/groups?groupId=${query.groupId}`)

  return {
    props: {
      ...groupInfo
    },
  }
}

export default GroupPage
