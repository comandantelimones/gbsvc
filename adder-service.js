const DiscoverableService = require('./discoverable-service').DiscoverableService
const config = require('./config')

class AdderService extends DiscoverableService {
    constructor() {
        super('adder', 'tcp://127.0.0.1:10001', config.discovery)
    }

    gbm_sum(args, reply) {
        let result = args.reduce((p, c) => p+c, 0)
        reply('ok', result)
    }

    gbm_version(args, reply) {
        reply('ok', 'v1.0')
    }
}

let adder = new AdderService()