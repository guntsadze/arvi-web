import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_FORM_VALUES } from "@/constants/carOptions";
import { carsService } from "@/services/cars/cars.service";
import { CarFormData } from "@/types/carForm.types";

interface UseCarFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const useCarForm = ({
  initialData,
  onClose,
  onSuccess,
}: UseCarFormProps) => {
  const isEditing = Boolean(initialData?.id);

  const formMethods = useForm<CarFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { reset, handleSubmit, formState } = formMethods;

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, userId, ...rest } = initialData;
      reset(rest);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CarFormData) => {
    const payload = {
      ...data,
      year: Number(data.year),
      horsepower: data.horsepower ? Number(data.horsepower) : null,
      torque: data.torque ? Number(data.torque) : null,
      mileage: data.mileage ? Number(data.mileage) : null,
    };

    if (isEditing) {
      await carsService.update(initialData.id, payload);
    } else {
      await carsService.create(payload);
    }

    onSuccess?.();
    onClose();
  };

  return {
    ...formMethods,
    isEditing,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting: formState.isSubmitting,
  };
};
