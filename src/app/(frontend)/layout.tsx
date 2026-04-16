import React from 'react'
import './styles.css'
;<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap"
  rel="stylesheet"
/>

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
