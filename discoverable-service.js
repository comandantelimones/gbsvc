const zmq = require('zeromq')
const BaseService = require('./base-service').BaseService
const ServiceClient = require('./client').ServiceClient

//------------------------------------------------------------------------------
class DiscoverableService extends BaseService {
    //--------------------------------------------------------------------------
    constructor(name, endpoint, discovery) {
        super(name, endpoint)
        this.discovery = new ServiceClient(discovery)

        this.discovery.invoke("register", this.manifest).then(
            (x) => { console.log('[REG] Service registration successful', x) },
            (x) => { console.log('[REG] Service registration failed', x)}
        )
    }

    //--------------------------------------------------------------------------
    stop() {
        this.discovery.invokeSync('deregister', this.name)
    }
}

module.exports = {
    DiscoverableService: DiscoverableService
}