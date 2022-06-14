describe('Index.html', () => {
    const server = require("../index");

    beforeAll(async () => {
        await page.goto('http://localhost:8080');
    });
  
    test("Title test", async ()=>{
        const title = await page.title();
        expect(title).toEqual("Tower Defense");
    });

    test("Canvas test", async()=>{
        const canvas_count = (await page.$$("canvas")).length;
        expect(canvas_count).toBeGreaterThan(0);
    });

    test("UI test", async()=>{
        expect( await page.$("#ui") ).not.toBeNull();
        expect( await page.$(".info-box") ).not.toBeNull();
        expect( await page.$(".coin-box") ).not.toBeNull();
    });


    afterAll(()=>{
        server.close();
    });

  });