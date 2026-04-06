"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { groupsService } from "@/services/groups.service";
import { useRouter } from "next/navigation";
import { GroupPrivacy } from "@/types/groups.types";
import { FormHeader } from "../../cars/carForm/shared/FormHeader";
import { FormSection } from "../../cars/carForm/shared/FormSection";
import { FormActions } from "../../cars/carForm/shared/FormActions";
import { GroupIdentitySection } from "./sections/GroupIdentitySection";
import { GroupSettingsSection } from "./sections/GroupSettingsSection";
import { GroupContentSection } from "./sections/GroupContentSection";

interface GroupFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({ onClose, onSuccess }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      privacy: GroupPrivacy.PUBLIC,
      rules: "",
    },
  });

  // ავტომატური სლაგის გენერაცია სახელის მიხედვით
  const groupName = watch("name");
  useEffect(() => {
    if (groupName) {
      const slug = groupName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [groupName, setValue]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const response = await groupsService.createGroup(data);
      if (onSuccess) onSuccess();
      onClose();
      router.push(`/groups/${response.data.slug}`);
    } catch (error) {
      console.error("FAILED_TO_INITIALIZE_NODE:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917] z-[60] overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundGrid />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto py-10 px-4 min-h-screen">
        <FormHeader
          isEditing={false}
          onClose={onClose}
          title="INIT_NEW_COMMUNITY_NODE"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 pb-24">
          {/* Section 1: Identity */}
          <div className="space-y-6">
            <FormSection title="Node Identity" />
            <GroupIdentitySection register={register} errors={errors} />
          </div>

          {/* Section 2: Configuration */}
          <div className="space-y-6">
            <FormSection title="System Configuration" />
            <GroupSettingsSection register={register} />
          </div>

          {/* Section 3: Content & Rules */}
          <div className="space-y-6">
            <FormSection title="Protocol & Manifest" />
            <GroupContentSection register={register} />
          </div>

          {/* Actions */}
          <div className="pt-10 border-t border-stone-800">
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={false}
              onCancel={onClose}
            />

            <div className="mt-4 opacity-50">
              <p className="font-mono text-[8px] text-[#EBE9E1] uppercase tracking-[0.2em]">
                System_Status: Awaiting_Deployment...
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
