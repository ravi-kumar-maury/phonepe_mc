class App {
    constructor(name) {
        this.name = name;
        this.versions = [];
    }
    addVersion(appVersion) {
        this.versions.push(appVersion);
    }
    getVersion(version) {
        return this.versions.find(v => v.version === version);
    }
    getLatestVersion() {
        return this.versions[this.versions.length - 1];
    }
    getLatestCompatibleVersion(device, compareVersions) {
        const compatible = this.versions.filter(v =>
            v.minOS.osType === device.osType &&
            compareVersions(device.osVersion, v.minOS.version) >= 0
        );
        return compatible.length ? compatible[compatible.length - 1] : null;
    }
}

module.exports = App;
