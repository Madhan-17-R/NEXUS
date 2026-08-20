export interface Post {
  id: string;
  type: string;
  content: string;
  tags: string[];
  published: string;
}

const DEFAULT_POSTS: Post[] = [
  { id: "POST-1", type: "General Post", content: "Excited to share our new robotics division...", tags: ["Robotics"], published: "2026-08-10" },
  { id: "POST-2", type: "Recruitment Post", content: "We are hiring! Looking for engineers...", tags: ["Hiring"], published: "2026-08-11" },
  { id: "POST-3", type: "Project Update", content: "Milestone achieved on v2.0...", tags: ["Update"], published: "2026-08-12" }
];

class PostService {
  private getStorageKey() {
    return 'skillforge_mock_posts';
  }

  async getPosts(): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (typeof window === 'undefined') return DEFAULT_POSTS;
    
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_POSTS;
    }
  }

  async createPost(data: Omit<Post, 'id' | 'published'>): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const posts = await this.getPosts();
    const newPost: Post = {
      ...data,
      id: `POST-${Date.now()}`,
      published: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(posts));
    }
    
    return newPost;
  }

  async deletePost(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const posts = await this.getPosts();
    const updated = posts.filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }
}

export const postService = new PostService();
