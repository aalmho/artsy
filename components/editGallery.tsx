import { Box, FormField, TextInput, Button, FileInput } from "grommet"
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { Gallery } from ".prisma/client"

export default function EditGallery({ gallery }: { gallery: Gallery }) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      ...gallery
    },
    onSubmit: async (values) => {
      const body = {
        galleryId: values.id,
        galleryName: values.galleryName,
        artistName: values.artistName,
        description: values.description
      }
      await fetch('http://localhost:3000/api/gallery/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      await router.push('/gallery');
    }
  });

  return (
    <>
      <Box align="center" justify="center">
        <form onSubmit={formik.handleSubmit}>
          <FormField name="GalleryName" htmlFor="galleryName" label="Gallery Name" onChange={formik.handleChange} value={formik.initialValues.galleryName!}>
            <TextInput id="galleryName" name="galleryName" placeholder={gallery.galleryName} />
          </FormField>
          <FormField name="ArtistName" htmlFor="artistName" label="Artist Name" onChange={formik.handleChange} value={formik.initialValues.artistName!}>
            <TextInput id="artistName" name="artistName" placeholder={gallery.artistName} />
          </FormField>
          <FormField name="Description" htmlFor="description" label="Description" onChange={formik.handleChange} value={formik.initialValues.description!}>
            <TextInput id="description" name="description" placeholder={gallery.description} />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Edit" />
          </Box>
        </form>
      </Box>
    </>
  )
}