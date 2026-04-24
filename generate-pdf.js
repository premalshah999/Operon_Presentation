import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const URL = 'http://localhost:8888';
const WIDTH = 1440;
const VIEWPORT_H = 900;

(async () => {
    console.log('Starting Vite server...');
    const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 4000));

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: VIEWPORT_H, deviceScaleFactor: 2 });
    await page.emulateMediaType('screen');

    console.log('Loading page...');
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

    // Inject CSS to force everything visible, kill transitions
    await page.addStyleTag({
        content: `
            html { scroll-behavior: auto !important; }
            .reveal, .reveal.up, .reveal.down, .reveal.left, .reveal.right, .reveal.scale {
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }
            nav, .progress-bar { display: none !important; }
            .recharts-tooltip-wrapper { display: none !important; }
        `
    });

    // Scroll through to trigger intersection observers
    console.log('Scrolling to trigger all observers...');
    await page.evaluate(async () => {
        const totalHeight = document.body.scrollHeight;
        for (let pos = 0; pos <= totalHeight; pos += 200) {
            window.scrollTo(0, pos);
            await new Promise(r => setTimeout(r, 50));
        }
        // Force all reveals visible via JS too
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        window.scrollTo(0, 0);
    });

    // Wait for Recharts to fully render
    await new Promise(r => setTimeout(r, 3000));

    // Force reveals one more time (in case observer callbacks reset things)
    await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    });

    // Get all section elements and their positions
    console.log('Measuring sections...');
    const sections = await page.evaluate(() => {
        const sects = document.querySelectorAll('section, [id="inaction"]');
        const results = [];
        sects.forEach(s => {
            const rect = s.getBoundingClientRect();
            const scrollTop = window.scrollY;
            results.push({
                id: s.id || s.className,
                top: rect.top + scrollTop,
                height: rect.height,
            });
        });
        return results;
    });

    console.log(`Found ${sections.length} sections`);
    sections.forEach(s => console.log(`  ${s.id}: top=${s.top}, height=${s.height}`));

    // Get the total document height
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Total document height: ${totalHeight}px`);

    // Capture the page in overlapping strips and stitch via a single full-page screenshot
    // The simplest reliable approach: use clip to capture strips at the correct scroll position
    const strips = [];
    let y = 0;
    const stripHeight = VIEWPORT_H;
    
    while (y < totalHeight) {
        const captureH = Math.min(stripHeight, totalHeight - y);
        
        // Scroll to position
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await new Promise(r => setTimeout(r, 2200));
        
        // Force reveals visible again after scroll
        await page.evaluate(() => {
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        });
        
        const filename = `strip_${strips.length}.png`;
        await page.screenshot({
            path: filename,
            clip: { x: 0, y: y, width: WIDTH, height: captureH },
        });
        strips.push({ filename, height: captureH });
        console.log(`Captured strip ${strips.length}: y=${y}, h=${captureH}`);
        
        y += stripHeight;
    }

    // Now we need to combine strips into a single PDF
    // Create an HTML page that displays all strips vertically, then PDF that
    console.log('Stitching strips into PDF...');
    
    const stitchPage = await browser.newPage();
    await stitchPage.setViewport({ width: WIDTH, height: VIEWPORT_H, deviceScaleFactor: 2 });
    await stitchPage.emulateMediaType('screen');
    
    // Build HTML with embedded images
    const fs = await import('fs');
    const path = await import('path');
    
    let imagesHtml = '';
    for (const strip of strips) {
        const imgPath = path.resolve(strip.filename);
        const imgBuffer = fs.readFileSync(imgPath);
        const base64 = imgBuffer.toString('base64');
        imagesHtml += `<img src="data:image/png;base64,${base64}" style="width:${WIDTH}px; display:block;" />\n`;
    }

    const html = `<!DOCTYPE html><html><head><style>
        * { margin: 0; padding: 0; }
        body { width: ${WIDTH}px; }
        img { display: block; }
    </style></head><body>${imagesHtml}</body></html>`;
    
    await stitchPage.setContent(html, { waitUntil: 'networkidle0' });
    
    const stitchedHeight = await stitchPage.evaluate(() => document.body.scrollHeight);
    console.log(`Stitched page height: ${stitchedHeight}px`);

    await stitchPage.pdf({
        path: 'Operon_Intelligence_Presentation.pdf',
        width: `${WIDTH}px`,
        height: `${stitchedHeight}px`,
        printBackground: true,
        pageRanges: '1',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // Clean up strip files
    for (const strip of strips) {
        fs.unlinkSync(strip.filename);
    }
    // Clean up old full screenshot if exists
    try { fs.unlinkSync('Operon_Intelligence_Presentation_full.png'); } catch {}

    await browser.close();
    server.kill();
    console.log('PDF saved as Operon_Intelligence_Presentation.pdf');
    process.exit(0);
})();
