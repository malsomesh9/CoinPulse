import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: 'https',  
        hostname: 'assets.coingecko.com',
        
      },
    ],
  }

  /* config options here */
};

export default nextConfig;
