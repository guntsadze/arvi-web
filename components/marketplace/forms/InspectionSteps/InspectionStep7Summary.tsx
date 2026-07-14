"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CarFormData } from "@/types/carForm.types";

export const InspectionStep7Summary: React.FC = () => {
  const { watch } = useFormContext<CarFormData>();
  const formData = watch("inspection");

  const renderField = (label: string, value: any) => {
    if (typeof value === "boolean") {
      return (
        <p>
          <span className="font-semibold text-text-secondary">{label}:</span>{" "}
          <span className={value ? "text-success" : "text-error"}>
            {value ? "Yes" : "No"}
          </span>
        </p>
      );
    }
    if (typeof value === "number" && label.includes("Rating")) {
      const rating = Number(value);
      let colorClass = "text-text-secondary";
      if (rating >= 8) colorClass = "text-success";
      else if (rating >= 5) colorClass = "text-warning";
      else colorClass = "text-error";

      return (
        <p>
          <span className="font-semibold text-text-secondary">{label}:</span>{" "}
          <span className={colorClass}>{value}/10</span>
        </p>
      );
    }
    if (value) {
      return (
        <p>
          <span className="font-semibold text-text-secondary">{label}:</span>{" "}
          <span className="text-text-secondary">{value}</span>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white">7. Summary & Notes</h2>
      <p className="text-text-secondary">
        Please review the inspection report before submitting.
      </p>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-accent">
          // Exterior & Body
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Paint Condition", formData.bodyCondition)}
          {renderField("Visible Rust", formData.hasRust)}
          {renderField("Panel Symmetry", formData.panelSymmetry)}
          {renderField("Glass Condition", formData.glassCondition)}
          {renderField("Exterior Visual Rating", formData.exteriorVisualRating)}
        </div>

        <h3 className="text-xl font-bold text-accent mt-8">
          // Wheels & Chassis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Tread Depth (mm)", formData.tireTreadDepth)}
          {renderField("Tire Year", formData.tireAge)}
          {renderField("Uniform Tire Set", formData.tireUniformity)}
          {renderField("Chassis Notes", formData.chassisCondition)}
          {renderField("Suspension Status", formData.suspensionStatus)}
          {renderField(
            "Chassis Structural Rating",
            formData.chassisStructuralRating,
          )}
        </div>

        <h3 className="text-xl font-bold text-accent mt-8">
          // Lights & Exhaust
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Lights Functional", formData.lightsFunctional)}
          {renderField("Exhaust Condition", formData.exhaustCondition)}
          {renderField("Catalyst Present", formData.catalystPresent)}
          {renderField(
            "Lighting & Emissions Rating",
            formData.lightsExhaustRating,
          )}
        </div>

        <h3 className="text-xl font-bold text-accent mt-8">
          // Interior & Electronics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Interior Grade", formData.interiorCondition)}
          {renderField("Smoker Car", formData.isSmokedIn)}
          {renderField("Water Damage", formData.hasWaterDamage)}
          {renderField("A/C Cold", formData.acFunctional)}
          {renderField("Dashboard Warnings", formData.dashboardWarnings)}
          {renderField("Safety Systems Intact", formData.airbagsIntact)}
          {renderField(
            "Cabin Comfort & Tech Rating",
            formData.cabinComfortTechRating,
          )}
        </div>

        <h3 className="text-xl font-bold text-accent mt-8">
          // Engine & Mechanical
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Oil Condition", formData.engineOilStatus)}
          {renderField("Coolant Status", formData.coolantStatus)}
          {renderField("Engine Acoustics", formData.engineNoise)}
          {renderField("Transmission Shift", formData.transmissionShift)}
          {renderField("Brake Condition", formData.brakeCondition)}
          {renderField("Oil Leaking", formData.oilLeaking)}
          {renderField(
            "Drivetrain Performance Rating",
            formData.drivetrainPerformanceRating,
          )}
        </div>

        <h3 className="text-xl font-bold text-accent mt-8">
          // Inspector Notes
        </h3>
        {renderField("Notes", formData.inspectorNotes)}
      </div>
    </div>
  );
};
