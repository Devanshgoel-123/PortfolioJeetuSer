export const VARSHA_PHOTO =
  "https://images.unsplash.com/photo-1547212371-eb5e6a4b590c?w=1200&h=900&fit=crop&auto=format&q=80";

export const yt = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
export const ytUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

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

export const WORK = [
  {
    id: 1,
    client: "Beauty & Lifestyle",
    category: "Content Production",
    year: "2024–26",
    thumb: yt("RAdw_jCDAjs"),
    href: ytUrl("RAdw_jCDAjs"),
    videos: [
      { id: "RAdw_jCDAjs", label: "Campaign Film" },
      { id: "Sw3tEcz2PK0", label: "Brand Story" },
      { id: "FX59-ZT6Ui0", label: "Product Reveal" },
      { id: "b0pexzGB44o", label: "Social Series" },
    ],
  },
  {
    id: 2,
    client: "ICICI Bank",
    category: "Finance & Banking",
    year: "2024–25",
    thumb: yt("Q7cLYdVysyY"),
    href: ytUrl("Q7cLYdVysyY"),
    videos: [
      { id: "Q7cLYdVysyY", label: "Brand Film" },
      { id: "nJCs11P9iDQ", label: "Campaign" },
      { id: "Ii8dR35JkaM", label: "Product Spot" },
      { id: "mnBVv4oFfWE", label: "Digital Series" },
    ],
  },
  {
    id: 3,
    client: "Hubble Money",
    category: "Fintech",
    year: "2024",
    thumb: yt("3SLDmRjx7Og"),
    href: ytUrl("3SLDmRjx7Og"),
    videos: [
      { id: "3SLDmRjx7Og", label: "Launch Film" },
      { id: "1iQSwtQmlig", label: "Explainer" },
      { id: "QCnjsjbrA-o", label: "Campaign Spot" },
    ],
  },
  {
    id: 4,
    client: "Manipal Healthcare",
    category: "Healthcare",
    year: "2023–24",
    thumb: yt("cd_RtZ0KuIw"),
    href: ytUrl("cd_RtZ0KuIw"),
    videos: [
      { id: "cd_RtZ0KuIw", label: "Brand Film" },
      { id: "XHBPn_ELA30", label: "Campaign" },
      { id: "TF_E1MaqwIs", label: "Documentary" },
      { id: "RsKaNypd3lw", label: "Series" },
    ],
  },
  {
    id: 5,
    client: "Healthcare",
    category: "Health & Wellness",
    year: "2023–25",
    thumb: yt("53QAAPOHCXo"),
    href: ytUrl("53QAAPOHCXo"),
    videos: [
      { id: "53QAAPOHCXo", label: "Awareness Film" },
      { id: "G0BV-ZqA5qE", label: "Campaign" },
      { id: "nlfTweqlfQc", label: "Patient Stories" },
      { id: "sCeCuH847ss", label: "Brand Spot" },
      { id: "T0DCpH47iPk", label: "Social Content" },
    ],
  },
  {
    id: 6,
    client: "Foods",
    category: "FMCG & Food",
    year: "2023–24",
    thumb: yt("KCcEEo3-8QA"),
    href: "https://www.youtube.com/watch?v=KCcEEo3-8QA&t=2s",
    videos: [
      { id: "KCcEEo3-8QA", label: "Brand Film" },
      { id: "mat96IEwIqg", label: "Product Spot" },
      { id: "twU7wpILnHc", label: "Recipe Series" },
      { id: "4kpsuvB9jpM", label: "Campaign" },
    ],
  },
  {
    id: 7,
    client: "Pro-bono",
    category: "Social Impact",
    year: "Ongoing",
    thumb: yt("d_irGzgCALc"),
    href: ytUrl("d_irGzgCALc"),
    videos: [
      { id: "d_irGzgCALc", label: "Impact Film" },
      { id: "kkrTmkYrPsw", label: "Documentary" },
      { id: "PzaI5jWJCEE", label: "Awareness" },
      { id: "SXtrDI6ps6c", label: "Campaign" },
      { id: "VRWeEzaA-vs", label: "Community Story" },
      { id: "yw1TYFY6vzg", label: "Short Film" },
    ],
  },
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
