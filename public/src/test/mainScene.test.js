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

jest.mock("../GLTFLoader", ()=>{
    const { Object3D } = require("three");
    // GLTF Loader sonsuz döngüye girdiği için object3d döndürmek üzere mocklandı
    class GLTFLoader{
        loadAsync(path){
            return {scene: new Object3D()};
        }
    }
    return {GLTFLoader};
});

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