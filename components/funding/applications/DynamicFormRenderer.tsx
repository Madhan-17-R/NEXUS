"use client";

import React from "react";
import { FormDefinition, FormField } from "@/types/funding/forms";
import { getFieldMeta } from "@/components/funding/formbuilder/FieldCard";
import { cn } from "@/lib/funding/utils";
import { FileText, Image as ImageIcon, Video, ExternalLink } from "lucide-react";

interface DynamicFormRendererProps {
  form: FormDefinition | null;
  responses: Record<string, any>;
  mode: "review";
}

export function DynamicFormRenderer({ form, responses, mode }: DynamicFormRendererProps) {
  if (!form) return <div className="p-4 text-surface-500">Loading form definition...</div>;

  const renderFieldValue = (field: FormField, value: any) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-surface-300 italic">No response provided</span>;
    }

    switch (field.type) {
      case "short_text":
      case "long_text":
      case "email":
      case "phone":
      case "profile_full_name":
      case "profile_email":
      case "profile_phone":
      case "profile_institution":
      case "profile_education":
      case "profile_domain":
      case "profile_experience":
      case "profile_skills":
      case "custom_question":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1.5">
              {value.map((v, i) => (
                <span key={i} className="px-2 py-1 bg-surface-100 text-surface-700 rounded-md text-sm">{v}</span>
              ))}
            </div>
          );
        }
        return <p className="text-sm text-surface-900 whitespace-pre-wrap">{String(value)}</p>;
      
      case "url":
      case "video_link":
        return (
          <a href={String(value)} target="_blank" rel="noreferrer" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            {String(value)} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        );

      case "number":
      case "funding_required":
        const num = Number(value);
        if (isNaN(num)) return <span className="text-surface-900">{value}</span>;
        const formatted = field.type === "funding_required" || field.validation.unit === "₹"
          ? `₹${num.toLocaleString("en-IN")}`
          : `${num.toLocaleString()} ${field.validation.unit || ""}`.trim();
        return <span className="text-sm font-semibold text-surface-900">{formatted}</span>;

      case "dropdown":
      case "single_choice":
      case "project_stage":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-sm font-semibold">
            {String(value)}
          </span>
        );

      case "multiple_choice":
      case "multi_select":
        const arr = Array.isArray(value) ? value : [value];
        return (
          <div className="flex flex-wrap gap-1.5">
            {arr.map((v, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-sm font-semibold">
                {String(v)}
              </span>
            ))}
          </div>
        );

      case "date":
      case "date_range":
      case "project_timeline":
        return <span className="text-sm text-surface-900">{new Date(String(value)).toLocaleDateString()}</span>;

      case "file_upload":
      case "image_upload":
        // Mocking file rendering since real upload isn't in scope
        const files = Array.isArray(value) ? value : [{ name: String(value), url: "#" }];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {files.map((f: any, i: number) => (
              <a key={i} href={f.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-xl border border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm transition-smooth group">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  {field.type === "image_upload" ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-surface-900 truncate group-hover:text-brand-600">{f.name || "Attached File"}</div>
                  <div className="text-xs text-surface-500 uppercase tracking-wider">{field.type === "image_upload" ? "Image" : "Document"}</div>
                </div>
              </a>
            ))}
          </div>
        );

      default:
        return <span className="text-sm text-surface-900">{String(value)}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {form.sections.map(section => {
        // Only render section if it has fields
        if (section.fields.length === 0) return null;

        return (
          <div key={section.id} className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-surface-200 bg-surface-50/50">
              <h3 className="text-base font-bold text-surface-900">{section.title}</h3>
              {section.description && <p className="text-sm text-surface-500 mt-1">{section.description}</p>}
            </div>
            
            <div className="p-6 space-y-6">
              {section.fields.map(field => {
                // Determine conditional visibility (simple check for Phase 4 mock)
                if (field.conditionalRule.enabled && field.conditionalRule.conditions.length > 0) {
                  // For a real app we'd evaluate the condition. Here, if the response is missing, we assume it was hidden.
                  if (responses[field.id] === undefined && responses[field.type] === undefined) {
                    return null;
                  }
                }

                // Temporary hack for mock data where keys might be strings like "project_title" instead of field IDs
                // In production, responses[field.id] is used.
                let val = responses[field.id];
                
                // Fallback mappings for the mock data seed that uses hardcoded string keys
                if (val === undefined) {
                  if (field.label.toLowerCase().includes("title")) val = responses["project_title"];
                  else if (field.label.toLowerCase().includes("problem")) val = responses["problem_statement"];
                  else if (field.label.toLowerCase().includes("funding")) val = responses["funding_required"];
                  else if (field.isProfileField) val = undefined; // handled by snapshot usually, omitted here for brevity
                }

                return (
                  <div key={field.id} className="border-b border-surface-100 pb-6 last:border-0 last:pb-0">
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-surface-900">{field.label}</h4>
                        {field.required && <span className="text-[10px] font-bold text-rose-500 uppercase">Required</span>}
                      </div>
                      {field.description && <p className="text-xs text-surface-500 mt-0.5">{field.description}</p>}
                    </div>
                    
                    <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
                      {renderFieldValue(field, val)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
