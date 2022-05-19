import React from "react"
import Image from "next/image"
import { Box, Container, Typography } from "@mui/material"
import logo from "../img/logo.png"
import { GroupType } from "../types/group"

export default function Thumbnail({ groupName }: GroupType): JSX.Element {
  return (
    <Container>
      <Box sx={{ width: 150, height: 150 }}>
        <Box sx={{ border: 1 }}>
          <Image src={logo} alt={groupName} width={150} height={150} />
        </Box>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {groupName}
        </Typography>
      </Box>
    </Container>
  )
}
