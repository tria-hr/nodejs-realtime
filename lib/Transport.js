const NATS = require('nats')
const Response = require('./Response')
const Message = require('./Message')

const debug = false

module.exports = Transport = class Transport {

	constructor(options) {
		this.options = Object.assign({}, options)
	}

	_____connect() {
		this.transport = NATS.connect({
			servers: this.options.servers,
			name: this.options.name
		})
	}

	_____startRPC() {
		if (!this.transport)
			throw new Error(`Can't start RPC without active transport`)

		this.transport.subscribe(`rpc.${this.options.name}`, { queue: this.options.name }, this._____onMessage.bind(this))
	}

	async _____onMessage(encodedMessage, replyTo) {
		if (debug) console.debug(`${this.options.name} got message ${encodedMessage}`)

		const { method, args } = Message.decode(encodedMessage)

		if (method === 'constructor' || method.startsWith('_____'))
			return this.transport.publish(replyTo, Response.error('Protected method'))
		if (!this[method])
			return this.transport.publish(replyTo, Response.error('Unknown method'))

		try {
			const result = await this[method].apply(this, args)
			return this.transport.publish(replyTo, Response.result(result))
		} catch (e) {
			return this.transport.publish(replyTo, Response.error('exception:' + e.toString()))
		}
	}

	async _____call(service, method, args = []) {
		if (debug) console.debug(`${this.options.name} is making a call to ${service}.${method}(${args.map(a => a.toString())})`)

		return new Promise((resolve, reject) => {
			this.transport.requestOne(`rpc.${service}`, Message.encode(method, args, this.options.compression), {}, 30000, response => {
				if (response instanceof NATS.NatsError)
					return reject(response)

				const error = Response.getError(response)
				if (error)
					return reject(error)

				resolve(Response.getResult(response))
			})
		})
	}

}

Transport.defaults = {
	servers: [],
	compression: true
}