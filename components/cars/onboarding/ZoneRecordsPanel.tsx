"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2, Wrench, ClipboardList } from "lucide-react";
import {
  modificationsService,
  type Modification,
} from "@/services/modifications.service";
import {
  maintenanceService,
  type MaintenanceRecord,
} from "@/services/maintenance.service";
import { getErrorMessage } from "@/lib/error-handler";

type RecordKind = "modification" | "maintenance";

interface TypeOption {
  value: string;
  label: string;
}

export interface ZoneSection {
  kind: RecordKind;
  label: string;
  typeOptions: readonly TypeOption[];
}

interface ZoneRecordsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  zoneLabel: string;
  sections: ZoneSection[];
}

/**
 * Slide-over triggered by clicking a CarBlueprint zone (hood/wheels/shell/
 * gauge) — lists, adds, and deletes modifications/maintenance records
 * scoped to that zone's relevant categories, pushing every change straight
 * to the backend via modifications.service.ts/maintenance.service.ts
 * (no CarFormData involvement, no deferred-until-form-submit batching).
 * Requires a real carId, so it's only usable once a car actually exists.
 */
export function ZoneRecordsPanel({
  isOpen,
  onClose,
  carId,
  zoneLabel,
  sections,
}: ZoneRecordsPanelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-end sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="glass-card relative flex h-full w-full max-w-md flex-col overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:rounded-xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-1/95 px-6 py-4 backdrop-blur">
              <h2 className="text-lg font-black uppercase tracking-tight text-text-primary">
                {zoneLabel}
              </h2>
              <button
                onClick={onClose}
                className="text-text-muted transition-colors hover:text-text-primary"
                aria-label="დახურვა"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8 p-6">
              {sections.map((section) => (
                <RecordSection
                  key={`${section.kind}-${section.label}`}
                  carId={carId}
                  section={section}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function RecordSection({
  carId,
  section,
}: {
  carId: string;
  section: ZoneSection;
}) {
  const [items, setItems] = useState<(Modification | MaintenanceRecord)[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState(section.typeOptions[0]?.value ?? "");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetcher =
      section.kind === "modification"
        ? modificationsService.getForCar(carId)
        : maintenanceService.getForCar(carId);

    fetcher
      .then((data) => {
        if (cancelled) return;
        const relevant = data.filter((item) =>
          section.typeOptions.some((opt) => opt.value === item.type),
        );
        setItems(relevant);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [carId, section]);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    setError(null);
    try {
      if (section.kind === "modification") {
        const created = await modificationsService.create(carId, {
          type,
          name: name.trim(),
          cost: cost ? Number(cost) : undefined,
        });
        setItems((prev) => [created, ...prev]);
      } else {
        const created = await maintenanceService.create(carId, {
          type,
          title: name.trim(),
          cost: cost ? Number(cost) : undefined,
        });
        setItems((prev) => [created, ...prev]);
      }
      setName("");
      setCost("");
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      if (section.kind === "modification") {
        await modificationsService.remove(id);
      } else {
        await maintenanceService.remove(id);
      }
    } catch (err) {
      setItems(previous);
      setError(getErrorMessage(err));
    }
  };

  const Icon = section.kind === "modification" ? Wrench : ClipboardList;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary">
          <Icon size={14} className="text-primary" />
          {section.label}
        </h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-hover"
        >
          <Plus size={12} />
          დამატება
        </button>
      </div>

      {error && <p className="mb-2 text-xs text-error">{error}</p>}

      {showForm && (
        <div className="mb-3 space-y-2 rounded-lg border border-border bg-surface-1 p-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-surface-2 px-2 text-xs text-text-primary"
          >
            {section.typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              section.kind === "modification" ? "დასახელება" : "სათაური"
            }
            className="h-9 w-full rounded-md border border-border bg-surface-2 px-2 text-xs text-text-primary placeholder:text-text-muted"
          />
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="number"
            placeholder="ღირებულება (₾)"
            className="h-9 w-full rounded-md border border-border bg-surface-2 px-2 text-xs text-text-primary placeholder:text-text-muted"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !name.trim()}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding && <Loader2 size={12} className="animate-spin" />}
            შენახვა
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={16} className="animate-spin text-text-muted" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-[11px] italic text-text-muted">ჩანაწერები არ არის</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => {
            const title = "name" in item ? item.name : item.title;
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-surface-1/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {title}
                  </p>
                  {item.cost != null && (
                    <p className="text-[10px] text-text-muted">
                      {item.cost} ₾
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="shrink-0 text-text-muted transition-colors hover:text-error"
                  aria-label="წაშლა"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
