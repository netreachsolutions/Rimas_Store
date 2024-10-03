import React, { useState, useRef, useCallback } from 'react';
import { FaRegImages } from "react-icons/fa";
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // The function to get cropped images

const UploadImages = ({ onImagesChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [fileName, setFileName] = useState(null); // Store file extension

  const fileInputRefs = useRef([]); // Array of file input refs for each slot

  // Initialize input refs for each slot
  const initializeRefs = (totalSlots) => {
    if (fileInputRefs.current.length !== totalSlots) {
      fileInputRefs.current = Array(totalSlots)
        .fill()
        .map((_, index) => fileInputRefs.current[index] || React.createRef());
    }
  };

  const handleFileClick = (index) => {
    if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
      fileInputRefs.current[index].current.click();
    }
  };

  const handleFileChange = (e, index) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setIsEditing(true); // Enable cropping mode
        setEditingImageId(null); // Reset editing image ID for new image uploads
      });
      reader.readAsDataURL(file);

      // Reset the input value to allow re-uploading another file
      if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
        fileInputRefs.current[index].current.value = ''; // Reset the input value after handling
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, 3 / 4); // Crop the image
      const newImage = {
        id: images.length + 1, // Assign a unique id
        file: croppedImageBlob, // Add blob to the object
        url: URL.createObjectURL(croppedImageBlob), // Preview URL
        priority: images.length + 1,
        fileName, // Add file extension
      };

      setImages((prevImages) => {
        // If editingImageId is set, update the specific image
        if (editingImageId !== null) {
          const updatedImages = [...prevImages];
          updatedImages[editingImageId] = newImage;
          onImagesChange(updatedImages); // Pass updated images with blob and extension
          return updatedImages;
        }
        // If no editingImageId, append the new image
        const updatedImages = [...prevImages, newImage];
        onImagesChange(updatedImages); // Pass updated images with blob and extension
        return updatedImages;
      });

      setImageSrc(null); // Close the image cropping editor
      setIsEditing(false);
      setEditingImageId(null); // Reset the editing image ID
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleRemoveImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handlePriorityChange = (id, direction) => {
    const index = images.findIndex((img) => img.id === id);
    if (direction === 'up' && index > 0) {
      const newImages = [...images];
      const temp = newImages[index - 1];
      newImages[index - 1] = newImages[index];
      newImages[index] = temp;
      setImages(newImages);
      onImagesChange(newImages);
    } else if (direction === 'down' && index < images.length - 1) {
      const newImages = [...images];
      const temp = newImages[index + 1];
      newImages[index + 1] = newImages[index];
      newImages[index] = temp;
      setImages(newImages);
      onImagesChange(newImages);
    }
  };

  const totalSlots = 3; // Adjust the total number of image slots (3x2)
  const vacantSlots = totalSlots - images.length;

  // Initialize refs on first render
  React.useEffect(() => {
    initializeRefs(totalSlots);
  }, [totalSlots]);

  return (
    <div className='flex w-full h-[200px]'>
      {/* Grid for images */}
      <div className='grid grid-cols-3 gap-0 flex-grow w-1/3 h-[200px] bg-gray-200  '>
        {images.map((img, index) => (
          <div key={img.id} className="relative w-full h-[200px] border-2 border-dashed border-gray-400">
            <img
              src={img.url}
              alt="uploaded"
              className="m-auto h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="px-2 py-1 bg-green-600 hover:bg-green-700"
                onClick={() => handlePriorityChange(img.id, 'up')}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                className="px-2 py-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleRemoveImage(img.id)}
              >
                ✕
              </button>
              <button
                className="px-2 py-1 bg-green-600 hover:bg-green-700"
                onClick={() => handlePriorityChange(img.id, 'down')}
                disabled={index === images.length - 1}
              >
                ↓
              </button>
            </div>
          </div>
        ))}

        {Array(vacantSlots).fill(null).map((_, index) => (
          <div key={`vacant-${index}`}
            className="w-full h-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:cursor-pointer"
            onClick={() => handleFileClick(index)}
          >
            <FaRegImages className='text-[75px]' />
            <h2 className='font-medium'>Add</h2>
            <input
              type="file"
              ref={fileInputRefs.current[index]} // Assign each input its unique ref
              onChange={(e) => handleFileChange(e, index)}
              className="hidden"
              accept="image/*"
            />
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 pt-[55px] x-6 max-w-[500px] rounded-lg shadow-lg w-3/4 h-4/5">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-6 bg-red-500 text-white px-4 py-1 rounded-md z-50 hover:bg-red-600"
            >
              Close
            </button>
            <div className="crop-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <button
              type="button"
              onClick={handleImageUpload}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Upload Cropped Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImages;
