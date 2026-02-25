const { chromium } = require('playwright');

async function scrapeTables() {
    const seeds = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let totalSum = 0;
    const browser = await chromium.launch();
    const context = await browser.newContext();

    console.log('Starting scrape for seeds 2 to 11...');

    for (const seed of seeds) {
        const page = await context.newPage();
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;

        try {
            await page.goto(url, { waitUntil: 'networkidle' });

            // Wait for tables to load
            await page.waitForSelector('table', { timeout: 10000 }).catch(() => null);

            // Extract all text content from table cells (td and th)
            const cellTexts = await page.$$eval('td, th', cells => cells.map(cell => cell.innerText));

            let seedSum = 0;
            for (const text of cellTexts) {
                // Match all numbers (integers and decimals)
                const matches = text.match(/-?\d+(\.\d+)?/g);
                if (matches) {
                    for (const m of matches) {
                        seedSum += parseFloat(m);
                    }
                }
            }

            console.log(`Seed ${seed}: Sum = ${seedSum}`);
            totalSum += seedSum;

        } catch (error) {
            console.error(`Error processing seed ${seed}: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    console.log('\n' + '='.repeat(40));
    console.log(`FINAL_TOTAL_SUM: ${totalSum}`);
    console.log('='.repeat(40));

    await browser.close();
}

scrapeTables().catch(err => {
    console.error(err);
    process.exit(1);
});

