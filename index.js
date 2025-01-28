import express from "express";
import { webkit } from "playwright-webkit";
const API_PASSWORD = process.env["API_PASSWORD"] ?? "password";
console.log("Password: ", API_PASSWORD);
async function main(){
    const app = express();
    app.get("/screenshot", async (req, res) => {
        let { url, password, width = 800, height = 480 } = req.query;
    
        if (password !== API_PASSWORD) {
            return res.status(401).json({ error: "Unauthorized: Incorrect password." });
        }
    
        if (!url) {
            return res.status(400).json({ error: "Bad Request: 'url' parameter is required." });
        }
    
        try {
            url = atob(url);
        } catch (error) {
            return res.status(400).json({ error: "Bad Request: Invalid URL (base64)" + error.message });
        }
    
        try {
            const browser = await webkit.launch();
            const context = await browser.newContext({ viewport: { width: parseInt(width), height: parseInt(height) },  ignoreHTTPSErrors: true });
            const page = await context.newPage();
    
            await page.goto(url, {timeout: 10000});
            const screenshot = await page.screenshot();
    
            await browser.close();
            res.type("image/png").send(screenshot);
        } catch (err) {
            res.status(500).json({ error: `Failed to capture screenshot: ${err.message}` });
        }
    });
    
    app.listen(5000, () => console.log("Server running on port 5000"));
    
}

main();