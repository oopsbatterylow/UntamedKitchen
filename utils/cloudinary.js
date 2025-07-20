
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  require("dotenv").config();
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder, filename) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: filename,
      resource_type: "image"
    });
    console.log(result)
    return result.url;
  } catch (error) {
    throw error;
  }
};

const deleteFromCloudinary = async (folder, filename) => {
  try {
    const publicId = `${folder}/${filename}`;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};



module.exports = {cloudinary,uploadToCloudinary,deleteFromCloudinary};
