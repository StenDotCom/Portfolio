import { Profile, Project, Skill, Education } from '../types/index';

export const initialProfile: Profile = {
  id: 'cruz-profile-primary',
  fullName: 'John Yestin F. Cruz',
  professionalTitle: 'Fourth-Year Computer Engineering Student',
  institution: 'ICCT Colleges',
  yearLevel: 'Fourth Year',
  location: 'Philippines',
  email: 'yestincruz471@gmail.com',
  githubUrl: 'https://github.com/StenDotCom',
  facebookUrl: 'https://www.facebook.com/cruuxxx/',
  instagramUrl: 'https://www.instagram.com/sten.com_/',
  biography:
    'I am a fourth-year Computer Engineering student at ICCT Colleges with interests in embedded systems, electronics, software development, and automation. I enjoy exploring how hardware and software work together through academic projects, practical experimentation, and prototype development. I aim to continue improving my engineering and development skills by building useful, well-designed technology solutions.',
  heroIntro:
    'I explore the intersection of hardware and software, developing practical solutions through embedded systems, electronics, and software development.',
  profileImageUrl: null,
  updatedAt: new Date().toISOString(),
};

export const initialProjects: Project[] = [
  {
    id: 'proj-01-cslms',
    title: 'ICCT Campus Supply Logistics Management System (ICCT CSLMS)',
    category: 'Desktop Software Application',
    description:
      'A desktop-based academic software project designed to organize campus supply inventory, receiving, distribution, and related inventory records.',
    objectives:
      'To organize and digitize campus supply tracking, minimize discrepancy between physical inventory and records, and support institutional inventory logging.',
    keyFeatures:
      'Inventory cataloging, receiving log entry, stock distribution tracking, administrative record generation, and structured search queries.',
    technologies: ['Java', 'Desktop Application', 'Database Management'],
    contribution:
      'System architecture, UI design, database connection, and core workflow implementation.',
    status: 'Academic Software Project',
    orderIndex: 1,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    images: [],
  },
  {
    id: 'proj-02-bedguard',
    title: 'BEDGUARD: Bed Exit Alert System',
    category: 'Embedded Systems Prototype',
    description:
      'An assistive healthcare prototype designed to detect when a patient leaves a bed and provide an alert to caregivers.',
    objectives:
      'To assist caregivers in monitoring patients at risk of falling by detecting unassisted bed exit events in real time without invasive restraints.',
    keyFeatures:
      'Pressure/boundary sensor detection, real-time alert buzzer/indicator, low-latency microcontroller signal processing, and caregiver reset interface.',
    technologies: ['Arduino', 'Embedded Systems', 'Electronics', 'Sensors'],
    contribution:
      'Circuit assembly, sensor calibration, microcontroller programming, and prototype testing.',
    status: 'Embedded Systems Prototype',
    orderIndex: 2,
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString(),
    images: [],
  },
  {
    id: 'proj-03-elevator',
    title: 'Small-Scale Three-Floor Elevator',
    category: 'Engineering Prototype',
    description:
      'A miniature elevator model built to demonstrate the basic operation of an elevator serving three floors.',
    objectives:
      'To demonstrate multi-floor hoist mechanisms, floor-level sensor positioning, call queuing, and state control logic in a physical scaled rig.',
    keyFeatures:
      'Floor limit switches, DC/stepper motor hoist control, call button matrix, floor indicator states, and emergency stop simulation.',
    technologies: ['Embedded Systems', 'Electronics', 'Motor Control', 'C++'],
    contribution:
      'Physical model construction, circuit wiring, state machine logic programming, and limit switch calibration.',
    status: 'Engineering Demonstration Prototype',
    orderIndex: 3,
    createdAt: new Date('2024-06-10').toISOString(),
    updatedAt: new Date('2024-06-10').toISOString(),
    images: [],
  },
  {
    id: 'proj-04-shoe-care',
    title: 'Smart Shoe Care Vending System with Automated Cleaning, Drying and Scent Infusion',
    category: 'Automation Prototype',
    description:
      'A shoe-care vending system concept combining automated cleaning, drying, and scent infusion.',
    objectives:
      'To automate multi-stage footwear care within an automated cabinet structure through timed cycles of cleaning, heat/air drying, and scent dispensing.',
    keyFeatures:
      'Automated cycle sequencer, mechanical agitation simulation, heating and ventilation drying chamber, and mist scent infusion module.',
    technologies: ['Automation', 'Hardware Prototyping', 'Embedded Systems', 'Microcontrollers'],
    contribution:
      'System concept design, cycle timing logic, actuator interface design, and prototype documentation.',
    status: 'Automation Prototype Development',
    orderIndex: 4,
    createdAt: new Date('2024-09-05').toISOString(),
    updatedAt: new Date('2024-09-05').toISOString(),
    images: [],
  },
];

export const initialSkills: Skill[] = [
  // Programming and Web
  { id: 'skill-1', name: 'C++', category: 'Programming and Web', orderIndex: 1 },
  { id: 'skill-2', name: 'Java', category: 'Programming and Web', orderIndex: 2 },
  { id: 'skill-3', name: 'HTML', category: 'Programming and Web', orderIndex: 3 },

  // Hardware and Engineering
  { id: 'skill-4', name: 'Arduino', category: 'Hardware and Engineering', orderIndex: 4 },
  { id: 'skill-5', name: 'Embedded Systems', category: 'Hardware and Engineering', orderIndex: 5 },
  { id: 'skill-6', name: 'Electronics', category: 'Hardware and Engineering', orderIndex: 6 },
  { id: 'skill-7', name: 'Hardware Prototyping', category: 'Hardware and Engineering', orderIndex: 7 },

  // Design and Productivity
  { id: 'skill-8', name: 'AutoCAD', category: 'Design and Productivity', orderIndex: 8 },
  { id: 'skill-9', name: 'Microsoft Word', category: 'Design and Productivity', orderIndex: 9 },
  { id: 'skill-10', name: 'Microsoft Excel', category: 'Design and Productivity', orderIndex: 10 },
  { id: 'skill-11', name: 'Microsoft PowerPoint', category: 'Design and Productivity', orderIndex: 11 },

  // Development Platform
  { id: 'skill-12', name: 'GitHub', category: 'Development Platform', orderIndex: 12 },
];

export const initialEducation: Education[] = [
  {
    id: 'edu-icct-bscpe',
    institution: 'ICCT Colleges',
    program: 'Computer Engineering',
    yearLevel: 'Fourth Year',
    details: 'Pursuing Bachelor of Science in Computer Engineering with academic and laboratory focus on embedded systems, hardware prototyping, software design, and engineering solutions.',
  },
];
