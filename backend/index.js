const express = require('express')
const PORT = process.env.PORT || 3001
const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const app = express()

app.listen(PORT, ()=>{
  console.log("start")
})

app.get('/api/:reelsId', async (req, res)=> {
  const url = "https://www.instagram.com/reel/" + req.params.reelsId + "/"
  console.log('пришел запрос', req.params.reelsId)
  try {
    const videoUrl = await getLink(url);
    res.send({ success: true, url: videoUrl }); // Отправляем успешный результат
  } catch (error) {
    res.send({ success: false, error: error.message }); // Отправляем ошибку
  }
})
async function getLink(url){
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('video[src]', { timeout: 5000 });
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const videoSrc = $('video').attr('src');
    await browser.close();
    return videoSrc
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error("incorrect link");
    } else {
      throw error; // Прокидываем остальные ошибки без изменений
    }
  }
};