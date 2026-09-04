

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary credentials from process.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and deletes the temporary local file.
 * @param {string} localFilePath - Path to the local file saved by Multer.
 * @param {string} folder - Folder name in Cloudinary (e.g., 'produce', 'voice_queries').
 * @returns {Promise<object>} Upload response containing secure_url and public_id.
 */
const uploadToCloudinary = async (localFilePath, folder = 'agri_platform') => {
  try {
    if (!localFilePath) return null;

    // Determine resource_type ('auto' supports images, video, audio)
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',
    });

    // Remove file from local disk after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    // Remove temporary local file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};

/**
 * Deletes a file from Cloudinary using its public_id.
 * @param {string} publicId - The public ID of the resource in Cloudinary.
 * @param {string} resourceType - Type of resource ('image', 'video', or 'raw').
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    throw new Error(`Cloudinary Delete Error: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
