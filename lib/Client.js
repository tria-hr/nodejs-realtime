const Transport = require('./Transport')

const hash = data => require('crypto').createHash('sha256').update(data).digest('hex').substr(0, 10)
const shortid = $ => hash(new Date().getTime().toString() + Math.random().toFixed(8))

function recursiveProxy(callback, base = {}, target = []) {
	return new Proxy(base, {
		get: (object, property) => {
			target.push(property)
			return recursiveProxy(callback, (...args) => callback(target, args), target)
		}
	})
}

module.exports = Client = class Client extends Transport {

	constructor(options = {}) {
		const baseName = 'client-' + shortid()
		super(Object.assign({}, Client.defaults, { name: options.namespace ? options.namespace + '.' + baseName : baseName }, options))

		this._____connect()
	}

	get rpc() {
		return recursiveProxy((parts, args) => {
			const method = parts.pop()
			const service = parts.join('.')

			return this._____call(service, method, args)
		})
	}

}

Client.defaults = Transport.defaults