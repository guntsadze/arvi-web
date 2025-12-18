import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_FORM_VALUES } from "@/constants/carOptions";
import { carsService } from "@/services/cars/cars.service";
import { CarFormData } from "@/types/carForm.types";

interface UseCarFormProps {
  initialData?: any;
  onSuccess: (car: any) => void;
  onClose: () => void;
}

export const useCarForm = ({
  initialData,
  onSuccess,
  onClose,
}: UseCarFormProps) => {
  const isEditing = !!initialData;

  const formMethods = useForm<CarFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { reset, setValue, handleSubmit, formState } = formMethods;

  // Load initial data თუ editing mode-ია
  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, userId, ...rest } = initialData;
      Object.keys(rest).forEach((key) => {
        setValue(key as keyof CarFormData, rest[key]);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: CarFormData) => {
    try {
      // Convert to numbers
      const payload = {
        ...data,
        year: Number(data.year),
        horsepower: data.horsepower ? Number(data.horsepower) : null,
        torque: data.torque ? Number(data.torque) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
      };

      let savedCar;
      if (isEditing) {
        // Update logic
        console.log("Updating car:", initialData.id, payload);
        savedCar = { ...initialData, ...payload };
      } else {
        savedCar = await carsService.create(payload);
      }

      onSuccess(savedCar);
      onClose();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  return {
    ...formMethods,
    isEditing,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting: formState.isSubmitting,
  };
};
