import { createStyles, makeStyles } from "@mui/styles"
import { Theme } from "@mui/material/styles"

interface Props {
  src: string
  alt: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 180,
      borderRadius: 90,
      margin: 20
    }
  })
)

export default function CircleImage({ src, alt }: Props): JSX.Element {
  const classes = useStyles()

  return (
    <img className={classes.container} src={src} alt={alt} />
  )
}
