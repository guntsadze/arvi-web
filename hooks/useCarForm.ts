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

    const { id, createdAt, updatedAt, userId, photos, coverPhoto, ...rest } =
      initialData;

    reset({
      ...rest,
      photos: photos ?? [], // ✅ მხოლოდ საჩვენებლად
    });
  }, [initialData, reset]);

  const onSubmit = async (data: CarFormData) => {
    const newPhotos = (data.photos || []).filter(
      (p) => typeof p === "string" && p.startsWith("data:")
    );

    const oldPhotos = initialData?.photos || [];

    // შედარება მხოლოდ URL-ების მიხედვით
    const oldPhotoUrls = oldPhotos.map((p) => p.url);
    const currentPhotoUrls = (data.photos || []).map((p) =>
      typeof p === "string" ? p : p.url
    );

    const hasChangedPhotos =
      newPhotos.length > 0 || // ახალი Base64 სურათები
      oldPhotoUrls.length !== currentPhotoUrls.length || // რაოდენობა განსხვავდება
      !oldPhotoUrls.every((url, idx) => url === currentPhotoUrls[idx]); // URL შეიცვალა

    const payload: any = {
      ...data,
      year: Number(data.year),
      horsepower: data.horsepower ? Number(data.horsepower) : null,
      torque: data.torque ? Number(data.torque) : null,
      mileage: data.mileage ? Number(data.mileage) : null,
    };

    if (hasChangedPhotos) {
      payload.photos = newPhotos.length > 0 ? newPhotos : currentPhotoUrls;
    } else {
      delete payload.photos; // იგივე სურათები → არ გავაგზავნოთ
    }

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
