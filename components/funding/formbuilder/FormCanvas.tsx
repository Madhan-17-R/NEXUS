"use client";

import React, { useState } from "react";
import { useForms } from "@/context/funding/FormsContext";
import { FormSection } from "@/types/funding/forms";
import { FieldCard } from "./FieldCard";
import { cn } from "@/lib/funding/utils";
import { Button } from "@/components/funding/ui/Button";
import {
  GripVertical, ChevronDown, ChevronUp, Copy, Trash2, Plus, 
  Settings, CheckCircle2, ChevronRight, Inbox
} from "lucide-react";

// ─── Section Component ────────────────────────────────────────────────────────

interface SectionProps {
  section: FormSection;
  isFirst: boolean;
  isLast: boolean;
}

function Section({ section, isFirst, isLast }: SectionProps) {
  const { 
    selectedSectionId, selectSection, selectedFieldId, selectField,
    updateSection, moveSection, duplicateSection, deleteSection, 
    toggleSectionCollapse 
  } = useForms();
  
  const isSelected = selectedSectionId === section.id;
  const hasSelectedField = section.fields.some(f => f.id === selectedFieldId);

  return (
    <div 
      className={cn(
        "rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white group/sec relative",
        isSelected || hasSelectedField
          ? "border-brand-300 shadow-md shadow-brand-50"
          : "border-surface-200 hover:border-surface-300"
      )}
      onClick={() => selectSection(section.id)}
    >
      {/* Section Header */}
      <div className={cn(
        "px-5 py-4 border-b flex gap-3 transition-colors",
        isSelected || hasSelectedField ? "border-brand-200 bg-brand-50/50" : "border-surface-100 bg-surface-50/50"
      )}>
        {/* Drag handle */}
        <div className="pt-1 text-surface-300 cursor-grab active:cursor-grabbing hover:text-brand-500 opacity-50 group-hover/sec:opacity-100 transition-smooth">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-surface-400">0{section.order}</span>
            <input
              type="text"
              value={section.title}
              onChange={e => updateSection(section.id, { title: e.target.value })}
              className="flex-1 bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded-md px-2 py-1 -ml-2 text-base font-bold text-surface-900 focus:outline-none transition-colors placeholder:text-surface-300"
              placeholder="Section Title"
            />
          </div>
          <input
            type="text"
            value={section.description}
            onChange={e => updateSection(section.id, { description: e.target.value })}
            className="w-full bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded-md px-2 py-1 -ml-2 text-sm text-surface-500 focus:outline-none transition-colors placeholder:text-surface-300 mt-1"
            placeholder="Add a description (optional)"
          />
        </div>

        {/* Section Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/sec:opacity-100 transition-smooth">
          <div className="flex items-center bg-white border border-surface-200 rounded-lg p-0.5 shadow-sm">
            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, "up"); }} disabled={isFirst} className="p-1.5 rounded hover:bg-surface-100 text-surface-500 disabled:opacity-30" title="Move Section Up"><ChevronUp className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, "down"); }} disabled={isLast} className="p-1.5 rounded hover:bg-surface-100 text-surface-500 disabled:opacity-30" title="Move Section Down"><ChevronDown className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-surface-200 mx-1" />
            <button onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }} className="p-1.5 rounded hover:bg-surface-100 text-surface-500" title="Duplicate Section"><Copy className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="p-1.5 rounded hover:bg-rose-50 text-surface-400 hover:text-rose-500" title="Delete Section"><Trash2 className="w-4 h-4" /></button>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleSectionCollapse(section.id); }} 
            className="p-2 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 text-surface-500 shadow-sm transition-transform"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", section.collapsed ? "-rotate-90" : "rotate-0")} />
          </button>
        </div>
      </div>

      {/* Fields Canvas */}
      {!section.collapsed && (
        <div 
          className="p-5 bg-surface-50 space-y-4"
          onClick={(e) => {
            // Unselect field if clicking empty space in canvas
            if (e.target === e.currentTarget) selectField(null);
          }}
        >
          {section.fields.map((field, i) => (
            <FieldCard
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              isFirst={i === 0}
              isLast={i === section.fields.length - 1}
            />
          ))}

          {section.fields.length === 0 && (
            <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface-50/50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-surface-100 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-brand-300" />
              </div>
              <h4 className="text-sm font-bold text-surface-700">Empty Section</h4>
              <p className="text-xs text-surface-500 mt-1 max-w-xs">
                Drag and drop fields here from the library, or click a field to add it automatically.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

export function FormCanvas() {
  const { form, updateFormMeta, addSection, selectSection, selectField } = useForms();

  if (!form) return null;

  return (
    <div 
      className="flex-1 overflow-y-auto bg-surface-100/50 px-4 py-8 md:px-8 lg:px-12"
      onClick={(e) => {
        // Clear selection when clicking outside
        if (e.target === e.currentTarget) {
          selectSection(null);
          selectField(null);
        }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Form Meta Header */}
        <div className="text-center space-y-3 mb-8">
          <input
            type="text"
            value={form.title}
            onChange={e => updateFormMeta({ title: e.target.value })}
            className="w-full text-center bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded-lg px-3 py-2 text-2xl font-black text-surface-900 focus:outline-none transition-colors placeholder:text-surface-300"
            placeholder="Form Title"
          />
          <textarea
            value={form.description}
            onChange={e => updateFormMeta({ description: e.target.value })}
            rows={2}
            className="w-full text-center bg-transparent border border-transparent hover:border-surface-200 focus:border-brand-300 focus:bg-white rounded-lg px-3 py-2 text-sm text-surface-500 focus:outline-none transition-colors placeholder:text-surface-300 resize-none max-w-xl mx-auto block mt-2"
            placeholder="Form description or instructions for applicants (optional)"
          />
        </div>

        {/* Sections List */}
        <div className="space-y-6 pb-24">
          {form.sections.map((section, i) => (
            <Section 
              key={section.id} 
              section={section} 
              isFirst={i === 0} 
              isLast={i === form.sections.length - 1} 
            />
          ))}

          {/* Add Section Button */}
          <button
            onClick={addSection}
            className="w-full py-4 border-2 border-dashed border-surface-300 rounded-2xl text-surface-500 font-bold hover:bg-surface-50 hover:border-brand-400 hover:text-brand-600 transition-all flex items-center justify-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center transition-smooth">
              <Plus className="w-4 h-4" />
            </div>
            Add New Section
          </button>
        </div>
      </div>
    </div>
  );
}
