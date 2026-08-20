"use client";

import React, { useState } from "react";
import { FormField, FieldType } from "@/types/funding/forms";
import { useForms } from "@/context/funding/FormsContext";
import { cn } from "@/lib/funding/utils";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import {
  Type, AlignLeft, Hash, Mail, Phone, Link,
  ChevronDown, Circle, CheckSquare, ToggleLeft, List,
  Calendar, CalendarRange, User, Upload, Image, Video,
  DollarSign, Clock, Users, Layers, HelpCircle,
  GripVertical, Pencil, Copy, Trash2, ChevronUp, ChevronDown as ChevronDownIcon,
  Eye, EyeOff, AlertCircle, Shield, Plus, AlertTriangle
} from "lucide-react";
import { ConfirmDialog } from "@/components/funding/ui/ConfirmDialog";

// ─── Field Type Meta ───────────────────────────────────────────────────────────

const FIELD_TYPE_META: Partial<Record<FieldType, { label: string; icon: React.ReactNode; color: string }>> = {
  short_text: { label: "Short Text", icon: <Type className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  long_text: { label: "Long Text", icon: <AlignLeft className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  number: { label: "Number", icon: <Hash className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  email: { label: "Email", icon: <Mail className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  phone: { label: "Phone", icon: <Phone className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  url: { label: "URL", icon: <Link className="w-3.5 h-3.5" />, color: "bg-sky-100 text-sky-700" },
  dropdown: { label: "Dropdown", icon: <ChevronDown className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700" },
  single_choice: { label: "Single Choice", icon: <Circle className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700" },
  multiple_choice: { label: "Multiple Choice", icon: <CheckSquare className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700" },
  multi_select: { label: "Multi Select", icon: <List className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700" },
  date: { label: "Date", icon: <Calendar className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700" },
  date_range: { label: "Date Range", icon: <CalendarRange className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700" },
  profile_full_name: { label: "Full Name", icon: <User className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_email: { label: "Email", icon: <Mail className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_phone: { label: "Phone", icon: <Phone className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_education: { label: "Education", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_institution: { label: "Institution", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_skills: { label: "Skills", icon: <List className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_domain: { label: "Domain", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  profile_experience: { label: "Experience", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
  file_upload: { label: "File Upload", icon: <Upload className="w-3.5 h-3.5" />, color: "bg-rose-100 text-rose-700" },
  image_upload: { label: "Image Upload", icon: <Image className="w-3.5 h-3.5" />, color: "bg-rose-100 text-rose-700" },
  video_link: { label: "Video Link", icon: <Video className="w-3.5 h-3.5" />, color: "bg-rose-100 text-rose-700" },
  funding_required: { label: "Funding", icon: <DollarSign className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700" },
  project_timeline: { label: "Timeline", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700" },
  team_members: { label: "Team", icon: <Users className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700" },
  project_stage: { label: "Stage", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700" },
  custom_question: { label: "Custom", icon: <HelpCircle className="w-3.5 h-3.5" />, color: "bg-surface-100 text-surface-700" },
};

export function getFieldMeta(type: FieldType) {
  return FIELD_TYPE_META[type] ?? { label: type, icon: <HelpCircle className="w-3.5 h-3.5" />, color: "bg-surface-100 text-surface-700" };
}

// ─── Render field preview input ────────────────────────────────────────────────

function FieldPreview({ field, updateField }: { field: FormField; updateField: (id: string, updates: Partial<FormField>) => void }) {
  if (field.isProfileField) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        <Shield className="w-3.5 h-3.5 shrink-0" />
        <span>Auto-filled from innovator&apos;s profile</span>
      </div>
    );
  }

  if (["dropdown", "single_choice", "multiple_choice", "multi_select"].includes(field.type)) {
    return (
      <div className="space-y-2 mt-2">
        {field.options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-3 text-sm text-surface-700 bg-surface-50/50 p-2.5 rounded-lg border border-surface-200 transition-colors focus-within:border-brand-300 focus-within:bg-white">
            {field.type === "multiple_choice" || field.type === "multi_select"
              ? <CheckSquare className="w-4 h-4 text-surface-300 shrink-0" />
              : <Circle className="w-4 h-4 text-surface-300 shrink-0" />
            }
            <input
              type="text"
              value={opt.label}
              onChange={(e) => {
                const newOptions = [...field.options];
                newOptions[i] = { ...opt, label: e.target.value };
                updateField(field.id, { options: newOptions });
              }}
              className="flex-1 bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none placeholder:text-surface-300"
              placeholder={`Option ${i + 1}`}
            />
            {field.options.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newOptions = field.options.filter((_, idx) => idx !== i);
                  updateField(field.id, { options: newOptions });
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-surface-400 p-1 rounded hover:bg-rose-50 transition-smooth shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newOptions = [
              ...field.options,
              { 
                id: `opt_${Date.now()}`, 
                label: `Option ${field.options.length + 1}`,
                value: `option_${field.options.length + 1}`,
                order: field.options.length + 1
              }
            ];
            updateField(field.id, { options: newOptions });
          }}
          className="text-xs text-brand-600 hover:text-brand-700 hover:bg-brand-50 p-1.5 px-3 rounded-md font-semibold flex items-center gap-1.5 mt-1 transition-colors w-max"
        >
          <Plus className="w-3.5 h-3.5" /> Add Option
        </button>

        {field.options.length === 0 && (
          <div className="text-[10px] text-amber-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Add at least one option
          </div>
        )}
      </div>
    );
  }

  if (field.type === "file_upload" || field.type === "image_upload") {
    const exts = field.validation.allowedFileTypes?.join(", ").toUpperCase() ?? "Any file";
    const size = field.validation.maxFileSizeMB ? `${field.validation.maxFileSizeMB}MB max` : "";
    return (
      <div className="border-2 border-dashed border-surface-200 rounded-lg px-3 py-2 text-center text-[11px] text-surface-400">
        <Upload className="w-4 h-4 mx-auto mb-1 text-surface-300" />
        {exts} · {size}
      </div>
    );
  }

  if (field.type === "long_text") {
    return (
      <textarea
        value={field.placeholder || ""}
        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
        className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 h-14 text-xs text-surface-500 focus:outline-none focus:border-brand-300 focus:bg-white transition-colors resize-none placeholder:text-surface-300"
        placeholder="Long text answer..."
      />
    );
  }

  if (field.type === "funding_required") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 focus-within:border-brand-300 focus-within:bg-white transition-colors">
        <span className="text-xs font-semibold text-surface-500">{field.validation.unit || "$"}</span>
        <input
          type="text"
          value={field.placeholder || ""}
          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          className="flex-1 bg-transparent border-none p-0 text-xs text-surface-500 focus:ring-0 focus:outline-none placeholder:text-surface-300"
          placeholder="Enter amount..."
        />
      </div>
    );
  }

  const defaultPlaceholder = field.type === "date" ? "Select date..." : `Enter ${field.label.toLowerCase()}...`;
  return (
    <input
      type="text"
      value={field.placeholder || ""}
      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
      className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-xs text-surface-500 focus:outline-none focus:border-brand-300 focus:bg-white transition-colors placeholder:text-surface-300"
      placeholder={defaultPlaceholder}
    />
  );
}

// ─── Field Card ────────────────────────────────────────────────────────────────

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function FieldCard({ field, isSelected, isFirst, isLast }: FieldCardProps) {
  const { selectField, duplicateField, deleteField, moveField, updateField } = useForms();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const meta = getFieldMeta(field.type);
  const hasConditional = field.conditionalRule.enabled && field.conditionalRule.conditions.length > 0;

  return (
    <div
      className={cn(
        "relative group rounded-xl border-2 bg-white transition-all duration-150 cursor-pointer",
        isSelected
          ? "border-brand-400 shadow-md shadow-brand-100"
          : "border-surface-200 hover:border-surface-300 hover:shadow-sm"
      )}
      onClick={() => selectField(field.id)}
      id={`field-card-${field.id}`}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center rounded-l-xl cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-smooth">
        <GripVertical className="w-4 h-4 text-surface-300" />
      </div>

      {/* Main content */}
      <div className="pl-8 pr-4 pt-3.5 pb-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="text-sm font-semibold text-surface-900 bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded px-2 py-1 -ml-2 focus:outline-none transition-colors flex-1 min-w-[200px]"
                placeholder="Question Title"
              />
              {field.required && (
                <Badge variant="danger" size="sm">Required</Badge>
              )}
              {hasConditional && (
                <Badge variant="info" size="sm">Conditional</Badge>
              )}
            </div>
            <input
              type="text"
              value={field.description || ""}
              onChange={(e) => updateField(field.id, { description: e.target.value })}
              className="text-xs text-surface-500 mt-0.5 bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded px-2 py-1 -ml-2 focus:outline-none transition-colors w-full max-w-lg"
              placeholder="Field description (optional)"
            />
          </div>

          {/* Field type badge */}
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1", meta.color)}>
            {meta.icon}
            {meta.label}
          </span>
        </div>

        {/* Field Preview */}
        <FieldPreview field={field} updateField={updateField} />
      </div>

      {/* Action bar — visible on hover / selection */}
      <div className={cn(
        "absolute right-3 -top-3 flex items-center gap-1 transition-smooth",
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-full px-1.5 py-0.5 shadow-sm">
          {/* Move up/down */}
          <button
            onClick={(e) => { e.stopPropagation(); moveField(field.id, "up"); }}
            disabled={isFirst}
            className="p-1 rounded hover:bg-surface-100 disabled:opacity-30 text-surface-500"
            title="Move up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); moveField(field.id, "down"); }}
            disabled={isLast}
            className="p-1 rounded hover:bg-surface-100 disabled:opacity-30 text-surface-500"
            title="Move down"
          >
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          <div className="w-px h-3 bg-surface-200 mx-0.5" />
          {/* Required toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); updateField(field.id, { required: !field.required }); }}
            className={cn("p-1 rounded transition-smooth", field.required ? "text-rose-500 hover:bg-rose-50" : "text-surface-400 hover:bg-surface-100")}
            title={field.required ? "Make optional" : "Make required"}
          >
            {field.required ? <span className="text-[10px] font-bold">REQ</span> : <span className="text-[10px] font-bold text-surface-300">OPT</span>}
          </button>
          <div className="w-px h-3 bg-surface-200 mx-0.5" />
          {/* Duplicate */}
          <button
            onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}
            className="p-1 rounded hover:bg-surface-100 text-surface-500"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }}
            className="p-1 rounded hover:bg-rose-50 text-surface-400 hover:text-rose-500"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Remove Field?"
        message="Remove this field from the form?"
        confirmLabel="Remove Field"
        isDestructive={true}
        onConfirm={() => {
          deleteField(field.id);
          setDeleteConfirm(false);
        }}
      />
    </div>
  );
}
