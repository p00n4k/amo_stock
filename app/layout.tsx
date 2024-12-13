import React from 'react'
import "./globals.css";
const layout = ({children}) => {
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