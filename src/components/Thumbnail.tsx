import React from "react"
import Image from "next/image"
import { Box, Button, Container, Typography } from "@mui/material"
import logo from "src/img/logo.png"
import { GroupType } from "src/types/group"
import { useRouter } from "next/router"

export default function Thumbnail({ groupName }: GroupType): JSX.Element {
  const router = useRouter()

  return (
    <Container>
      <Box sx={{ width: 150, height: 150 }}>
        <Button
          // onClick={()=>router.push(`/join/${groupName}`)}
          sx={{ border: 1, color: "white" }}
        >
          <Image src={logo} alt={groupName} width={150} height={150} />
        </Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {groupName}
        </Typography>
      </Box>
    </Container>
  )
}
