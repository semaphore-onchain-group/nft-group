import { Theme } from "@mui/material/styles"
import { createStyles, makeStyles } from "@mui/styles"
import theme from "./theme"
import { Search, SearchIconWrapper, StyledInputBase } from "./searchBar"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flex: 1,
      position: "relative"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "60%"
    },
    stepWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    results: {
      position: "relative",
      marginTop: 20,
      width: 530,
      textAlign: "center"
    },
    link: {
      textDecoration: "underline"
    }
  })
)

export { useStyles, theme, Search, SearchIconWrapper, StyledInputBase }
