const errorFactory = require('error-factory')
const AuthError = errorFactory('Autherror')

const state = 'xyc6'

const Discovery = async (axios) => {
  try {
    const { data } = await axios.get(process.env.COGNITO_DISCOVERY_ENDPOINT)

    return data
  } catch (error) {
    console.error(error.message)
    throw AuthError(error)
  }
}

const Callback = async (response, axios, code, state) => {
  try {
    const discovery = await Discovery(axios)

    var result = await axios.post(
      discovery.token_endpoint,
      {
        code: code,
        state: state,
        client_id: process.env.APP_AUTH_CODE_CLIENT_ID,
        client_secret: process.env.APP_AUTH_CODE_CLIENT_SECRET,
        grant_type: process.env.APP_AUTH_CODE_GRANT_TYPE,
        redirect_uri: process.env.APP_AUTH_CODE_CALLBACK
      }
    )

    return result

  } catch (error) {
    console.error(error.message)
    return response.response(error).code(400)
  }
}

const GetAuthUrl = async (response, axios) => {
  try {
    const { authorization_endpoint } = await Discovery(axios)

    return response.response({
      auth: `${authorization_endpoint}?scope=${process.env.APP_AUTH_CODE_SCOPES}&response_type=code&client_id=${process.env.APP_AUTH_CODE_CLIENT_ID}&redirect_uri=${process.env.APP_AUTH_CODE_CALLBACK}&state=${state}`
    }).code(200)
  } catch (error) {
    console.error(error.message)
    return response.response(error).code(400)
  }
}

module.exports = { Discovery, Callback, GetAuthUrl }
