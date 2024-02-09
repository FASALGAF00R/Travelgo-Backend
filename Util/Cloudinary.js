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
  

/*            
we import Cloudinary and configure it with an object consisting of our
 Cloudinary credentials. Next, we define the handleUpload function, which accepts a
  file and attempts to upload the file. The upload is made possible by calling 
  the upload method on the cloudinary object, and it accepts two parameters.
   The first is the file to be uploaded, and the second is an object that holds 
   the options we want for the uploaded file.

When we do uploads from the server, the upload call assumes that 
the file is an image, i.e., resource_type: "image", but setting the
 resource_type to auto automatically detects the file type during the 
 upload process. Once the file is successfully uploaded, the response we get 
 from the API is returned.


*/