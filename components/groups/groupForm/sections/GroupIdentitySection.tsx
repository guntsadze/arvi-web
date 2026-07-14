import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { GroupPrivacy } from "@/types/groups.types";
import { Input } from "@/components/ui/Input";

export interface GroupFormValues {
  name: string;
  slug: string;
  description: string;
  privacy: GroupPrivacy;
  rules: string;
}

interface GroupIdentitySectionProps {
  register: UseFormRegister<GroupFormValues>;
  errors: FieldErrors<GroupFormValues>;
}

export const GroupIdentitySection = ({
  register,
  errors,
}: GroupIdentitySectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Input
      label="Community Name"
      placeholder="E30_OWNERS_CLUB"
      error={errors.name?.message}
      {...register("name")}
    />
    <Input
      label="URL Identifier (Slug)"
      placeholder="e30-owners"
      error={errors.slug?.message}
      {...register("slug")}
    />
  </div>
);
