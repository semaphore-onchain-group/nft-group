import type { NextPage } from "next"
import React, { useState } from 'react'
import { ThemeProvider } from "@mui/material/styles"
import { useRouter } from "next/router"

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

const GroupPage: NextPage = () => {
  const router = useRouter()
  const classes = useStyles()

  const { groupId } = router.query

  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
 
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

export default GroupPage
