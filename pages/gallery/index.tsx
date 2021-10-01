import Layout from "../../components/layout"
import ArtViewer from "../../components/artViewer";
import EditGallery from "../../components/editGallery";
import Head from "next/head"
import { Box, Button, Heading, Layer, } from "grommet"
import { getSession, useSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/clients/prisma";
import { Art, Gallery } from ".prisma/client";
import { useState } from "react";
import AddArt from "../../components/addArt"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const safeJsonStringify = require('safe-json-stringify')
    const session = await getSession(context)
    const userId = session ? await Promise.resolve(Number(session.userId).toString()) : "";
    let gallery: Gallery | null = await prisma.gallery.findUnique({
        where: { userId: userId }
    })
    let art: Art[] = await prisma.art.findMany({
        where: { galleryId: gallery?.id }
    })

    gallery = JSON.parse(safeJsonStringify(gallery));
    art = JSON.parse(safeJsonStringify(art));

    return {
        props: { gallery, art },
    }
}

export default function GalleryIndex({
    gallery, art
}: {
    gallery: Gallery,
    art: Art[]
}) {
    const [show, setShow] = useState(false);
    const [session] = useSession();
    if (!session) {
        return (
            <div>
                Not authenticated
            </div>)
    }

    const changeLayerState = (newState: boolean) => {
        setShow(newState);
    }

    return (

        <Layout>
            <Head>
                <title>Gallery</title>
            </Head>
            <Box align="center" justify="center">
                <Heading>Your gallery</Heading>
            </Box>
            {!gallery.id ?
                <Box align="center" justify="center">
                    <Button primary label="Create your gallery" size="large" href="/gallery/create" />
                </Box> :
                <>
                    <EditGallery gallery={gallery} />
                    <Box align="center" justify="center" pad="medium">
                        {show && (
                            <Layer
                                onEsc={() => setShow(false)}
                                onClickOutside={() => setShow(false)}
                            >
                                <AddArt galleryId={gallery.id} setShow={changeLayerState} />
                            </Layer>
                        )}
                    </Box>
                    <ArtViewer art={art} />
                    <Box align="center" justify="center">
                        <Button label="Add art" onClick={() => setShow(true)} />
                    </Box>
                </>
            }
        </Layout>
    )
}