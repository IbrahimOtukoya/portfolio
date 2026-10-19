// Content for the pages that are not managed in Notion (home hero, about, archive, footer).
// Images still point at Framer's CDN; replace them with files in /public before retiring Framer.

export const site = {
  name: "Ibrahim Otukoya",
  title: "Ibrahim Otukoya — Brand Designer",
  description: "Thinker. Craftsman. Scribbler.",
  email: "ibrahimotukoya100@gmail.com",
  enquiryHref: "mailto:ibrahimotukoya100@gmail.com?subject=Project%20enquiry",
  location: "Based in Lagos, Nigeria",
  hero: {
    headline: "Thinker. Craftsman. Scribbler",
    role: "Brand designer, Moniepoint | Ex: Anchor",
    bio: "Brands shape experiences. I shape brands. Working with the mind of an engineer and the eye of a designer, I've built visual systems for fintech startups and companies serving millions across Africa. Currently designing brand systems at Moniepoint.",
  },
  // Hero tiles; illustrations live in /public/pixel.
  tiles: [
    { label: "Work", href: "/#work" },
    { label: "Thoughts", href: "https://ibrahimotukoya.substack.com/" },
    { label: "Experiments", href: "/archive" },
  ],
  services: ["Branding", "Illustration", "Editorial", "Graphic design", "Motion design", "Web design"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/iotukoya/" },
    { label: "Behance", href: "https://www.behance.net/iotukoya" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ibrahimotukoya/" },
    { label: "Substack", href: "https://ibrahimotukoya.substack.com/" },
    { label: "Medium", href: "https://medium.com/@iotukoya" },
  ],
};

export const about = {
  headline: "Ibrahim Otukoya is a brand designer, based in Lagos, Nigeria.",
  portrait: "https://framerusercontent.com/images/zamjyyflZPpwvsGH3Aty1JLk2bM.png",
  bio: [
    "I am many things. Being a designer is merely one of them. It's probably the reason you are here, and so, it's the part of me we'll discuss. I am a designer. A brand designer.",
    "For the last 7 years, I have designed—almost everyday. I have partnered with diverse individuals and teams to craft brands that address customer pain points, meet their needs, and deliver exceptional experiences.",
    "For the last 1 year and some, I have designed at Moniepoint. Before that, I designed for two years at Anchor, and before that, I just designed...",
    "Writer, reader, thinker, yapper, walker, movie-watcher, swimmer, Duck-lover. When I am not a being a designer, these are some of the things I am.",
  ],
  experience: [
    { role: "Brand Designer", company: "Moniepoint", years: "2025 – Present" },
    { role: "Brand Designer", company: "Anchor", years: "2023 – 2025" },
    { role: "Brand Designer (Contract)", company: "Caravan", years: "2022 – 2023" },
    { role: "User Experience Researcher (Contract)", company: "Thrill DAO", years: "2022" },
    { role: "Creative Designer", company: "Musterpoint Limited", years: "2020 – 2021" },
    { role: "Freelance Brand Designer", company: null, years: "2018 – Present" },
  ],
  reading: [
    "https://framerusercontent.com/images/VXOjgSRTWEEeOj8Ch9COF7Whwc.png",
    "https://framerusercontent.com/images/INVvAPt9h79jeRkehNv6QR9H9o.png",
    "https://framerusercontent.com/images/2iuJ6op3SItKWMLoPPi7UYvA.png",
  ],
  watching: ["https://framerusercontent.com/images/jxiAQkCif9GaaPQU9qHeGWWz0Dk.png"],
};

export const archive = {
  headline: "Archives",
  subhead: "The home for ideas, thoughts and explorations that have nowhere to go.",
  images: [
    "https://framerusercontent.com/images/5L2VygcM6LOnRkdpVxxePvnZo.png",
    "https://framerusercontent.com/images/0JSaV5n9MNXZRnz0LIffhnPLUUE.png",
    "https://framerusercontent.com/images/gLYXOSjBYxv960y5fbkWNGkIQSw.png",
    "https://framerusercontent.com/images/RhLffMhPNuBXbEXHymsA1jax0rk.png",
    "https://framerusercontent.com/images/6XVqM92yUV8aEHK5BDz21L72usY.png",
    "https://framerusercontent.com/images/qhEc1KSF2GDA6dHckINrLveCs0.png",
    "https://framerusercontent.com/images/od17C44A0YCmJOcqUbTXlcn8.jpg",
    "https://framerusercontent.com/images/CFmNORKWsddIBCDtObYl2wuWHU.png",
    "https://framerusercontent.com/images/gsMmuWSTfG2o1W8eyR77WiR10Us.png",
    "https://framerusercontent.com/images/XeiGEmgkXaXkSRXuWY2P3BLdDzk.jpg",
  ],
};
