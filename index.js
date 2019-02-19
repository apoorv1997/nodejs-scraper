const cheerio = require('cheerio');
var express = require('express');
const app = express();
const server = require('http').createServer(app);
const puppeteer = require('puppeteer');
const url = 'https://medium.com/';
const fs = require('fs');
const links = [];
const internalLinks = [];
server.maxConnections = 5;

app.get('/getLinks', async () => {
    console.log("enter");
    puppeteer.launch().then(function(browser) {
    return browser.newPage();
    }).then(function(page) {
        return page.goto(url).then(function() {
            return page.content();
        })
    }).then(function(html) {
        $ = cheerio.load(html);
        $('article > .extremeHero-post > a').each(function(i, value) {
            var link = $(value).attr('href');
            links.push(link)
        })
        $('li > div > a').each(function(i,value) {
            var link = $(value).attr('href');
            links.push(link);
        });
        scrapSite(links);
    }).catch((error) => {
        console.log(error);
    })
});

async function scrapSite(links)  {
    for(let i=0;i<links.length;i++) {
        console.log(`Link${i+1}: ${links[i]}`)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(links[i], {waitUntil: 'load', timeout: 0});
        const html = await page.content();
        $ = cheerio.load(html);
        $('.section-content > .section-inner > p > a').each(function(i, value) {
            var link = $(value).attr('href');
            internalLinks.push(link);
        })
        const Data = {
            "Page Link":links[i],
            "Links":internalLinks
        }
        fs.appendFile('links.txt', JSON.stringify(Data)+"\n",'utf-8', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        await browser.close();
    }
    console.log("Finished");
}
server.listen(3000);
