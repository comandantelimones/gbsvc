const DiscoveryService = require('./discovery-service').DiscoveryService
const config = require('./config')

let discovery = new DiscoveryService(config.discovery)
