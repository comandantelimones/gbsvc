const BaseService = require('./base-service').BaseService

class DiscoveryService extends BaseService {
    constructor(endpoint) {
        super('discovery', endpoint)

        this.registry = new Map()
        this.registry.set('discovery', this.manifest)
    }

    gbm_register(manifest, reply) {
        // argument here is the manifest -- name, endpoint, methods
        console.log('Registration request for', manifest)
        this.registry.set(manifest.name, manifest)
        reply('ok', [])
    }

    gbm_deregister(name, reply) {
        console.log('Deregistration request for', name)
        if (this.registry.has(name)) {
            this.registry.delete(name)
        }
        reply('ok', [])
    }

    gbm_find(name, reply) {
        console.log('Discovery request for name ', name)
        if (this.registry.has(name)) {
            let manifest = this.registry.get(name)
            console.log('Request satisfied: ', manifest)
            reply('ok', this.registry.get(name))
        } else {
            console.log('Request failed: ', name)
            reply('fail', "Requested service is not registered (yet?)")
        }
    }

    gbm_list(arg, reply) {
        console.log('Service list request')
        let result = []
        this.registry.forEach((v,k) => {
            result.push(k)
        })

        reply('ok', result)
    }
}

module.exports = {
    DiscoveryService: DiscoveryService
}