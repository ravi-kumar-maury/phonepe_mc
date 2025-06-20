class Device {
    constructor(id, osType, osVersion) {
        this.id = id;
        this.osType = osType;
        this.osVersion = osVersion;
        this.installedApps = {}; // { appName: version }
    }
}

module.exports = Device;
