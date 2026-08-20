import type { Project } from '@/types/innovator';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    name: 'AutonomNav — Autonomous Indoor Navigation Robot',
    description: 'Building a compact autonomous indoor navigation robot using ROS2, SLAM, and computer vision for healthcare facility navigation.',
    status: 'Active',
    domain: 'Robotics',
    skills: ['ROS2', 'C++', 'Python', 'SLAM', 'OpenCV', 'LIDAR'],
    progress: 65,
    teamMembers: [
      {
        userId: 'u1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Engineer',
      },
      {
        userId: 'u6',
        name: 'Mei-Ling Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        role: 'NLP Integration',
      },
    ],
    tasks: [
      { id: 't1', title: 'SLAM integration with LIDAR', status: 'done' },
      { id: 't2', title: 'ROS2 navigation stack setup', status: 'done' },
      { id: 't3', title: 'Obstacle avoidance algorithm', status: 'in-progress' },
      { id: 't4', title: 'NLP command interface', status: 'in-progress' },
      { id: 't5', title: 'Hardware enclosure design', status: 'todo' },
      { id: 't6', title: 'Field testing in hospital corridor', status: 'todo' },
    ],
    updates: [
      {
        id: 'u1',
        content: 'Successfully integrated LIDAR-based SLAM. Mapping accuracy is within 2cm at 10m range.',
        author: 'Alex Rivera',
        createdAt: '2026-08-10',
      },
      {
        id: 'u2',
        content: 'Mei-Ling has the NLP API ready. Integration starts this week.',
        author: 'Alex Rivera',
        createdAt: '2026-08-15',
      },
    ],
    createdAt: '2026-06-01',
    updatedAt: '2026-08-17',
  },
  {
    id: 'p2',
    ownerId: 'u1',
    name: 'PCB Power Monitor Dashboard',
    description: 'Real-time power monitoring dashboard for embedded systems using custom PCB with current sensors and ESP32 microcontroller.',
    status: 'Completed',
    domain: 'Hardware / IoT',
    skills: ['PCB Design', 'KiCad', 'ESP32', 'React', 'MQTT'],
    progress: 100,
    teamMembers: [
      {
        userId: 'u1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Full Stack + Hardware',
      },
    ],
    tasks: [
      { id: 't7', title: 'PCB schematic and layout', status: 'done' },
      { id: 't8', title: 'Firmware for ESP32', status: 'done' },
      { id: 't9', title: 'MQTT broker setup', status: 'done' },
      { id: 't10', title: 'React dashboard', status: 'done' },
    ],
    updates: [
      {
        id: 'u3',
        content: 'Project completed and open-sourced on GitHub. 50+ stars!',
        author: 'Alex Rivera',
        createdAt: '2026-07-20',
      },
    ],
    createdAt: '2026-04-01',
    updatedAt: '2026-07-20',
  },
  {
    id: 'p3',
    ownerId: 'u1',
    name: 'Smart Greenhouse IoT System',
    description: 'Designing an automated greenhouse monitoring and control system with soil moisture, temperature, and CO2 sensors.',
    status: 'Planning',
    domain: 'IoT & Agriculture',
    skills: ['Arduino', 'Python', 'IoT Sensors', 'MQTT', 'React Native'],
    progress: 15,
    teamMembers: [
      {
        userId: 'u1',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Project Lead',
      },
      {
        userId: 'u5',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=150&auto=format&fit=crop&q=80',
        role: 'Sensor Integration',
      },
    ],
    tasks: [
      { id: 't11', title: 'Sensor selection and procurement', status: 'done' },
      { id: 't12', title: 'Arduino firmware for data collection', status: 'in-progress' },
      { id: 't13', title: 'MQTT broker and cloud integration', status: 'todo' },
      { id: 't14', title: 'Mobile app for monitoring', status: 'todo' },
    ],
    createdAt: '2026-08-01',
    updatedAt: '2026-08-17',
  },
];
