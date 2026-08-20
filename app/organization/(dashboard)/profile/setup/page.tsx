"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check } from "lucide-react";
import { profileService, CompanyProfile } from "@/services/organization/firebase/profile";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    name: "",
    headline: "",
    location: "",
    website: "",
    founded: "",
    employees: "",
    about: "",
    email: "",
    hq: "",
    techStack: []
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getProfile();
        setFormData(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!formData.techStack?.includes(newSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          techStack: [...(prev.techStack || []), newSkill.trim()]
        }));
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await profileService.updateProfile(formData);
      router.push("/organization/profile");
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-foreground">Edit Your Profile</h1>
        <p className="text-brand-foreground/70 mt-2">Add details to help candidates and investors understand your company better.</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Logo & Banner Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-foreground border-b border-brand-border pb-2">Branding</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-3">
                <label className="block text-sm font-medium text-brand-foreground">Company Logo</label>
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-primary transition-colors">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">Upload Logo</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-3">
                <label className="block text-sm font-medium text-brand-foreground">Cover Banner</label>
                <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-primary transition-colors">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">Upload Banner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-foreground border-b border-brand-border pb-2">Company Details</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="Company Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Headline (Tagline)</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="e.g. Innovating the future of AI"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground">Company Description</label>
              <textarea
                rows={4}
                name="about"
                value={formData.about || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                placeholder="Tell us about what your company does..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Founded Year</label>
                <input
                  type="text"
                  name="founded"
                  value={formData.founded || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="e.g. 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Employee Size</label>
                <input
                  type="text"
                  name="employees"
                  value={formData.employees || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="e.g. 51-200 employees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="e.g. company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Location (General)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-brand-foreground">Contact Email (Public)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="hello@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground">HQ Address (Full)</label>
                <input
                  type="text"
                  name="hq"
                  value={formData.hq || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                  placeholder="123 Startup Blvd, SF, CA"
                />
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-foreground border-b border-brand-border pb-2">Tech Stack & Skills</h2>
            <p className="text-sm text-brand-foreground/70">What technologies does your company primarily work with?</p>
            
            <div>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={addSkill}
                className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                placeholder="Type a skill and press Enter (e.g. React, Python, ROS2)"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.techStack?.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-brand-mint text-brand-primary text-xs font-bold rounded-full flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-70"
            >
              {isLoading ? "Saving..." : (
                <>
                  <Check className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
