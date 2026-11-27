import type {
  FloatingToolCardData,
  PrincipleItem,
  ToolCategoryItem,
} from "@/types/content";

export const aboutHeroData = {
  badge: "About me",
  heading: "Good design starts with clear thinking.",
  bio: "I'm an independent digital designer creating refined identities, websites, and product experiences shaped by strategy, clarity, and thoughtful execution.",
  signaturePath: "/assets/images/about/sevora-signature.png",
  portraitPath: "/assets/images/about/sevora-profile-portrait.jpg",
  portraitAlt: "Warm studio portrait of Sevora Vale",
  foregroundPropsPath: "/assets/images/about/books-and-black-mug.png",
  foregroundPropsAlt: "Black ceramic mug resting on stacked design books",
};

export const aboutStatsData = [
  {
    id: "experience",
    title: "8+",
    subtitle: "Years of experience",
    description: "Working with brands and teams around the world since 2016.",
    iconName: "star" as const,
  },
  {
    id: "clients",
    title: "24+",
    subtitle: "Happy clients",
    description: "Trusted by startups, agencies, and established brands.",
    iconName: "users" as const,
  },
  {
    id: "availability",
    title: "Available",
    subtitle: "For new project",
    description: "Currently available for branding, web, and digital projects.",
    iconName: "send" as const,
  },
];

export const aboutApproachData = {
  badge: "My approach",
  heading: "Design is more than how it looks",
  description:
    "A clear and collaborative workflow that moves each project from first idea to polished final result.",
  photoPath: "/assets/images/about/design-approach-workspace.png",
  photoAlt: "Open wireframe notebook, Kinfolk book, and black pen on studio desk",
  steps: [
    {
      id: "strategy-first",
      title: "Strategy first",
      description: "Understanding the goal, audience, and message before designing.",
      iconName: "users" as const,
    },
    {
      id: "clear-direction",
      title: "Clear direction",
      description: "Building a focused visual language with purpose and consistency.",
      iconName: "lightbulb" as const,
    },
    {
      id: "refined-execution",
      title: "Refined execution",
      description: "Polishing every detail until the final result feels complete.",
      iconName: "search" as const,
    },
  ],
};

export const aboutPrinciplesData = {
  badge: "Principles",
  heading: "The values behind my work",
  description:
    "A few simple principles guide every project, from early direction to final execution.",
  items: [
    {
      id: "clarity-first",
      number: "01",
      title: "Clarity first",
      description:
        "I believe strong design should make ideas easier to understand, not harder to explain.",
      iconName: "sparkles",
    },
    {
      id: "purposeful-details",
      number: "02",
      title: "Purposeful details",
      description:
        "Every layout, interaction, and visual choice should support the message behind the work.",
      iconName: "pencil",
      featured: true,
    },
    {
      id: "simple-systems",
      number: "03",
      title: "Simple systems",
      description:
        "I create design structures that stay useful, flexible, and consistent as brands grow.",
      iconName: "layers",
    },
    {
      id: "thoughtful-execution",
      number: "04",
      title: "Thoughtful execution",
      description:
        "The final result should feel polished, intentional, and ready to be used with confidence.",
      iconName: "target",
    },
  ] satisfies PrincipleItem[],
};

export const aboutToolsData = {
  badge: "Tools",
  heading: "The tools behind the work",
  description:
    "The tools I use to shape ideas, design systems, build websites, and prepare polished final work.",
  categories: [
    {
      id: "design",
      number: "01",
      category: "Design",
      toolsLabel: "Figma, Illustrator, Photoshop",
      iconName: "pen",
    },
    {
      id: "build",
      number: "02",
      category: "Build",
      toolsLabel: "Framer, Webflow",
      iconName: "code",
    },
    {
      id: "motion",
      number: "03",
      category: "Motion",
      toolsLabel: "After Effects",
      iconName: "play",
    },
  ] satisfies ToolCategoryItem[],
  cards: [
    {
      id: "framer",
      name: "Framer",
      description: "Building fast, responsive websites with fluid interactions.",
      iconPath: "/assets/images/benefits/framer-logo-badge.svg",
      href: "https://www.framer.com/?via=dmytri_design",
      featured: true,
    },
    {
      id: "figma",
      name: "Figma",
      description: "Design, prototype & create systems.",
      iconPath: "/assets/images/about/ALQstMfPrtqwn4YcWXNvneT92fg.svg",
      href: null,
    },
    {
      id: "illustrator",
      name: "illustrator",
      description: "Create vector graphics & assets.",
      iconPath: "/assets/images/about/Xc4LE3LkV6WFbkGO1O4vvBb1v0.png",
      href: null,
    },
    {
      id: "photoshop",
      name: "Photoshop",
      description: "Edit images & craft polished visuals.",
      iconPath: "/assets/images/about/BDVysRFEd3LQfO5Kta9TDvjYlM.svg",
      href: null,
    },
    {
      id: "webflow",
      name: "Webflow",
      description: "Build responsive sites with visual control.",
      iconPath: "/assets/images/about/5xFWoMTW4cSYWo5t83cv8Yp6Ao.svg",
      href: null,
    },
  ] satisfies FloatingToolCardData[],
};

export const aboutStoryData = {
  badge: "My story",
  heading: "From curiosity to refined craft",
  workspacePhotoPath: "/assets/images/about/sevora-studio-workspace.png",
  workspacePhotoAlt: "Minimal white design studio desk with monitor displaying Framer",
  sinceEyebrow: "Since",
  sinceYear: "2016",
  sinceCaption: "Design & digital experiences",
  paragraphs: [
    "My work started with a simple interest in how visuals shape the way people feel, understand, and remember ideas.",
    "Over time, that interest grew into a focused practice across brand identity, web design, product interfaces, and Framer development.",
    "Today, I work with founders, teams, and creative businesses to build digital experiences that feel clear, refined, and ready to grow.",
  ],
  signaturePath: "/assets/images/about/sevora-signature.png",
  authorName: "Sevora Vale",
  authorRole: "Founder & Designer",
};

export const aboutProjectCtaData = {
  badge: "Start a project",
  heading: "Let's create something thoughtful together",
  description:
    "Have a brand, website, or product idea in mind? Share a few details and let's shape the next step.",
  primaryCta: { label: "Get in touch", href: "/contact" },
  secondaryCta: { label: "View projects", href: "/projects" },
  tags: ["Branding", "Web design", "Framer"],
  panelTitle: "Available for new projects",
};
