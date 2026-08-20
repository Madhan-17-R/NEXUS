"use client";

import React, { useState } from "react";
import { useGrants } from "@/context/funding/GrantsContext";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { cn } from "@/lib/funding/utils";
import {
  X, ChevronRight, ChevronLeft, Save, CheckCircle,
  AlertCircle, FileText, Layers, Eye, Pencil, Globe,
  Plus, Trash2, Calendar, DollarSign, Users, Clock,
  Zap, BookOpen
} from "lucide-react";
import { EligibilityCriteria, ApplicationFormConfig } from "@/types/funding";
import { WizardStep1, WizardStep3 } from "@/context/funding/GrantsContext";

// ─── Step Indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Eligibility" },
  { id: 3, label: "Funding & Timeline" },
  { id: 4, label: "Application Form" },
  { id: 5, label: "Review & Publish" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-px">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                done ? "bg-emerald-500 border-emerald-500 text-white" :
                  active ? "bg-surface-900 border-surface-900 text-white" :
                    "bg-white border-surface-300 text-surface-400"
              )}>
                {done ? <CheckCircle className="w-4 h-4" /> : step.id}
              </div>
              <span className={cn(
                "text-[10px] font-semibold whitespace-nowrap hidden sm:block",
                active ? "text-surface-900" : done ? "text-emerald-600" : "text-surface-400"
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-1 min-w-[20px] transition-all",
                done ? "bg-emerald-400" : "bg-surface-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Field Wrappers ────────────────────────────────────────────────────────────

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-surface-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-surface-400">{hint}</p>}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-xl border border-surface-300 bg-white text-sm text-surface-900 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 placeholder:text-surface-400 transition-smooth"
      {...props}
    />
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full rounded-xl border border-surface-300 bg-white text-sm text-surface-900 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 placeholder:text-surface-400 transition-smooth resize-none"
      {...props}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className="w-full rounded-xl border border-surface-300 bg-white text-sm text-surface-900 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-smooth appearance-none cursor-pointer"
      {...props}
    >
      {children}
    </select>
  );
}

// ─── STEP 1: Basic Information ─────────────────────────────────────────────────

const DOMAINS = [
  "AI & Machine Learning", "Healthcare", "Climate & Sustainability",
  "Agriculture", "FinTech", "Robotics", "Education", "Social Innovation",
  "Climate & CleanTech", "HealthTech & BioAI", "Robotics & Hardware",
  "Web3 & Security", "AgriTech & Food"
];

const PROGRAM_TYPES = [
  "Student Grant", "Innovation Grant", "Research Grant",
  "Startup Grant", "Community Grant", "Open Innovation"
];

const FUNDING_TYPES = ["Grant", "Fellowship", "Prize", "Research Funding", "Other"];

