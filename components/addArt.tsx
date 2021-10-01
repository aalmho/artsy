import { Box, Button, FileInput, FormField, TextInput } from "grommet";
import { useFormik } from "formik";
import React from "react";
import { useRouter } from "next/router";

export default function AddArt({ galleryId, setShow }: { galleryId: string, setShow: Function }) {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      id: null,
      name: "Art name",
      description: "description",
      file: null
    },
    onSubmit: async (values) => {
      setShow(false);
      const data = new FormData();
      data.append("galleryId", galleryId)
      data.append("artName", values.name)
      data.append("description", values.description)
      data.append("file", values.file!)

      await fetch('http://localhost:3000/api/art/create', {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json'}, 
        body: data
      })
      await router.push('/gallery')
    }
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <FormField name="name" htmlFor="artName" label="Art name" onChange={formik.handleChange} value="Artist name">
          <TextInput id="name" name="name" placeholder={formik.initialValues.name} />
        </FormField>
        <FormField name="Description" htmlFor="description" label="Description" onChange={formik.handleChange} value="description">
          <TextInput id="description" name="description" placeholder={formik.initialValues.description} />
        </FormField>
        <FormField name="file" htmlFor="file" type="file" label="Upload picture">
          <FileInput
            name="file"
            onChange={event => {
              const fileList = event.target.files;
              formik.setFieldValue("file", fileList![0]);
            }}
          />
        </FormField>
        <Box direction="row" gap="medium">
          <Button type="submit" primary label="Add" />
        </Box>
      </form>
    </>
  )
}