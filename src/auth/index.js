const Joi = require('@hapi/joi')
const { Callback, GetAuthUrl } = require('./auth')

const Auth = (server, axios) => {
  server.route({
    method: 'GET',
    path: '/auth-raw/callback',
    handler: async (req, res) => {
      return res
        .response({ authorizeURL: await Callback(res, axios, req.query.code, req.query.state) })
        .code(200)
    },
    options: {
      description: 'OAUTH2 Authorization Code Callback',
      notes: ['201', '500'],
      tags: ['api'],
      validate: {
        query: Joi.object({
          code : Joi.string()
                  .required()
                  .description('Authorization Code'),
          state : Joi.string()
                  .required()
                  .description('State of authentication')
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/auth-raw',
    handler: async (req, res) => {
      return await GetAuthUrl(res, axios)
    },
    options: {
      description: 'Get the Cognito Authorization URL',
      notes: 'Returns a complete authorization url',
      tags: ['api']
    }
  })
}

module.exports = Auth
