/** @type {import('next').NextConfig} */
const nextConfig = {
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
