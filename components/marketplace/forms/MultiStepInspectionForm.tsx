"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Car, CarFormData } from "@/types/carForm.types";
import { InspectionStep1Exterior } from "./InspectionSteps/InspectionStep1Exterior";
import { InspectionStep2Chassis } from "./InspectionSteps/InspectionStep2Chassis";
import { InspectionStep3LightsExhaust } from "./InspectionSteps/InspectionStep3LightsExhaust";
import { InspectionStep4Interior } from "./InspectionSteps/InspectionStep4Interior";
import { InspectionStep5Engine } from "./InspectionSteps/InspectionStep5Engine";
import { InspectionStep7Summary } from "./InspectionSteps/InspectionStep7Summary";
import { marketplaceService } from "@/services/marketplace.service";
import { InspectionStep6Contact } from "./InspectionSteps/InspectionStep6Contact";

interface MultiStepInspectionFormProps {
  car: Car;
  onClose: () => void;
  onSuccess: (inspectionData: CarFormData) => void;
}

export const MultiStepInspectionForm: React.FC<
  MultiStepInspectionFormProps
> = ({ car, onClose, onSuccess }) => {
  const methods = useForm<CarFormData>({
    defaultValues: {
      carId: car.id,
      type: "CAR",
      title: `${car.year} ${car.make} ${car.model}`,
    },
  });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <InspectionStep1Exterior key="step1" />,
    <InspectionStep2Chassis key="step2" />,
    <InspectionStep3LightsExhaust key="step3" />,
    <InspectionStep4Interior key="step4" />,
    <InspectionStep5Engine key="step5" />,
    <InspectionStep6Contact key="step6" />,
    <InspectionStep7Summary key="step7" />,
  ];

  const totalSteps = steps.length;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await marketplaceService.createListing(data);
      onSuccess(data);
    } catch (err) {
      console.error("Listing Error:", err);
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // დახურვის ფუნქცია ფონზე დაჭერით
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-surface-1 border border-border shadow-2xl rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-black/20">
          <h1 className="text-xl font-bold text-accent font-mono italic">
            Vehicle Inspection Report for {car.make} {car.model}
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-1-hover text-text-secondary transition-colors rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {" "}
          {/* Scrollable content */}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Progress Bar */}
              <div className="w-full bg-surface-2 rounded-full h-2.5 mb-8">
                <div
                  className="bg-accent h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                <p className="text-right text-text-secondary text-sm mt-1">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>

              <div>{steps[currentStep]}</div>

              <div className="flex justify-between mt-8 pt-4 border-t border-border">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 bg-surface-2 text-white rounded hover:bg-surface-1-hover transition duration-200"
                  >
                    Previous
                  </button>
                )}

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-accent text-white rounded hover:bg-primary-hover transition duration-200 ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-success text-white rounded hover:bg-success transition duration-200 ml-auto"
                  >
                    Submit Inspection
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </motion.div>
    </div>
  );
};
