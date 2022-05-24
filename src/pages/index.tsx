import type { NextPage } from "next"
import { ThemeProvider } from "@mui/material/styles"
import {
  Paper,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Tooltip,
  Toolbar,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox
} from "@mui/material"
import {
  useStyles,
  theme,
  Search,
  SearchIconWrapper,
  StyledInputBase
} from "src/styles"
import Thumbnail from "src/components/Thumbnail"
import getGroupList from "src/hooks/getGroupList"
import AddBoxIcon from "@mui/icons-material/AddBox"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { GroupType } from "src/types/group"
import SearchIcon from "@mui/icons-material/Search"
import { FilterList } from "@mui/icons-material"

const Home: NextPage = () => {
  const router = useRouter()
  const classes = useStyles()
  const [_fullGroupList, setFullGroupList] = useState<GroupType[]>([])
  const [_groupList, setGroupList] = useState<GroupType[]>([])
  const [_generalChecked, setGeneralChecked] = useState<boolean>(true)
  const [_pohChecked, setPohChecked] = useState<boolean>(true)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    ;(async () => {
      const groupList = await getGroupList()
      setFullGroupList(groupList)
      setGroupList(groupList)
    })()
  }, [])

  useEffect(() => {
    if (_generalChecked !== _pohChecked) {
      setGroupList(_fullGroupList.filter(group=>group.isPOH === _pohChecked))
    } else if(_generalChecked && _pohChecked) {
      setGroupList(_fullGroupList)
    } else {
      setGroupList([])
    }
  }, [_pohChecked, _generalChecked])

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container} elevation={0} square={true}>
        <Box className={classes.content}>
          <Typography variant="h4" sx={{ mt: 10, mb: 10 }}>
            Semaphore On-chain NFT group
          </Typography>

          <Grid container spacing={10} sx={{ mb: 20 }}>
            <Grid item xs={12}>
              <Toolbar>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      sx={{ color: "white" }}
                      onClick={() => router.push("/admin")}
                    >
                      <Typography>create group</Typography>
                    </Button>
                  </Grid>

                  <Grid item xs={5}></Grid>

                  <Grid item xs={3}>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase placeholder="Search group…" />
                    </Search>
                  </Grid>

                  <Grid item xs={1}>
                    <Button onClick={handleClick} sx={{ color: "white" }}>
                      <FilterList />
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              checked={_generalChecked}
                              onChange={(e) => {
                                setGeneralChecked(e.target.checked)
                              }}
                            />
                          }
                          label="General NFT group"
                        />
                      </MenuItem>
                      <MenuItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              checked={_pohChecked}
                              onChange={(e) => {
                                setPohChecked(e.target.checked)
                              }}
                            />
                          }
                          label="PoH NFT group"
                        />
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Toolbar>
            </Grid>
            {_groupList.map((group) => (
              <Grid key={group.groupId} item xs={3}>
                <Thumbnail
                  groupId={group.groupId}
                  name={group.name}
                  thumbnailImg={group.thumbnailImg}
                  contract={group.contract}
                  memberCount={group.memberCount}
                  isPOH={group.isPOH}
                />
              </Grid>
            ))}
            <Grid item xs={3}>
              <Container>
                <Tooltip title="Create new group" placement="bottom">
                  <Button
                    onClick={() => router.push("/admin")}
                    sx={{ width: 150, height: 150, color: "gray", border: 1 }}
                  >
                    <AddBoxIcon sx={{ width: 150, height: 150 }} />
                  </Button>
                </Tooltip>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export default Home
