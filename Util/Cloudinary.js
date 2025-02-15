import { v2 as cloudinary } from 'cloudinary';
import env from 'dotenv';
env.config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

 export  async function handleUpload(file) {
    try {
        const res = await cloudinary.uploader.upload(file, {
          resource_type: "auto",
        });
    
        return res;       
    } catch (error) {
        throw error;

    }
  }
  

