/**
 * Mock Firebase Auth Service Layer
 * This simulates Firebase authentication for the hackathon UI phase.
 * It uses localStorage to persist the "logged in" state.
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'company' | 'student' | 'skilled_worker' | 'investor';
  companyId?: string;
}

// Mock current user
const mockCompanyUser: User = {
  uid: 'company-user-123',
  email: 'recruiter@apexrobotics.com',
  displayName: 'Alex Rivera',
  role: 'company',
  companyId: 'comp-apex-456'
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillforge_auth', JSON.stringify(mockCompanyUser));
      }
      return mockCompanyUser;
    }
    throw new Error('Invalid credentials');
  },

  async registerCompany(data: any): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (typeof window !== 'undefined') {
      const newUser = {
        ...mockCompanyUser,
        email: data.email,
        displayName: 'Admin User'
      };
      localStorage.setItem('skillforge_auth', JSON.stringify(newUser));
      
      // Initialize fresh profile based on form data
      const initialProfile = {
        name: data.companyName || "",
        headline: data.industry ? `Company in ${data.industry}` : "",
        location: data.location || "",
        website: data.website || "",
        founded: new Date().getFullYear().toString(),
        employees: data.companySize || "",
        techStack: [],
        about: `We are ${data.companyName}, looking for the best talent.`,
        email: data.email || "",
        hq: data.location || ""
      };
      
      localStorage.setItem('skillforge_mock_profile', JSON.stringify(initialProfile));
      
      // Clear posts and opportunities for a fresh account
      localStorage.setItem('skillforge_mock_posts', JSON.stringify([]));
      localStorage.setItem('skillforge_mock_opportunities', JSON.stringify([]));
    }
    return mockCompanyUser;
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillforge_auth');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillforge_auth');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
};
