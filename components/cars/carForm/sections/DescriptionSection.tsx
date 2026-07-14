import { Control, Controller, UseFormRegister } from "react-hook-form";
import { CarFormData } from "@/types/carForm.types";
import { ImageUpload } from "../shared/ImageUpload";
import { Textarea } from "@/components/ui/Textarea";

interface DescriptionSectionProps {
  register: UseFormRegister<CarFormData>;
  control: Control<CarFormData>;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  register,
  control,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="md:col-span-2">
      <Textarea
        label="ავტომობილის აღწერა"
        rows={6}
        {...register("description")}
      />
    </div>

    <div>
      <Controller
        name="photos"
        control={control}
        render={({ field }) => (
          <ImageUpload
            images={field.value || []} // გადააწოდე პირდაპირ მასივი (ობიექტებიანად)
            onChange={(newImages) => {
              field.onChange(newImages); // დააბრუნე შეცვლილი მასივი (სადაც წაშლილი უკვე აღარ არის)
            }}
          />
        )}
      />
    </div>
  </div>
);
