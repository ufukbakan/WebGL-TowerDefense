const { modelPlacer } = require("./modelPlacer");

class ClonableModels {
    constructor(scene) {
        this.scene = scene;
        this.MODELS = {};
        this.ASSETS_LOAD_POS = [0, -10, 0];
        this.init();
    }

    async init() {
        const boyModel = await modelPlacer(this.scene, "Boy", this.ASSETS_LOAD_POS, [0, 0, 0], [0.01, 0.01, 0.01], 1);
        this.MODELS.boy = boyModel;
    }

    getModels() {
        return this.MODELS;
    }
}

module.exports = {ClonableModels};

