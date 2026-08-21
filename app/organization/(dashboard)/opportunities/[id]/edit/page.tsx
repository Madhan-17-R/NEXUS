"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { opportunityService, Opportunity } from "@/services/organization/firebase/opportunities";
import Link from "next/link";

export default function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  
  useEffect(() => {
    const fetchOpp = async () => {
      const opp = await opportunityService.getOpportunity(id);
      if (opp) setOpportunity(opp);
    };
    fetchOpp();
  }, [id]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const appFields = {
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
    };

    await opportunityService.updateOpportunity(id, {
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      openings: Number(formData.get("openings")),
      applicationFields: appFields
    });
    
    router.push(`/organization/opportunities/${id}`);
  };

  if (!opportunity) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 pb-20">
      <Link href="/organization/opportunities" className="inline-flex items-center gap-2 text-sm text-brand-foreground/70 hover:text-brand-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-foreground">Edit Recruitment</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Update details for {opportunity.title}.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Recruitment Title</label>
              <input
                type="text"
                name="title"
                defaultValue={opportunity.title}
                required
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Location</label>
              <input type="text" name="location" defaultValue={opportunity.location} className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Number of Openings</label>
              <input type="number" name="openings" min="1" defaultValue={opportunity.openings} className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-3 mb-6">Application Form Configuration</h2>
          <p className="text-sm text-brand-foreground/70 mb-6">Select the fields you want applicants to fill out. (Name, Email, Phone, and Location are always required).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_dob" defaultChecked={opportunity.applicationFields?.dob ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Date of Birth</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_currentRole" defaultChecked={opportunity.applicationFields?.currentRole ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Current Role / Job Title</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_totalExperience" defaultChecked={opportunity.applicationFields?.totalExperience ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Total Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_relevantExperience" defaultChecked={opportunity.applicationFields?.relevantExperience ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Relevant Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_highestQualification" defaultChecked={opportunity.applicationFields?.highestQualification ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Highest Qualification</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_graduationYear" defaultChecked={opportunity.applicationFields?.graduationYear ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Graduation Year</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_university" defaultChecked={opportunity.applicationFields?.university ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">University / College</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_whyInterested" defaultChecked={opportunity.applicationFields?.whyInterested ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Why are you interested?</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_whyConsider" defaultChecked={opportunity.applicationFields?.whyConsider ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Why should we consider you?</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_projectExperience" defaultChecked={opportunity.applicationFields?.projectExperience ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Project/Work Experience</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_resume" defaultChecked={opportunity.applicationFields?.resume ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Resume / CV</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_portfolio" defaultChecked={opportunity.applicationFields?.portfolio ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Portfolio / Links</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_certificates" defaultChecked={opportunity.applicationFields?.certificates ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Certificates</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_expectedCompensation" defaultChecked={opportunity.applicationFields?.expectedCompensation ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Expected Compensation</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_noticePeriod" defaultChecked={opportunity.applicationFields?.noticePeriod ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Notice Period</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="appField_coverLetter" defaultChecked={opportunity.applicationFields?.coverLetter ?? true} className="rounded text-brand-primary focus:ring-brand-primary" /><span className="text-sm">Cover Letter / Comments</span></label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-brand-border rounded-lg text-sm font-medium text-brand-foreground bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-hover shadow-sm disabled:opacity-70">
            {isLoading ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
