import React, { useEffect, useState } from "react"
import {
  Typography,
  Theme,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Chip,
  Box
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import { useRouter } from "next/router"
import Image from "next/image"
import logo from "src/img/logo.png"
import { GroupType } from "src/types/group"
import { makeStyles, createStyles } from "@mui/styles"

interface Props {
  groupId: string
  name: string
  thumbnailImg: string
  groupType: GroupType
  memberCount: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      borderRadius: 10
    },
    image: {
      width: "100%",
      backgroundColor: "lightgray"
    },
    title: {
      height: 45
    },
    contentWrapper: {
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5
    },
    groupInfoWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 15
    }
  })
)

export default function GroupCard({
  groupId,
  name,
  thumbnailImg,
  groupType,
  memberCount
}: Props): JSX.Element {
  const classes = useStyles()
  const router = useRouter()
  const [_groupColor, setGroupColor] = useState<undefined | string>()

  useEffect(() => {
    if (groupType === GroupType.POH) {
      setGroupColor("orange")
    } else if (groupType === GroupType.POAP) {
      setGroupColor("purple")
    }
  }, [])

  return (
    <>
      <Grid item xs={4} md={3}>
        <Card className={classes.container}>
          <CardActionArea onClick={() => router.push(`/group/${groupId}`)}>
            {thumbnailImg ? (
              <img className={classes.image} src={thumbnailImg} alt={name} />
            ) : (
              <Image src={logo} alt={name} />
            )}

            <CardContent className={classes.contentWrapper}>
              <Typography className={classes.title} align="center">
                {name}
              </Typography>
              <Box className={classes.groupInfoWrapper}>
                <Chip
                  label={groupType.toLowerCase()}
                  size="small"
                  sx={{ backgroundColor: _groupColor }}
                />
                <Box sx={{display:"flex", flexDirection:"row"}}>
                  <PersonIcon />
                  <Typography className={classes.title}>
                    {memberCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  )
}
