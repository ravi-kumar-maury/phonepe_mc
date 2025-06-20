const RolloutStrategy = require('./RolloutStrategy');

class BetaRolloutStrategy extends RolloutStrategy {
    constructor(deviceIds) {
        super();
        this.deviceIds = deviceIds;
    }
    apply(devices) {
        return devices.filter(d => this.deviceIds.includes(d.id));
    }
}

module.exports = BetaRolloutStrategy;
