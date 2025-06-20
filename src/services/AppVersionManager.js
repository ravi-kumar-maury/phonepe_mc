const App = require('../models/App');
const AppVersion = require('../models/AppVersion');
const installApp = require('../capabilities/installApp');
const updateApp = require('../capabilities/updateApp');
const createDiffPack = require('../capabilities/createDiffPack');
const uploadFile = require('../capabilities/uploadFile');
const getFile = require('../capabilities/getFile');
const BetaRolloutStrategy = require('../strategies/BetaRolloutStrategy');
const PercentageRolloutStrategy = require('../strategies/PercentageRolloutStrategy');

class AppVersionManager {
    constructor(appRepo, deviceRepo) {
        this.appRepo = appRepo;
        this.deviceRepo = deviceRepo;
    }

    uploadNewVersion(appName, version, minOS, fileContent) {
        let app = this.appRepo.getApp(appName);
        if (!app) {
            app = new App(appName);
            this.appRepo.addApp(app);
        }
        const fileUrl = uploadFile(fileContent);
        const appVersion = new AppVersion(version, minOS, fileUrl, appName);
        app.addVersion(appVersion);
        return appVersion;
    }

    createUpdatePatch(appName, fromVersion, toVersion) {
        const app = this.appRepo.getApp(appName);
        if (!app) throw new Error('App not found');
        const fromV = app.getVersion(fromVersion);
        const toV = app.getVersion(toVersion);
        if (!fromV || !toV) throw new Error('Version not found');
        const fromFile = getFile(fromV.fileUrl);
        const toFile = getFile(toV.fileUrl);
        return createDiffPack(fromFile, toFile);
    }

    releaseVersion(appName, version, strategy, strategyParams) {
        const app = this.appRepo.getApp(appName);
        if (!app) throw new Error('App not found');
        const appVersion = app.getVersion(version);
        if (!appVersion) throw new Error('Version not found');
        let rolloutStrategy;
        if (strategy === 'beta') {
            rolloutStrategy = new BetaRolloutStrategy(strategyParams.deviceIds);
        } else if (strategy === 'percentage') {
            rolloutStrategy = new PercentageRolloutStrategy(strategyParams.percentage);
        } else {
            throw new Error('Unknown strategy');
        }
        const allDevices = this.deviceRepo.getAllDevices();
        const targetDevices = rolloutStrategy.apply(allDevices);
        targetDevices.forEach(device => {
            // If app is not installed, install; else update
            if (!device.installedApps[appName]) {
                installApp(device, appVersion);
                device.installedApps[appName] = version;
            } else {
                const fromVersion = device.installedApps[appName];
                const diffPack = this.createUpdatePatch(appName, fromVersion, version);
                updateApp(device, diffPack);
                device.installedApps[appName] = version;
            }
        });
        return targetDevices.map(d => d.id);
    }

    isAppVersionSupported(appName, version, device) {
        const app = this.appRepo.getApp(appName);
        if (!app) return false;
        const appVersion = app.getVersion(version);
        if (!appVersion) return false;
        // Check OS type and version
        if (appVersion.minOS.osType !== device.osType) return false;
        if (this.compareVersions(device.osVersion, appVersion.minOS.version) < 0) return false;
        return true;
    }

    checkForInstall(appName, device) {
        const app = this.appRepo.getApp(appName);
        if (!app) return false;
        const latest = app.getLatestCompatibleVersion(device, this.compareVersions);
        return !!latest;
    }

    checkForUpdates(appName, device) {
        const app = this.appRepo.getApp(appName);
        if (!app) return null;
        const latest = app.getLatestCompatibleVersion(device, this.compareVersions);
        const installedVersion = device.installedApps[appName];
        if (!installedVersion || !latest) return null;
        if (this.compareVersions(latest.version, installedVersion) > 0) {
            return latest.version;
        }
        return null;
    }

    executeTask(appName, device, taskType) {
        const app = this.appRepo.getApp(appName);
        if (!app) throw new Error('App not found');
        const latest = app.getLatestCompatibleVersion(device, this.compareVersions);
        if (!latest) return 'Not supported';
        if (taskType === 'install') {
            installApp(device, latest);
            device.installedApps[appName] = latest.version;
            return 'Installed';
        } else if (taskType === 'update') {
            const installedVersion = device.installedApps[appName];
            if (!installedVersion) return 'App not installed';
            if (this.compareVersions(latest.version, installedVersion) > 0) {
                const diffPack = this.createUpdatePatch(appName, installedVersion, latest.version);
                updateApp(device, diffPack);
                device.installedApps[appName] = latest.version;
                return 'Updated';
            } else {
                return 'No update available or not supported';
            }
        } else {
            throw new Error('Unknown task type');
        }
    }

    // Helper: compareVersions('1.2.3', '1.2.0') => 1 if first > second, 0 if equal, -1 if first < second
    compareVersions(v1, v2) {
        const a = v1.split('.').map(Number);
        const b = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            const n1 = a[i] || 0;
            const n2 = b[i] || 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }
        return 0;
    }
}

module.exports = AppVersionManager;
