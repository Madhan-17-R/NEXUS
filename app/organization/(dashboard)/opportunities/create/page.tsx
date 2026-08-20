"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { opportunityService } from "@/services/organization/firebase/opportunities";

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [opportunityType, setOpportunityType] = useState("Full-time");
  
  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // In a real app we'd get all fields correctly, here we'll grab a few basic ones
    // and use defaults for the rest to keep the mock simple
    try {
      await opportunityService.createOpportunity({
        title: (formData.get("title") as string) || "New Opportunity",
        type: opportunityType,
        target: (formData.get("target") as string) || "Both",
        project: (formData.get("project") as string) || "-",
        skills: ["React", "TypeScript"], // Mocked for now
        salary: (formData.get("salary") as string) || "Competitive",
        workMode: (formData.get("workMode") as string) || "Remote",
        location: (formData.get("location") as string) || "Anywhere",
        openings: Number(formData.get("openings")) || 1,
        deadline: (formData.get("deadline") as string) || "2026-12-31",
        description: (formData.get("description") as string) || "We are looking for a highly skilled individual to join our team...",
        experience: (formData.get("experience") as string) || "2-5 Years",
        responsibilities: formData.get("responsibilities") 
            ? (formData.get("responsibilities") as string).split('\n').filter(r => r.trim() !== '')
            : ["Develop and maintain complex solutions.", "Collaborate with cross-functional teams."],
        applicationFields: {
          dob: formData.get("appField_dob") === "on",
          currentRole: formData.get("appField_currentRole") === "on",
          totalExperience: formData.get("appField_totalExperience") === "on",
          relevantExperience: formData.get("appField_relevantExperience") === "on",
          highestQualification: formData.get("appField_highestQualification") === "on",
          graduationYear: formData.get("appField_graduationYear") === "on",
          university: formData.get("appField_university") === "on",
          whyInterested: formData.get("appField_whyInterested") === "on",
          whyConsider: formData.get("appField_whyConsider") === "on",
          projectExperience: formData.get("appField_projectExperience") === "on",
          resume: formData.get("appField_resume") === "on",
          portfolio: formData.get("appField_portfolio") === "on",
          certificates: formData.get("appField_certificates") === "on",
          expectedCompensation: formData.get("appField_expectedCompensation") === "on",
          noticePeriod: formData.get("appField_noticePeriod") === "on",
          coverLetter: formData.get("appField_coverLetter") === "on",
        }
      });
      router.push("/organization/opportunities");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-foreground">Create Recruitment</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Publish a new role to find the best talent.</p>
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        
        {/* Section A - Basic Information */}
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">1. Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Recruitment Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Frontend Developer, AI/ML Intern"
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Opportunity Type</label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value)}
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Target Candidate</label>
              <select name="target" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                <option value="Both">Both (Student & Skilled Worker)</option>
                <option value="Student">Student Innovator</option>
                <option value="Skilled Worker">Skilled Worker</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B - Role Details */}
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">2. Role Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Short Role Description</label>
              <textarea
                name="description"
                rows={3}
                required
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Responsibilities</label>
              <textarea
                name="responsibilities"
                rows={4}
                placeholder="- Develop user interfaces&#10;- Collaborate with design team"
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Required Skills</label>
                <input
                  type="text"
                  placeholder="Press Enter to add"
                  className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-brand-foreground text-xs font-medium rounded-md flex items-center gap-1">React <X className="w-3 h-3 cursor-pointer hover:text-red-500" /></span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Experience Level</label>
                <select name="experience" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                  <option>Fresher</option>
                  <option>0–2 Years</option>
                  <option>2–5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section C - Compensation (Dynamic based on Type) */}
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">3. Compensation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {(opportunityType === "Full-time" || opportunityType === "Part-time" || opportunityType === "Contract") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Minimum Salary</label>
                  <input type="number" placeholder="e.g. 60000" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Maximum Salary</label>
                  <input type="number" placeholder="e.g. 90000" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Currency</label>
                  <select className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
              </>
            )}

            {opportunityType === "Internship" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Paid / Unpaid</label>
                  <select className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                    <option>Paid</option>
                    <option>Unpaid</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Stipend Amount (Optional)</label>
                  <input type="text" placeholder="e.g. $2,500 / month" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
              </>
            )}

            {opportunityType === "Freelance" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Payment Type</label>
                  <select className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                    <option>Fixed Budget</option>
                    <option>Hourly Rate</option>
                    <option>Milestone Based</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Budget Estimate</label>
                  <input type="text" placeholder="e.g. $5,000" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
              </>
            )}

          </div>
        </div>

        {/* Section D - Project Information */}
        <div className="card p-6 md:p-8">
          <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-6">
            <h2 className="text-lg font-bold text-brand-foreground">4. Project Information (Optional)</h2>
          </div>
          <p className="text-sm text-brand-foreground/70 mb-6">Connect this opportunity to a specific project to provide candidates with more context.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Project Name</label>
              <input type="text" name="project" placeholder="e.g. AI Healthcare Assistant" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Expected Duration</label>
              <input type="text" placeholder="e.g. 4 Months" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Project Description</label>
              <textarea rows={2} className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Section E - Work Information */}
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">5. Work Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Work Mode</label>
              <select name="workMode" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Location</label>
              <input type="text" name="location" placeholder="e.g. Chennai, India" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Number of Openings</label>
              <input type="number" name="openings" min="1" defaultValue="1" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Application Deadline</label>
              <input type="date" name="deadline" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Section F - Application Form Config */}
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">6. Application Form Configuration</h2>
          <p className="text-sm text-brand-foreground/70 mb-6">Select the fields you want applicants to fill out. (Name, Email, Phone, and Location are always required).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_dob" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Date of Birth</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_currentRole" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Current Role / Job Title</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_totalExperience" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Total Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_relevantExperience" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Relevant Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_highestQualification" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Highest Qualification</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_graduationYear" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Graduation Year</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_university" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">University / College</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_whyInterested" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Why are you interested?</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_whyConsider" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Why should we consider you?</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_projectExperience" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Project/Work Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_resume" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Resume / CV</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_portfolio" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Portfolio / Links</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_certificates" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Certificates</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_expectedCompensation" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Expected Compensation</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_noticePeriod" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Notice Period</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_coverLetter" defaultChecked className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Cover Letter / Comments</span></label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-brand-border rounded-lg text-sm font-medium text-brand-foreground bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="px-6 py-2.5 border border-brand-primary text-brand-primary rounded-lg text-sm font-medium bg-white hover:bg-brand-mint">
            Save as Draft
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-hover shadow-sm disabled:opacity-70">
            {isLoading ? "Publishing..." : <><Check className="w-4 h-4" /> Publish Opportunity</>}
          </button>
        </div>

      </form>
    </div>
  );
}
