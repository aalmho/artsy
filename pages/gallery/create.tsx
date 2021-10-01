import Layout from "../../components/layout"
import Head from 'next/head'
import { Box, FormField, TextInput, Button } from "grommet"
import { GetServerSideProps } from "next"
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/client"
import { Gallery } from ".prisma/client"
import { prisma } from "../../lib/clients/prisma"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const safeJsonStringify = require('safe-json-stringify');
  const session = await getSession(context);
  const userId = session ? await Promise.resolve(Number(session.userId).toString()) : "";
  let gallery: Gallery | null = await prisma.gallery.findUnique({
    where: { userId: userId }
  })
  gallery = JSON.parse(safeJsonStringify(gallery));
  return {
    props: { gallery },
  }
}

export default function CreateGallery({ gallery }: { gallery: Gallery }) {
  const [session] = useSession();
  if (!session) {
    return (
      <div>
        Not authenticated
      </div>)
  }
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      ...gallery
    },
    onSubmit: async (values) => {
      const body = {
        galleryName: values.galleryName,
        artistName: values.artistName,
        description: values.description
      }
      await fetch('http://localhost:3000/api/gallery/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      await router.push('/gallery');
    }
  });

  return (
    <Layout>
      <Head>
        <title>Create your gallery</title>
      </Head>
      <Box align="center" justify="center">
        <h1>Define your gallery</h1>
      </Box>
      <Box align="center" justify="center">
        <form onSubmit={formik.handleSubmit}>
          <FormField name="Gallery name" htmlFor="galleryName" label="Gallery Name" onChange={formik.handleChange} value="Gallery name">
            <TextInput id="galleryName" name="galleryName" placeholder={gallery.galleryName} />
          </FormField>
          <FormField name="Artist name" htmlFor="artistName" label="Artist Name" onChange={formik.handleChange} value="Artist name">
            <TextInput id="artistName" name="artistName" placeholder={gallery.artistName} />
          </FormField>
          <FormField name="Description" htmlFor="description" label="Description" onChange={formik.handleChange} value="description">
            <TextInput id="description" name="description" placeholder={gallery.description} />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Create" />
          </Box>
        </form>
      </Box>
    </Layout>
  )
}