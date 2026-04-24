import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const URL = 'http://localhost:8888';

(async () => {
    console.log('Starting Vite server...');
    const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 4000));

    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a standard monitor viewport
    await page.setViewport({ width: 1440, height: 900 });
    
    console.log('Loading page...');
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Step 1: Force all elements visible, disable transitions, and MOST IMPORTANTLY:
    // override min-height: 100vh to an exact pixel value so the print renderer doesn't explode
    await page.addStyleTag({
        content: `
            .reveal, .reveal.up, .reveal.down, .reveal.left, .reveal.right, .reveal.scale {
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }
            .slide {
                min-height: 900px !important;
                height: auto !important;
            }
            nav, .progress-bar { display: none !important; }
        `
    });

    console.log('Scrolling to trigger lazily loaded elements...');
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                document.querySelectorAll('.reveal').forEach(el => {
                    el.classList.add('visible');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 2000));

    // Get the exact document height so we can create a single massive page
    const fullHeight = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight, 
            document.documentElement.scrollHeight
        );
    });

    console.log(`Generating native PDF with height: ${fullHeight}px...`);
    await page.pdf({
        path: 'Operon_Intelligence_Presentation.pdf',
        width: '1440px',
        height: `${fullHeight}px`,
        printBackground: true,
        pageRanges: '1',
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();
    server.kill();
    console.log('PDF saved natively with clickable hyperlinks!');
    process.exit(0);
})();
