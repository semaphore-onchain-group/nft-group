import React from "react"
import { Box, Button, Container, Typography } from "@mui/material"
import { GroupType } from "src/types/group"
import { useRouter } from "next/router"

export default function Thumbnail({
  groupId,
  name,
  thumbnailImg
}: GroupType): JSX.Element {
  const router = useRouter()
  
  return (
    <Container>
      <Box sx={{ width: 150, height: 150 }}>
        <Button
          onClick={() => router.push(`/group/${groupId}`)}
          sx={{ border: 1, color: "white" }}
        >
          <img src={thumbnailImg} alt={name} />
        </Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {name}
        </Typography>
      </Box>
    </Container>
  )
}
