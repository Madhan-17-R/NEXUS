"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Share2, Bookmark, Briefcase, MapPin, Clock, Users, Building, AlertCircle } from "lucide-react";
import { opportunityService, Opportunity } from "@/services/organization/firebase/opportunities";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    opportunityService.getOpportunity(id).then(data => {
      setOpp(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-brand-foreground/50">Loading recruitment details...</div>;
  }

  if (!opp) {
    return <div className="p-12 text-center text-red-500">Recruitment not found.</div>;
  }

  const safeOpp = {
    ...opp,
    description: opp.description || "We are looking for a highly skilled individual to join our team...",
    responsibilities: opp.responsibilities || ["Develop and maintain complex solutions.", "Collaborate with cross-functional teams."],
    requiredSkills: opp.requiredSkills || opp.skills || ["React", "TypeScript"],
    preferredSkills: opp.preferredSkills || ["Problem Solving"],
    experience: opp.experience || "2-5 Years",
    target: opp.target || "Skilled Worker",
    salary: opp.salary || "Competitive",
    workMode: opp.workMode || "Hybrid",
    location: opp.location || "San Francisco, CA",
    project: opp.project || "Internal Project",
    openings: opp.openings || 1,
    deadline: opp.deadline || "2026-12-31"
  };

  const safeAppFields = safeOpp.applicationFields || {
    dob: true, currentRole: true, totalExperience: true, relevantExperience: true,
    highestQualification: true, graduationYear: true, university: true,
    whyInterested: true, whyConsider: true, projectExperience: true,
    resume: true, portfolio: true, certificates: true,
    expectedCompensation: true, noticePeriod: true, coverLetter: true
  };

  const hasProfessional = safeAppFields.currentRole || safeAppFields.totalExperience || safeAppFields.relevantExperience;
  const hasEducation = safeAppFields.highestQualification || safeAppFields.graduationYear || safeAppFields.university;
  const hasQuestions = safeAppFields.whyInterested || safeAppFields.whyConsider || safeAppFields.projectExperience;
  const hasAdditional = safeAppFields.expectedCompensation || safeAppFields.noticePeriod || safeAppFields.coverLetter;
  const hasAttachments = safeAppFields.resume || safeAppFields.portfolio || safeAppFields.certificates;

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20">
      <Link href="/organization/opportunities" className="inline-flex items-center gap-2 text-sm text-brand-foreground/70 hover:text-brand-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Recruitments
      </Link>

      <div className="card p-0 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-brand-navy p-6 md:p-8 text-white relative">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                  {safeOpp.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white">
                  {safeOpp.type}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{safeOpp.title}</h1>
              <p className="text-white/80 text-lg">{safeOpp.company}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Save">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-brand-navy font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-6 mb-8 border-b border-brand-border pb-8">
            <div className="flex items-center gap-3 text-brand-foreground">
              <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center text-brand-primary shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-foreground/60 uppercase font-bold tracking-wider mb-0.5">Experience</p>
                <p className="text-sm font-medium">{safeOpp.experience}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-brand-foreground">
              <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center text-brand-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-foreground/60 uppercase font-bold tracking-wider mb-0.5">Location</p>
                <p className="text-sm font-medium">{safeOpp.location} ({safeOpp.workMode})</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-brand-foreground">
              <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center text-brand-primary shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-foreground/60 uppercase font-bold tracking-wider mb-0.5">Compensation</p>
                <p className="text-sm font-medium">{safeOpp.salary}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-brand-foreground">
              <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center text-brand-primary shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-foreground/60 uppercase font-bold tracking-wider mb-0.5">Deadline</p>
                <p className="text-sm font-medium">{safeOpp.deadline}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-brand-foreground mb-4">About the Role</h2>
                <p className="text-brand-foreground/80 leading-relaxed">{safeOpp.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-foreground mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {safeOpp.responsibilities!.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-brand-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-foreground mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {safeOpp.requiredSkills!.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-brand-mint text-brand-primary font-bold text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-foreground mb-4">Preferred Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {safeOpp.preferredSkills!.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 text-brand-foreground/70 font-medium text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-gray-50 border border-brand-border rounded-xl">
                <h3 className="font-bold text-brand-foreground mb-4">Recruitment Overview</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-foreground/60">Target:</span>
                    <span className="font-medium text-brand-foreground">{safeOpp.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-foreground/60">Openings:</span>
                    <span className="font-medium text-brand-foreground">{safeOpp.openings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-foreground/60">Project:</span>
                    <span className="font-medium text-brand-foreground text-right">{safeOpp.project}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm transition-colors text-sm"
                  >
                    Apply Now
                  </button>
                  <p className="text-xs text-center text-brand-foreground/50 mt-3 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Note: This is an integration point.
                  </p>
                </div>
              </div>
              
              <button className="w-full py-2.5 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors text-sm">
                Close Recruitment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Apply for {safeOpp.title}</h2>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="flex flex-col overflow-hidden min-h-0">
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                      <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                    </div>
                    {safeAppFields.dob && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
                        <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                {hasProfessional && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeAppFields.currentRole && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Current Role / Job Title *</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                      {safeAppFields.totalExperience && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Total Experience (Years) *</label>
                          <input type="number" min="0" step="0.5" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                      {safeAppFields.relevantExperience && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Relevant Experience (Years/Months) *</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Education */}
                {hasEducation && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeAppFields.highestQualification && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Highest Qualification *</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                      {safeAppFields.graduationYear && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Graduation Year *</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                      {safeAppFields.university && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">University / College *</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Questionnaires */}
                {hasQuestions && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Questions</h3>
                    {safeAppFields.whyInterested && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Why are you interested in this role? *</label>
                        <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required></textarea>
                      </div>
                    )}
                    {safeAppFields.whyConsider && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Why should we consider you? *</label>
                        <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required></textarea>
                      </div>
                    )}
                    {safeAppFields.projectExperience && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Relevant Project / Work Experience *</label>
                        <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required></textarea>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Details */}
                {hasAdditional && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Additional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeAppFields.expectedCompensation && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {safeOpp.type === 'Internship' ? 'Expected Stipend' : safeOpp.type === 'Freelance' ? 'Expected Budget/Rate' : 'Expected Salary'} *
                          </label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                        </div>
                      )}
                      {safeAppFields.noticePeriod && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Notice Period (if applicable)</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
                        </div>
                      )}
                      {safeAppFields.coverLetter && (
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Additional Comments / Cover Letter (Optional)</label>
                          <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Attachments & Links */}
                {hasAttachments && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Attachments & Links</h3>
                    {safeAppFields.resume && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Resume / CV Upload *</label>
                        <input type="file" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-mint file:text-brand-primary hover:file:bg-brand-mint/80" required />
                      </div>
                    )}
                    {safeAppFields.portfolio && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Portfolio / GitHub / LinkedIn URL *</label>
                        <input type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required />
                      </div>
                    )}
                    {safeAppFields.certificates && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Relevant Certificates (Optional)</label>
                        <input type="file" multiple className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                      </div>
                    )}
                  </div>
                )}

                {/* Declaration */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Declaration</h3>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 border-gray-300 rounded text-brand-primary focus:ring-brand-primary" required />
                    <span className="text-xs text-gray-700">I confirm that the information provided is accurate.</span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 border-gray-300 rounded text-brand-primary focus:ring-brand-primary" required />
                    <span className="text-xs text-gray-700">I agree to the company's application/privacy terms.</span>
                  </label>
                </div>
              </div>
                
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-6 py-2 bg-brand-primary text-sm text-white font-bold rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