function Step1Form() {
  const { wizard, updateWizardStep1 } = useGrants();
  const d = wizard.step1;
  const [focusInput, setFocusInput] = useState("");

  const addFocusArea = () => {
    if (!focusInput.trim() || d.focusAreas.includes(focusInput.trim())) return;
    updateWizardStep1({ focusAreas: [...d.focusAreas, focusInput.trim()] });
    setFocusInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-surface-900">Grant Information</h3>
        <p className="text-xs text-surface-500 mt-0.5">Define the core details of this funding opportunity.</p>
      </div>

      <div className="space-y-4">
        <Field label="Grant Title" required>
          <Input
            placeholder="e.g. Student Innovation Grant 2026"
            value={d.title}
            onChange={e => updateWizardStep1({ title: e.target.value })}
            id="wizard-grant-title"
          />
        </Field>

        <Field label="Short Description" required hint="A concise 1–2 sentence summary shown on listing cards.">
          <Textarea
            rows={2}
            placeholder="Brief overview of what this grant funds and who it's for..."
            value={d.shortDescription}
            onChange={e => updateWizardStep1({ shortDescription: e.target.value })}
            id="wizard-short-desc"
          />
        </Field>

        <Field label="Detailed Description" hint="Full context, goals, and evaluation criteria.">
          <Textarea
            rows={5}
            placeholder="Provide a comprehensive description of the grant program, its objectives, and what makes a strong application..."
            value={d.description}
            onChange={e => updateWizardStep1({ description: e.target.value })}
            id="wizard-full-desc"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Funding Domain" required>
            <Select
              value={d.domain}
              onChange={e => updateWizardStep1({ domain: e.target.value })}
              id="wizard-domain"
            >
              <option value="">Select domain…</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </Field>

          <Field label="Program Type" required>
            <Select
              value={d.programType}
              onChange={e => updateWizardStep1({ programType: e.target.value })}
              id="wizard-program-type"
            >
              <option value="">Select type…</option>
              {PROGRAM_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
            </Select>
          </Field>
        </div>

        <Field label="Funding Type">
          <div className="flex flex-wrap gap-2">
            {FUNDING_TYPES.map(ft => (
              <button
                key={ft}
                type="button"
                onClick={() => updateWizardStep1({ fundingType: ft })}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full border transition-smooth",
                  d.fundingType === ft
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-600 border-surface-300 hover:border-surface-500"
                )}
              >
                {ft}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Focus Areas" hint="Press Enter or click Add to add focus tags.">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Carbon Capture, Machine Learning…"
              value={focusInput}
              onChange={e => setFocusInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFocusArea(); } }}
              id="wizard-focus-input"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addFocusArea}>
              Add
            </Button>
          </div>
          {d.focusAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {d.focusAreas.map(fa => (
                <span key={fa} className="flex items-center gap-1 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                  {fa}
                  <button onClick={() => updateWizardStep1({ focusAreas: d.focusAreas.filter(x => x !== fa) })}
                    className="text-brand-400 hover:text-brand-700 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>
    </div>
  );
}

// ─── STEP 2: Eligibility ───────────────────────────────────────────────────────

const APPLICANT_TYPES = ["Student", "Innovator", "Researcher", "Working Professional", "Startup", "Team", "Individual"];
const EDUCATION_LEVELS = ["High School", "Undergraduate", "Postgraduate", "PhD", "Any Education Level"];
const EXPERIENCE_LEVELS = ["Any experience", "0–2 years", "2–5 years", "5+ years"];
const GEOGRAPHY_OPTIONS = ["Global", "Country", "State/Region", "Selected Locations"];

function MultiSelect({ options, selected, onChange }: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(x => x !== val) : [...selected, val]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-full border transition-smooth",
            selected.includes(opt)
              ? "bg-surface-900 text-white border-surface-900"
              : "bg-white text-surface-600 border-surface-300 hover:border-surface-500"
          )}
        >
          {selected.includes(opt) ? "✓ " : ""}{opt}
        </button>
      ))}
    </div>
  );
}

