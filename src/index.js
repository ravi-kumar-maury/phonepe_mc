const AppRepository = require('./repositories/AppRepository');
const DeviceRepository = require('./repositories/DeviceRepository');
const Device = require('./models/Device');
const AppVersionManager = require('./services/AppVersionManager');

// Setup
const appRepo = new AppRepository();
const deviceRepo = new DeviceRepository();
const appManager = new AppVersionManager(appRepo, deviceRepo);

// Create devices
deviceRepo.addDevice(new Device('dev1', 'android', '10.0'));
deviceRepo.addDevice(new Device('dev2', 'android', '9.0'));
deviceRepo.addDevice(new Device('dev3', 'ios', '15.0'));
deviceRepo.addDevice(new Device('dev4', 'android', '11.0'));

// Upload versions
appManager.uploadNewVersion('PhonePe', '1.0.0', { osType: 'android', version: '9.0' }, 'file-content-1.0.0-android');
appManager.uploadNewVersion('PhonePe', '1.1.0', { osType: 'android', version: '10.0' }, 'file-content-1.1.0-android');
appManager.uploadNewVersion('PhonePe', '2.0.0', { osType: 'ios', version: '15.0' }, 'file-content-2.0.0-ios');

// Test checkForInstall
console.log('d1 can install:', appManager.checkForInstall('PhonePe', deviceRepo.getDevice('dev1'))); // true
console.log('d2 can install:', appManager.checkForInstall('PhonePe', deviceRepo.getDevice('dev2'))); // false
console.log('d3 can install:', appManager.checkForInstall('PhonePe', deviceRepo.getDevice('dev3'))); // true

// Test install
console.log('Install on d1:', appManager.executeTask('PhonePe', deviceRepo.getDevice('dev1'), 'install'));
console.log('Install on d2:', appManager.executeTask('PhonePe', deviceRepo.getDevice('dev2'), 'install'));
console.log('Install on d3:', appManager.executeTask('PhonePe', deviceRepo.getDevice('dev3'), 'install'));

// Test update (add a new android version)
appManager.uploadNewVersion('PhonePe', '1.2.0', { osType: 'android', version: '10.0' }, 'file-content-1.2.0-android');
console.log('Update available for d1:', appManager.checkForUpdates('PhonePe', deviceRepo.getDevice('dev1'))); // 1.2.0
console.log('Update on d1:', appManager.executeTask('PhonePe', deviceRepo.getDevice('dev1'), 'update'));

// Test beta rollout
const betaDevices = appManager.releaseVersion('PhonePe', '1.2.0', 'beta', { deviceIds: ['dev4'] });
console.log('Beta rollout devices:', betaDevices);

// Test percentage rollout
const percentDevices = appManager.releaseVersion('PhonePe', '1.2.0', 'percentage', { percentage: 50 });
console.log('Percentage rollout devices:', percentDevices);
