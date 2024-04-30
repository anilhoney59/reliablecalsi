import { navbarItemsProps, ServicesProps, socialLinksProps } from "./types";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// Change your content from here
export const SITE_NAME = "Reliable Design";
export const TAGLINE = "Architect | Vastu | Structural";
const WP_NUMBER = 911234567890;

export const WP_LINK = `https://wa.me/${WP_NUMBER}?text=Hi,%20can%20you%20help%20me%20with...`;

// Function to open whatsapp
export const openUrl = (WP_LINK: string) => {
  window.open(WP_LINK);
};

// Do not change these items
export const navbarItems: navbarItemsProps[] = [
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Services",
    href: "#services",
  },
  {
    title: "About",
    href: "#about",
  },
];

export const socialsLinks: socialLinksProps[] = [
  {
    title: "YouTube",
    icon: <FaYoutube />,
    href: "https://youtube.com/",
  },
  {
    title: "Instagram",
    icon: <FaInstagram />,
    href: "https://instagram.com/",
  },
];

export const projectsItem = [
  {
    title: "Project Name",
    img: "/projects-imgs/project-1.png",
  },
  {
    title: "Project Name",
    img: "/projects-imgs/project-2.png",
  },
  {
    title: "Project Name",
    img: "/projects-imgs/project-3.png",
  },
  {
    title: "Project Name",
    img: "/projects-imgs/project-4.png",
  },
  {
    title: "Project Name",
    img: "/projects-imgs/project-5.png",
  },
];

export const servicesItem: ServicesProps[] = [
  {
    title: "Architecture",
    width: 250,
    height: 250,
    imgSrc: "/architecture.svg",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, sapiente!",
  },
  {
    title: "Commercial Buildings",
    width: 400,
    height: 400,
    imgSrc: "/commercial.svg",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
  },
  {
    title: "Interior Design",
    width: 300,
    height: 300,
    imgSrc: "/interior.svg",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, sapiente!",
  },
  {
    title: "Vastu",
    width: 250,
    height: 250,
    imgSrc: "/vastu.jpg",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, sapiente!",
  },
];

export const aboutDescription: string = `
Welcome to Anil Suthar's Architectural and Design Studio! With a wealth of experience and a passion for creating exceptional spaces, Anil Suthar and his team of talented architects and interior designers offer a comprehensive range of architectural, interior design, and Vastu consultancy services. 

Anil Suthar, a Senior Design Engineer with a Post Graduation in M.Tech Structure, leads our team with a commitment to excellence and a keen eye for detail.
Whether you're looking to design your dream home, revamp your office space, or seek Vastu-compliant solutions, we are here to turn your vision into reality. 
At Anil Suthar's Architectural and Design Studio, we believe that great design has the power to transform lives. We work closely with each client to understand their unique needs and aspirations, ensuring that every project is a true reflection of their style and personality. 

From concept to completion, we are dedicated to delivering innovative design solutions that exceed expectations. Contact us today to discuss your project and let us help you create a space that inspires and delights.
`;
