import { useForm } from "react-hook-form";
import { DEFAULT_FORM_VALUES } from "@/constants/carOptions";
import { carsService } from "@/services/cars/cars.service";
import { CarFormData } from "@/types/carForm.types";
import { MediaDto } from "@/services/media.service";
import { getErrorMessage } from "@/lib/error-handler";
import { toast } from "sonner";

interface UseCarFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
  /** Which garage a newly created car lands in — ignored when editing. */
  garageId?: string;
}

// class-validator's @IsOptional() only skips validation for null/undefined,
// not "" — so an empty string sent for e.g. bodyType (@IsEnum) or
// licensePlate (@Matches) fails validation as if it were a real invalid
// value. These are exactly the optional string/enum fields on CarFormData;
// stripping "" -> undefined here means "not filled in" reads as "not
// filled in" everywhere, not as invalid data.
type OptionalStringKey = Extract<
  keyof CarFormData,
  | "nickname"
  | "vin"
  | "licensePlate"
  | "engine"
  | "color"
  | "paintCode"
  | "bodyType"
  | "description"
  | "driveType"
  | "characterTag"
>;

const OPTIONAL_STRING_FIELDS: OptionalStringKey[] = [
  "nickname",
  "vin",
  "licensePlate",
  "engine",
  "color",
  "paintCode",
  "bodyType",
  "description",
  "driveType",
  "characterTag",
];

function stripEmptyOptionalStrings(data: CarFormData): CarFormData {
  const result = { ...data };
  OPTIONAL_STRING_FIELDS.forEach((key) => {
    if (result[key] === "") {
      result[key] = undefined;
    }
  });
  return result;
}

export const useCarForm = ({
  initialData,
  onClose,
  onSuccess,
  garageId,
}: UseCarFormProps) => {
  const isEditing = Boolean(initialData?.id);

  const formMethods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialData
      ? (() => {
          const { createdAt, updatedAt, userId, ...rest } = initialData;
          return rest;
        })()
      : DEFAULT_FORM_VALUES,
  });

  const { reset, handleSubmit, formState } = formMethods;

  const onSubmit = async (data: CarFormData) => {
    try {
      // Photos are already uploaded by the time we get here — ShowOffStep
      // uploads to POST /media on file-select (see useMediaUpload) and only
      // writes the resulting Media objects into this field. Submitting the
      // car form is now just sending the ids to attach.
      const photos = (data.photos ?? []) as MediaDto[];
      const { photos: _photos, ...rest } = data;

      const submitData = {
        ...stripEmptyOptionalStrings(rest as CarFormData),
        mediaIds: photos.map((p) => p.id),
        coverMediaId: photos[0]?.id,
        modifications: (data.modifications ?? []).map((m) => ({
          ...m,
          carId: initialData?.id,
        })),
        maintenanceRecords: (data.maintenanceRecords ?? []).map((r) => ({
          ...r,
          carId: initialData?.id,
        })),
      };

      if (isEditing) {
        await carsService.update(initialData.id, submitData);
      } else {
        await carsService.create(
          garageId ? { ...submitData, garageId } : submitData,
        );
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
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
    errors: formState.errors,
    watch: formMethods.watch,
    setValue: formMethods.setValue,
    getValues: formMethods.getValues,
  };
};
