/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfkit", "nodemailer", "sharp"],
};

export default nextConfig;
