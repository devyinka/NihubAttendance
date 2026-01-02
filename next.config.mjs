/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allowed external hosts for next/image
    domains: ["i.ibb.co", "pinterest.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
