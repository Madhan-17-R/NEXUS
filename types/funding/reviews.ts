export type EvaluationOwnerType = "grant" | "directPitch";

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, e.g., 25 for 25%
  maxScore: number;
  required: boolean;
  order: number;
}

export interface EvaluationRubric {
  id: string;
  ownerType: EvaluationOwnerType;
  ownerId: string;
  criteria: EvaluationCriterion[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationScore {
  criterionId: string;
  score: number;
  comment?: string;
}

export type EvaluationStatus = "Draft" | "Submitted";

export interface ReviewerEvaluation {
  id: string;
  ownerType: EvaluationOwnerType;
  applicationId: string; // Used for both grant applicationId and direct pitch pitchId
  rubricId: string;
  reviewerId: string;
  reviewerName: string;
  scores: Record<string, EvaluationScore>; // Keyed by criterionId
  totalScore: number; // Weighted score out of 100
  comments: string; // Overall comment
  status: EvaluationStatus;
  submittedAt?: string;
  updatedAt: string;
}

export type ReviewerAssignmentStatus = "Pending" | "In Progress" | "Submitted";

export interface ReviewerAssignment {
  id: string;
  ownerType: EvaluationOwnerType;
  applicationId: string;
  reviewerId: string;
  reviewerName: string;
  status: ReviewerAssignmentStatus;
  assignedAt: string;
  dueDate?: string;
}

export type DecisionType = "Shortlisted" | "Awarded" | "More Information Required" | "Rejected" | "Pending";

export interface DecisionRecord {
  id: string;
  ownerType: EvaluationOwnerType;
  applicationId: string;
  decision: DecisionType;
  reason?: string;
  notes?: string;
  amount?: number;
  informationRequested?: string;
  deadline?: string;
  decidedBy: string;
  decidedAt: string;
}
