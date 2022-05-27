import React, { useEffect, useState } from "react"
import { Box, Button, Container, Typography, Theme, Card, CardActionArea, CardContent, Grid, Chip } from "@mui/material"
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
      borderRadius: 10,
    },
    image: {
      width: '100%',
      backgroundColor: 'lightgray'
    },
    title: {
      height: 45
    },
    contentWrapper: {
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 10,
    },
    memberCount: {
      
    }
  })
)

export default function GroupCard({
  groupId,
  name,
  thumbnailImg,
  groupType,
  memberCount,
}: Props): JSX.Element {
  const classes = useStyles()
  const router = useRouter()
  const [_groupTitle, setGroupTitle] = useState<string>(
    name.length > 13 ? `${name.substring(0, 10)}...` : name
  )
  const [_borderColor, setBorderColor] = useState<string>()

  useEffect(() => {
    if (groupType === GroupType.POH) {
      setBorderColor("orange")
    } else {
      setBorderColor("white")
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
              <Typography className={classes.title}>{name}</Typography>
              <Chip label={groupType.toLowerCase()} color="secondary" size="small" />
              <div className={classes.memberCount}>
                <Typography className={classes.title}>{memberCount}</Typography>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  )
}
