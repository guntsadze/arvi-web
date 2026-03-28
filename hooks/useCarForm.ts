import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_FORM_VALUES } from "@/constants/carOptions";
import { carsService } from "@/services/cars/cars.service";
import { CarFormData } from "@/types/carForm.types";
import { storageService } from "@/services/storage.service";

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
    values: initialData || undefined,
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
      let finalPhotos = [];

      // 1. ვახარისხებთ ფოტოებს: რომელია უკვე ატვირთული და რომელია ახალი (File)
      const existingPhotos = data.photos.filter((p) => !(p instanceof File));
      const newFiles = data.photos.filter((p) => p instanceof File) as File[];

      // 2. ავტვირთოთ მხოლოდ ახალი ფაილები
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((file) =>
          storageService.uploadFile(file, "cars"),
        );
        const uploadedResults = await Promise.all(uploadPromises);
        finalPhotos = [...existingPhotos, ...uploadedResults];
      } else {
        finalPhotos = existingPhotos;
      }

      // 3. მოვამზადოთ საბოლოო მონაცემები ბექენდისთვის
      const submitData = {
        ...data,
        photos: finalPhotos, // აქ უკვე მხოლოდ Cloudinary-ს ობიექტებია
        modifications: data.modifications.map((m) => ({
          ...m,
          carId: initialData?.id,
        })),
        maintenanceRecords: data.maintenanceRecords.map((r) => ({
          ...r,
          carId: initialData?.id,
        })),
      };

      if (isEditing) {
        await carsService.update(initialData.id, submitData);
      } else {
        await carsService.create(submitData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
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
