const zmq = require('zeromq')

const prefix = 'gbm_'

//------------------------------------------------------------------------------
class Utility {
    static getAllMethods(obj) {
        let props = []
        let tmp = obj

        do {
            props = props.concat(Object.getOwnPropertyNames(tmp))
        } while(tmp = Object.getPrototypeOf(tmp))
    
        return props.sort().filter((x, i, a) => {
            return (x != a[i+1]) && (typeof(obj[x]) == 'function')
        })
    }

    static getManifest(obj, name, endpoint) {
        let manifest = { name: name }
        const prefixLength = prefix.length

        let methods = Utility.getAllMethods(obj)
        let valid = methods.filter(x => x.startsWith(prefix))

        manifest['methods'] = valid.map(x => x.substr(prefixLength))
        manifest['endpoint'] = endpoint
        return manifest
    }
}

//------------------------------------------------------------------------------
class BaseService {
    constructor(name, endpoint) {
        this.name = name
        this.endpoint = endpoint
        this.manifest = Utility.getManifest(this, name, endpoint)

        this.socket = zmq.createSocket('rep')
        this.socket.on('message', msg => this.processMessage(msg))
        this.socket.bind(this.endpoint, err => {
            if (err) {
                console.log('[BASE] Failed to bind to the endpoint', this.endpoint, err)
            } else {
                console.log('[BASE] Listening on the endpoint', this.endpoint)
            }
        })
    }

    processMessage(raw) {
        const msg = JSON.parse(raw)
        let method = prefix + msg.method
        let arg = msg.arg

        let reply = (status, content) => {
            let response = {
                id: msg.id,
                status: status,
                content: content
            }

            this.socket.send(JSON.stringify(response))
        }

        if (this[method]) {
            this[method](arg, reply)
        } else {
            reply('fail', 'No such method')
        }
    }

    
}

module.exports = {
    BaseService: BaseService
}