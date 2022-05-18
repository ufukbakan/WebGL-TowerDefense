const { JSDOM } = require("jsdom");
const dom = new JSDOM();
const gl = require("gl");
const { Canvas } = require("canvas");

const canvas = new Canvas(640,640);
canvas.addEventListener = jest.fn( (x,y)=>{undefined} );
jest.spyOn(canvas, "getContext").mockReturnValue( gl(640,640) );

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const nodefetch = require("node-fetch");
global.fetch = require("jest-mock-fetch").default;
global.Request = nodefetch.Request;
global.Headers = nodefetch.Headers;

jest.mock("../modelPlacer");
const modelPlacer = require("../modelPlacer");
modelPlacer.mockImplementation(
    (scene, path, pos, rot=[0,0,0], sca=[1,1,1])=>{
        const { Object3D } = require("three");
        // GLTF LOADER JEST İLE SONSUZ DÖNGÜYE GİRDİĞİ İÇİN BOŞ MODEL MOCKLANDI :
        const model = new Object3D();
        model.position.set(pos[0], pos[1], pos[2]);
        model.rotation.set(rot[0], rot[1], rot[2]);
        model.userData.direction = model.rotation.y * Math.PI/180;
        model.scale.set(sca[0], sca[1], sca[2]);
        scene.add(model);
        return model;
    }
)

const loadScene = require("../loadScene");
jest.setTimeout(30000);

beforeEach( ()=>{
    //console.log("im working...");
} )

test("Main scene test", async () => {
    const [scene, renderer, camera] = await loadScene(canvas);
    let objectNames = [];
    scene.traverse(
        (obj)=>{
            objectNames.push(obj.name);
        }
    );

    expect( objectNames.includes("Ground") ).toBe(true);
    expect( objectNames.includes("Base") ).toBe(true);
}
)