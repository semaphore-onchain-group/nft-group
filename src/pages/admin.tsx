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
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useStyles } from "src/styles"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import useOnChainGroups from "src/hooks/useOnChainGroups"
import { useWeb3React } from "@web3-react/core"
import { providers } from "ethers"
import { useRouter } from "next/router"
import getUsersNFT from "src/hooks/getUsersNFT"
import { Nft } from "@alch/alchemy-web3"
import { GroupType } from "src/types/group"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ){
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  })

const Admin: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const { account } = useWeb3React<providers.Web3Provider>()
  const { createNftGroup, loading, etherscanLink, transactionstatus } =
    useOnChainGroups()
  const { usersNftList, checkGroupsStatus, groupstatusMsg } = getUsersNFT()
  const [_activeStep, setActiveStep] = useState<number>(0)
  const [_error, setError] = useState<
    { errorStep: number; message?: string } | undefined
  >()
  const [_openDialog, setOpenDialog] = useState(false)
  const [_openSuccess, setOpenSuccess] = useState(false)
  const [_openFail, setOpenFail] = useState(false)
  const [_nft, setNft] = useState<Nft>()
  const [_nftlist, setNftList] = useState<Nft[]>([])
  const [_groupType, setGroupType] = useState<GroupType>(GroupType.GENERAL)
  const [_isPoap, setIsPoap] = useState<boolean>()

  useEffect(() => {
    ; (async () => {
      setError(undefined)
      if (_activeStep === 0 && account) {
        const nftlist = await usersNftList(account)
        if (nftlist) {
          setNftList(nftlist)
        }
      }
      if (!account){
        setNftList([])
        setError({errorStep:0,message:"Connect your Wallet first"})
        setActiveStep(0)
      }
    })()
  }, [_activeStep, account])

  useEffect(() => {
    if(_nft?.contract.address ==="0x22c1f6050e56d2876009903609a2cc3fef83b415") {
      setIsPoap(true)
    } else {
      setIsPoap(false)
    }
  },[_nft])

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
    setError(undefined)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1)
    setError(undefined)
  }

  const selectNft = (event: SelectChangeEvent) => {
    const idx = Number(event.target.value)
    setNft(_nftlist[idx])
    handleNext()
  }

  const selectGroupType = (event: SelectChangeEvent) => {
    setGroupType(event.target.value as GroupType)
  }

  const handleDialogOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleAlertClose = () => {
    setOpenSuccess(false)
    setOpenFail(false)
  }

  const checkGroup = async () => {
    if(_nft && await checkGroupsStatus(_groupType, _nft)){
      setOpenSuccess(true)
      handleNext()
    }
    else{
      setOpenFail(true)
      setError({errorStep:1})
    }
  }
  
  const createGroup = async () => {
    try {
      setOpenDialog(false)
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
            <StepLabel error={_error?.errorStep === 0}>Select NFT</StepLabel>
            <StepContent style={{ width: 400 }}>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} disabled={_error?.errorStep === 0}>
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
            <StepLabel error={_error?.errorStep === 1}>
              Select Type of the Group
              <Button onClick={handleBack} disabled={_activeStep !== 1} >back</Button>
            </StepLabel>
            <StepContent style={{ width: 400 }}>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <RadioGroup value={_groupType} onChange={selectGroupType}>
                  <FormControlLabel disabled={_isPoap} value={GroupType.GENERAL} control={<Radio/>} label="General NFT"/>
                  <FormControlLabel disabled={_isPoap} value={GroupType.POH} control={<Radio/>} label="PoH(Proof of Humanity)"/>
                  <FormControlLabel disabled={!_isPoap} value={GroupType.POAP} control={<Radio/>} label="POAP"/>
                </RadioGroup>
                <Button onClick={checkGroup}>check&create</Button>
              </FormControl>
            </StepContent>
          </Step>
          <Step>
            <StepLabel error={_error?.errorStep === 2}>
              Create Group
              <Button onClick={handleBack} disabled={_activeStep !== 2} >back</Button>
              </StepLabel>
              
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
                <Box>
                  <LoadingButton
                    fullWidth
                    onClick={handleDialogOpen}
                    variant="outlined"
                    loading={loading}
                  >
                    Create Group
                  </LoadingButton>
                  <Dialog open={_openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Make sure you want to create this group </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {`NFT : ${_nft?.title}`}<br/>
                        {`GroupType : ${_groupType}`}<br/><br/>
                        {`This group will be created by ${_groupType} NFT on-chain group admin,
                        and if this group is created successfully,
                        you can join this group`}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogClose}>Cancel</Button>
                      <Button onClick={createGroup}>Create</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
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
          <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={_openSuccess} autoHideDuration={5000} onClose={handleAlertClose}>
            <Alert severity="success" sx={{width:'100%'}}>{groupstatusMsg}</Alert>
          </Snackbar>
          <Snackbar anchorOrigin={{vertical:"bottom",horizontal:"center"}} open={_openFail} autoHideDuration={5000} onClose={handleAlertClose}>
            <Alert severity="error" sx={{width:'100%'}}>{groupstatusMsg}</Alert>
          </Snackbar>
      </Box>
    </Paper>
  )
}

export default Admin
