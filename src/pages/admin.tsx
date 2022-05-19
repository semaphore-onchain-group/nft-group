import type { NextPage } from "next"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  MenuItem,
  Link
} from "@mui/material"
import React, { useState } from "react"
import { useStyles } from "src/styles"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import useOnChainGroups from "src/hooks/useOnChainGroups"
import { useRouter } from "next/router"

const Admin: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()

  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const [nftName, setNftName] = useState<string>("")

  const { createNftGroup, loading, etherscanLink, transactionstatus } =
    useOnChainGroups()

  function handleNext() {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
    setError(undefined)
  }

  const handleSelect = (event: SelectChangeEvent) => {
    setNftName(event.target.value)
    handleNext()
  }

  const createGroup =async () => {
      try {
        await createNftGroup(nftName)
      } catch (e) {
        setError({ errorStep: _activeStep, message: "create group Failed - " + e })
      }
  }

  return (
    <Paper className={classes.container} elevation={0} square={true}>
      <Box className={classes.content}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create Group
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Create the NFT Semaphore onchain group
        </Typography>

        <Stepper activeStep={_activeStep} orientation="vertical">
          <Step>
            <StepLabel error={_error?.errorStep === 1}>Select NFT</StepLabel>
            <StepContent style={{ width: 400 }}>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>
                  Select NFT
                </InputLabel>
                <Select
                  value={nftName}
                  onChange={handleSelect}
                >
                  <MenuItem value={"nft1"}>NFT1</MenuItem>
                  <MenuItem value={"nft2"}>NFT2</MenuItem>
                  <MenuItem value={"nft3"}>NFT3</MenuItem>
                </Select>
              </FormControl>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={_error?.errorStep === 2}>Create Group</StepLabel>
            <StepContent style={{ width: 400 }}>
              {transactionstatus !== undefined ? (
                <Box>
                  <Typography variant="body1">
                    Transaction {!!transactionstatus ? "Successful" : "Failed"}{" "}
                    (Check the&nbsp;
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
                  <Button fullWidth variant="outlined" onClick={() => router.push("/")}>
                    Home
                  </Button>
                </Box>
              ) : (
                <LoadingButton
                  fullWidth
                  onClick={createGroup}
                  variant="outlined"
                  loading={loading}
                >
                  Create Group
                </LoadingButton>
              )}
            </StepContent>
          </Step>
        </Stepper>
        {_error && (
          <Paper className={classes.results} sx={{ p: 3 }}>
            {_error.message && (
              <Typography variant="body1">{_error.message}</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Paper>
  )
}

export default Admin
