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

export const metadata: Metadata = {
  icons: 'mask-icon.svg',
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
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
      <title>My awesome PWA app</title>
      <meta name="description" content="Погода в Якутске" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
      <meta name="theme-color" content="#B4B4B4" />
      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
      />
      <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
      />
      <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
      />
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
