"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Trash2, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { postService, Post } from "@/services/organization/firebase/posts";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await postService.deletePost(id);
    await fetchPosts();
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">Manage Posts</h1>
          <p className="text-brand-foreground/70 text-sm mt-1">Track and manage your feed posts.</p>
        </div>
        <Link 
          href="/organization/posts/create" 
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary sm:text-sm transition-colors"
              placeholder="Search posts..."
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-brand-border rounded-lg text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center p-8 text-brand-foreground/50">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 text-brand-foreground/50 border border-dashed border-gray-200 rounded-2xl">
            No posts found. Create your first post!
          </div>
        ) : (
          posts.map((post, index) => {
            const fakeLikes = Math.floor(Math.random() * 150) + 10;
            const fakeComments = Math.floor(Math.random() * 20) + 2;

            return (
              <div key={`${post.id}-${index}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button onClick={() => toggleMenu(post.id)} className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === post.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5 pr-12">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">Apex Robotics</h3>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {post.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{post.published.substring(0, 10)}</p>
                  </div>
                </div>

                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm mb-5">
                  {post.content}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-5 border-t border-gray-100 flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {fakeLikes} Likes</span>
                    <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {fakeComments} Comments</span>
                  </div>
                  <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors font-medium">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
