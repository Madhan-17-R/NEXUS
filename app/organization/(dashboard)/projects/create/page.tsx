"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Camera } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/organization/projects");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-foreground">Add a Project</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Showcase what your team is building to attract the right talent.</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-brand-foreground">Project Cover Image</label>
            <div className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-primary transition-colors">
              <Camera className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-2">Upload Cover (1200x600 recommended)</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Project Name</label>
              <input type="text" required placeholder="e.g. AI Healthcare Platform" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Short Description</label>
              <textarea rows={3} required placeholder="Describe what the project aims to solve..." className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Industry / Domain</label>
                <select className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                  <option>Robotics</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>AI/ML</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Project Status</label>
                <select className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white">
                  <option>Idea / Research</option>
                  <option>Prototyping</option>
                  <option>Development</option>
                  <option>Testing</option>
                  <option>Production</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Start Date</label>
                <input type="date" required className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-1.5">Current Team Size</label>
                <input type="number" defaultValue={1} min={1} className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-foreground mb-1.5">Technologies Used</label>
              <input type="text" placeholder="Press Enter to add tags (e.g. React, Python)" className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-brand-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 border border-brand-border rounded-lg shadow-sm text-sm font-medium text-brand-foreground bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-70"
            >
              {isLoading ? "Saving..." : (
                <>
                  <Check className="w-4 h-4" />
                  Save Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
