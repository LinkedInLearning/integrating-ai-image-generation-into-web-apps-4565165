# OpenAI - Images Gallery

- **express**: Node.js back end web application framework for building RESTful
- **cors** : library that allows a web page to access restricted resources from a server on a domain different than the domain that served the web page
- **nodemon**: utility that will monitor for any changes in your source and automatically restart your server.
- **dotenv**: zero-dependency module that loads environment variables from a .env file into process.env.
- **readline-sync** : simplifies the process of receiving user input in a Node.js application.
- **node-fetch**: light-weight module to use Fetch API in Node.js applications.
- **openai**:OpenAI API library for Node.js projects. This library provides convenient access to the OpenAI API from applications written in server-side JavaScript.

## Installation :

[Node 19+](https://nodejs.org/en/download):
`node -v`

`npm install`

## [get an API key](https://platform.openai.com/account/api-keys)

.env file

OPENAI_API_KEY=sk-brHeh...A39v5iXsM2

`export OPENAI_API_KEY='sk-brHeh...A39v5iXsM2'`

## Start:
`npm start`

## Test API endpoints:

### For the `read` function to return the list of image objects:

curl http://127.0.0.1:4000/

### For the `create` function to create a new image:

curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -d '{"input": "flower blue"}' \
     http://127.0.0.1:4000/create






