"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { marketplaceService } from "@/services/marketplace.service";
import { FormHeader } from "../cars/carForm/shared/FormHeader";
import { FormSection } from "../cars/carForm/shared/FormSection";
import { Input } from "../ui/Input";
import { FormActions } from "../cars/carForm/shared/FormActions";
import { InspectionSection } from "./InspectionSection";

export const MarketplaceForm = ({ car, onClose, onSuccess }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      carId: car.id,
      title: `${car.year} ${car.make} ${car.model}`,
      price: "",
      location: "",
      inspection: {
        bodyCondition: "ORIGINAL",
        catalystPresent: true,
        airbagsIntact: true,
      },
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await marketplaceService.createListing(data);
      onSuccess();
    } catch (err) {
      console.error("Listing Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-[110] overflow-y-auto">
      <div className="relative z-10 max-w-5xl mx-auto py-10 px-4 min-h-screen">
        {/* აქ გამოვიყენოთ შენი FormHeader */}
        <FormHeader title={`SELL_PROPOSAL: ${car.model}`} onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 pb-24">
          {/* SALES DATA SECTION */}
          <div className="space-y-8">
            <FormSection title="Commercial Parameters" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Offer Title"
                placeholder="Ex: Immaculate Condition M3"
                {...register("title")}
              />
              <Input
                label="Listing Price (USD/GEL)"
                type="number"
                placeholder="25000"
                {...register("price")}
              />
              <Input
                label="Current Location"
                placeholder="Tbilisi, Georgia"
                {...register("location")}
              />
            </div>
          </div>

          {/* DIGITAL INSPECTION SECTION (Rugged Style) */}
          <div className="space-y-8">
            <FormSection
              title="Technical Health Report"
              description="Full system scan and manual inspection data"
            />
            <InspectionSection register={register} />
          </div>

          <div className="pt-10 border-t border-border">
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={false}
              onCancel={onClose}
              submitLabel="Deploy to Marketplace"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
