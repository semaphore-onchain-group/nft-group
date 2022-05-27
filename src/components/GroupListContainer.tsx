import React, { useEffect, useState } from "react"
import { Box, Button, Container, Typography, Theme, Card, CardActionArea, CardContent, Grid } from "@mui/material"
import { useRouter } from "next/router"
import Image from "next/image"
import logo from "src/img/logo.png"
import { GroupType, Group } from "src/types/group"
import { makeStyles, createStyles } from "@mui/styles"
import Thumbnail from "./Thumbnail"
import GroupCard from "./GroupCard"

interface Props {
  groupList: Array<Group>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      alignSelf: 'center'
    },
    image: {
      width: 180,
      borderRadius: 90,
      margin: 20
    },
    wrapper: {
      backgroundColor: 'skyblue',
      justifyContent: 'center',

    }
  })
)

export default function GroupListContainer({
  groupList
}: Props): JSX.Element {
  const classes = useStyles()
  const router = useRouter()

  return (
    <Box className={classes.container}>
      <Grid container spacing={3} >
        {groupList.map(group =>
          <GroupCard {...group} />
        )}
      </Grid>
    </Box>
  )
}
