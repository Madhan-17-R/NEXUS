"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForms } from "@/context/funding/FormsContext";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { cn } from "@/lib/funding/utils";
import {
  ArrowLeft, Eye, Save, Rocket, CheckCircle2,
  AlertCircle, Settings, Menu, Settings2, AlertTriangle
} from "lucide-react";
import { ConfirmDialog } from "@/components/funding/ui/ConfirmDialog";
import { useAlert } from "@/context/funding/AlertContext";

export function FormBuilderHeader() {
  const router = useRouter();
  const { 
    form, loading, saving, publishing, lastSaved, isDirty,
    openPreview, openPublishModal, saveDraft, validateForm,
    toggleFieldLibrary, toggleSettingsPanel, settingsPanelOpen
  } = useForms();
  const { showWarning } = useAlert();
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  if (loading || !form) {
    return (
      <header className="h-16 bg-white border-b border-surface-200 flex items-center px-4 animate-pulse">
        <div className="w-8 h-8 bg-surface-200 rounded-lg mr-4" />
        <div className="w-48 h-5 bg-surface-200 rounded mr-auto" />
        <div className="w-24 h-8 bg-surface-200 rounded-lg" />
      </header>
    );
  }

  // Handle back navigation safely
  const handleBack = () => {
    if (isDirty) {
      showWarning("Unsaved changes", "You have unsaved changes. Save your changes before leaving this page.");
      setShowExitConfirm(true);
    } else {
      router.back();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 shrink-0 z-20">
      
      {/* Left: Back & Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-smooth shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-surface-900 truncate">
              {form.title}
            </h1>
            <Badge variant={form.status === "published" ? "success" : "neutral"} size="sm">
              {form.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="text-[11px] text-surface-500 flex items-center gap-2 mt-0.5">
            <span>{form.ownerType === "grant" ? "Grant Application Form" : "Direct Pitch Form"}</span>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            {saving ? (
              <span className="text-brand-600 font-medium">Saving...</span>
            ) : lastSaved ? (
              <span>Last saved {lastSaved}</span>
            ) : (
              <span>Unsaved changes</span>
            )}
            {isDirty && !saving && (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Mobile controls */}
        <button 
          onClick={toggleFieldLibrary}
          className="md:hidden p-2 text-surface-500 hover:bg-surface-100 rounded-lg"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={openPreview}
          >
            Preview
          </Button>
          
          <Button
            variant={isDirty ? "secondary" : "ghost"}
            size="sm"
            leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
            onClick={saveDraft}
            disabled={saving || !isDirty}
          >
            {saving ? "Saving..." : "Save Draft"}
          </Button>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Rocket className="w-4 h-4" />}
          onClick={openPublishModal}
          disabled={publishing}
        >
          Publish
        </Button>

        <div className="w-px h-6 bg-surface-200 mx-1 hidden md:block" />

        <button 
          onClick={toggleSettingsPanel}
          className={cn(
            "hidden md:flex p-2 rounded-lg transition-smooth",
            settingsPanelOpen ? "bg-surface-900 text-white" : "text-surface-500 hover:bg-surface-100"
          )}
          title="Toggle Settings Panel"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        title="Leave without saving?"
        message="You have unsaved changes. Are you sure you want to leave this page? All unsaved work will be lost."
        confirmLabel="Leave Page"
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          router.back();
        }}
      />
    </header>
  );
}

// ─── Simple local Plus icon since lucide was missing it in this file scope ──
function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
