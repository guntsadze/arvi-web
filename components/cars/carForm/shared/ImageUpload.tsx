import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  images: string[]; // Base64 სტრინგების მასივი
  onChange: (images: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onChange([...images, ...base64Images]); // ძველებს ვუმატებთ ახლებს
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* ატვირთვის ზონა */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-stone-700 bg-stone-800/30 flex flex-col items-center justify-center p-6 text-stone-500 hover:border-amber-600 hover:text-amber-500 transition-colors cursor-pointer group h-full min-h-[160px]"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
        <span className="text-xs uppercase tracking-widest font-mono text-center">
          Upload Photos
        </span>
      </div>

      {/* პრევიუების სექცია */}
      <div className="grid grid-cols-3 gap-2">
        {images?.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square border border-stone-700 group"
          >
            <img
              src={img}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
