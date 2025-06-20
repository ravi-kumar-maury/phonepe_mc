class AppVersion {
    constructor(version, minOS, fileUrl, appName) {
        this.version = version;
        this.minOS = minOS; // { osType: 'android'|'ios', version: string }
        this.fileUrl = fileUrl;
        this.appName = appName;
    }
}

module.exports = AppVersion;
