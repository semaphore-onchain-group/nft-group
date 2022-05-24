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
import React, { useEffect, useState } from "react"
import { useStyles } from "src/styles"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import useOnChainGroups from "src/hooks/useOnChainGroups"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import { useRouter } from "next/router"
import getUsersNFT from "src/hooks/getUsersNFT"
import { Nft } from "@alch/alchemy-web3"

const Admin: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const { account } = useWeb3React<providers.Web3Provider>()
  const { createNftGroup, loading, etherscanLink, transactionstatus } =
    useOnChainGroups()
  const { usersNftList } = getUsersNFT()
  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const [_nft, setNft] = useState<Nft>()
  const [_nftlist, setNftList] = useState<Nft[]>([])
  const [_groupType, setGroupType] = useState<string>("")
  useEffect(() => {
    ; (async () => {
      setError(undefined)
      if (_activeStep === 0 && account) {
        const nftlist = await usersNftList(account)
        if (nftlist) {
          setNftList(nftlist)
        }
      }
    })()
  }, [_activeStep, account])

  function handleNext() {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
    setError(undefined)
  }

  const selectNft = (event: SelectChangeEvent) => {
    const idx = Number(event.target.value)
    setNft(_nftlist[idx])
    handleNext()
  }

  const selectGroupType = (event: SelectChangeEvent) => {
    setGroupType(event.target.value)
    handleNext()
  }

  const createGroup = async () => {
    try {
      _nft && await createNftGroup(_nft, _groupType)
    } catch (e) {
      setError({
        errorStep: _activeStep,
        message: "create group Failed - " + e
      })
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
                <InputLabel>Select NFT</InputLabel>
                <Select value={_nft?.title || ''} onChange={selectNft}>
                  {_nftlist.map((nft, idx) => (
                    <MenuItem value={idx} key={nft.title}>
                      {nft.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={_error?.errorStep === 2}>
              Select Type of the Group
            </StepLabel>
            <StepContent style={{ width: 400 }}>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>NFT Type</InputLabel>
                <Select value={_groupType} onChange={selectGroupType}>
                  <MenuItem value="general">General NFT</MenuItem>
                  <MenuItem value="poh">PoH(Proof of Humanity)</MenuItem>
                </Select>
              </FormControl>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={_error?.errorStep === 3}>Create Group</StepLabel>
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
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push("/")}
                  >
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
