"use client";

import React, { useState, useEffect } from "react";
import { EvaluationRubric, ReviewerEvaluation, EvaluationScore } from "@/types/funding/reviews";
import { Button } from "@/components/funding/ui/Button";
import { CheckCircle2, FileText, AlertCircle } from "lucide-react";

interface ReviewerEvaluationPanelProps {
  rubric: EvaluationRubric;
  evaluation: ReviewerEvaluation | null;
  onSaveDraft: (evalData: Partial<ReviewerEvaluation>) => Promise<void>;
  onSubmit: (evaluationId: string) => Promise<void>;
  reviewerId: string;
  reviewerName: string;
  applicationId: string;
  ownerType: "grant" | "directPitch";
}

export function ReviewerEvaluationPanel({
  rubric,
  evaluation,
  onSaveDraft,
  onSubmit,
  reviewerId,
  reviewerName,
  applicationId,
  ownerType
}: ReviewerEvaluationPanelProps) {
  const [scores, setScores] = useState<Record<string, EvaluationScore>>(evaluation?.scores || {});
  const [comments, setComments] = useState<string>(evaluation?.comments || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (evaluation) {
      setScores(evaluation.scores || {});
      setComments(evaluation.comments || "");
    }
  }, [evaluation]);

  const isSubmitted = evaluation?.status === "Submitted";
  const criteria = [...rubric.criteria].sort((a, b) => a.order - b.order);

  const calculateTotal = () => {
    let total = 0;
    criteria.forEach(c => {
      const s = scores[c.id]?.score || 0;
      total += (s / c.maxScore) * c.weight;
    });
    return Math.round(total * 10) / 10;
  };

  const currentTotal = calculateTotal();

  const handleScoreChange = (criterionId: string, score: number) => {
    if (isSubmitted) return;
    setScores(prev => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], criterionId, score }
    }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    if (isSubmitted) return;
    setScores(prev => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], criterionId, score: prev[criterionId]?.score || 0, comment }
    }));
  };

  const isComplete = criteria.every(c => !c.required || (scores[c.id] && scores[c.id].score > 0));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveDraft({
        id: evaluation?.id,
        ownerType,
        applicationId,
        rubricId: rubric.id,
        reviewerId,
        reviewerName,
        scores,
        totalScore: currentTotal,
        comments,
        status: evaluation?.status || "Draft"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setSaving(true);
    try {
      // First save to ensure latest data
      await onSaveDraft({
        id: evaluation?.id,
        ownerType,
        applicationId,
        rubricId: rubric.id,
        reviewerId,
        reviewerName,
        scores,
        totalScore: currentTotal,
        comments,
        status: "Draft"
      });
      // Assuming evaluation.id exists after saveDraft, but since it's async and we might not have it yet if it was brand new, 
      // the parent component should ideally handle this. For now, we trust the parent re-renders and provides `evaluation.id`.
      // If no ID exists, we can't submit. The parent typically creates the draft first.
      if (evaluation?.id) {
        await onSubmit(evaluation.id);
      } else {
        // Fallback: If no ID, it means saveDraft hasn't updated the prop yet. In a real app we'd await the returned ID.
        // We will assume the parent passes down the updated eval.
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-surface-200 flex justify-between items-center bg-surface-50">
        <div>
          <h2 className="text-lg font-bold text-surface-900">Reviewer Evaluation</h2>
          <p className="text-sm text-surface-500">
            {isSubmitted ? "Evaluation submitted. Read-only." : "Complete the evaluation rubric."}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Weighted Score</div>
          <div className="text-2xl font-black text-brand-600">{currentTotal} / 100</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold block mb-1">Evaluation Submitted</span>
              This evaluation was submitted by {evaluation.reviewerName} and is now locked for editing.
            </div>
          </div>
        )}

        {criteria.map((crit) => {
          const currentScore = scores[crit.id]?.score || 0;
          return (
            <div key={crit.id} className="pt-6 first:pt-0 border-t first:border-0 border-surface-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-bold text-surface-900">
                    {crit.name}
                    {crit.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <p className="text-sm text-surface-500 mt-1">{crit.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-xs font-medium text-surface-500">Weight</div>
                  <div className="text-sm font-bold text-surface-900">{crit.weight}%</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-surface-700 mb-2">Score (Max: {crit.maxScore})</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: crit.maxScore }, (_, i) => i + 1).map(val => (
                    <button
                      key={val}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleScoreChange(crit.id, val)}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors
                        ${currentScore === val 
                          ? 'bg-brand-600 text-white border-brand-600' 
                          : 'bg-white border border-surface-200 text-surface-600 hover:border-brand-300 hover:bg-brand-50'
                        }
                        ${isSubmitted ? 'opacity-80 cursor-not-allowed' : ''}
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-surface-700 mb-2">Reviewer Comment</div>
                <textarea
                  disabled={isSubmitted}
                  className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-600"
                  rows={3}
                  placeholder="Provide rationale for the score..."
                  value={scores[crit.id]?.comment || ""}
                  onChange={(e) => handleCommentChange(crit.id, e.target.value)}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-6 border-t border-surface-200">
          <h3 className="text-base font-bold text-surface-900 mb-2">Overall Comments</h3>
          <textarea
            disabled={isSubmitted}
            className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500 disabled:bg-surface-50 disabled:text-surface-600"
            rows={4}
            placeholder="Final thoughts and overall recommendation..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </div>

      {!isSubmitted && (
        <div className="p-5 border-t border-surface-200 bg-surface-50 flex justify-between items-center shrink-0">
          {!isComplete ? (
            <div className="flex items-center text-sm font-medium text-amber-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              Complete all required scores to submit
            </div>
          ) : (
            <div className="text-sm font-medium text-surface-500">Ready to submit</div>
          )}
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={saving}
              className="text-surface-600 border-surface-200 hover:bg-surface-100"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isComplete || saving || !evaluation?.id}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Submit Evaluation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
