import Layout from "../../components/layout"
import { Anchor, Box, Button, Heading, Text } from "grommet";
import Head from "next/head"
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next"
import { Art, Gallery } from ".prisma/client";
import { prisma } from "../../lib/clients/prisma";
import { Trash } from "grommet-icons";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    const userId = session ? await Promise.resolve(Number(session.userId).toString()) : "";
    const safeJsonStringify = require('safe-json-stringify');
    const res = await fetch(`http://localhost:3000/api/art/${context.params!.id}`)
    const art: Art = await res.json()

    let gallery: Gallery | null = await prisma.gallery.findFirst({
        where: { id: art.galleryId },
    })
    gallery = JSON.parse(safeJsonStringify(gallery))

    return { props: { art, gallery, userId } }
}

export default function ArtComponent({ art, gallery, userId }: { art: Art, gallery: Gallery, userId: string }) {
    const router = useRouter();
    const DeleteButton = (art: Art) => {
        if (userId === gallery.userId) {
            return (
                <Button
                    icon={<Trash color="red" size="small" />}
                    onClick={() => { deleteArtPiece(art) }}>
                </Button>
            )
        } else {
            return null;
        }
    }

    const deleteArtPiece = async (art: Art) => {
        await fetch(`http://localhost:3000/api/art/${art.id}`, {
            method: 'DELETE',
        })
        await router.push('/gallery');
    }

    return (
        <Layout>
            <Head>
                <title>{art.name}</title>
            </Head>
            <Box align="center" justify="center" >
                <Heading >{art.name}</Heading>
                <Text size="small"> {art.description} </Text>
            </Box>
            <Box align="center" justify="center">
                <Image
                    src={art.src}
                    height={600}
                    width={400}
                    alt={art.name!}
                />
                <Box direction="row">
                    <Box justify="start" align="left" gap="small">
                        <Text size="small">By: </Text>
                        <Text size="medium"> {gallery.artistName} </Text>
                    </Box>
                    <Box justify="end" alignContent="right" gap="small">
                        <Link href={`/gallery/${art.galleryId}`}>
                            <Anchor>
                                <Text>Go to artist gallery</Text>
                            </Anchor>
                        </Link>
                    </Box>
                    <DeleteButton {...art} />
                </Box>

            </Box>
        </Layout>
    );
}