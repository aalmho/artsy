import { Art, Gallery } from ".prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/layout";
import { prisma } from "../../lib/clients/prisma";
import { Anchor, Box, Carousel, Heading, Text } from "grommet";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
    const safeJsonStringify = require('safe-json-stringify');
    let galleries = await prisma.gallery.findMany()
    galleries = JSON.parse(safeJsonStringify(galleries));
    let art = await prisma.art.findMany()
    art = JSON.parse(safeJsonStringify(art));
    return {
        props: { art, galleries }
    }
}

export default function Galleries({ art, galleries }: { art: Art[], galleries: Gallery[] }) {
    const [artState, setArtState] = useState<Art[]>(art);

    const GalleryView = (gallery: Gallery) => {
        const exampleImages = artState.filter(art => art.galleryId === gallery.id);
        return (
            <Box align="center" height="medium" width="medium">
                <Carousel fill>
                    {exampleImages.map(img => (
                        <Box pad="xlarge">
                            <Image src={img.src} layout="fill" />
                        </Box>
                    ))}
                </Carousel>
            </Box>
        )
    }

    return (
        <Layout>
            <Head><title>Galleries</title></Head>
            <Box align="center" justify="center">
                {galleries.map(gallery => (
                    <Box align="center" height="large" width="large" overflow="hidden">
                        <Link href={`/gallery/${gallery.id}`}>
                            <Anchor>
                                <Heading>{gallery.galleryName}</Heading>
                            </Anchor>
                        </Link>

                        <Box direction="row">
                            <Text size="small">{`By ${gallery.artistName}`}</Text>
                        </Box>
                        <Text size="medium">{gallery.description}</Text>
                        <GalleryView {...gallery} />
                    </Box>
                ))}
            </Box>
        </Layout>
    )
}