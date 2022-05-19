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

const Home: NextPage = () => {
  const router = useRouter()
  const classes = useStyles()
  const groupList = getGroupList()

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container} elevation={0} square={true}>
        <Box className={classes.content}>
          <Typography variant="h4" sx={{ mb: 10 }}>
            Semaphore On-chain NFT group
          </Typography>

          <Grid container spacing={10} justifyContent="center">
            {groupList.map((group) => (
              <Grid key={group.index} item xs={3}>
                <Thumbnail index={group.index} groupName={group.groupName} imgSrc={group.imgSrc} />
              </Grid>
            ))}
            <Grid item xs={3}>
              <Container>
                <Tooltip title="Create group" placement="bottom">
                  <Button
                    // onClick={() => router.push("/admin")}
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
