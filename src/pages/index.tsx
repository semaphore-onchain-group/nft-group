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
import { useStyles, theme } from "../styles"
import Thumbnail from "../components/Thumbnail"
import getGroupList from "../hooks/getGroupList"
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
            Semaphore On-chain group
          </Typography>

          <Grid container spacing={8} justifyContent="center">
            {groupList.map((group) => (
              <Grid item xs={3}>
                <Thumbnail groupName={group.groupName} />
              </Grid>
            ))}
            <Grid item xs={3}>
              <Container>
                <Tooltip title="Create group" placement="bottom">
                  <Button
                    // onClick={() => router.push("/admin")}
                    sx={{ width: 150, height: 150, color: "gray" }}
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
