"use client";

import React, { useState } from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Modal } from "@/components/funding/ui/Modal";
import { Button } from "@/components/funding/ui/Button";
import { Award, Plus, Calendar, DollarSign, Tag, FileText } from "lucide-react";

export function NewGrantQuickModal() {
  const { isCreateGrantOpen, setIsCreateGrantOpen, createQuickGrant } = useFundingOrg();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Climate & CleanTech");
  const [totalPool, setTotalPool] = useState("1500000");
  const [minAward, setMinAward] = useState("50000");
  const [maxAward, setMaxAward] = useState("250000");
  const [deadline, setDeadline] = useState("Nov 30, 2026");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await createQuickGrant({
      title,
      category,
      totalPool: parseInt(totalPool, 10) || 1000000,
      minAward: parseInt(minAward, 10) || 25000,
      maxAward: parseInt(maxAward, 10) || 250000,
      deadline,
      description: description || "Program description and eligibility criteria defined in setup.",
    });
    setIsSubmitting(false);
    setTitle("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isCreateGrantOpen}
      onClose={() => setIsCreateGrantOpen(false)}
      title="Initialize New Grant Round"
      description="Create a draft grant program. You can configure full eligibility criteria and custom forms in Phase 2 & 3."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateGrantOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Initialize Draft Grant
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grant Title */}
        <div>
          <label className="block text-xs font-bold text-surface-700 mb-1">
            Grant Program Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. NextGen Carbon Removal Accelerator 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
          />
        </div>

        {/* Category & Deadline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-surface-700 mb-1">
              Focus Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
            >
              <option value="Climate & CleanTech">Climate & CleanTech</option>
              <option value="HealthTech & BioAI">HealthTech & BioAI</option>
              <option value="Robotics & Hardware">Robotics & Hardware</option>
              <option value="Web3 & Security">Web3 & Security</option>
              <option value="AgriTech & Food">AgriTech & Food</option>
              <option value="Deep Tech & Quantum">Deep Tech & Quantum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 mb-1">
              Application Deadline
            </label>
            <input
              type="text"
              placeholder="e.g. Dec 15, 2026"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
            />
          </div>
        </div>

        {/* Financial Pool & Award Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-surface-700 mb-1">
              Total Grant Pool ($)
            </label>
            <input
              type="number"
              placeholder="1500000"
              value={totalPool}
              onChange={(e) => setTotalPool(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 mb-1">
              Min Award ($)
            </label>
            <input
              type="number"
              placeholder="50000"
              value={minAward}
              onChange={(e) => setMinAward(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 mb-1">
              Max Award ($)
            </label>
            <input
              type="number"
              placeholder="250000"
              value={maxAward}
              onChange={(e) => setMaxAward(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
            />
          </div>
        </div>

        {/* Program Description */}
        <div>
          <label className="block text-xs font-bold text-surface-700 mb-1">
            Program Description &amp; Scope
          </label>
          <textarea
            rows={3}
            placeholder="Outline target breakthrough areas, eligibility criteria, and key milestone requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-smooth"
          />
        </div>
      </form>
    </Modal>
  );
}
