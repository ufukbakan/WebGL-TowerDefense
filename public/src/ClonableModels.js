const { modelPlacer, modelLoader } = require("./modelPlacer");

class ClonableModels {
    constructor(scene) {
        this.scene = scene;
        this.MODELS = {};
        this.ASSETS_LOAD_POS = [0, -10, 0];
    }

    async init() {
        const boyModel = await modelLoader("Boy");
        this.MODELS.Boy = boyModel;
        const baseTowerModel = await modelLoader("BaseTower");
        this.MODELS.BaseTower = baseTowerModel;
    }

    getModels() {
        return this.MODELS;
    }
}

module.exports = {ClonableModels};

