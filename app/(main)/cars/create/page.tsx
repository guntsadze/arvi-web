"use client";
import { useState, useEffect } from "react";
import { Plus, Car } from "lucide-react";
import { carsService } from "@/services/cars/cars.service";

import { CarCard } from "@/components/cars/CarCard";
import { CarDetailView } from "@/components/cars/carDetails";
import { CarForm } from "@/components/cars/carForm";

export default function CarCollectionPage() {
  const [cars, setCars] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  // როცა ვარედაქტირებთ (ეს ღილაკი უნდა იყოს სადმე, მაგალითად DetailView-ში ან ბარათზე)
  const handleEdit = (car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const data = await carsService.search();
      setCars(data.data.data);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // თუ მანქანა არჩეულია, ვაჩვენებთ detail view-ს
  if (selectedCar) {
    return (
      <CarDetailView
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        onEdit={(car) => {
          setSelectedCar(null); // ვხურავთ დეტალებს
          handleEdit(car); // ვხსნით ფორმას
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1917] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] text-[#EBE9E1] font-sans selection:bg-amber-500 selection:text-stone-900 pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b-4 border-stone-800 bg-[#1c1917]/95 backdrop-blur-sm shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <Car className="text-stone-900 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-[#EBE9E1] drop-shadow-lg">
                  Garage <span className="text-amber-600">Inventory</span>
                </h1>
                <p className="text-stone-500 font-mono text-xs tracking-[0.3em] uppercase border-t border-stone-700 mt-1 pt-1">
                  Log Record: {cars.length} units
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="relative group overflow-hidden bg-[#EBE9E1] px-8 py-3 font-black uppercase tracking-widest text-stone-900 border-2 border-transparent hover:border-amber-500 shadow-[6px_6px_0px_0px_#ea580c] hover:shadow-[2px_2px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Machine
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ADD CAR FORM */}
        {isFormOpen && (
          <CarForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={loadCars}
            initialData={editingCar}
          />
        )}

        {/* CARS GRID */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-stone-600 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-stone-800/30 rounded-3xl">
            <Car className="w-24 h-24 mx-auto text-stone-700 mb-4 opacity-50" />
            <h3 className="text-2xl font-black text-stone-500 uppercase mb-2">
              Garage Empty
            </h3>
            <p className="text-stone-600 font-mono mb-8">
              No machinery records found.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-amber-500 font-bold uppercase tracking-widest underline hover:text-amber-400"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => setSelectedCar(car)}
              />
            ))}
          </div>
        )}
      </div>

      {/* SVG FILTERS */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="rugged-tear" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