function Step2Form() {
  const { wizard, updateWizardStep2 } = useGrants();
  const d = wizard.step2;
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (!skillInput.trim() || d.skills.includes(skillInput.trim())) return;
    updateWizardStep2({ skills: [...d.skills, skillInput.trim()] });
    setSkillInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-surface-900">Eligibility Criteria</h3>
        <p className="text-xs text-surface-500 mt-0.5">Define who can apply for this funding opportunity.</p>
      </div>

      {/* Logic preview */}
      {(d.applicantTypes.length > 0 || d.domains.length > 0) && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-sm">
          <div className="text-[10px] font-bold text-brand-700 uppercase tracking-wider mb-2">Eligibility Preview</div>
          <div className="space-y-1 text-surface-700 text-xs">
            {d.applicantTypes.length > 0 && (
              <div>
                <span className="font-semibold">Applicants must be: </span>
                <span className="text-brand-700 font-bold">{d.applicantTypes.join(" OR ")}</span>
              </div>
            )}
            {d.domains.length > 0 && (
              <div><span className="font-semibold text-surface-500">AND</span>{" "}
                <span className="font-semibold">Domain = </span>
                <span className="text-brand-700 font-bold">{d.domains.join(", ")}</span>
              </div>
            )}
            <div><span className="font-semibold text-surface-500">AND</span>{" "}
              <span className="font-semibold">Location = </span>
              <span className="text-brand-700 font-bold">{d.geography}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <Field label="Applicant Type" hint="Select all that apply. Uses OR logic within this group.">
          <MultiSelect
            options={APPLICANT_TYPES}
            selected={d.applicantTypes}
            onChange={v => updateWizardStep2({ applicantTypes: v })}
          />
        </Field>

        <Field label="Education Level">
          <MultiSelect
            options={EDUCATION_LEVELS}
            selected={d.educationLevels}
            onChange={v => updateWizardStep2({ educationLevels: v })}
          />
        </Field>

        <Field label="Experience Level">
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => updateWizardStep2({ experienceLevel: level })}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full border transition-smooth",
                  d.experienceLevel === level
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-600 border-surface-300 hover:border-surface-500"
                )}
              >
                {d.experienceLevel === level ? "✓ " : ""}{level}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Relevant Domains" hint="Select the domains this grant targets.">
          <MultiSelect
            options={DOMAINS}
            selected={d.domains}
            onChange={v => updateWizardStep2({ domains: v })}
          />
        </Field>

        <Field label="Required Skills" hint="Press Enter or click Add to create skill tags.">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Python, TensorFlow, Machine Learning…"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              id="wizard-skill-input"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addSkill}>Add</Button>
          </div>
          {d.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {d.skills.map(s => (
                <span key={s} className="flex items-center gap-1 text-xs font-medium bg-surface-900 text-white px-2.5 py-0.5 rounded-full">
                  {s}
                  <button onClick={() => updateWizardStep2({ skills: d.skills.filter(x => x !== s) })}
                    className="text-white/50 hover:text-white ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field label="Geography">
          <div className="flex flex-wrap gap-2">
            {GEOGRAPHY_OPTIONS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => updateWizardStep2({ geography: g })}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full border transition-smooth",
                  d.geography === g
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-600 border-surface-300 hover:border-surface-500"
                )}
              >
                {d.geography === g ? "✓ " : ""}{g}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Additional Requirements" hint="Any specific requirements not covered above.">
          <Textarea
            rows={3}
            placeholder='e.g. "Applicants must demonstrate a working prototype."'
            value={d.additionalRequirements}
            onChange={e => updateWizardStep2({ additionalRequirements: e.target.value })}
            id="wizard-extra-req"
          />
        </Field>
      </div>
    </div>
  );
}

// ─── STEP 3: Funding & Timeline ────────────────────────────────────────────────

const CURRENCIES = [
  { code: "USD", label: "USD $" },
  { code: "EUR", label: "EUR €" },
  { code: "GBP", label: "GBP £" },
  { code: "INR", label: "INR ₹" },
];

