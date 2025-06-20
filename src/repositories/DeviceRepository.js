class DeviceRepository {
    constructor() {
        this.devices = {};
    }
    getDevice(deviceId) {
        return this.devices[deviceId];
    }
    addDevice(device) {
        this.devices[device.id] = device;
    }
    getAllDevices() {
        return Object.values(this.devices);
    }
}

module.exports = DeviceRepository;
