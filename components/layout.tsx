import Head from 'next/head'
import Navbar from './navbar'
import React from 'react';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

export const siteTitle = 'Artsy'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Grommet theme={grommet}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Navbar />
        <main>{children}</main>
      </Grommet>
    </div>
  )
}