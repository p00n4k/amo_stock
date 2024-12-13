import React from 'react'
import "./globals.css";
import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body >
        <div className=''></div>
        <div className=''>{children}</div>
      </body>
    </html>
  )
}

export default layout