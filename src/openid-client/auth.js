const errorFactory = require('error-factory')
const AuthError = errorFactory('Autherror')

const state = 'xyc6'

const { Issuer } = require('openid-client')

const Discovery = async () => {
	try {
		return await Issuer.discover(process.env.COGNITO_DISCOVERY_ENDPOINT)
	} catch (error) {
		console.error(error.message)
		throw AuthError(error)
	}
}

const Callback = async (response, request) => {
	try {
		const issuer = await Discovery()
		const client = new issuer.Client({
			client_id: process.env.APP_AUTH_CODE_CLIENT_ID,
			client_secret: process.env.APP_AUTH_CODE_CLIENT_SECRET,
			redirect_uris: [process.env.APP_AUTH_CODE_CALLBACK],
			response_types: ['code']
			// id_token_signed_response_alg (default "RS256")
			// token_endpoint_auth_method (default "client_secret_basic")
		})
		const params = client.callbackParams(request)
		const nonce = ''
		return await client.callback(process.env.APP_AUTH_CODE_CALLBACK, params, { nonce })
	} catch (error) {
		console.error(error.message)
		return response.response(error).code(400)
	}
}

const GetAuthUrl = async (response) => {
	try {
		const { authorization_endpoint } = await Discovery()

		return response
			.response({
				auth: `${authorization_endpoint}?scope=${process.env.APP_AUTH_CODE_SCOPES}&response_type=code&client_id=${process.env.APP_AUTH_CODE_CLIENT_ID}&redirect_uri=${process.env.APP_AUTH_CODE_CALLBACK}&state=${state}`
			})
			.code(200)
	} catch (error) {
		console.error(error.message)
		return response.response(error).code(400)
	}
}

module.exports = { Discovery, Callback, GetAuthUrl }
