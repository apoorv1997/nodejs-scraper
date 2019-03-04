const cheerio = require('cheerio');
var express = require('express');
const puppeteer = require('puppeteer');
const url = 'https://medium.com/';
const fs = require('fs');
const links = [];
const internalLinks = [];
const maxConnections = 5; //setting max connection for concurrency. 
var runningConnections = 0; //to check for the number of jobs running.

getLinks = async () => {
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
}

scrapSite = async (links) =>  {
    if(links.length===0 && runningConnections <= maxConnections) // condition to maintain number of jobs running to max connection.
        return internalLinks;
    else if(runningConnections < maxConnections) {
        runningConnections++;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(links[0], {waitUntil: 'load', timeout: 0});
        const html = await page.content();
        $ = cheerio.load(html);
        $('.section-content > .section-inner > p > a').each(function(i, value) {
            var link = $(value).attr('href');
            internalLinks.push(link);
        })
        const Data = {
            "Page Link":links[0],
            "Links":internalLinks
        }
        fs.appendFile('links.txt', JSON.stringify(Data)+"\n",'utf-8', function (err) {
            if (err) throw err;
            console.log('Saved!');
            runningConnections--;
        });
        await browser.close();
        console.log(links);
        scrapSite(links.slice(1)); //calling helper function recursively.
    }
    else if(runningConnections > maxConnections) {
        console.log("Number of jobs exceeded");
    }
    console.log("Finished");
}

getLinks();