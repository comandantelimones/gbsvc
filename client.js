const zmq = require('zeromq')

class Utility {
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

//------------------------------------------------------------------------------
class ServiceClient {
    //--------------------------------------------------------------------------
    constructor(endpoint) {
        this.socket = zmq.createSocket('req')
        this.socket.on('message', res => this.processResponse(res))
        this.socket.connect(endpoint)
        this.replyMap = new Map()
    }

    //--------------------------------------------------------------------------
    invoke(method, args) {
        let message = {
            id: Utility.getRandomInt(65536),
            method: method,
            arg: args
        }
        
        return new Promise((resolve, reject) => {
            this.replyMap.set(message.id, {resolve: resolve, reject: reject})
            this.socket.send(JSON.stringify(message))
        })
    }

    //--------------------------------------------------------------------------
    async invokeSync(method, args) {
        return await this.invoke(method, args)
    }

    //--------------------------------------------------------------------------
    processResponse(res) {
        console.log('[CLIENT] Got raw response', res)
        let response = JSON.parse(res)
        let id = response.id
        let status = response.status

        if (this.replyMap.has(id)) {
            let cb = this.replyMap.get(id)
            this.replyMap.delete(id)
            if (status == 'ok') {
                console.log('[DEBUG][CLIENT]', response)
                cb.resolve(response.content)
            } else {
                console.log('[DEBUG][CLIENT]', response)
                cb.reject(response.content)
            }
        } else {
            console.log('[FAIL] Unrecognized response id', id)
        }
    }
}

module.exports = {
    ServiceClient: ServiceClient
}