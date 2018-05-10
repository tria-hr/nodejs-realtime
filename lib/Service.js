const Transport = require('./Transport')

module.exports = Service = class Service extends Transport {

	constructor(options) {
		super(options)

		this.options = Object.assign({}, Service.defaults, this.options, options)
	}

	static publish(namespace) {
		const svc = new this({ name: namespace ? namespace + '.' + this.name : this.name })
		svc._____connect()
		svc._____startRPC()
	}

}

Service.defaults = Transport.defaults