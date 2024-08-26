// src/components/cropImage.js
import { createImage, getCroppedImageBlob } from './ImageUtils';

const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const image = await createImage(imageSrc);
  const croppedImageBlob = await getCroppedImageBlob(image, croppedAreaPixels);
  return croppedImageBlob;
};

export default getCroppedImg;
