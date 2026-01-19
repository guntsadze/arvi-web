import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  images: any[];
  onChange: (images: any[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // დამხმარე ფუნქცია ურლის ამოსაღებად (ობიექტია თუ სტრინგი)
  const getImageUrl = (img: any) => (typeof img === "string" ? img : img.url);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImagesPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
    });

    try {
      const base64Images = await Promise.all(newImagesPromises);
      // ვამატებთ ახალ Base64 სტრინგებს არსებულ მასივში
      onChange([...images, ...base64Images]);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const removeImage = (index: number) => {
    // ვფილტრავთ ძირითად მასივს ინდექსით
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-stone-700 bg-stone-800/30 flex flex-col items-center justify-center p-6 text-stone-500 hover:border-amber-600 hover:text-amber-500 transition-colors cursor-pointer min-h-[160px]"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload className="w-8 h-8 mb-2" />
        <span className="text-xs uppercase font-mono">Upload Photos</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images?.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square border border-stone-700 group"
          >
            <img
              src={getImageUrl(img)} // ვიყენებთ დამხმარე ფუნქციას
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
