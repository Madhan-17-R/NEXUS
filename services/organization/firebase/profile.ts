export interface CompanyProfile {
  name: string;
  headline: string;
  location: string;
  website: string;
  founded: string;
  employees: string;
  techStack: string[];
  about: string;
  email: string;
  hq: string;
}

const STORAGE_KEY = "skillforge_mock_profile";

const defaultProfile: CompanyProfile = {
  name: "Apex Robotics",
  headline: "Robotics & AI • Next-gen automated systems",
  location: "San Francisco, CA",
  website: "apexrobotics.com",
  founded: "2018",
  employees: "51-200 employees",
  techStack: ["ROS2", "Python", "C++", "Computer Vision", "Machine Learning", "LiDAR"],
  about: "Apex Robotics is at the forefront of autonomous systems development, creating the next generation of robotic solutions for industrial and commercial applications. Founded by a team of researchers and engineers, our mission is to make advanced robotics accessible and highly efficient.\n\nWe specialize in integrating state-of-the-art computer vision and machine learning models with robust physical hardware, enabling our robots to navigate complex, dynamic environments autonomously.",
  email: "careers@apexrobotics.com",
  hq: "100 Innovation Drive, SF, CA"
};

class ProfileService {
  async getProfile(): Promise<CompanyProfile> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Set the default initial data on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    
    return JSON.parse(stored);
  }

  async updateProfile(updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
    
    const current = await this.getProfile();
    const updated = { ...current, ...updates };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}

export const profileService = new ProfileService();
