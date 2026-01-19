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
    if (!initialData) return;

    // 1. ამოვიღოთ მხოლოდ ის ფილდები, რომლებიც ფორმაში არ გვჭირდება (მეტამონაცემები)
    const { createdAt, updatedAt, userId, ...rest } = initialData;

    reset({
      ...rest,
    });
  }, [initialData, reset]);

  const onSubmit = async (data: CarFormData) => {
    try {
      if (isEditing) {
        // modifications თუ არსებობს, დაამატე carId
        let submitData = { ...data };
        if (submitData.modifications.length > 0) {
          submitData.modifications = submitData.modifications.map((mod) => ({
            ...mod,
            carId: initialData.id,
          }));
        }
        if (submitData.maintenanceRecords.length > 0) {
          submitData.maintenanceRecords = submitData.maintenanceRecords.map(
            (record) => ({
              ...record,
              carId: initialData.id,
            }),
          );
        }
        console.log("Submitting form data:", submitData);
        await carsService.update(initialData.id, submitData);
      } else {
        await carsService.create(data);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    try {
      await carsService.delete(initialData.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return {
    ...formMethods,
    isEditing,
    onSubmit: handleSubmit(onSubmit),
    handleDelete,
    isSubmitting: formState.isSubmitting,
  };
};
