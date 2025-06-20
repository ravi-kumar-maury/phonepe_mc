const AppRepository = require('../src/repositories/AppRepository');
const DeviceRepository = require('../src/repositories/DeviceRepository');
const Device = require('../src/models/Device');
const AppVersionManager = require('../src/services/AppVersionManager');

function assertEqual(actual, expected, message) {
    if (actual === expected) {
        console.log('PASS:', message);
    } else {
        console.error(`FAIL: ${message} (expected: ${expected}, got: ${actual})`);
    }
}

// Setup
const appRepo = new AppRepository();
const deviceRepo = new DeviceRepository();
const manager = new AppVersionManager(appRepo, deviceRepo);

deviceRepo.addDevice(new Device('dev1', 'android', '10.0'));
deviceRepo.addDevice(new Device('dev2', 'android', '9.0'));
deviceRepo.addDevice(new Device('dev3', 'ios', '15.0'));
deviceRepo.addDevice(new Device('dev4', 'android', '11.0'));

manager.uploadNewVersion('PhonePe', '1.0.0', { osType: 'android', version: '9.0' }, 'file-content-1.0.0-android');
manager.uploadNewVersion('PhonePe', '1.1.0', { osType: 'android', version: '10.0' }, 'file-content-1.1.0-android');
manager.uploadNewVersion('PhonePe', '2.0.0', { osType: 'ios', version: '15.0' }, 'file-content-2.0.0-ios');

assertEqual(manager.checkForInstall('PhonePe', deviceRepo.getDevice('dev1')), true, 'd1 can install');
assertEqual(manager.checkForInstall('PhonePe', deviceRepo.getDevice('dev2')), false, 'd2 cannot install (latest requires 10.0)');
assertEqual(manager.checkForInstall('PhonePe', deviceRepo.getDevice('dev3')), true, 'd3 can install (ios)');

assertEqual(manager.executeTask('PhonePe', deviceRepo.getDevice('dev1'), 'install'), 'Installed', 'Install on d1');
assertEqual(manager.executeTask('PhonePe', deviceRepo.getDevice('dev2'), 'install'), 'Not supported', 'Install on d2');
assertEqual(manager.executeTask('PhonePe', deviceRepo.getDevice('dev3'), 'install'), 'Installed', 'Install on d3');

manager.uploadNewVersion('PhonePe', '1.2.0', { osType: 'android', version: '10.0' }, 'file-content-1.2.0-android');
assertEqual(manager.checkForUpdates('PhonePe', deviceRepo.getDevice('dev1')), '1.2.0', 'Update available for d1');
assertEqual(manager.executeTask('PhonePe', deviceRepo.getDevice('dev1'), 'update'), 'Updated', 'Update on d1');

const betaDevices = manager.releaseVersion('PhonePe', '1.2.0', 'beta', { deviceIds: ['dev4'] });
assertEqual(Array.isArray(betaDevices) && betaDevices.includes('dev4'), true, 'Beta rollout includes dev4');

const percentDevices = manager.releaseVersion('PhonePe', '1.2.0', 'percentage', { percentage: 50 });
assertEqual(Array.isArray(percentDevices), true, 'Percentage rollout returns array');
