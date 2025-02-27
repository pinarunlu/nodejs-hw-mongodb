import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (fileBuffer) => {
  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
        return result.secure_url;
      }
    );

    uploadStream.end(fileBuffer);
  } catch (error) {
    console.error(error);  // Hata loglaması
    throw error;  // Daha üst katmanlarda yakalanabilmesi için hata fırlatılıyor
  }
};

export default uploadToCloudinary;
