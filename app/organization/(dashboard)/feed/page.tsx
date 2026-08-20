"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Briefcase, MessageCircle, Heart, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { postService, Post } from "@/services/organization/firebase/posts";

export default function FeedPage() {
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
      console.error(error);
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
    <div className="max-w-2xl mx-auto py-6">
      {/* Create Post Banner */}
      <div className="card p-4 mb-6 flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold shrink-0">
          A
        </div>
        <Link 
          href="/organization/posts/create"
          className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-left px-4 py-2.5 rounded-full text-brand-foreground/60 text-sm font-medium"
        >
          Share an update, open role, or project milestone...
        </Link>
        <div className="flex gap-2 shrink-0">
          <Link href="/organization/posts/create" className="p-2 text-gray-500 hover:text-brand-primary transition-colors bg-gray-50 rounded-full">
            <ImageIcon className="w-5 h-5" />
          </Link>
          <Link href="/organization/opportunities/create" className="p-2 text-gray-500 hover:text-brand-primary transition-colors bg-gray-50 rounded-full">
            <Briefcase className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-brand-foreground">Company Feed</h1>
        <select className="text-sm border-none bg-transparent text-brand-foreground/70 font-medium focus:ring-0 cursor-pointer">
          <option>Recent First</option>
          <option>Top Engagement</option>
        </select>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post, index) => {
          // Fake random likes/comments for realism since they aren't stored
          const fakeLikes = Math.floor(Math.random() * 150) + 10;
          const fakeComments = Math.floor(Math.random() * 20) + 2;

          return (
          <div key={`${post.id}-${index}`} className="card p-0 overflow-hidden relative">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-foreground text-sm">Apex Robotics</p>
                      <span className="text-xs bg-brand-mint text-brand-primary px-2 py-0.5 rounded-full font-medium">
                        {post.type}
                      </span>
                    </div>
                    <p className="text-xs text-brand-foreground/50">{post.published.substring(0, 10)}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button onClick={() => toggleMenu(post.id)} className="text-gray-400 hover:text-brand-foreground p-1 rounded-md hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuId === post.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-brand-border rounded-lg shadow-lg py-1 z-10">
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-brand-foreground/90 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-brand-primary text-sm font-medium hover:underline cursor-pointer">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 flex items-center justify-between border-b border-brand-border text-xs text-brand-foreground/60">
              <span>{fakeLikes} Likes</span>
              <span>{fakeComments} Comments</span>
            </div>

            <div className="px-2 py-1 flex items-center justify-between">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand-foreground/70 hover:bg-gray-50 rounded-lg transition-colors">
                <Heart className="w-4 h-4" /> Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand-foreground/70 hover:bg-gray-50 rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4" /> Comment
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand-foreground/70 hover:bg-gray-50 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
