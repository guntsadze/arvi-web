import React, { useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  images: any[]; // აქ იქნება ან არსებული URL-ები (ბაზიდან), ან ახალი File ობიექტები
  onChange: (images: any[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange([...images, ...files]);
  };

  const getImageUrl = (img: any) => {
    if (img instanceof File) return URL.createObjectURL(img); // დროებითი URL პრევიუსთვის
    return img.url || img; // თუ უკვე ატვირთული ობიექტია ან სტრინგი
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-stone-700 bg-stone-800/30 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-amber-600 transition-colors"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload className="w-8 h-8 mb-2 text-stone-500" />
        <span className="text-xs uppercase font-mono text-stone-500">
          Add Photos
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square border border-stone-700 group"
          >
            <img
              src={getImageUrl(img)}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
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
