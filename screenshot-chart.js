import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';

const URL = 'http://localhost:8888';

(async () => {
    console.log('Starting server...');
    const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 4000));

    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    
    await page.goto(URL, { waitUntil: 'networkidle0' });
    
    // Scroll to the inaction section where the chart is
    await page.evaluate(() => {
        document.querySelector('#inaction').scrollIntoView();
    });
    
    // Wait for Recharts to fully animate and draw
    console.log('Waiting for chart animations...');
    await new Promise(r => setTimeout(r, 4000));
    
    // Select the chart container and screenshot it
    const chartElement = await page.$('.recharts-responsive-container, .recharts-wrapper, #inaction > div > div:nth-child(2) > div');
    
    if (chartElement) {
        await chartElement.screenshot({
            path: 'public/chart.png'
        });
        console.log('Successfully saved public/chart.png!');
    } else {
        console.log('Could not find chart element!');
        await page.screenshot({ path: 'public/chart.png' });
    }
    
    await browser.close();
    server.kill();
    process.exit(0);
})();
