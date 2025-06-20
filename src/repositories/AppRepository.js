class AppRepository {
    constructor() {
        this.apps = {};
    }
    getApp(appName) {
        return this.apps[appName];
    }
    addApp(app) {
        this.apps[app.name] = app;
    }
}

module.exports = AppRepository;
