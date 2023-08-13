const express = require('express')
const PORT = process.env.PORT || 3001
const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const app = express()

app.listen(PORT, ()=>{
  console.log("start")
})

app.get('/api/:link', async (req, res)=> {
  const url = "https://www.instagram.com/reel/" + req.params.link + "/"
  //console.log('пришел запрос', req.params.link)
  try{
    const videoUrl = await getLink(url)
    res.send({url:videoUrl, id: req.params.link})
  } catch (error){
    res.send("Возникла ошибка")
  }
})
async function getLink(url){
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector('video[src]');

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const videoSrc = $('video').attr('src');

    await browser.close();

    return videoSrc
  } catch {

  }
  
};