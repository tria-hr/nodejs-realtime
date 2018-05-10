const Message = require('./Message')

module.exports = class Response {

	static result(result) {
		return JSON.stringify({
			r: Message.encodeValue(result)
		})
	}

	static error(message) {
		return JSON.stringify({
			e: Message.encodeValue(message)
		})
	}

	static getError(encodedResponse) {
		const response = JSON.parse(encodedResponse)
		return Message.decodeValue(response.e)
	}

	static getResult(encodedResponse) {
		const response = JSON.parse(encodedResponse)
		return Message.decodeValue(response.r)
	}
}