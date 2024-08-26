// src/components/imageUtils.js
export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  
  export const getCroppedImageBlob = (image, croppedAreaPixels) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const { width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      width,
      height
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };
  