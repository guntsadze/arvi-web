import { Control, Controller, UseFormRegister } from "react-hook-form";
import { CarFormData } from "@/types/carForm.types";
import { ImageUpload } from "../shared/ImageUpload";
import { RuggedTextArea } from "@/components/ui/RuggedTextArea";

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
      <RuggedTextArea
        label="Vehicle Description"
        name="description"
        register={register}
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
