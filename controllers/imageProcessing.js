const { supabase } = require("../config/db")
const { uploadBase64ToCloudinary } = require("../config/upload")
const sharp = require("sharp");
const axios = require("axios");

const CreateAndUploadThumbnail = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const sizes = [
            { name: 'thumbnail_1', width: 100 },
            { name: 'thumbnail_2', width: 300 },
            { name: 'thumbnail_3', width: 600 }
        ]
        if (response.data) {

            for (const size of sizes) {
                const resizedImageBuffer = await sharp(response.data)
                    .resize({ width: size.width })
                    .toBuffer()

                const base64 = resizedImageBuffer.toString('base64')
                const result = await uploadBase64ToCloudinary(base64, size.name);
                if (result != '') {
                    const { data, error } = await supabase
                        .from("images")
                        .update({
                            [size.name]: result //-> dynamic name
                        })
                        .eq('imageUrl', url);
                    if (error) {
                        console.log("Error while updating the thunmbnail data in supabase"+error)
                        return "Error while updating the thunmbnail data in supabase"+error;
                    }

                }
                else {
                    console.log('Error While uploading to cloudinary (Thumbnail)')
                    return 'Error While uploading to cloudinary (Thumbnail)'
                }

            }
            console.log('Thumbnail created and uploaded')
            return true;

        }
        else {
            return 'Error While Creating Thumbails' + response.error;
        }
    } catch (error) {
        return 'Error While Creating Thumbails' + error;
    }
}

const CreateAndUploadWatermark = async (url) => {
    try {
        if (url !== '') {
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            });
            if (response.data) {
                const watermark = await sharp('watermark.jpeg')
                    .resize({ width: 100 })
                    .png()
                    .toBuffer();

                const finalImage = await sharp(response.data)
                    .composite([
                        {
                            input: watermark,
                            gravity: 'center', // position: bottom-right
                        }
                    ])
                    .jpeg()
                    .toBuffer();

                const base64 = finalImage.toString("base64")
                console.log("Watermaked image created")
                const result = await uploadBase64ToCloudinary(base64, 'watermark_image')
                if (result !== '') {
                    const { data, error } = await supabase
                        .from('images')
                        .update({
                            watermark_image: result
                        })
                        .eq('imageUrl', url);

                        if(error){
                            console.log("Update error in supabase while updating watermark image"+error)
                            return 'Update error in supabase while updating watermark image'+error
                        }
                        console.log('Watermark image created and uploaded!')
                        return true;
                }
                else{
                    console.log('Error while uploading watermark image to cloudinary')
                    return 'Error while uploading watermark image to cloudinary'
                }
            }
            else {
                console.error('Error While Fetching the image' + response.error)
                return 'Error While Fetching the image' + response.error
            }
        }
        else{
            return 'Invalid URL passed to watermark function';
        }
    } catch (error) {
        console.log('Error while creating watermark image:'+error)
        return 'Error while Creating the watermark image:'+error
    }
}


module.exports = { CreateAndUploadThumbnail , CreateAndUploadWatermark}