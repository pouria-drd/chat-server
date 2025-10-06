import ENV from "./env.config";
import { v2 as cloudinary } from "cloudinary";

if (
    ENV.CLOUDINARY_API_KEY === undefined ||
    ENV.CLOUDINARY_CLOUD_NAME === undefined ||
    ENV.CLOUDINARY_API_SECRET === undefined
) {
    throw new Error(
        "Cloudinary API key, Cloudinary cloud name, and Cloudinary API secret are required."
    );
}

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;
