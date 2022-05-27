import React, { useEffect, useState } from "react"
import { Button, Container, Typography } from "@mui/material"
import { useRouter } from "next/router"
import Image from "next/image"
import logo from "src/img/logo.png"
import { GroupType } from "src/types/group"

interface Props {
  groupId: string
  name: string
  thumbnailImg: string
  groupType: GroupType
}

export default function Thumbnail({
  groupId,
  name,
  thumbnailImg,
  groupType
}: Props): JSX.Element {
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
    <Container sx={{ width: 200 }}>
      <Button
        onClick={() => router.push(`/group/${groupId}`)}
        onMouseOver={() => setGroupTitle(name)}
        onMouseOut={() =>
          setGroupTitle(name.length > 13 ? `${name.substring(0, 10)}...` : name)
        }
        sx={{ width: 150, height: 150, border: 1, color: _borderColor }}
      >
        {thumbnailImg ? (
          <img src={thumbnailImg} alt={name} />
        ) : (
          <Image src={logo} alt={name} />
        )}
      </Button>
      <Typography variant="body1" align="center">
        {_groupTitle}
      </Typography>
    </Container>
  )
}
