import express from "express";
import { webkit } from "playwright-webkit";
const API_PASSWORD = process.env["API_PASSWORD"] ?? "password";
console.log("Password: ", API_PASSWORD);

function log(...params){
    let d = new Date()
    console.log(d.toLocaleDateString() + " " + d.toLocaleTimeString(), ...params)
}

async function main(){
    const app = express();
    app.get("/screenshot", async (req, res) => {
        let { url, password, width = 800, height = 480 } = req.query;
   
        if (password !== API_PASSWORD) {
            console.log("ERROR, unauthorized")
            return res.status(401).json({ error: "Unauthorized: Incorrect password." });
        }
    
        if (!url) {
            log("ERROR, url parameter missing")
            return res.status(400).json({ error: "Bad Request: 'url' parameter is required." });
        }
    
        try {
            url = atob(url);
        } catch (error) {
            log("ERROR, Invalid URL (base64 malformend)", error.message)
            return res.status(400).json({ error: "Bad Request: Invalid URL (base64)" + error.message });
        }
        log("Got for html2png: ", url)
        let browser;
        try {
            browser = await webkit.launch();
            const context = await browser.newContext({ viewport: { width: parseInt(width), height: parseInt(height) },  ignoreHTTPSErrors: true });
            const page = await context.newPage();
    
            await page.goto(url, {timeout: 60000});
            const screenshot = await page.screenshot();
    
            res.type("image/png").send(screenshot);
        } catch (err) {
            res.status(500).json({ error: `Failed to capture screenshot: ${err.message}` });
        } finally {
            try {
                if(browser)await browser.close();  
            } catch (error) {
                console.error(error)
            }
        }
    });
    
    app.listen(5000, () => console.log("Server running on port 5000"));
    
}

main();