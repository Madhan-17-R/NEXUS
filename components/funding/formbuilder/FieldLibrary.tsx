"use client";

import React, { useState } from "react";
import { FieldType } from "@/types/funding/forms";
import { useForms } from "@/context/funding/FormsContext";
import { cn } from "@/lib/funding/utils";
import {
  Type, AlignLeft, Hash, Mail, Phone, Link,
  ChevronDown, Circle, CheckSquare, ToggleLeft, List,
  Calendar, CalendarRange, User, Upload, Image, Video,
  DollarSign, Clock, Users, Layers, HelpCircle, Search,
  GripVertical, X, Plus
} from "lucide-react";

export interface FieldLibraryItem {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  isProfile?: boolean;
  description?: string;
}

export const FIELD_CATEGORIES: { id: string; label: string; fields: FieldLibraryItem[] }[] = [
  {
    id: "basic",
    label: "Basic",
    fields: [
      { type: "short_text", label: "Short Text", icon: <Type className="w-4 h-4" />, description: "Single line text input" },
      { type: "long_text", label: "Long Text", icon: <AlignLeft className="w-4 h-4" />, description: "Multi-line text area" },
      { type: "number", label: "Number", icon: <Hash className="w-4 h-4" />, description: "Numeric input with validation" },
      { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, description: "Email address field" },
      { type: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, description: "Phone number input" },
      { type: "url", label: "URL / Link", icon: <Link className="w-4 h-4" />, description: "Website or resource link" },
    ],
  },
  {
    id: "selection",
    label: "Selection",
    fields: [
      { type: "dropdown", label: "Dropdown", icon: <ChevronDown className="w-4 h-4" />, description: "Single selection from list" },
      { type: "single_choice", label: "Single Choice", icon: <Circle className="w-4 h-4" />, description: "Radio button selection" },
      { type: "multiple_choice", label: "Multiple Choice", icon: <CheckSquare className="w-4 h-4" />, description: "Checkboxes" },
      { type: "multi_select", label: "Multi Select", icon: <List className="w-4 h-4" />, description: "Tag-style multi select" },
    ],
  },
  {
    id: "date",
    label: "Date & Time",
    fields: [
      { type: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, description: "Single date picker" },
      { type: "date_range", label: "Date Range", icon: <CalendarRange className="w-4 h-4" />, description: "Start and end date" },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    fields: [
      { type: "profile_full_name", label: "Full Name", icon: <User className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_email", label: "Email", icon: <Mail className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_phone", label: "Phone", icon: <Phone className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_education", label: "Education", icon: <Layers className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_institution", label: "Institution", icon: <Layers className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_skills", label: "Skills", icon: <List className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_domain", label: "Domain / Field", icon: <Layers className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
      { type: "profile_experience", label: "Experience", icon: <Clock className="w-4 h-4" />, isProfile: true, description: "From innovator profile" },
    ],
  },
  {
    id: "upload",
    label: "Upload",
    fields: [
      { type: "file_upload", label: "File Upload", icon: <Upload className="w-4 h-4" />, description: "PDF, DOC, PPT uploads" },
      { type: "image_upload", label: "Image Upload", icon: <Image className="w-4 h-4" />, description: "PNG, JPG, SVG uploads" },
      { type: "video_link", label: "Video / Demo Link", icon: <Video className="w-4 h-4" />, description: "YouTube, Vimeo, or direct URL" },
    ],
  },
  {
    id: "project",
    label: "Funding & Project",
    fields: [
      { type: "funding_required", label: "Funding Required", icon: <DollarSign className="w-4 h-4" />, description: "Amount field with currency" },
      { type: "project_timeline", label: "Project Timeline", icon: <Clock className="w-4 h-4" />, description: "Milestone planner" },
      { type: "team_members", label: "Team Members", icon: <Users className="w-4 h-4" />, description: "Team roster" },
      { type: "project_stage", label: "Project Stage", icon: <Layers className="w-4 h-4" />, description: "Development stage selector" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    fields: [
      { type: "custom_question", label: "Custom Question", icon: <HelpCircle className="w-4 h-4" />, description: "Write your own question" },
    ],
  },
];

// ─── Library Card ──────────────────────────────────────────────────────────────

function LibraryCard({ item, sectionId }: { item: FieldLibraryItem; sectionId?: string }) {
  const { addField, form } = useForms();
  const targetSection = sectionId ?? form?.sections[0]?.id ?? null;

  const handleClick = () => {
    if (!targetSection) return;
    addField(item.type, targetSection);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-surface-200 bg-white hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm transition-all duration-150 text-left group"
      title={item.description}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-smooth",
        item.isProfile
          ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200"
          : "bg-surface-100 text-surface-600 group-hover:bg-brand-100 group-hover:text-brand-700"
      )}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-surface-800 group-hover:text-brand-700">{item.label}</div>
        {item.isProfile && (
          <div className="text-[10px] text-emerald-600 font-medium">Profile field</div>
        )}
      </div>
      <Plus className="w-3.5 h-3.5 text-surface-300 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-smooth shrink-0" />
    </button>
  );
}

// ─── Field Library Panel ───────────────────────────────────────────────────────

interface FieldLibraryProps {
  activeSectionId?: string;
  onClose?: () => void;
  mobile?: boolean;
}

export function FieldLibrary({ activeSectionId, onClose, mobile }: FieldLibraryProps) {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(["basic", "selection", "profile", "upload", "project", "custom"]);

  const toggleCategory = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filtered = search.trim()
    ? FIELD_CATEGORIES.map(cat => ({
        ...cat,
        fields: cat.fields.filter(f =>
          f.label.toLowerCase().includes(search.toLowerCase()) ||
          (f.description ?? "").toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.fields.length > 0)
    : FIELD_CATEGORIES;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className={cn("px-4 pt-4 pb-3 border-b border-surface-200 shrink-0", mobile && "flex items-center justify-between")}>
        <div>
          <h3 className="text-xs font-bold text-surface-900">Add Field</h3>
          <p className="text-[11px] text-surface-400 mt-0.5">Click a field to add it to your form</p>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
          <input
            type="text"
            placeholder="Search fields..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-300 bg-surface-50 text-xs pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-400 focus:bg-white transition-smooth"
            id="field-library-search"
          />
        </div>
      </div>

      {/* Profile note */}
      {(search === "" || openCategories.includes("profile")) && (
        <div className="mx-3 mb-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[11px] text-emerald-700">
          <span className="font-semibold">Profile fields</span> are auto-filled from the innovator&apos;s profile.
        </div>
      )}

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {filtered.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-wider hover:text-surface-600 transition-smooth"
            >
              {cat.label}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openCategories.includes(cat.id) ? "rotate-180" : "")} />
            </button>
            {openCategories.includes(cat.id) && (
              <div className="space-y-1">
                {cat.fields.map(field => (
                  <LibraryCard key={field.type} item={field} sectionId={activeSectionId} />
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-surface-400">
            No fields match &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
