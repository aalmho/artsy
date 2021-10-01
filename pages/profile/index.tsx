import Layout from "../../components/layout"
import Head from "next/head"
import { Avatar, Box, Button, Heading, FileInput, Text, FormField } from "grommet"
import { getSession, useSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/clients/prisma";
import { User } from ".prisma/client";
import { useRouter } from "next/router";
import { useFormik } from "formik";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const safeJsonStringify = require('safe-json-stringify');
    const session = await getSession(context)
    const userId = session ? await Promise.resolve(Number(session.userId).toString()) : "";

    let user = await prisma.user.findUnique({
        where: { id: userId }
    })
    user = JSON.parse(safeJsonStringify(user));

    return {
        props: { user },
    }
}

export default function profile({ user }: { user: User }) {
    const [session] = useSession()
    const router = useRouter()
    if (!session) {
        return (
            <div>
                Not authenticated
            </div>)
    }

    const formik = useFormik({
        initialValues: {
            id: null,
            file: null
        },
        onSubmit: async (values) => {
            const data = new FormData();
            data.append("userId", user.id)
            data.append("file", values.file!)
            formik.resetForm();

            await fetch('http://localhost:3000/api/profile/updatePhoto', {
                method: 'PUT',
                //headers: { 'Content-Type': 'application/json'}, 
                body: data
            }).then(() => { router.push('/profile') })

        }
    });

    return (
        <Layout>
            <Head><title>Profile</title></Head>
            <Box align="center">
                <Heading>Your profile</Heading>
                <Box align="center" justify="center">
                    <Text>{user.name}</Text>
                    <Avatar src={user.image!} />
                </Box>
            </Box>
            <Box align="center" justify="center" pad="large">
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <FormField name="file" htmlFor="file" type="file" label="Change artist picture">
                        <FileInput
                            name="file"
                            onChange={event => {
                                const fileList = event.target.files;
                                formik.setFieldValue("file", fileList![0]);
                            }}
                        />
                    </FormField>
                    <Box direction="row" gap="medium">
                        <Button type="submit" primary label="Change" />
                    </Box>
                </form>
            </Box>
        </Layout>
    )
}