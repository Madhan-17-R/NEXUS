import {
  FormDefinition, FormSection, FormField, FormTemplate,
  FieldType, FormStatus, FieldOption, FormOwnerType
} from "@/types/funding/forms";

// ─── ID Generator ─────────────────────────────────────────────────────────────

function uid(prefix = "fld"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

// ─── Default Field Factory ─────────────────────────────────────────────────────

export function makeField(
  type: FieldType,
  label: string,
  sectionId: string,
  order: number,
  extra: Partial<FormField> = {}
): FormField {
  const isProfile = type.startsWith("profile_");
  return {
    id: uid("fld"),
    type,
    label,
    description: "",
    placeholder: "",
    required: false,
    order,
    sectionId,
    options: [],
    validation: {},
    conditionalRule: {
      enabled: false,
      logic: "all",
      conditions: [],
    },
    isProfileField: isProfile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

export function makeOption(label: string, order: number): FieldOption {
  return { id: uid("opt"), label, value: label.toLowerCase().replace(/\s+/g, "_"), order };
}

function makeSection(title: string, description: string, order: number): Omit<FormSection, "fields"> {
  return { id: uid("sec"), title, description, order, collapsed: false };
}

// ─── Student Innovation Grant Template ────────────────────────────────────────

function buildStudentInnovationForm(grantId: string): FormDefinition {
  const s1Id = uid("sec");
  const s2Id = uid("sec");
  const s3Id = uid("sec");
  const s4Id = uid("sec");

  const protoQId = uid("fld");

  const s1Fields: FormField[] = [
    makeField("profile_full_name", "Full Name", s1Id, 1, { required: true, description: "Your legal full name as it appears on official documents." }),
    makeField("profile_email", "Email Address", s1Id, 2, { required: true, description: "We'll use this to contact you about your application." }),
    makeField("profile_phone", "Phone Number", s1Id, 3, { required: false, placeholder: "+91 9999 999 999" }),
    makeField("profile_institution", "Institution / University", s1Id, 4, { required: true, description: "The institution you are currently affiliated with." }),
    makeField("profile_education", "Education Level", s1Id, 5, { required: true, options: [
      makeOption("High School", 1),
      makeOption("Undergraduate", 2),
      makeOption("Postgraduate", 3),
      makeOption("PhD", 4),
    ]}),
    makeField("profile_skills", "Skills & Expertise", s1Id, 6, { required: false, placeholder: "e.g. Python, Machine Learning, Hardware Design" }),
  ];

  const s2Fields: FormField[] = [
    makeField("short_text", "Project Title", s2Id, 1, { required: true, placeholder: "e.g. AI-powered rural healthcare diagnostics", validation: { maxLength: 100 } }),
    makeField("long_text", "Problem Statement", s2Id, 2, { required: true, description: "Describe the problem you are solving and its significance.", placeholder: "What problem does your project address?", validation: { minLength: 100, maxLength: 1000 } }),
    makeField("long_text", "Proposed Solution", s2Id, 3, { required: true, description: "Explain your solution and how it addresses the problem.", placeholder: "How does your project solve this problem?", validation: { minLength: 100, maxLength: 1000 } }),
    makeField("long_text", "Innovation & Uniqueness", s2Id, 4, { required: true, description: "What makes your solution different from existing alternatives?", placeholder: "What makes your approach innovative?", validation: { minLength: 50, maxLength: 500 } }),
    makeField("dropdown", "Current Development Stage", s2Id, 5, { required: true, options: [
      makeOption("Idea / Concept", 1),
      makeOption("Prototype", 2),
      makeOption("MVP", 3),
      makeOption("Pilot / Early Stage", 4),
      makeOption("Production", 5),
    ]}),
    makeField("short_text", "Target Users", s2Id, 6, { required: true, placeholder: "Who will use your solution?", validation: { maxLength: 200 } }),
    {
      ...makeField("single_choice", "Do you currently have a working prototype?", s2Id, 7, {
        required: true,
        options: [makeOption("Yes", 1), makeOption("No", 2)],
      }),
      id: protoQId,
    },
  ];

  const s3Fields: FormField[] = [
    makeField("funding_required", "Funding Required", s3Id, 1, { required: true, description: "Total funding you are requesting.", validation: { minValue: 50000, maxValue: 5000000, unit: "₹" } }),
    makeField("long_text", "Funding Usage Plan", s3Id, 2, { required: true, description: "How do you plan to use the funding?", placeholder: "e.g. 40% infrastructure, 30% prototyping, 30% research...", validation: { minLength: 100, maxLength: 800 } }),
    makeField("project_timeline", "Project Timeline", s3Id, 3, { required: true, description: "Key milestones you plan to achieve with this funding." }),
  ];

  const s4Fields: FormField[] = [
    makeField("file_upload", "Pitch Deck", s4Id, 1, { required: true, description: "Upload your presentation slides.", validation: { allowedFileTypes: ["pdf", "pptx", "ppt"], maxFileSizeMB: 20, maxFiles: 1 } }),
    {
      ...makeField("file_upload", "Prototype / Demo", s4Id, 2, {
        required: false,
        description: "Upload a demo video, images, or prototype documentation.",
        validation: { allowedFileTypes: ["pdf", "mp4", "png", "jpg", "zip"], maxFileSizeMB: 50, maxFiles: 3 },
      }),
      conditionalRule: {
        enabled: true,
        logic: "all" as const,
        conditions: [{
          id: uid("cond"),
          sourceFieldId: protoQId,
          operator: "equals" as const,
          value: "Yes",
        }],
      },
    },
    makeField("file_upload", "Additional Documents", s4Id, 3, { required: false, description: "Any additional supporting documents.", validation: { allowedFileTypes: ["pdf", "doc", "docx"], maxFileSizeMB: 10, maxFiles: 5 } }),
  ];

  const now = new Date().toISOString();
  const totalFields = s1Fields.length + s2Fields.length + s3Fields.length + s4Fields.length;
  const requiredFields = [...s1Fields, ...s2Fields, ...s3Fields, ...s4Fields].filter(f => f.required).length;

  return {
    id: uid("form"),
    title: "Student Innovation Grant 2026 — Application Form",
    description: "Provide the information required from innovators applying to this grant. All required fields must be completed before submission.",
    ownerType: "grant",
    ownerId: grantId,
    status: "draft",
    sections: [
      { id: s1Id, title: "Applicant Information", description: "Tell us about yourself and your academic background.", order: 1, collapsed: false, fields: s1Fields },
      { id: s2Id, title: "Project Information", description: "Tell us about the problem you are solving and the solution you are proposing.", order: 2, collapsed: false, fields: s2Fields },
      { id: s3Id, title: "Funding Requirements", description: "Describe your funding needs and how you plan to use the grant.", order: 3, collapsed: false, fields: s3Fields },
      { id: s4Id, title: "Supporting Documents", description: "Upload materials that support your application.", order: 4, collapsed: false, fields: s4Fields },
    ],
    settings: {
      estimatedMinutes: 15,
      applicantInstructions: "Please prepare your project information and supporting documents before starting. You can save your progress and return later.",
      allowSaveAndContinue: true,
      confirmationText: "Thank you for submitting your application to the Student Innovation Grant 2026. We will review your application and be in touch within 2 weeks.",
    },
    totalFields,
    requiredFields,
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
  };
}

// ─── Direct Pitch Template ─────────────────────────────────────────────────────

function buildDirectPitchForm(ownerId: string): FormDefinition {
  const s1Id = uid("sec");
  const s2Id = uid("sec");
  const s3Id = uid("sec");
  const s4Id = uid("sec");
  const s5Id = uid("sec");
  const s6Id = uid("sec");

  const s1Fields: FormField[] = [
    makeField("short_text", "Idea Title", s1Id, 1, { id: "idea_title", required: true, validation: { maxLength: 100 } }),
    makeField("long_text", "Problem Statement", s1Id, 2, { id: "problem_statement", required: true, description: "Describe the problem you are solving.", validation: { minLength: 50, maxLength: 1000 } }),
    makeField("long_text", "Proposed Solution", s1Id, 3, { required: true, description: "Explain your solution.", validation: { minLength: 50, maxLength: 1000 } }),
    makeField("long_text", "Innovation & Uniqueness", s1Id, 4, { required: true, description: "What makes your solution different?", validation: { minLength: 50, maxLength: 500 } }),
    makeField("short_text", "Target Users", s1Id, 5, { required: true }),
    makeField("dropdown", "Domain", s1Id, 6, { required: true, options: [
      makeOption("AI", 1), makeOption("Healthcare", 2), makeOption("Agriculture", 3), makeOption("Climate", 4), makeOption("FinTech", 5), makeOption("Education", 6), makeOption("Robotics", 7)
    ]}),
  ];

  const s2Fields: FormField[] = [
    makeField("dropdown", "Current Development Stage", s2Id, 1, { required: true, options: [
      makeOption("Idea", 1), makeOption("Prototype", 2), makeOption("MVP", 3), makeOption("Production", 4)
    ]}),
    makeField("single_choice", "Existing Prototype?", s2Id, 2, { required: true, options: [makeOption("Yes", 1), makeOption("No", 2)] }),
  ];

  const s3Fields: FormField[] = [
    makeField("long_text", "Expected Impact", s3Id, 1, { required: true }),
    makeField("short_text", "Target Geography", s3Id, 2, { required: true }),
  ];

  const s4Fields: FormField[] = [
    makeField("funding_required", "Funding Required", s4Id, 1, { id: "funding_required", required: true, validation: { unit: "₹" } }),
    makeField("long_text", "Funding Usage", s4Id, 2, { required: true }),
  ];

  const s5Fields: FormField[] = [
    makeField("long_text", "Team Members", s5Id, 1, { required: true, description: "List your core team members and roles." }),
    makeField("long_text", "Relevant Experience", s5Id, 2, { required: true }),
  ];

  const s6Fields: FormField[] = [
    makeField("file_upload", "Pitch Deck", s6Id, 1, { required: true }),
    makeField("url", "Prototype / Demo Link", s6Id, 2, { required: false }),
  ];

  const now = new Date().toISOString();
  
  return {
    id: "tpl_direct_pitch", // Using a consistent ID for mock mapping
    title: "Direct Innovation Pitch",
    description: "Submit your idea directly for funding consideration.",
    ownerType: "directPitch",
    ownerId,
    status: "draft",
    sections: [
      { id: s1Id, title: "Idea Information", description: "", order: 1, collapsed: false, fields: s1Fields },
      { id: s2Id, title: "Development Stage", description: "", order: 2, collapsed: false, fields: s2Fields },
      { id: s3Id, title: "Impact", description: "", order: 3, collapsed: false, fields: s3Fields },
      { id: s4Id, title: "Funding", description: "", order: 4, collapsed: false, fields: s4Fields },
      { id: s5Id, title: "Team", description: "", order: 5, collapsed: false, fields: s5Fields },
      { id: s6Id, title: "Supporting Materials", description: "", order: 6, collapsed: false, fields: s6Fields },
    ],
    settings: {
      estimatedMinutes: 20,
      applicantInstructions: "Please fill out the pitch form completely.",
      allowSaveAndContinue: true,
      confirmationText: "Your pitch has been submitted successfully.",
    },
    totalFields: s1Fields.length + s2Fields.length + s3Fields.length + s4Fields.length + s5Fields.length + s6Fields.length,
    requiredFields: 13,
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
  };
}

// ─── In-memory Form Store ──────────────────────────────────────────────────────

const formsStore = new Map<string, FormDefinition>();

// ─── Templates ─────────────────────────────────────────────────────────────────

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "tpl_student_innovation",
    name: "Student Innovation Grant",
    description: "Comprehensive form for student innovators — covers profile, project details, funding needs, and documents.",
    thumbnail: "🎓",
    category: "student_grant",
    sections: [],
    fieldBlueprints: [],
    estimatedMinutes: 15,
  },
  {
    id: "tpl_startup_grant",
    name: "Startup Grant",
    description: "Suitable for early-stage startups — company info, product overview, traction metrics, and team details.",
    thumbnail: "🚀",
    category: "startup_grant",
    sections: [],
    fieldBlueprints: [],
    estimatedMinutes: 20,
  },
  {
    id: "tpl_research_grant",
    name: "Research Grant",
    description: "Designed for academic researchers — research abstract, methodology, team credentials, publications.",
    thumbnail: "🔬",
    category: "research_grant",
    sections: [],
    fieldBlueprints: [],
    estimatedMinutes: 25,
  },
  {
    id: "tpl_general",
    name: "General Innovation Grant",
    description: "A versatile template suitable for any innovation-focused grant program.",
    thumbnail: "💡",
    category: "general",
    sections: [],
    fieldBlueprints: [],
    estimatedMinutes: 12,
  },
  {
    id: "tpl_direct_pitch",
    name: "Direct Innovation Pitch",
    description: "Accept direct ideas from innovators — includes idea details, impact, funding, and team.",
    thumbnail: "🎯",
    category: "general", // Can put in general
    sections: [],
    fieldBlueprints: [],
    estimatedMinutes: 20,
  },
];

// ─── Forms API ─────────────────────────────────────────────────────────────────

export const formsApi = {
  async getByOwner(ownerType: FormOwnerType, ownerId: string): Promise<FormDefinition | null> {
    return new Promise((resolve) => {
      const form = Array.from(formsStore.values()).find(
        f => f.ownerType === ownerType && f.ownerId === ownerId
      );
      setTimeout(() => resolve(form ?? null), 80);
    });
  },

  async getById(formId: string): Promise<FormDefinition | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(formsStore.get(formId) ?? null), 80);
    });
  },

  async createFromTemplate(
    templateId: string,
    ownerType: FormOwnerType,
    ownerId: string,
    title: string
  ): Promise<FormDefinition> {
    return new Promise((resolve) => {
      // For the student grant, build the full populated form
      let form: FormDefinition;
      if (templateId === "tpl_student_innovation") {
        form = buildStudentInnovationForm(ownerId);
        form.title = title || form.title;
        form.ownerType = ownerType;
        form.ownerId = ownerId;
      } else if (templateId === "tpl_direct_pitch") {
        form = buildDirectPitchForm(ownerId);
        form.title = title || form.title;
        form.ownerType = ownerType;
        form.ownerId = ownerId;
      } else {
        // Other templates: build a simple empty form
        const secId = uid("sec");
        const now = new Date().toISOString();
        form = {
          id: uid("form"),
          title: title || "Application Form",
          description: "Provide the information required to apply for this grant.",
          ownerType,
          ownerId,
          status: "draft",
          sections: [{
            id: secId,
            title: "Applicant Information",
            description: "Tell us about yourself.",
            order: 1,
            collapsed: false,
            fields: [
              makeField("profile_full_name", "Full Name", secId, 1, { required: true }),
              makeField("profile_email", "Email Address", secId, 2, { required: true }),
            ],
          }],
          settings: {
            estimatedMinutes: 10,
            applicantInstructions: "Please complete all required fields before submitting your application.",
            allowSaveAndContinue: true,
            confirmationText: "Thank you for your application. We will be in touch shortly.",
          },
          totalFields: 2,
          requiredFields: 2,
          createdAt: now,
          updatedAt: now,
          lastSavedAt: now,
        };
      }
      formsStore.set(form.id, form);
      setTimeout(() => resolve({ ...form }), 150);
    });
  },

  async createEmpty(ownerType: FormOwnerType, ownerId: string, title: string): Promise<FormDefinition> {
    return new Promise((resolve) => {
      const now = new Date().toISOString();
      const form: FormDefinition = {
        id: uid("form"),
        title: title || "Application Form",
        description: "",
        ownerType,
        ownerId,
        status: "draft",
        sections: [],
        settings: {
          estimatedMinutes: 10,
          applicantInstructions: "",
          allowSaveAndContinue: true,
          confirmationText: "Thank you for submitting your application.",
        },
        totalFields: 0,
        requiredFields: 0,
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      };
      formsStore.set(form.id, form);
      setTimeout(() => resolve({ ...form }), 100);
    });
  },

  async save(form: FormDefinition): Promise<FormDefinition> {
    return new Promise((resolve) => {
      const totalFields = form.sections.reduce((acc, s) => acc + s.fields.length, 0);
      const requiredFields = form.sections.reduce(
        (acc, s) => acc + s.fields.filter(f => f.required).length, 0
      );
      const updated: FormDefinition = {
        ...form,
        totalFields,
        requiredFields,
        updatedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
      };
      formsStore.set(updated.id, updated);
      setTimeout(() => resolve({ ...updated }), 120);
    });
  },

  async publish(formId: string): Promise<FormDefinition | null> {
    return new Promise((resolve) => {
      const form = formsStore.get(formId);
      if (!form) { resolve(null); return; }
      const now = new Date().toISOString();
      const updated: FormDefinition = {
        ...form,
        status: "published",
        publishedAt: now,
        publishedVersion: (form.publishedVersion ?? 0) + 1,
        updatedAt: now,
        lastSavedAt: now,
      };
      formsStore.set(formId, updated);
      setTimeout(() => resolve({ ...updated }), 200);
    });
  },

  async duplicate(formId: string, newOwnerId: string): Promise<FormDefinition | null> {
    return new Promise((resolve) => {
      const original = formsStore.get(formId);
      if (!original) { resolve(null); return; }
      const now = new Date().toISOString();
      const copy: FormDefinition = {
        ...original,
        id: uid("form"),
        ownerId: newOwnerId,
        status: "draft",
        title: `${original.title} — Copy`,
        publishedAt: undefined,
        publishedVersion: undefined,
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      };
      formsStore.set(copy.id, copy);
      setTimeout(() => resolve({ ...copy }), 150);
    });
  },

  // Helpers used by the builder
  makeField,
  makeOption,
  uid,
};
