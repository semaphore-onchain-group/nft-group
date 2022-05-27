import type { NextPage } from "next"
import { ThemeProvider } from "@mui/material/styles"
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button,
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
import getGroupList from "src/hooks/getGroupList"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Group, GroupType } from "src/types/group"
import SearchIcon from "@mui/icons-material/Search"
import { FilterList } from "@mui/icons-material"
import GroupListContainer from "src/components/GroupListContainer"

const Home: NextPage = () => {
  const router = useRouter()
  const classes = useStyles()
  const [_fullGroupList, setFullGroupList] = useState<Group[]>([])
  const [_groupList, setGroupList] = useState<Group[]>([])
  const [_checkedGroupsInfo, setCheckedGroupsInfo] = useState<Record<GroupType, boolean>>({ POH: true, GENERAL: true, POAP: true })
  const [_anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [_searchField, setSearchField] = useState<string>("")
  const openFilter = Boolean(_anchorEl)

  const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    ; (async () => {
      const groupList = await getGroupList()
      setFullGroupList(groupList)
    })()
  }, [])

  useEffect(() => {
    const checkedGroups =
      (Object.keys(_checkedGroupsInfo) as GroupType[])
        .filter(key => _checkedGroupsInfo[key])

    setGroupList(
      _fullGroupList
        .filter(group => checkedGroups.includes(group.groupType))
        .sort((a, b) => b.memberCount - a.memberCount)
    )
  }, [_checkedGroupsInfo, _fullGroupList])

  useEffect(() => {
    setGroupList(
      _fullGroupList.filter((group) =>
        group.name.toLowerCase().includes(_searchField.toLowerCase())
      ).sort((a, b) => b.memberCount - a.memberCount)
    )
  }, [_searchField, _fullGroupList])

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
                      <StyledInputBase
                        type="search"
                        placeholder="Search group…"
                        onChange={(e) => {
                          setSearchField(e.target.value)
                        }}
                      />
                    </Search>
                  </Grid>

                  <Grid item xs={1}>
                    <Button onClick={handleClickFilter} sx={{ color: "white" }}>
                      <FilterList />
                    </Button>
                    <Menu
                      anchorEl={_anchorEl}
                      open={openFilter}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              checked={_checkedGroupsInfo[GroupType.GENERAL]}
                              onChange={(e) => {
                                setCheckedGroupsInfo({ ..._checkedGroupsInfo, GENERAL: e.target.checked })
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
                              checked={_checkedGroupsInfo[GroupType.POH]}
                              onChange={(e) => {
                                setCheckedGroupsInfo({ ..._checkedGroupsInfo, POH: e.target.checked })
                              }}
                            />
                          }
                          label="PoH NFT group"
                        />
                      </MenuItem>
                      <MenuItem>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked
                              checked={_checkedGroupsInfo[GroupType.POAP]}
                              onChange={(e) => {
                                setCheckedGroupsInfo({ ..._checkedGroupsInfo, POAP: e.target.checked })
                              }}
                            />
                          }
                          label="POAP group"
                        />
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Toolbar>
            </Grid>
          </Grid>
          <GroupListContainer groupList={_groupList} />
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export default Home
