import puppeteer from "puppeteer-core";


(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Adjust this path if needed
        headless: false // Set to false if you want to see the browser actions
    });

    const page = await browser.newPage();
    const url = 'https://www.cars.co.za/usedcars/'; // Replace with the actual URL

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.waitForSelector('a.card_root__kAJ_V.VehicleCard_vehicleCard__IpXY2.vehicle-card', { timeout: 60000 });

        const data = await page.evaluate(() => {
            const getDataFromElement = (element, selector, attribute = null) => {
                const selectedElement = element.querySelector(selector);
                return attribute ? selectedElement?.getAttribute(attribute) : selectedElement?.innerText.trim();
            };

            const listings = document.querySelectorAll('a.card_root__kAJ_V.VehicleCard_vehicleCard__IpXY2.vehicle-card');

            return Array.from(listings).map(listing => ({
                imageUrl: getDataFromElement(listing, 'img.VehicleCard_vehicleMainImage__34Kmy', 'src'),
                title: getDataFromElement(listing, 'h3.title_root__U3F4v'),
                price: getDataFromElement(listing, 'h3.vehicle-price'),
                estimatedMonthlyPayment: getDataFromElement(listing, 'span.mantine-focus-auto.m-b6d8b162[data-size="md"]'),
                mileage: getDataFromElement(listing, 'div.m-8bffd616.mantine-Flex-root.__m__-R1muqrddlm1t35lnm span.mantine-focus-auto.m-b6d8b162[data-size="md"]'),
                transmission: getDataFromElement(listing, 'div.m-8bffd616.mantine-Flex-root.__m__-R2muqrddlm1t35lnm span.mantine-focus-auto.m-b6d8b162[data-size="md"]'),
                fuelType: getDataFromElement(listing, 'div.m-8bffd616.mantine-Flex-root.__m__-R3muqrddlm1t35lnm span.mantine-focus-auto.m-b6d8b162[data-size="md"]'),
                location: getDataFromElement(listing, 'div.m-8bffd616.mantine-Flex-root.__m__-Rurbddlm1t35lnm p.mantine-focus-auto.area.region.m-b6d8b162[data-size="md"]'),
                link: `https://example.com${getDataFromElement(listing, 'a.card_root__kAJ_V', 'href')}`
            }));
        });

        console.log(data);
    } catch (error) {
        console.error('Scrape failed:', error);
    } finally {
        await browser.close();
    }
})();

