const Service = require('../lib/Service')

class TimeService extends Service {

	getCurrentTime() {
		return new Date().toISOString()
	}

}

TimeService.publish('me.code.demo')