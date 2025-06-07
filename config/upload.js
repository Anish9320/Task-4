require("dotenv").config()
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadBase64ToCloudinary = async (base64Data, prefix) => {
    const publicId = `${prefix}_${crypto.randomBytes(8).toString('hex')}`;

    try {
        var result = ''
        result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
            public_id: publicId,
            resource_type: 'image',
            upload_preset: 'sspdimages'
        })
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        throw new Error('Failed to upload image to Cloudinary')
    }
}

module.exports = { uploadBase64ToCloudinary }