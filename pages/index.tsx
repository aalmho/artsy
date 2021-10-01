import Head from 'next/head'
import Layout from '../components/layout'
import { Box, Heading } from 'grommet';
import ArtViewer from "../components/artViewer";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/clients/prisma"
import { Art } from ".prisma/client";

export const getServerSideProps: GetServerSideProps = async () => {
  const safeJsonStringify = require('safe-json-stringify');
  let art: Art[] = await prisma.art.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  })
  art = JSON.parse(safeJsonStringify(art));
  return {
    props: { art },
  }
}

export default function Home({ art }: { art: Art[] }) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <Box direction="column" justify="center" align="center">
        <Heading>Newest on Artsy</Heading>
        <ArtViewer art={art} />
      </Box>
    </Layout>
  )
}
