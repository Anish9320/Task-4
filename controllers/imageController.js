const { supabase } = require("../config/db")
const { uploadBase64ToCloudinary } = require("../config/upload")
const sharp = require("sharp");
const axios = require("axios");
const imageQueue = require('./queue')

const GetAllImages = async (req, res) => {
    const { data, error } = await supabase
        .from("images")
        .select("*")

    if (error) {
        console.error("Supabase error: ", error.message)
        return res.status(500).send({ message: "supabase error: " + error.message })
    }
    return res.status(200).send({ images: data })
}

const GetImageByUrl = async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).send({ message: "Image url is required!" })
    }
    try {
        const { data, error } = await supabase
            .from("images")
            .select("*")
            .eq('imageUrl', imageUrl)

        if (error) {
            console.log("Error while fetching images" + error.message)
            return res.status(500).send({ message: "Error while fetching images" + error.message })
        }
        if (data.length <= 0) {
            return res.status(500).send({ message: "No data found!", status: false })
        }
        return res.status(200).send({ images: data[0] })
    } catch (error) {
        console.log("Error while fetching images" + error.message)
        return res.status(500).send({ message: "Error while fetching images" + error.message })
    }
}

const uploadImage = async (req, res) => {
    const { image } = req.body;
    if (!image) {
        return res.status(400).send({ message: "Image required!", status: false })
    }
    const url = await uploadBase64ToCloudinary(image, 'original_image')

    if (url != '') {
        const { data, error } = await supabase
            .from('images')
            .insert([
                {
                    imageUrl: url
                }
            ])
        if (error) {
            console.error(error.message)
            return res.status(500).send({ message: 'An error: ' + error.message, status: false })
        }
        await imageQueue.add('process-image', { imageUrl: url })
        return res.status(200).send({ message: "Image uploaded successfully. Processing will continue in the background", data: url, status: true })

    }
    else {
        return res.status(500).send({ message: 'Error While uploading image to cloudinary', status: false })
    }

}
module.exports = { GetAllImages, uploadImage ,GetImageByUrl}