import { RuggedInput } from "@/components/ui/RuggedInput";

export const GroupIdentitySection = ({ register, errors }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <RuggedInput
      label="Community Name"
      name="name"
      register={register}
      placeholder="E30_OWNERS_CLUB"
      error={errors.name?.message}
    />
    <RuggedInput
      label="URL Identifier (Slug)"
      name="slug"
      register={register}
      placeholder="e30-owners"
      error={errors.slug?.message}
    />
  </div>
);
