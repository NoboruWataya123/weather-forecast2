import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from "react";
import Head from "next/head";

const APP_NAME = "Погода в Якутске";
const APP_DEFAULT_TITLE = "Погода в Якутске";
const APP_TITLE_TEMPLATE = "%s - Погода в Якутске";
const APP_DESCRIPTION = "Погода в Якутске на 3 дня";

const inter = Inter({ subsets: ['latin'] })
export const revalidate = 3600

export const metadata: Metadata = {
  icons: 'mask-icon.svg',
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Погода в Якутске</title>
      <meta name="description" content="Погода в Якутске" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
      <meta name="theme-color" content="#B4B4B4" />
      <link rel="manifest" href="/public/manifest.json" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Погода в Якутске" />
      <meta property="og:description" content="Погода в Якутске" />
      <meta property="og:site_name" content="Погода в Якутске" />
      <meta property="og:url" content="https://weather-forecast2-three.vercel.app/" />
      <meta property="og:image" content="/icons/icon-512x512.png" />
    </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
