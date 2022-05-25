import React from "react"
import { Box, Button, Container, Typography } from "@mui/material"
import { GroupType } from "src/types/group"
import { useRouter } from "next/router"
import Image from "next/image"
import logo from "src/img/logo.png"

export default function Thumbnail({
  groupId,
  name,
  thumbnailImg
}: GroupType): JSX.Element {
  const router = useRouter()

  return (
    <Container>
      <Box>
        <Button
          onClick={() => router.push(`/group/${groupId}`)}
          sx={{ width: 150, height: 150, border: 1, color: "white" }}
        >
          {thumbnailImg ? (
            <img src={thumbnailImg} alt={name} />
          ) : (
            <Image src={logo} alt={name} />
          )}
        </Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {name}
        </Typography>
      </Box>
    </Container>
  )
}
