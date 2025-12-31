import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
    },
    allowedDevOrigins: ['localhost:3000', 'morally-advanced-escargot.ngrok-free.app', "synapse.ngrok.app"],
};

export default nextConfig;
