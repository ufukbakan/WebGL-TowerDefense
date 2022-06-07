const { modelLoader } = require("./modelPlacer");

class ClonableModels {
    constructor(scene) {
        this.scene = scene;
        this.MODELS = {};
    }

    async init() {
        const boyModel = await modelLoader("Boy");
        this.MODELS.Boy = boyModel;
        const baseTowerModel = await modelLoader("BaseTower");
        this.MODELS.BaseTower = baseTowerModel;
        const turret0Model = await modelLoader("Turret0");
        this.MODELS.Turret0 = turret0Model;
    }

    getModels() {
        return this.MODELS;
    }
}

module.exports = {ClonableModels};

