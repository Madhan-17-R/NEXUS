"use client";

import React from "react";
import { ReviewerEvaluation, ReviewerAssignment } from "@/types/funding/reviews";
import { AlertCircle, Users, FileText, Activity } from "lucide-react";

interface EvaluationSummaryProps {
  evaluations: ReviewerEvaluation[];
  assignments: ReviewerAssignment[];
}

export function EvaluationSummary({ evaluations, assignments }: EvaluationSummaryProps) {
  const numReviewers = assignments.length;
  
  const submittedEvals = evaluations.filter(e => e.status === "Submitted");
  const numCompleted = submittedEvals.length;
  
  if (numReviewers === 0) {
    return (
      <div className="bg-surface-50 border border-surface-200 rounded-xl p-8 text-center">
        <Users className="w-10 h-10 text-surface-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-surface-900">No Reviewers Assigned</h3>
        <p className="text-sm text-surface-500 mt-1">Assign reviewers to begin the evaluation process.</p>
      </div>
    );
  }

  const scores = submittedEvals.map(e => e.totalScore);
  
  const hasScores = scores.length > 0;
  
  const averageScore = hasScores ? Math.round((scores.reduce((a,b) => a+b, 0) / scores.length) * 10) / 10 : 0;
  const highestScore = hasScores ? Math.max(...scores) : 0;
  const lowestScore = hasScores ? Math.min(...scores) : 0;
  const variance = highestScore - lowestScore;

  const showVarianceWarning = variance > 20 && submittedEvals.length > 1;

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-surface-200 bg-surface-50">
        <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-surface-500" />
          Evaluation Summary
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-50 rounded-lg p-4 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Reviewers</span>
            </div>
            <div className="text-2xl font-black text-surface-900">
              {numCompleted} <span className="text-lg text-surface-400 font-medium">/ {numReviewers}</span>
            </div>
          </div>
          
          <div className="bg-surface-50 rounded-lg p-4 border border-surface-100">
            <div className="flex items-center gap-2 text-surface-500 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
            </div>
            <div className="text-2xl font-black text-brand-600">
              {hasScores ? `${averageScore}%` : '-'}
            </div>
          </div>

          <div className="bg-surface-50 rounded-lg p-4 border border-surface-100">
            <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Highest</div>
            <div className="text-xl font-bold text-surface-900">{hasScores ? `${highestScore}%` : '-'}</div>
          </div>

          <div className="bg-surface-50 rounded-lg p-4 border border-surface-100">
            <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Lowest</div>
            <div className="text-xl font-bold text-surface-900">{hasScores ? `${lowestScore}%` : '-'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-surface-200">
          <span className="text-sm font-semibold text-surface-700">Score Variance:</span>
          <span className="text-sm font-bold text-surface-900">{hasScores ? `${variance} points` : '-'}</span>
        </div>

        {showVarianceWarning && (
          <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block mb-1">High Score Variance Detected</span>
              Reviewers have significantly different scores. Consider scheduling a discussion before making a final decision.
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-bold text-surface-900 mb-4">Reviewer Breakdown</h3>
          <div className="space-y-3">
            {assignments.map(asg => {
              const evalRecord = submittedEvals.find(e => e.reviewerId === asg.reviewerId);
              return (
                <div key={asg.id} className="flex items-center justify-between p-3 rounded-lg border border-surface-200 bg-white">
                  <div>
                    <div className="text-sm font-bold text-surface-900">{asg.reviewerName}</div>
                    <div className="text-xs text-surface-500">{asg.status}</div>
                  </div>
                  <div className="text-right">
                    {evalRecord ? (
                      <div className="text-sm font-bold text-brand-600">{evalRecord.totalScore} / 100</div>
                    ) : (
                      <div className="text-sm font-medium text-surface-400">Pending</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
