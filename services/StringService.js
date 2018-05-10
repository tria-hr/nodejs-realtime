const Service = require('../lib/Service')

class StringService extends Service {

	reverse(input) {
		return input.split('').reverse().join('')
	}

}

StringService.publish('me.code.demo')