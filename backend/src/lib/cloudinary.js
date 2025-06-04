import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";
// Allows to grab from .env file
config();
// Configs clodinary for use
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
