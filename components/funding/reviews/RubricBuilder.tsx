"use client";

import React, { useState, useEffect } from "react";
import { EvaluationRubric, EvaluationCriterion } from "@/types/funding/reviews";
import { Plus, Trash2, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/funding/ui/Button";

interface RubricBuilderProps {
  initialRubric: EvaluationRubric | null;
  onSave: (rubric: EvaluationRubric) => Promise<void>;
  ownerType: "grant" | "directPitch";
  ownerId: string;
}

export function RubricBuilder({ initialRubric, onSave, ownerType, ownerId }: RubricBuilderProps) {
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(
    initialRubric?.criteria || []
  );

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const isValid = totalWeight === 100 && criteria.length > 0;

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      {
        id: `crit_${Date.now()}`,
        name: "",
        description: "",
        weight: 0,
        maxScore: 5,
        required: true,
        order: criteria.length + 1,
      },
    ]);
  };

  const handleUpdateCriterion = (id: string, updates: Partial<EvaluationCriterion>) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    if (!isValid) return;

    const rubricToSave: any = {
      ...(initialRubric || {}),
      ownerType,
      ownerId,
      criteria,
    };
    
    await onSave(rubricToSave);
  };

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-surface-200">
        <h2 className="text-lg font-bold text-surface-900">Evaluation Criteria</h2>
        <p className="text-sm text-surface-500 mt-1">
          Configure the rubric reviewers will use to evaluate this {ownerType === "grant" ? "application" : "pitch"}.
        </p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {criteria.map((crit, index) => (
            <div key={crit.id} className="flex gap-4 items-start p-4 bg-surface-50 rounded-lg border border-surface-200">
              <div className="pt-2 text-surface-400 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-surface-700 block mb-1">Criterion Name</label>
                    <input
                      type="text"
                      className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                      value={crit.name}
                      onChange={(e) => handleUpdateCriterion(crit.id, { name: e.target.value })}
                      placeholder="e.g. Technical Feasibility"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-semibold text-surface-700 block mb-1">Weight (%)</label>
                    <input
                      type="number"
                      className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                      value={crit.weight || ""}
                      onChange={(e) => handleUpdateCriterion(crit.id, { weight: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-semibold text-surface-700 block mb-1">Max Score</label>
                    <input
                      type="number"
                      className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                      value={crit.maxScore}
                      onChange={(e) => handleUpdateCriterion(crit.id, { maxScore: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-surface-700 block mb-1">Description / Guidelines</label>
                  <textarea
                    className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                    rows={2}
                    value={crit.description}
                    onChange={(e) => handleUpdateCriterion(crit.id, { description: e.target.value })}
                    placeholder="Provide guidance to the reviewer..."
                  />
                </div>
              </div>
              <button 
                onClick={() => handleDeleteCriterion(crit.id)}
                className="text-surface-400 hover:text-red-600 transition-colors pt-2"
                title="Remove Criterion"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {criteria.length === 0 && (
            <div className="text-center py-8 text-surface-500 border-2 border-dashed border-surface-200 rounded-lg">
              No criteria defined. Add your first criterion below.
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={handleAddCriterion}
            className="w-full text-brand-600 border-brand-200 hover:bg-brand-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Criterion
          </Button>
        </div>
      </div>

      <div className="p-6 border-t border-surface-200 bg-surface-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-surface-600">Total Weight:</span>
            <span className={`ml-2 font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
          </div>
          {totalWeight !== 100 && (
            <div className="flex items-center text-xs text-red-600 font-medium">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Criterion weights must total exactly 100%
            </div>
          )}
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!isValid}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          Save Rubric
        </Button>
      </div>
    </div>
  );
}
