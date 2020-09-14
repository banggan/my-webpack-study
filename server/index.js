const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server');

server(process.env.PORT || 3000);


const server = (port)=>{
    const app = express()

    app.use(express.static('dist'))

    app.get('/search',(req,res) => {
        // console.log('-----SSR',SSR)
        // const ss = renderToString(SSR)
        // const myhtml = renderMarkup(ss) ；
        // res.status(200).send(myhtml)
    });
    app.listen(port,() => {
        console.log('server is running on port:'+ port)
    })
};
const renderMarkup = (str) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${str}</div>
    </body>
    </html>
    `
};
