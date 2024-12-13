import React from 'react'
import "./globals.css";
import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <head>
        <title>Amo Stock V.2</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />

      </head>
      <body >
        <div className=''></div>
        <div className=''>{children}</div>
      </body>
    </html>
  )
}

export default layout