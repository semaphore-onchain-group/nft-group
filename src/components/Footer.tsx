import React from "react"
import { Box, Link, Container, Typography, AppBar } from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import DescriptionIcon from "@mui/icons-material/Description"

export default function Footer(): JSX.Element {
  return (
    <AppBar position="static" color="primary">
      <Container sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography color="white" variant="body1">
            Semaphore NFT group
          </Typography>
          <Box>
            <Link href="https://github.com/semaphore-onchain-group">
              <GitHubIcon sx={{ color: "white", mr: 2 }} />
            </Link>
            <Link href="https://nft-group-docs.vercel.app/">
              <DescriptionIcon sx={{ color: "white" }} />
            </Link>
          </Box>
        </Box>
      </Container>
    </AppBar>
  )
}
