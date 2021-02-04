import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = (file, resourceType, fileCategory) => {
  let promise = new Promise((resolve, reject) => {
    const newFilename = uuidv4();
    file.mv(`${__dirname}/${newFilename}-${file.name}`, (err) => {
      if (err) {
        reject(err);
      }
      cloudinary.uploader
        .upload(`${__dirname}/${newFilename}-${file.name}`, {
          folder: `apps/${fileCategory}`,
          use_filename: true,
          resource_type: resourceType,
        })
        .then((result) => {
          fs.unlink(`${__dirname}/${newFilename}-${file.name}`, () => {
            resolve(result);
          });
        })
        .catch((err) => {
          fs.unlink(`${__dirname}/${newFilename}-${file.name}`, () => {
            reject(err);
          });
        });
    });
  });
  return promise
}

const deleteFile = (public_id) => {
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
      resolve(result);
    });
  });
}