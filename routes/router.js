const express = require("express")
const { GetAllImages, uploadImage, GetImageByUrl } = require("../controllers/imageController")

const router = express.Router()


router.get("/", GetAllImages)
router.post("/upload",uploadImage)
router.post("/images",GetImageByUrl)
module.exports = { router }