"use client";

import React, { useEffect } from "react";
import { useForms } from "@/context/funding/FormsContext";
import { FormOwnerType } from "@/types/funding/forms";
import { FormBuilderHeader } from "./FormBuilderHeader";
import { FieldLibrary } from "./FieldLibrary";
import { FormCanvas } from "./FormCanvas";
import { FieldSettings } from "./FieldSettings";
import { cn } from "@/lib/funding/utils";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { FORM_TEMPLATES } from "@/lib/funding/firebase/formsApi";
import { X, CheckCircle2, AlertTriangle, Zap, Eye, Rocket, HelpCircle } from "lucide-react";
import { getFieldMeta } from "./FieldCard";

interface FormBuilderLayoutProps {
  ownerType: FormOwnerType;
  ownerId: string;
  grantTitle?: string;
}

export function FormBuilderLayout({ ownerType, ownerId, grantTitle }: FormBuilderLayoutProps) {
  const { 
    form, loading, loadForm, settingsPanelOpen, fieldLibraryOpen, selectedSectionId,
    previewOpen, closePreview, publishModalOpen, closePublishModal, publishForm,
    publishSuccess, dismissPublishSuccess, templateSelectorOpen, closeTemplateSelector,
    applyTemplate, validationErrors
  } = useForms();

  useEffect(() => {
    loadForm(ownerType, ownerId, grantTitle);
  }, [loadForm, ownerType, ownerId, grantTitle]);

  if (loading && !form) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-surface-500">Loading Form Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface-50 overflow-hidden font-sans">
      <FormBuilderHeader />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Field Library (Desktop) */}
        <aside className="hidden md:block w-64 bg-white border-r border-surface-200 shrink-0 z-10 shadow-sm">
          <FieldLibrary activeSectionId={selectedSectionId ?? undefined} />
        </aside>

        {/* Center: Canvas */}
        <main className="flex-1 min-w-0 relative h-full flex flex-col">
          <FormCanvas />
        </main>

        {/* Right Panel: Settings (Desktop) */}
        {settingsPanelOpen && (
          <aside className="hidden md:block w-80 bg-white border-l border-surface-200 shrink-0 z-10 shadow-sm">
            <FieldSettings />
          </aside>
        )}

      </div>

      {/* ─── Modals ───────────────────────────────────────────────────────────── */}

      {/* Template Selector Modal */}
      {templateSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-surface-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-surface-900">Choose a Template</h2>
                <p className="text-sm text-surface-500 mt-1">Start from scratch or use a pre-built template to save time.</p>
              </div>
              {form && (
                <button onClick={closeTemplateSelector} className="p-2 hover:bg-surface-100 rounded-lg text-surface-500">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="p-6 overflow-y-auto bg-surface-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Start from Scratch */}
                <div 
                  onClick={() => {
                    if (!form) return; // shouldn't happen
                    closeTemplateSelector();
                  }}
                  className="bg-white rounded-xl border-2 border-dashed border-surface-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center mb-4 transition-smooth">
                    <span className="text-xl">✨</span>
                  </div>
                  <h3 className="text-base font-bold text-surface-900 group-hover:text-brand-700">Start from Scratch</h3>
                  <p className="text-xs text-surface-500 mt-2">Build your form field by field with a blank canvas.</p>
                </div>

                {/* Templates */}
                {FORM_TEMPLATES.map(tpl => (
                  <div 
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl.id)}
                    className="bg-white rounded-xl border-2 border-surface-200 p-5 cursor-pointer hover:border-brand-400 hover:shadow-md transition-all group flex flex-col"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      {tpl.thumbnail}
                    </div>
                    <h3 className="text-base font-bold text-surface-900">{tpl.name}</h3>
                    <p className="text-xs text-surface-500 mt-2 flex-1">{tpl.description}</p>
                    <div className="mt-4 pt-4 border-t border-surface-100 flex justify-between items-center text-xs font-semibold text-surface-400">
                      <span>{tpl.estimatedMinutes} min to apply</span>
                      <span className="text-brand-600 group-hover:underline">Use Template</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal (Phase 3 simplified preview) */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm" onClick={closePreview} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col h-full max-h-[90vh]">
            <div className="px-5 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-100 text-brand-700 rounded-lg"><Eye className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-bold text-surface-900">Applicant Preview</h3>
                  <p className="text-[11px] text-surface-500">This is exactly how applicants will see your form.</p>
                </div>
              </div>
              <button onClick={closePreview} className="p-2 hover:bg-surface-200 rounded-lg text-surface-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface-50/50">
              {/* Form renderer preview container */}
              <div className="max-w-2xl mx-auto bg-white border border-surface-200 rounded-2xl p-6 md:p-10 shadow-sm">
                
                <div className="text-center mb-8 space-y-3">
                  <h1 className="text-2xl font-black text-surface-900">{form?.title}</h1>
                  {form?.description && <p className="text-sm text-surface-600">{form.description}</p>}
                </div>

                <div className="space-y-10">
                  {form?.sections.map(sec => (
                    <div key={sec.id} className="space-y-5">
                      <div className="border-b border-surface-200 pb-2">
                        <h2 className="text-lg font-bold text-surface-900">{sec.title}</h2>
                        {sec.description && <p className="text-sm text-surface-500 mt-1">{sec.description}</p>}
                      </div>
                      
                      <div className="space-y-6">
                        {sec.fields.map(f => {
                          const meta = getFieldMeta(f.type);
                          return (
                            <div key={f.id} className="space-y-2">
                              <label className="block text-sm font-bold text-surface-900">
                                {f.label} {f.required && <span className="text-rose-500">*</span>}
                              </label>
                              {f.description && <p className="text-xs text-surface-500 -mt-1">{f.description}</p>}
                              
                              <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 flex items-center gap-3 text-surface-400">
                                {meta.icon}
                                <span className="text-sm">{f.placeholder || meta.label} input preview</span>
                              </div>
                            </div>
                          );
                        })}
                        {sec.fields.length === 0 && (
                          <div className="text-xs text-surface-400 italic py-2">No fields in this section</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-surface-200 flex justify-end">
                  <Button variant="primary">Submit Application</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm" onClick={closePublishModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            
            {validationErrors.some(e => e.severity === "error") ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900">Cannot Publish Form</h3>
                  <p className="text-sm text-surface-500 mt-1">Please fix the following errors before publishing:</p>
                </div>
                <ul className="space-y-2 bg-rose-50 rounded-xl p-4 text-sm text-rose-700 list-disc list-inside">
                  {validationErrors.filter(e => e.severity === "error").map((e, i) => (
                    <li key={i}>{e.message}</li>
                  ))}
                </ul>
                <div className="pt-2 flex justify-end">
                  <Button variant="secondary" onClick={closePublishModal}>Back to Editing</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900">Publish Application Form?</h3>
                  <p className="text-sm text-surface-500 mt-1">
                    Once published, applicants will be able to see and use this form to apply for the grant.
                  </p>
                </div>
                <div className="bg-surface-50 rounded-xl p-4 flex gap-4 text-sm">
                  <div><span className="block text-surface-500 text-xs">Total Sections</span><span className="font-bold">{form?.sections.length}</span></div>
                  <div><span className="block text-surface-500 text-xs">Total Fields</span><span className="font-bold">{form?.totalFields}</span></div>
                  <div><span className="block text-surface-500 text-xs">Required Fields</span><span className="font-bold">{form?.requiredFields}</span></div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={closePublishModal}>Cancel</Button>
                  <Button variant="primary" onClick={publishForm}>Publish Form</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Success Modal */}
      {publishSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
            <div className="bg-emerald-500 px-6 py-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-white">Form Published!</h2>
              <p className="text-emerald-100 text-sm mt-1">The application form is now live.</p>
            </div>
            <div className="p-6 flex flex-col gap-2">
              <Button variant="primary" onClick={dismissPublishSuccess}>Continue Editing</Button>
              <Button variant="outline" onClick={() => window.location.href = `/grants`}>Back to Grants</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
