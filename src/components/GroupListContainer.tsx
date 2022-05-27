import React from "react"
import { Box, Theme, Grid } from "@mui/material"
import { Group } from "src/types/group"
import { makeStyles, createStyles } from "@mui/styles"
import GroupCard from "./GroupCard"

interface Props {
  groupList: Array<Group>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      alignSelf: 'center',
      marginBottom: 200
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
