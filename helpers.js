require('dotenv').config();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid');

// Procesando y guardando imagen

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

async function processAndSaveImage(messageImage) {
  // Comprobando si existe el directorio
  await fs.ensureDir(imageUploadPath);
  // Generando nombre aleatorio con uuid
  const savedImageName = `${uuid.v1()}.jpg`;
  // Procesando imagen con sharp
  const finalImage = sharp(messageImage.data).resize(500);

  //Guardamos la imagen
  await finalImage.toFile(path.join(imageUploadPath, savedImageName));

  //Devolvemos el nombre de la imagen
  return savedImageName;
}

// Borrar imagen

async function deleteImage(imagePath) {
  await fs.unlink(path.join(imageUploadPath, imagePath));
}

module.exports = { processAndSaveImage, deleteImage };
