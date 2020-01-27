require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const axios = require('axios')

const Home = require('./home')
const Auth = require('./auth')
const OpenIdClient = require('./openid-client')

console.log(`Cognito Integration - ${process.env.NAME} ${process.env.VERSION}`)

const Start = async () => {
  const server = await new Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST || '0.0.0.0'
  })

  const swaggerOptions = {
    info: {
      title: `NodeJS OAuth Sample - ${process.env.NAME} ${process.env.VERSION}`,
      version: '1'
    }
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  try {
    await server.start()
    console.log(`Server running on ${server.info.uri}`)
  } catch (error) {
    console.log(error)
  }

  return server
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

const startupError = err => {
  console.log('Error bootstrapping app!', err)
}

Start().then(server => {
  Auth(server, axios)
  OpenIdClient(server)
  Home(server)
})
.catch(startupError)
