# nodejs-scraper
NodeJS scraper that fetches all the links of post from home page of medium.com and recursively fetches all the links from those posts.


# Setup application
Run the command 'npm i' in root directory to install all the depedencies.
Dependencies used:-
1) cheerio - Able to use Jquery while scraping data from web.
2) express - setting up router for the application.
3) puppeteer - to load dynamic JS generated by website.
4) fs - to create and save data into file.

# Run code 
run the command 'node index.js' and the hit url 'http://localhost:3000/getLinks' which will run a function that fetches all the links of posts on home page of medium.com. Since medium.com uses dynamic JS to load its content that's why puppeteer has been used that loads dynamic JS.
All the links fetched will be saved in 'links.txt' file in form of object => {
    "page link":'link of the post',
    "all links":'array of all the internal links'
}
cheerio has been used in order to use jquery in scraped data, inorder to select only the post's url.