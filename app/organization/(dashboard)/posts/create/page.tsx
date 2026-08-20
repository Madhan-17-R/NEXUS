"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, X, MapPin, Link as LinkIcon, Briefcase } from "lucide-react";
import { postService } from "@/services/organization/firebase/posts";

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState("General Post");
  
  const postTypes = [
    "General Post",
    "Recruitment Post",
    "Internship Post",
    "Freelance/Project Opportunity",
    "Project Update",
    "Company Announcement"
  ];

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.currentTarget;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
    const tagsInput = (form.elements.namedItem("tags") as HTMLInputElement).value;
    const tags = tagsInput ? tagsInput.split(" ").map(t => t.trim()) : [];
    
    try {
      await postService.createPost({
        type: postType,
        content: content,
        tags: tags
      });
      router.push("/organization/feed");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-foreground">Create a Post</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Share updates, news, or opportunities with your followers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <form onSubmit={handlePublish} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">Post Type</label>
                <select 
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-lg shadow-sm transition-colors bg-white"
                >
                  {postTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">Post Content</label>
                <textarea
                  name="content"
                  rows={6}
                  placeholder="What do you want to share?"
                  className="block w-full px-3 py-3 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors resize-none"
                  required
                />
              </div>

              <div className="border border-dashed border-brand-border rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-brand-foreground/70">Add photos or video</span>
                <span className="text-xs text-brand-foreground/50 mt-1">Drag and drop or click to upload</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">Add Tags (Optional)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="e.g. #Hiring #Robotics #Innovation"
                  className="block w-full px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 border border-brand-border rounded-lg shadow-sm text-sm font-medium text-brand-foreground bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 border border-brand-primary text-brand-primary rounded-lg shadow-sm text-sm font-medium hover:bg-brand-mint transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-brand-foreground uppercase tracking-wider mb-3">Live Preview</h3>
            <div className="card p-0 overflow-hidden opacity-80 pointer-events-none">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-brand-foreground text-xs">Apex Robotics</p>
                      <span className="text-[10px] bg-brand-mint text-brand-primary px-1.5 py-0.5 rounded-full font-medium">
                        {postType}
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-foreground/50">Just now</p>
                  </div>
                </div>
                <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
