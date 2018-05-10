const Transport = require('./lib/Transport')
Transport.defaults.servers = ['nats://167.99.211.209:64222']

const Client = require('./lib/Client')

require('./services/StringService')
require('./services/TimeService')

async function sleep(timeout) {
	return new Promise(resolve => setTimeout(resolve, timeout))
}

async function main() {
	await sleep(250)

	const client = new Client()

	const TimeService = client.rpc.me.code.demo.TimeService
	const StringService = client.rpc.me.code.demo.StringService

	try {
		const now = await TimeService.getCurrentTime()
		console.log('     Now:', now)

		console.log('Reversed:', await StringService.reverse(now))
	} catch (e) {
		console.log('main.exception:', e)
	}
}

main()