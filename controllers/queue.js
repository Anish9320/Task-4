require("dotenv").config()
const {Queue} = require("bullmq")
const {Worker} = require("bullmq")
const IORedis = require("ioredis")

const { CreateAndUploadThumbnail, CreateAndUploadWatermark } = require('./imageProcessing');

const connection = new IORedis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
    password:process.env.PASSWORD,
    tls: true
});
const imageQueue = new Queue('image-processing',{connection})

const imageWorker = new Worker('image-processing',async job=>{
    const { imageUrl } = job.data
    console.log('Processing job for: ',imageUrl)

    const thumbResult = await CreateAndUploadThumbnail(imageUrl)
    const watermarkResult = await CreateAndUploadWatermark(imageUrl)

    if(thumbResult !== true || watermarkResult !== true){
        throw new Error(`Failed processing: ${thumbResult || watermarkResult}`)
    }

    return true;
},{connection});

module.exports = imageQueue