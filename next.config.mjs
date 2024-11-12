/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spimvuqwvknjuepojplk.supabase.co",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