function Step3Form() {
  const { wizard, updateWizardStep3 } = useGrants();
  const d = wizard.step3;

  const dateError = (start: string, end: string) => {
    if (!start || !end) return null;
    return new Date(end) <= new Date(start) ? "End date must be after start date." : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-surface-900">Funding & Timeline</h3>
        <p className="text-xs text-surface-500 mt-0.5">Configure the financial parameters and key dates.</p>
      </div>

      {/* Funding Section */}
      <div className="bg-surface-50 rounded-xl border border-surface-200 p-4 space-y-4">
        <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" /> Funding Configuration
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Currency">
            <Select value={d.currency} onChange={e => updateWizardStep3({ currency: e.target.value })} id="wizard-currency">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Number of Awards" required>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 10"
              value={d.numberOfAwards}
              onChange={e => updateWizardStep3({ numberOfAwards: e.target.value })}
              id="wizard-num-awards"
            />
          </Field>
        </div>

        <Field label="Total Funding Pool" required>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-semibold">
              {d.currency === "INR" ? "₹" : d.currency === "EUR" ? "€" : d.currency === "GBP" ? "£" : "$"}
            </span>
            <Input
              type="number"
              min="0"
              placeholder="5000000"
              value={d.totalPool}
              onChange={e => updateWizardStep3({ totalPool: e.target.value })}
              className="pl-8"
              id="wizard-total-pool"
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum Award" required>
            <Input
              type="number"
              min="0"
              placeholder="50000"
              value={d.minAward}
              onChange={e => updateWizardStep3({ minAward: e.target.value })}
              id="wizard-min-award"
            />
          </Field>
          <Field label="Maximum Award" required>
            <Input
              type="number"
              min="0"
              placeholder="500000"
              value={d.maxAward}
              onChange={e => updateWizardStep3({ maxAward: e.target.value })}
              id="wizard-max-award"
            />
          </Field>
        </div>

        {d.minAward && d.maxAward && Number(d.minAward) > Number(d.maxAward) && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Minimum award cannot exceed maximum award.
          </p>
        )}
      </div>

      {/* Timeline Section */}
      <div className="bg-surface-50 rounded-xl border border-surface-200 p-4 space-y-4">
        <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Grant Timeline
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Application Opening Date" required>
            <Input
              type="date"
              value={d.openingDate}
              onChange={e => updateWizardStep3({ openingDate: e.target.value })}
              id="wizard-opening-date"
            />
          </Field>

          <Field label="Application Deadline" required>
            <Input
              type="date"
              value={d.deadline}
              onChange={e => updateWizardStep3({ deadline: e.target.value })}
              id="wizard-deadline"
            />
          </Field>

          <Field label="Review Period End">
            <Input
              type="date"
              value={d.reviewPeriodEnd}
              onChange={e => updateWizardStep3({ reviewPeriodEnd: e.target.value })}
              id="wizard-review-end"
            />
          </Field>

          <Field label="Decision Date">
            <Input
              type="date"
              value={d.decisionDate}
              onChange={e => updateWizardStep3({ decisionDate: e.target.value })}
              id="wizard-decision-date"
            />
          </Field>

          <Field label="Funding Start Date">
            <Input
              type="date"
              value={d.fundingStartDate}
              onChange={e => updateWizardStep3({ fundingStartDate: e.target.value })}
              id="wizard-funding-start"
            />
          </Field>
        </div>

        {dateError(d.openingDate, d.deadline) && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {dateError(d.openingDate, d.deadline)}
          </p>
        )}

        {/* Visual Timeline */}
        {d.openingDate && d.deadline && (
          <div className="mt-2 pt-3 border-t border-surface-200">
            <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2">Timeline Preview</div>
            <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-semibold">
              {[
                { label: d.openingDate, color: "bg-emerald-100 text-emerald-700" },
                { label: "→", color: "" },
                { label: d.deadline, color: "bg-amber-100 text-amber-700" },
                { label: "→", color: "" },
                { label: d.reviewPeriodEnd || "Review", color: "bg-sky-100 text-sky-700" },
                { label: "→", color: "" },
                { label: d.decisionDate || "Decision", color: "bg-purple-100 text-purple-700" },
              ].map((t, i) => (
                <span key={i} className={cn(
                  "whitespace-nowrap",
                  t.color ? `px-2 py-1 rounded-lg ${t.color}` : "text-surface-300"
                )}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 4: Application Form ──────────────────────────────────────────────────

function Step4Form() {
  const { wizard, updateWizardStep4 } = useGrants();
  const d = wizard.step4;
  const isConfigured = d.status === "configured" || d.status === "draft";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-surface-900">Application Form Setup</h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Choose what information applicants must provide when applying to this grant.
        </p>
      </div>

      {!isConfigured ? (
        <div className="bg-surface-50 border-2 border-dashed border-surface-300 rounded-2xl p-10 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h4 className="text-base font-bold text-surface-900 mb-1">Application Form Not Configured</h4>
            <p className="text-sm text-surface-500 max-w-xs">
              Create a customized application form to collect the information required from innovators applying for this grant.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Layers className="w-4 h-4" />}
              onClick={() => updateWizardStep4({
                status: "configured",
                totalFields: 12,
                totalSections: 4,
                requiredFields: 8,
                optionalFields: 4,
                sections: ["Applicant Information", "Project Information", "Funding Requirements", "Supporting Documents"],
                lastUpdated: new Date().toLocaleDateString(),
              })}
              id="wizard-customize-form"
            >
              Customize Application Form
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => updateWizardStep4({
                status: "configured",
                totalFields: 8,
                totalSections: 3,
                requiredFields: 6,
                optionalFields: 2,
                sections: ["Applicant Profile", "Project Summary", "Supporting Documents"],
                lastUpdated: new Date().toLocaleDateString(),
              })}
            >
              Use Template
            </Button>
          </div>
          <div className="bg-surface-100 border border-surface-200 rounded-xl px-4 py-2 text-xs text-surface-500 font-medium">
            🧩 Full Drag-and-Drop Form Builder — Available in Phase 3
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-bold text-emerald-800">Application Form Ready</div>
              <div className="text-xs text-emerald-600">Template applied — customizable in Phase 3 Form Builder</div>
            </div>
            <button
              onClick={() => updateWizardStep4({ status: "not_configured", totalFields: 0, totalSections: 0, requiredFields: 0, optionalFields: 0, sections: [] })}
              className="text-xs text-surface-400 hover:text-rose-500 transition-smooth"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Fields", value: d.totalFields },
              { label: "Sections", value: d.totalSections },
              { label: "Required", value: d.requiredFields },
              { label: "Optional", value: d.optionalFields },
            ].map(m => (
              <div key={m.label} className="bg-white border border-surface-200 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-surface-900">{m.value}</div>
                <div className="text-xs text-surface-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
            <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Form Sections</div>
            <div className="space-y-2">
              {d.sections.map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-sm text-surface-700">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-surface-400 text-center">
            Full drag-and-drop field customization available in Phase 3.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── STEP 5: Review & Publish ──────────────────────────────────────────────────

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-surface-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-50 hover:bg-surface-100 transition-smooth"
      >
        <span className="text-sm font-bold text-surface-900">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <ChevronRight className={cn("w-4 h-4 text-surface-400 transition-transform", open ? "rotate-90" : "")} />
        </div>
      </button>
      {open && <div className="px-4 pb-4 pt-3 space-y-2">{children}</div>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-surface-500">{label}</span>
      <span className="font-semibold text-surface-900 text-right max-w-[60%]">{String(value)}</span>
    </div>
  );
}

function Step5Review() {
  const { wizard, setWizardStep, publishGrant } = useGrants();
  const { step1: s1, step2: s2, step3: s3, step4: s4 } = wizard;

  const validations = [
    { label: "Grant title completed", ok: Boolean(s1.title) },
    { label: "Domain selected", ok: Boolean(s1.domain) },
    { label: "Funding configured", ok: Boolean(s3.totalPool) },
    { label: "Eligibility configured", ok: s2.applicantTypes.length > 0 },
    { label: "Timeline configured", ok: Boolean(s3.openingDate && s3.deadline) },
    { label: "Application form configured", ok: s4.status !== "not_configured" },
  ];

  const allValid = validations.every(v => v.ok);
  const formMissing = s4.status === "not_configured";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-surface-900">Review Grant Round</h3>
        <p className="text-xs text-surface-500 mt-0.5">Review all configuration before publishing.</p>
      </div>

      {/* Validation checklist */}
      <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
        <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Publication Checklist</div>
        <div className="space-y-2">
          {validations.map(v => (
            <div key={v.label} className={cn("flex items-center gap-2 text-sm", v.ok ? "text-emerald-700" : "text-rose-500")}>
              {v.ok
                ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              }
              {v.label}
            </div>
          ))}
        </div>
      </div>

      {formMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-800">Application form required</div>
            <p className="text-xs text-amber-600 mt-0.5">
              Applicants need an application form before this grant can accept submissions.
            </p>
            <Button variant="outline" size="xs" className="mt-2" onClick={() => setWizardStep(4)}>
              Configure Application Form
            </Button>
          </div>
        </div>
      )}

      <ReviewSection title="Basic Information" onEdit={() => setWizardStep(1)}>
        <ReviewRow label="Grant Title" value={s1.title || "—"} />
        <ReviewRow label="Domain" value={s1.domain || "—"} />
        <ReviewRow label="Program Type" value={s1.programType || "—"} />
        <ReviewRow label="Funding Type" value={s1.fundingType} />
        {s1.shortDescription && <p className="text-xs text-surface-500 mt-2 italic">{s1.shortDescription}</p>}
      </ReviewSection>

      <ReviewSection title="Eligibility" onEdit={() => setWizardStep(2)}>
        <ReviewRow label="Applicant Types" value={s2.applicantTypes.join(", ") || "—"} />
        <ReviewRow label="Education" value={s2.educationLevels.join(", ") || "—"} />
        <ReviewRow label="Experience" value={s2.experienceLevel} />
        <ReviewRow label="Geography" value={s2.geography} />
        {s2.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {s2.skills.map(s => (
              <span key={s} className="text-[10px] font-semibold bg-surface-900 text-white px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </ReviewSection>

      <ReviewSection title="Funding" onEdit={() => setWizardStep(3)}>
        <ReviewRow label="Total Pool" value={s3.totalPool ? `${s3.currency} ${Number(s3.totalPool).toLocaleString()}` : "—"} />
        <ReviewRow label="Award Range" value={s3.minAward && s3.maxAward ? `${Number(s3.minAward).toLocaleString()} – ${Number(s3.maxAward).toLocaleString()}` : "—"} />
        <ReviewRow label="Number of Awards" value={s3.numberOfAwards || "—"} />
      </ReviewSection>

      <ReviewSection title="Timeline" onEdit={() => setWizardStep(3)}>
        <ReviewRow label="Opening Date" value={s3.openingDate || "—"} />
        <ReviewRow label="Deadline" value={s3.deadline || "—"} />
        <ReviewRow label="Decision Date" value={s3.decisionDate || "—"} />
        <ReviewRow label="Funding Start" value={s3.fundingStartDate || "—"} />
      </ReviewSection>

      <ReviewSection title="Application Form" onEdit={() => setWizardStep(4)}>
        <ReviewRow label="Status" value={s4.status === "not_configured" ? "Not Configured" : "Configured"} />
        {s4.status !== "not_configured" && (
          <>
            <ReviewRow label="Total Fields" value={s4.totalFields} />
            <ReviewRow label="Sections" value={s4.totalSections} />
          </>
        )}
      </ReviewSection>
    </div>
  );
}

// ─── Wizard Shell ──────────────────────────────────────────────────────────────

export function CreateGrantWizard() {
  const { wizard, closeWizard, setWizardStep, saveDraft, publishGrant } = useGrants();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { currentStep } = wizard;

  const handleSaveDraft = async () => {
    setSaving(true);
    await saveDraft();
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    await publishGrant();
    setPublishing(false);
  };

  const canNext = () => {
    if (currentStep === 1) return Boolean(wizard.step1.title && wizard.step1.domain && wizard.step1.programType);
    if (currentStep === 2) return wizard.step2.applicantTypes.length > 0;
    if (currentStep === 3) return Boolean(wizard.step3.totalPool && wizard.step3.openingDate && wizard.step3.deadline);
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm" onClick={closeWizard} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-surface-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-surface-900">Create Grant Round</h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {wizard.lastSaved && (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Saved {wizard.lastSaved}
                </span>
              )}
              <button
                onClick={closeWizard}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-smooth"
                aria-label="Close wizard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <StepIndicator current={currentStep} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {currentStep === 1 && <Step1Form />}
          {currentStep === 2 && <Step2Form />}
          {currentStep === 3 && <Step3Form />}
          {currentStep === 4 && <Step4Form />}
          {currentStep === 5 && <Step5Review />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-200 shrink-0 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSaveDraft}
              isLoading={saving}
              id="wizard-save-draft"
            >
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setWizardStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            {currentStep < STEPS.length ? (
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                disabled={!canNext()}
                onClick={() => setWizardStep(currentStep + 1)}
                id="wizard-next"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                rightIcon={<Zap className="w-4 h-4" />}
                onClick={handlePublish}
                isLoading={publishing}
                disabled={!wizard.step1.title}
                id="wizard-publish"
              >
                Publish Grant
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
