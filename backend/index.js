const express = require('express')
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const https = require('https')
const instaSpider = require('insta-spider').instaSpider;
const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())
app.listen(PORT, ()=>{
  console.log("start")
})

app.get('/api/:reelsId', async (req, res)=> {
  const reelsId = req.params.reelsId
  const pathToSave = req.query.pathToSave || null
  const url = "https://www.instagram.com/reel/" + reelsId + "/"
  try {
    const status = await download(url, reelsId, pathToSave);
    console.log(status)
    res.send({ success: true, msg: status}); // Отправляем успешный результат
  } catch (error) {
    res.send({ success: false, error: error.message }); // Отправляем ошибку
  }
}) 


async function download(url, reelId, userPath, maxRetries = 150, retryDelay = 50){
  let retries = 0;
  while (retries < maxRetries) {
    try {
        const spider = await instaSpider();
        const downloadUrl = await spider.downloadReel(url);
        const filePath = userPath ? path.join(userPath, `reel-${reelId}.mp4`) : path.join(__dirname, '../downloads', `reel-${reelId}.mp4`);
        const file = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            https.get(downloadUrl, response => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve(`reel-${reelId}.mp4 successfully downloaded`);
                });
            }).on("error", err => {
                reject(err);
            });
        })

        return `reel-${reelId}.mp4 successfully downloaded`;
    } catch (error) {
        console.error(`Error while loading reel (attempt ${retries + 1}):`);
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying after ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
  }
throw new Error(`error is occured, reel-${reelId}.mp4 couldn't be downloaded`)
}