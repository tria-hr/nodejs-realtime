module.exports = Message = class Message {

	// encode 
	static encodeValue(value) {
		if (Buffer.isBuffer(value))
			return 'b' + value.toString('base64')

		switch (typeof value) {
			case 'string': return 's' + value
			default: return value
		}
	}

	static decodeValue(value) {
		if (typeof value === 'string' && value.length > 0) {
			switch (value[0]) {
				case 's': return value.substr(1)
				case 'b': return Buffer.from(value.substr(1), 'base64')
			}
		}
		return value
	}

	static encode(method, args) {
		return JSON.stringify({
			m: method,
			a: args.map(this.encodeValue)
		})
	}

	static decode(encoded) {
		const decoded = JSON.parse(encoded)
		return {
			method: decoded.m,
			args: decoded.a.map(this.decodeValue)
		}
	}

}