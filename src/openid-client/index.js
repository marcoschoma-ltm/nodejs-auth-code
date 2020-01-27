const Joi = require('@hapi/joi')
const { Callback, GetAuthUrl } = require('./auth')

const OpenIdClient = (server) => {
  server.route({
    method: 'GET',
    path: '/auth/callback',
    handler: async (req, res) => {
      return res
        .response({ authorizeURL: await Callback(res, req.query.code, req.query.state) })
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
    path: '/auth',
    handler: async (req, res) => {
      return await GetAuthUrl(res)
    },
    options: {
      description: 'Get the Cognito Authorization URL',
      notes: 'Returns a complete authorization url',
      tags: ['api']
    }
  })
}

module.exports = OpenIdClient
