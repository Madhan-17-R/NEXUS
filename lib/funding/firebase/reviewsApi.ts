import { 
  EvaluationRubric, 
  ReviewerAssignment, 
  ReviewerEvaluation, 
  DecisionRecord,
  EvaluationOwnerType,
  EvaluationStatus,
  ReviewerAssignmentStatus
} from "@/types/funding/reviews";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

const mockRubrics: EvaluationRubric[] = [
  {
    id: "rub_grant_g1",
    ownerType: "grant",
    ownerId: "g1",
    criteria: [
      { id: "crit_1", name: "Technical Feasibility", description: "Can this solution realistically be implemented?", weight: 25, maxScore: 5, required: true, order: 1 },
      { id: "crit_2", name: "Innovation", description: "How original and differentiated is the idea?", weight: 20, maxScore: 5, required: true, order: 2 },
      { id: "crit_3", name: "Impact", description: "What is the potential impact?", weight: 25, maxScore: 5, required: true, order: 3 },
      { id: "crit_4", name: "Scalability", description: "How well can this solution scale?", weight: 15, maxScore: 5, required: true, order: 4 },
      { id: "crit_5", name: "Team Capability", description: "Does the team have the skills?", weight: 15, maxScore: 5, required: true, order: 5 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "rub_pitch_org1",
    ownerType: "directPitch",
    ownerId: "org_1",
    criteria: [
      { id: "crit_p1", name: "Innovation", description: "How original is this?", weight: 30, maxScore: 5, required: true, order: 1 },
      { id: "crit_p2", name: "Market Potential", description: "Is there a market?", weight: 30, maxScore: 5, required: true, order: 2 },
      { id: "crit_p3", name: "Technical Feasibility", description: "Can it be built?", weight: 20, maxScore: 5, required: true, order: 3 },
      { id: "crit_p4", name: "Team Capability", description: "Can they execute?", weight: 20, maxScore: 5, required: true, order: 4 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockAssignments: ReviewerAssignment[] = [
  {
    id: "asg_1",
    ownerType: "grant",
    applicationId: "APP-2026-00124",
    reviewerId: "rev_1",
    reviewerName: "A. Kumar",
    status: "Pending",
    assignedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString() // +3 days
  },
  {
    id: "asg_2",
    ownerType: "grant",
    applicationId: "APP-2026-00124",
    reviewerId: "rev_2",
    reviewerName: "Priya Shah",
    status: "Submitted",
    assignedAt: new Date().toISOString()
  },
  {
    id: "asg_3",
    ownerType: "directPitch",
    applicationId: "PITCH-2026-0018", // Aris Thorne
    reviewerId: "rev_3",
    reviewerName: "Rahul Menon",
    status: "Pending",
    assignedAt: new Date().toISOString()
  }
];

let mockEvaluations: ReviewerEvaluation[] = [
  {
    id: "eval_1",
    ownerType: "grant",
    applicationId: "APP-2026-00124",
    rubricId: "rub_grant_g1",
    reviewerId: "rev_2",
    reviewerName: "Priya Shah",
    scores: {
      "crit_1": { criterionId: "crit_1", score: 4, comment: "Looks feasible based on the proposal." },
      "crit_2": { criterionId: "crit_2", score: 5, comment: "Very innovative approach." },
      "crit_3": { criterionId: "crit_3", score: 4, comment: "Good impact expected." },
      "crit_4": { criterionId: "crit_4", score: 3, comment: "Might struggle to scale outside region." },
      "crit_5": { criterionId: "crit_5", score: 4, comment: "Strong team." }
    },
    totalScore: 81,
    comments: "Overall a very solid proposal.",
    status: "Submitted",
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockDecisions: DecisionRecord[] = [];

export const reviewsApi = {
  // Rubrics
  async getRubric(ownerType: EvaluationOwnerType, ownerId: string): Promise<EvaluationRubric | null> {
    await delay(300);
    return mockRubrics.find(r => r.ownerType === ownerType && r.ownerId === ownerId) || null;
  },
  
  async saveRubric(rubric: Omit<EvaluationRubric, "createdAt" | "updatedAt"> & Partial<Pick<EvaluationRubric, "id" | "createdAt">>): Promise<EvaluationRubric> {
    await delay(400);
    const existingIndex = mockRubrics.findIndex(r => r.id === rubric.id || (r.ownerType === rubric.ownerType && r.ownerId === rubric.ownerId));
    
    if (existingIndex >= 0) {
      const updated = {
        ...mockRubrics[existingIndex],
        ...rubric,
        updatedAt: new Date().toISOString()
      };
      mockRubrics[existingIndex] = updated;
      return updated;
    } else {
      const newRubric: EvaluationRubric = {
        ...rubric,
        id: rubric.id || uid("rub"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockRubrics.push(newRubric);
      return newRubric;
    }
  },

  // Assignments
  async getAssignments(applicationId: string): Promise<ReviewerAssignment[]> {
    await delay(300);
    return mockAssignments.filter(a => a.applicationId === applicationId);
  },

  async getAllAssignments(): Promise<ReviewerAssignment[]> {
    await delay(300);
    return [...mockAssignments];
  },

  async assignReviewer(assignment: Omit<ReviewerAssignment, "id" | "status" | "assignedAt">): Promise<ReviewerAssignment> {
    await delay(400);
    const newAssignment: ReviewerAssignment = {
      ...assignment,
      id: uid("asg"),
      status: "Pending",
      assignedAt: new Date().toISOString()
    };
    mockAssignments.push(newAssignment);
    return newAssignment;
  },

  async removeAssignment(id: string): Promise<void> {
    await delay(300);
    mockAssignments = mockAssignments.filter(a => a.id !== id);
  },

  // Evaluations
  async getEvaluations(applicationId: string): Promise<ReviewerEvaluation[]> {
    await delay(300);
    return mockEvaluations.filter(e => e.applicationId === applicationId);
  },

  async getEvaluationById(id: string): Promise<ReviewerEvaluation | null> {
    await delay(300);
    return mockEvaluations.find(e => e.id === id) || null;
  },

  async saveEvaluation(evaluation: Partial<ReviewerEvaluation> & Pick<ReviewerEvaluation, "applicationId" | "reviewerId" | "ownerType" | "rubricId">): Promise<ReviewerEvaluation> {
    await delay(400);
    const existingIndex = mockEvaluations.findIndex(e => e.id === evaluation.id || (e.applicationId === evaluation.applicationId && e.reviewerId === evaluation.reviewerId));
    
    if (existingIndex >= 0) {
      const updated = {
        ...mockEvaluations[existingIndex],
        ...evaluation,
        reviewerName: evaluation.reviewerName || mockEvaluations[existingIndex].reviewerName,
        scores: evaluation.scores || mockEvaluations[existingIndex].scores,
        totalScore: evaluation.totalScore ?? mockEvaluations[existingIndex].totalScore,
        comments: evaluation.comments || mockEvaluations[existingIndex].comments,
        status: evaluation.status || mockEvaluations[existingIndex].status,
        updatedAt: new Date().toISOString()
      };
      mockEvaluations[existingIndex] = updated;

      // Update assignment status
      const assignment = mockAssignments.find(a => a.applicationId === updated.applicationId && a.reviewerId === updated.reviewerId);
      if (assignment && assignment.status === "Pending") {
        assignment.status = "In Progress";
      }

      return updated;
    } else {
      const newEval: ReviewerEvaluation = {
        id: evaluation.id || uid("eval"),
        ownerType: evaluation.ownerType,
        applicationId: evaluation.applicationId,
        rubricId: evaluation.rubricId,
        reviewerId: evaluation.reviewerId,
        reviewerName: evaluation.reviewerName || "Unknown Reviewer",
        scores: evaluation.scores || {},
        totalScore: evaluation.totalScore || 0,
        comments: evaluation.comments || "",
        status: evaluation.status || "Draft",
        updatedAt: new Date().toISOString()
      };
      mockEvaluations.push(newEval);
      
      const assignment = mockAssignments.find(a => a.applicationId === newEval.applicationId && a.reviewerId === newEval.reviewerId);
      if (assignment && assignment.status === "Pending") {
        assignment.status = "In Progress";
      }

      return newEval;
    }
  },

  async submitEvaluation(id: string): Promise<ReviewerEvaluation> {
    await delay(400);
    const existing = mockEvaluations.find(e => e.id === id);
    if (!existing) throw new Error("Evaluation not found");
    
    existing.status = "Submitted";
    existing.submittedAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();

    const assignment = mockAssignments.find(a => a.applicationId === existing.applicationId && a.reviewerId === existing.reviewerId);
    if (assignment) {
      assignment.status = "Submitted";
    }

    return existing;
  },

  // Decisions
  async getDecision(applicationId: string): Promise<DecisionRecord | null> {
    await delay(200);
    // Return latest decision if multiple exist
    const decs = mockDecisions.filter(d => d.applicationId === applicationId);
    if (decs.length === 0) return null;
    return decs.sort((a, b) => new Date(b.decidedAt).getTime() - new Date(a.decidedAt).getTime())[0];
  },

  async saveDecision(decision: Omit<DecisionRecord, "id" | "decidedAt">): Promise<DecisionRecord> {
    await delay(500);
    const newDec: DecisionRecord = {
      ...decision,
      id: uid("dec"),
      decidedAt: new Date().toISOString()
    };
    mockDecisions.push(newDec);
    return newDec;
  }
};
