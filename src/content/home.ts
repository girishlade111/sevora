import type {
  ExpertiseItem,
  FaqItem,
  PricingPackage,
  ProcessPhase,
  ServiceItem,
  TestimonialItem,
} from "@/types/content";

export const heroData = {
  headlineLeading: "Craft better",
  headlineMiddle: "brands,",
  headlineMuted: "faster",
  description:
    "I design refined brands, websites, and interfaces for ambitious founders and creative teams.",
  primaryCta: { label: "View projects", href: "/projects" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
  portraitPath: "/assets/images/hero/sevora-monochrome-portrait.png",
  portraitAlt: "Monochrome studio portrait of Sevora Vale",
  stats: [
    { id: "projects", value: 30, suffix: "+", label: "Projects completed" },
    { id: "experience", value: 8, suffix: "yr", label: "Experience" },
    { id: "clients", value: 40, suffix: "+", label: "Happy clients" },
  ],
  availabilityCard: {
    eyebrow: "Select project",
    title: "Available for projects",
    description: "Share a few details, and I'll get back with a clear direction.",
    href: "/contact",
  },
};

export const clientLogos = [
  { id: "logo-1", name: "Codify", path: "/assets/logos/client-logo-1.svg", width: 98, height: 24 },
  { id: "logo-2", name: "Flowboard", path: "/assets/logos/client-logo-2.svg", width: 141, height: 24 },
  { id: "logo-3", name: "Agentify", path: "/assets/logos/client-logo-3.svg", width: 110, height: 24 },
  { id: "logo-4", name: "TodoFusion", path: "/assets/logos/client-logo-4.svg", width: 124, height: 24 },
  { id: "logo-5", name: "Identify", path: "/assets/logos/client-logo-5.svg", width: 98, height: 24 },
  { id: "logo-6", name: "Nexus AI", path: "/assets/logos/client-logo-6.svg", width: 104, height: 24 },
  { id: "logo-7", name: "Landify", path: "/assets/logos/client-logo-7.svg", width: 101, height: 24 },
  { id: "logo-8", name: "Flexify", path: "/assets/logos/client-logo-8.svg", width: 100, height: 24 },
];

export const benefitsSection = {
  badge: "Benefits",
  heading: "Discover why we stand out",
  description:
    "Designing clean, responsive websites that communicate clearly, guide visitors smoothly, and support meaningful business goals.",
  cards: [
    {
      id: "clear-design-systems",
      title: "Clear design systems",
      description:
        "Elevate your B2B brand with specialized design expertise, enhancing industry presence.",
      previewType: "design-system" as const,
    },
    {
      id: "websites-built-to-perform",
      title: "Websites built to perform",
      description:
        "Dominate search results with our precision-tailored sites designed for top rankings and visibility.",
      previewType: "analytics" as const,
    },
    {
      id: "framer-ready-execution",
      title: "Framer-ready execution",
      description:
        "Expand and flourish with Framer's innovation and design expertise, propelling your success.",
      previewType: "framer" as const,
    },
  ],
};

export const featuredProjectsSection = {
  badge: "Selected work",
  heading: "Projects with clarity",
  description:
    "A curated collection of brand, web, and product design work created for modern teams.",
};

export const credibilitySection = {
  badge: "Why choose me",
  heading: "Design built around lasting clarity",
  description:
    "I bring strategy, visual direction, and refined execution together to create meaningful digital experiences with lasting impact.",
  avatars: [
    "/assets/images/testimonials/avatar-1.jpg",
    "/assets/images/testimonials/avatar-2.jpg",
    "/assets/images/testimonials/avatar-3.jpg",
    "/assets/images/testimonials/avatar-4.jpg",
  ],
  clientsCountLabel: "+3K clients",
  clientsDescription: "Clear design direction shaped around every project goal.",
  satisfactionValue: 92,
  satisfactionSuffix: "%",
  satisfactionLabel: "Client satisfaction",
  projectsDescription: "Brand identities, websites, and digital systems delivered with care.",
  projectsValue: 56,
  projectsSuffix: "+",
  projectsLabel: "Projects completed",
  availabilityPill: "Available for projects",
  ratingCardCopy:
    "I help founders, creators, and teams turn ideas into refined digital experiences that feel memorable and easy to navigate.",
  ratingScore: "4.9",
  ratingCaption: "Trusted by clients worldwide",
};

export const servicesSection = {
  heading: "Creative services for digital brands",
  description:
    "Focused design and development support to help brands build clearer identities, better websites, and refined product experiences.",
  services: [
    {
      id: "development",
      title: "Development",
      description:
        "Building responsive, polished websites with clean structure, smooth interactions, and launch-ready execution.",
      iconName: "code",
      graphicStateIndex: 0,
      order: 1,
    },
    {
      id: "visual-system",
      title: "Visual system",
      description:
        "Creating clear visual systems that keep your brand consistent across every touchpoint.",
      iconName: "sparkles",
      graphicStateIndex: 1,
      order: 2,
    },
    {
      id: "product-design",
      title: "Product design",
      description:
        "Designing intuitive interfaces and user flows that make digital products feel simple and refined.",
      iconName: "compass",
      graphicStateIndex: 2,
      order: 3,
    },
  ] satisfies ServiceItem[],
  graphicPaths: [
    "/assets/images/services/isometric-state-1.png",
    "/assets/images/services/isometric-state-2.png",
    "/assets/images/services/isometric-state-3.png",
  ],
};

export const processSection = {
  badge: "Process",
  heading: "How the process flows with clarity",
  description:
    "A clear and collaborative workflow that moves each project from first idea to polished final result.",
  phases: [
    {
      id: "discovery",
      step: 1,
      title: "Discovery",
      description:
        "We start by understanding your goals, audience, brand needs, and the direction your project should take.",
      iconName: "users",
    },
    {
      id: "strategy",
      step: 2,
      title: "Strategy",
      description:
        "I define the structure, message, and creative approach before moving into the visual design stage.",
      iconName: "lightbulb",
    },
    {
      id: "direction",
      step: 3,
      title: "Direction",
      description:
        "A clear visual direction is shaped through mood, layout ideas, typography, and overall design language.",
      iconName: "terminal",
    },
    {
      id: "design",
      step: 4,
      title: "Design",
      description:
        "The main layouts, brand elements, and digital experiences are crafted with careful attention to detail.",
      iconName: "award",
    },
    {
      id: "development",
      step: 5,
      title: "Development",
      description:
        "Designs are turned into responsive, polished pages with smooth interactions and clean structure.",
      iconName: "layers",
    },
    {
      id: "delivery",
      step: 6,
      title: "Delivery",
      description:
        "Final assets, pages, and guidelines are prepared clearly so everything is ready to launch.",
      iconName: "search",
    },
  ] satisfies ProcessPhase[],
};

export const expertiseSection = {
  badge: "Expertise",
  heading: "Design support with clear direction",
  description:
    "A focused mix of strategy, design, and execution to help ideas become clear, refined, and ready to launch with confidence.",
  cards: [
    {
      id: "affordability",
      title: "Affordability",
      description: "Access high-quality design services at a fraction of traditional costs.",
      iconName: "zap",
      variant: "light",
      span: "single",
    },
    {
      id: "consistency",
      title: "Consistency",
      description: "Ensure a cohesive brand identity with regular design output.",
      iconName: "wand",
      variant: "light",
      span: "single",
    },
    {
      id: "scalability",
      title: "Scalability",
      description: "Easily scale design efforts to support growing products and businesses.",
      iconName: "magnet",
      variant: "light",
      span: "single",
    },
    {
      id: "speed",
      title: "Speed",
      description:
        "Get quicker turnarounds on design projects without sacrificing quality at a way better price on your wallet.",
      iconName: "palette",
      variant: "dark",
      span: "wide",
    },
    {
      id: "flexibility",
      title: "Flexibility",
      description: "Adapt the service to cover a wide range of design tasks as needed.",
      iconName: "trophy",
      variant: "light",
      span: "single",
    },
    {
      id: "diversity",
      title: "Diversity",
      description:
        "Access to a variety of styles and expertise from a pool of creative professionals and people.",
      iconName: "crosshair",
      variant: "light",
      span: "wide",
    },
    {
      id: "support",
      title: "Support",
      description: "Enjoy dedicated customer service and revisions to perfect your designs.",
      iconName: "headphones",
      variant: "light",
      span: "single",
    },
    {
      id: "convenience",
      title: "Convenience",
      description: "Streamline the design process with a simple workflow and process.",
      iconName: "shield",
      variant: "light",
      span: "single",
    },
  ] satisfies ExpertiseItem[],
};

export const testimonialsSection = {
  badge: "Testimonials",
  heading: "What clients say",
  description:
    "Thoughtful feedback from founders and teams who trusted the process, direction, and final result.",
  ctaLabel: "Let's work together",
  ctaHref: "/contact",
  trustLabel: "Trusted by 24+ clients",
  items: [
    {
      id: "ethan-brooks",
      name: "Ethan Brooks",
      role: "Founder",
      quote:
        "Working with Sevora felt incredibly smooth. The direction was clear from the beginning, and the final website captured our brand with precision and confidence.",
      avatarPath: "/assets/images/testimonials/ethan-brooks.jpg",
      linkLabel: "X",
      externalUrl: "https://x.com/Dmytri_Design",
      variant: "dark",
    },
    {
      id: "maya-chen",
      name: "Maya Chen",
      role: "Designer",
      quote:
        "The process was thoughtful, fast, and highly organized. Every design decision felt intentional, and the final result made our product feel much more polished.",
      avatarPath: "/assets/images/testimonials/maya-chen.jpg",
      linkLabel: "Linkedin",
      externalUrl: "https://www.linkedin.com/in/dmytri-design/",
      variant: "light",
    },
    {
      id: "liam-carter",
      name: "Liam Carter",
      role: "Director",
      quote:
        "Sevora helped turn a rough idea into a refined visual identity. The work felt clean, strategic, and exactly aligned with where we wanted to go.",
      avatarPath: "/assets/images/testimonials/liam-carter.png",
      linkLabel: "Dribbble",
      externalUrl: "https://dribbble.com/Stylokit",
      variant: "light",
    },
  ] satisfies TestimonialItem[],
};

export const pricingSection = {
  badge: "Pricing",
  heading: "Simple packages, clear outcomes",
  description: "Focused packages for design, Framer, and launch.",
  packages: [
    {
      id: "framer",
      name: "Framer",
      description:
        "A focused Framer build for brands that need a clean, responsive, and launch-ready website.",
      amount: 1000,
      screenshotAmount: 1200,
      currency: "USD",
      ctaLabel: "Start a project",
      ctaHref: "/contact",
      features: [
        "Framer website development",
        "Responsive page setup",
        "CMS structure setup",
        "Basic interactions",
        "Launch support",
      ],
      variant: "light",
    },
    {
      id: "premium",
      name: "Premium",
      description:
        "A complete design package for brands that need strategy, identity, and a refined website.",
      amount: 2400,
      screenshotAmount: 2800,
      currency: "USD",
      ctaLabel: "Book this package",
      ctaHref: "/contact",
      features: [
        "Full website design",
        "Brand identity direction",
        "Visual system guidelines",
        "Responsive page layouts",
        "Final asset handoff",
      ],
      variant: "dark",
    },
  ] satisfies PricingPackage[],
};

export const faqSection = {
  heading: "Explore our FAQs",
  description: "Answers to questions about process, pricing, timelines, and project details",
  items: [
    {
      id: "submit-request",
      question: "How do I submit a design request?",
      answer:
        "You and your team can request design work through a shared board we will set up for you in Asana. You can request as many designs as you like.",
    },
    {
      id: "onboarding",
      question: "How does onboarding work?",
      answer:
        "Your account manager will set up a call to discuss your design needs. After that, you'll receive an invitation to your design board on Asana, along with instructions on how to add your design requests",
    },
    {
      id: "turnaround",
      question: "How fast will I receive my designs?",
      answer:
        "You can set your own deadlines for designs but on average, we deliver a design within a couple of days.",
    },
    {
      id: "company-fit",
      question: "Do you work at our company?",
      answer:
        "It may feel like it but we do not work at your company however we do stay in close touch to make sure we provide the best service possible.",
    },
    {
      id: "full-time",
      question: "Why not hire full-time?",
      answer:
        "A full-time designer can be expensive and hard to source. Your company may not have enough work to keep a full-time designer busy.",
    },
    {
      id: "one-time-logo",
      question: "Can I order a one-time logo service?",
      answer:
        "We offer a combined All-In-One plan to help you with all your design needs. You're welcome to upgrade for one month to get the designs you need, then return to your previous plan for the following month.",
    },
    {
      id: "tools",
      question: "What tools do you use?",
      answer:
        "We work in a wide range of design software, including Figma, Photoshop, Illustrator, After Effects, Canva, and many others.",
    },
    {
      id: "refund-policy",
      question: "What is your refund policy?",
      answer:
        "Because we deliver custom design work it's not possible to issue a refund.",
    },
  ] satisfies FaqItem[],
};
