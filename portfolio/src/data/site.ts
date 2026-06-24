import { yt } from "@/lib/youtube";

export const VARSHA_PHOTO =
  "https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=1200&h=900&fit=crop&auto=format&q=80";

export const HERO_SLIDES = [
  { src: VARSHA_PHOTO, label: "" },
  { src: yt("RAdw_jCDAjs"), label: "Beauty & Lifestyle" },
  { src: yt("Q7cLYdVysyY"), label: "ICICI Bank" },
  { src: yt("3SLDmRjx7Og"), label: "Hubble Money" },
  { src: yt("cd_RtZ0KuIw"), label: "Manipal Healthcare" },
  { src: yt("53QAAPOHCXo"), label: "Healthcare" },
  { src: yt("KCcEEo3-8QA"), label: "Foods" },
  { src: yt("d_irGzgCALc"), label: "Pro-bono" },
];

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Showreel", href: "https://www.youtube.com/watch?v=OSSOWGKYsc4&t=23s", external: true },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  { no: "01", title: "Brand Films", desc: "Cinematic storytelling that puts your brand's purpose on screen — made to move and to last." },
  { no: "02", title: "Campaign Production", desc: "End-to-end content for digital, TV, and social — from concept to final delivery." },
  { no: "03", title: "Social Content", desc: "High-quality short-form content built for Instagram, YouTube, and beyond." },
  { no: "04", title: "Documentaries", desc: "Long-form stories that build trust, community, and brand equity." },
];

export const STATS = [
  { n: "7+", l: "Industry sectors" },
  { n: "35+", l: "Videos produced" },
  { n: "100%", l: "Client retention" },
];

export const CONTACT_LINKS = [
  { label: "Email", value: "makeitherebyvarsha@gmail.com", href: "mailto:makeitherebyvarsha@gmail.com" },
  { label: "YouTube", value: "Watch Showreel", href: "https://www.youtube.com/watch?v=OSSOWGKYsc4&t=23s" },
  { label: "Instagram", value: "@makeithere", href: "https://instagram.com/makeithere" },
  { label: "LinkedIn", value: "Make It Here by Varsha", href: "https://linkedin.com/in/varsha" },
];

export const FOOTER_LINKS = [
  { l: "Work", h: "#work" },
  { l: "About", h: "#about" },
  { l: "Services", h: "#services" },
  { l: "Showreel", h: "https://www.youtube.com/watch?v=OSSOWGKYsc4&t=23s" },
  { l: "Contact", h: "#contact" },
];
