import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                port: '',
                pathname: '/**',
            },
        ],
    },
    allowedDevOrigins: ['localhost:3000', 'morally-advanced-escargot.ngrok-free.app', "synapse.ngrok.app"],
};

export default nextConfig;
