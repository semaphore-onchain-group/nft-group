import type { NextPage } from "next"
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles"
import { Paper, Box, Typography } from "@mui/material"
import useStyles from "../styles"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#66A8C9"
    }
  }
})

const Home: NextPage = () => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container} elevation={0} square={true}>
        <Box className={classes.content}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Semaphore On-chain group
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            contents
          </Typography>
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export default Home
