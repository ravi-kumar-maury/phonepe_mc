const RolloutStrategy = require('./RolloutStrategy');

class PercentageRolloutStrategy extends RolloutStrategy {
    constructor(percentage) {
        super();
        this.percentage = percentage;
    }
    apply(devices) {
        const count = Math.ceil(devices.length * this.percentage / 100);
        return devices.slice(0, count);
    }
}

module.exports = PercentageRolloutStrategy;
