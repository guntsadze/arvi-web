import { Control, Controller, UseFormRegister } from "react-hook-form";
import { CarFormData } from "@/types/carForm.types";
import { ImageUpload } from "../shared/ImageUpload";
import { RuggedTextarea } from "@/components/ui/RuggedTextarea";

interface DescriptionSectionProps {
  register: UseFormRegister<CarFormData>;
  control: Control<CarFormData>; // დაამატე კონტროლი
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  register,
  control,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="md:col-span-2">
      <RuggedTextarea
        label="Vehicle Description"
        name="description"
        register={register}
        placeholder="Describe modifications..."
        rows={6}
      />
    </div>

    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-mono mb-2 block">
        Visual Documentation
      </label>
      <Controller
        name="photos"
        control={control}
        render={({ field }) => {
          // initialData.images შეიძლება იყოს string[] ან {url:string}[]
          const imageUrls =
            field.value?.map((file: any) =>
              typeof file === "string" ? file : file.url
            ) || [];

          return (
            <ImageUpload
              images={imageUrls}
              onChange={(imgs: any[]) => {
                // როცა ImageUpload დაბრუნებს string[] ან File[], Field-ს სწორად გადავცემ
                field.onChange(imgs);
              }}
            />
          );
        }}
      />
    </div>
  </div>
);
