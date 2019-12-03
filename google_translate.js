const puppeteer = require('puppeteer');

(async () => {
	let launchOptions = { headless: false, args: ['--start-maximized'] };
	
	const browser = await puppeteer.launch(launchOptions);
	const page = await browser.newPage();
	
	// set viewport and user agent (just in case for nice viewing)
	await page.setViewport({width: 1366, height: 768});
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
	
	// define source and target language code
	let sourceLang = 'id', targetLang = 'en';

	await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`);
	
	// detect the source textarea for input data (source string)
	await page.waitForSelector('#source');
	await page.waitFor(1000);

	// string that we want to translate and type it on the textarea
	let sourceString = 'Apa kamu sadar kalau muka kamu itu jelek sekali?';
	await page.type('#source', sourceString);

	// wait for the result container available
	await page.waitForSelector('.result-shield-container');
	await page.waitFor(3000);

	// get the result string (translated text)
	const translatedResult = await page.evaluate(() => {
		return document.querySelectorAll('.result-shield-container')[0].textContent;
	});

	// display the source and translated text to console
	console.log(`${sourceLang}: ${sourceString}\n${targetLang}: ${translatedResult}`);
	
	await page.waitFor(1000);
	await browser.close();
})();
