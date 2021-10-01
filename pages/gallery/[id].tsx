import Layout from "../../components/layout"
import ArtViewer from "../../components/artViewer";
import { Box, Heading, Text } from "grommet";
import Head from "next/head"
import { GetServerSideProps } from "next"
import { Art, Gallery } from ".prisma/client";
import { prisma } from "../../lib/clients/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const safeJsonStringify = require('safe-json-stringify');
    const res = await fetch(`http://localhost:3000/api/gallery/${context.params!.id}`)
    const gallery: Gallery = await res.json()

    let artPieces: Art[] = await prisma.art.findMany({
        where: { galleryId: gallery.id }
    })
    artPieces = JSON.parse(safeJsonStringify(artPieces));

    return { props: { artPieces, gallery } }
}

export default function GalleryView({ artPieces, gallery }: { artPieces: Art[], gallery: Gallery }) {

    return (
        <Layout>
            <Head>{gallery.galleryName}</Head>
            <Box align="center" justify="center">
                <Heading>{gallery.galleryName}</Heading>
            </Box>
            <Box align="center" justify="center" direction="row">
                <Text size="medium">{gallery.description}</Text>
            </Box>
            <Box align="center" justify="center" direction="row">
                <Text>By: {gallery.artistName}</Text>
            </Box>
            <ArtViewer art={artPieces} />
        </Layout>
    );
}