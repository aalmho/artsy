import React from 'react';
import { signIn, signOut, useSession } from "next-auth/client"
import { Avatar, Anchor, Box, Header, Nav, Button } from 'grommet';
import { User } from 'grommet-icons'
import Link from 'next/link'

export default function Navbar() {

    const [session] = useSession();

    const publicLinks = [
        { label: 'Art', href: '/' },
        { label: 'Galleries', href: 'gallery/galleries' },
    ];

    const privateLinks = [
        { label: 'My gallery', href: '/gallery/' },
        { label: 'My profile', href: '/profile' }
    ];

    return (
        <Header background="dark-1" pad="small">
            <Box align="center" gap="small">
                <Link href="/">
                    <a>
                        <h1>Artsy</h1>
                    </a>
                </Link>
            </Box>
            {session ? (
                <>
                    <Nav direction="row" align="center" justify="center">
                        {publicLinks.concat(privateLinks).map((item) => (
                            <Anchor href={item.href} label={item.label} key={item.label} />
                        ))}
                    </Nav>
                    <Box direction="row" align="center" gap="small">
                        {session.user.name}
                        <Avatar src={session.user.image} />
                        <Button onClick={() => signOut({ redirect: false, callbackUrl: '/' })}>Logout</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Nav direction="row" align="center" justify="center">
                        {publicLinks.map((item) => (
                            <Anchor href={item.href} label={item.label} key={item.label} />
                        ))}
                    </Nav>
                    <Box direction="row" align="center" gap="small">
                        <Button onClick={() => signIn('facebook', { callbackUrl: '/' })}>
                            Login
                        </Button>
                        <User />
                    </Box>
                </>
            )}
        </Header>
    )
}