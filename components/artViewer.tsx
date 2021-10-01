import { useSession } from "next-auth/client";
import { Anchor, Box, Card, Avatar, Heading, CardBody, CardHeader, Text, Layer, Stack, } from "grommet"
import Image from "next/dist/client/image"
import Link from "next/dist/client/link"
import { Art } from ".prisma/client";
import { useState } from "react";

export default function ArtViewer({ art }: { art: Art[] }) {
  const [session] = useSession();
  const [showLayer, setShowLayer] = useState(false);
  const [clickedImage, setClickedImage] = useState<Art>();

  const imageLayer = (image: Art) => {
    setClickedImage(image);
    setShowLayer(!showLayer);
  }

  return (
    <>
      <Box direction="row-responsive" justify="center" align="center" pad="small" wrap>
        {art.map((img) => (
          <Box pad="small" align="center" gap="small" round="true" width="medium">
            <Card width="medium" key={img.src}>
              <Stack anchor="bottom-left">
                <CardBody height="medium">
                  <Image
                    src={img.src}
                    height={600}
                    width={400}
                    alt={img.name!}
                    onClick={() => imageLayer(img)}
                  />
                </CardBody>
                <CardHeader
                  pad={{ horizontal: 'small', vertical: 'small' }}
                  background="#000000A0"
                  width="medium"
                  justify="start"
                >
                  <Avatar src={session?.user.image} a11yTitle="avatar" />
                  <Box>
                    <Heading level="3" margin="none">
                      {img.name}
                    </Heading>
                    <Text size="small">{img.description}</Text>
                  </Box>
                  <Link href={`/art/${img.id}`}>
                    <Anchor>
                      <Text size="small">Go to art</Text>
                    </Anchor>
                  </Link>
                </CardHeader>
              </Stack>
            </Card>
          </Box>
        ))}
      </Box>
      {showLayer && (
        <Layer position="center"
          onEsc={() => setShowLayer(false)}
          onClickOutside={() => setShowLayer(false)}>
          <Box align="center" justify="center">
            <Image
              src={clickedImage!.src}
              height={600}
              width={400}
              alt={clickedImage!.name!}
            />
          </Box>
        </Layer>
      )}
    </>
  );
}