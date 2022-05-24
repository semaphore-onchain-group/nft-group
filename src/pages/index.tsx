import type { NextPage } from "next"
import { ThemeProvider } from "@mui/material/styles"
import {
  Paper,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Tooltip
} from "@mui/material"
import { useStyles, theme } from "src/styles"
import Thumbnail from "src/components/Thumbnail"
import getGroupList from "src/hooks/getGroupList"
import AddBoxIcon from "@mui/icons-material/AddBox"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { GroupType } from "src/types/group"

const Home: NextPage = () => {
  const router = useRouter()
  const classes = useStyles()
  const [_groupList, setGroupList] = useState<GroupType[]>([])

  useEffect(() => {
    ;(async () => {
      const groupList = await getGroupList()
      setGroupList(groupList)
    })()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container} elevation={0} square={true}>
        <Box className={classes.content}>
          <Typography variant="h4" sx={{ mt: 10, mb: 10 }}>
            Semaphore On-chain NFT group
          </Typography>

          <Grid container spacing={10}>
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
