"use client";

import React, { useState } from "react";
import { useForms } from "@/context/funding/FormsContext";
import { FormField, FieldOption, BuilderValidationError } from "@/types/funding/forms";
import { cn } from "@/lib/funding/utils";
import { getFieldMeta } from "./FieldCard";
import {
  Settings, X, Trash2, Plus, GripVertical, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";

export function FieldSettings({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { form, selectedFieldId, updateField, addFieldOption, updateFieldOption, deleteFieldOption, moveFieldOption, validationErrors } = useForms();

  if (!form || !selectedFieldId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-surface-400">
        <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mb-3">
          <Settings className="w-6 h-6 text-surface-300" />
        </div>
        <div className="text-sm font-bold text-surface-900">No field selected</div>
        <p className="text-xs mt-1">Select a field on the canvas to configure its settings.</p>
      </div>
    );
  }

  // Find the selected field
  let field: FormField | null = null;
  for (const s of form.sections) {
    const f = s.fields.find(x => x.id === selectedFieldId);
    if (f) { field = f; break; }
  }

  if (!field) return null;

  const meta = getFieldMeta(field.type);
  const errors = validationErrors.filter(e => e.fieldId === field?.id);

  // Helper for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(field!.id, { [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={cn("px-4 py-3 border-b border-surface-200 shrink-0", mobile && "flex items-center justify-between")}>
        <div className="flex items-center gap-2">
          <span className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0", meta.color)}>
            {meta.icon}
          </span>
          <div>
            <h3 className="text-xs font-bold text-surface-900 leading-tight">Field Settings</h3>
            <div className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">{meta.label}</div>
          </div>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="px-4 pt-3 pb-0 shrink-0">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1">
            {errors.map((err, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-rose-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{err.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {field.isProfileField && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700">
            <span className="font-bold block mb-1">Profile-linked field</span>
            This information will be automatically populated from the innovator&apos;s existing profile when they apply.
          </div>
        )}

        {/* Basic Settings */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700">Field Label</label>
            <input
              type="text"
              name="label"
              value={field.label}
              onChange={handleChange}
              className="w-full text-sm rounded-lg border border-surface-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. Project Title"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700 flex items-center justify-between">
              Description
              <span className="text-[10px] font-normal text-surface-400">Optional</span>
            </label>
            <textarea
              name="description"
              value={field.description}
              onChange={handleChange}
              rows={2}
              className="w-full text-sm rounded-lg border border-surface-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none"
              placeholder="Provide instructions to applicants..."
            />
          </div>

          {!["dropdown", "single_choice", "multiple_choice", "multi_select", "file_upload", "image_upload"].includes(field.type) && !field.isProfileField && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-700 flex items-center justify-between">
                Placeholder
                <span className="text-[10px] font-normal text-surface-400">Optional</span>
              </label>
              <input
                type="text"
                name="placeholder"
                value={field.placeholder}
                onChange={handleChange}
                className="w-full text-sm rounded-lg border border-surface-300 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. Enter value..."
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => updateField(field!.id, { required: e.target.checked })}
              className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-semibold text-surface-900">Required field</span>
          </label>
        </div>

        {/* Options (for selection fields) */}
        {["dropdown", "single_choice", "multiple_choice", "multi_select"].includes(field.type) && (
          <div className="pt-4 border-t border-surface-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-surface-700">Options</label>
            </div>
            
            <div className="space-y-2">
              {field.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2 group">
                  <GripVertical className="w-4 h-4 text-surface-300 cursor-grab shrink-0" />
                  <input
                    type="text"
                    value={opt.label}
                    onChange={e => updateFieldOption(field!.id, opt.id, e.target.value)}
                    className="flex-1 text-sm rounded-md border border-transparent hover:border-surface-300 focus:border-brand-500 bg-surface-50 hover:bg-white focus:bg-white px-2 py-1.5 transition-smooth focus:outline-none"
                    placeholder={`Option ${i + 1}`}
                  />
                  <button
                    onClick={() => moveFieldOption(field!.id, opt.id, "up")}
                    disabled={i === 0}
                    className="p-1 rounded text-surface-400 hover:bg-surface-100 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveFieldOption(field!.id, opt.id, "down")}
                    disabled={i === field!.options.length - 1}
                    className="p-1 rounded text-surface-400 hover:bg-surface-100 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteFieldOption(field!.id, opt.id)}
                    className="p-1 rounded text-surface-400 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addFieldOption(field!.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 px-2 py-1.5 rounded-lg hover:bg-brand-50 transition-smooth"
            >
              <Plus className="w-3.5 h-3.5" /> Add Option
            </button>
          </div>
        )}

        {/* Validation Settings (for text/number/file) */}
        {(["short_text", "long_text", "number", "file_upload", "image_upload"].includes(field.type)) && (
          <div className="pt-4 border-t border-surface-200 space-y-3">
            <label className="text-xs font-bold text-surface-700">Validation & Limits</label>
            
            {["short_text", "long_text"].includes(field.type) && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-surface-500 uppercase">Min Length</label>
                  <input
                    type="number"
                    value={field.validation.minLength ?? ""}
                    onChange={e => updateField(field!.id, { validation: { ...field!.validation, minLength: e.target.value ? Number(e.target.value) : undefined }})}
                    className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-surface-500 uppercase">Max Length</label>
                  <input
                    type="number"
                    value={field.validation.maxLength ?? ""}
                    onChange={e => updateField(field!.id, { validation: { ...field!.validation, maxLength: e.target.value ? Number(e.target.value) : undefined }})}
                    className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    placeholder="1000"
                  />
                </div>
              </div>
            )}

            {field.type === "number" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-surface-500 uppercase">Min Value</label>
                    <input
                      type="number"
                      value={field.validation.minValue ?? ""}
                      onChange={e => updateField(field!.id, { validation: { ...field!.validation, minValue: e.target.value ? Number(e.target.value) : undefined }})}
                      className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-surface-500 uppercase">Max Value</label>
                    <input
                      type="number"
                      value={field.validation.maxValue ?? ""}
                      onChange={e => updateField(field!.id, { validation: { ...field!.validation, maxValue: e.target.value ? Number(e.target.value) : undefined }})}
                      className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-surface-500 uppercase">Unit (e.g. ₹, kg, days)</label>
                  <input
                    type="text"
                    value={field.validation.unit ?? ""}
                    onChange={e => updateField(field!.id, { validation: { ...field!.validation, unit: e.target.value || undefined }})}
                    className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                  />
                </div>
              </>
            )}

            {["file_upload", "image_upload"].includes(field.type) && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-surface-500 uppercase">Allowed Formats (comma separated)</label>
                  <input
                    type="text"
                    value={field.validation.allowedFileTypes?.join(", ") ?? ""}
                    onChange={e => updateField(field!.id, { validation: { ...field!.validation, allowedFileTypes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }})}
                    className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    placeholder="pdf, doc, docx"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-surface-500 uppercase">Max Size (MB)</label>
                    <input
                      type="number"
                      value={field.validation.maxFileSizeMB ?? ""}
                      onChange={e => updateField(field!.id, { validation: { ...field!.validation, maxFileSizeMB: e.target.value ? Number(e.target.value) : undefined }})}
                      className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-surface-500 uppercase">Max Files</label>
                    <input
                      type="number"
                      value={field.validation.maxFiles ?? ""}
                      onChange={e => updateField(field!.id, { validation: { ...field!.validation, maxFiles: e.target.value ? Number(e.target.value) : undefined }})}
                      className="w-full text-sm rounded-lg border border-surface-300 bg-white px-2 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Conditional Logic */}
        <div className="pt-4 border-t border-surface-200 space-y-3">
          <label className="text-xs font-bold text-surface-700 flex items-center justify-between">
            Conditional Logic
            <button
              onClick={() => updateField(field!.id, { conditionalRule: { ...field!.conditionalRule, enabled: !field!.conditionalRule.enabled } })}
              className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold transition-smooth", field.conditionalRule.enabled ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-500 hover:bg-surface-200")}
            >
              {field.conditionalRule.enabled ? "ON" : "OFF"}
            </button>
          </label>
          
          {field.conditionalRule.enabled && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-xs space-y-3">
              <div className="font-semibold text-brand-800">Show this field when:</div>
              {/* Very simplified conditional UI for Phase 3 */}
              <div className="text-brand-600 bg-white border border-brand-200 rounded-lg p-2 text-center">
                Click to configure rules (Phase 3 placeholder)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
