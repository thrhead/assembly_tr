import { Platform } from 'react-native';

const getBaseUrl = () => {
    // Check if we have a production URL defined in environment variables (for EAS builds)
    const prodUrl = process.env.EXPO_PUBLIC_API_URL;
    if (prodUrl && !__DEV__) {
        return prodUrl;
    }

    // For web (react-native-web), use the same host that serves the app in dev, 
    // but LIVE backend in production
    if (Platform.OS === 'web') {
        if (__DEV__) {
            if (typeof window !== 'undefined' && window.location) {
                const host = window.location.hostname;
                return `http://${host}:3000`;
            }
            return 'http://localhost:3000';
        }
        return 'https://assemblyweb.vercel.app';
    }

    // Hardcoded LAN IP for physical device testing in development
    if (__DEV__) {
        // This value is updated automatically by start_tunnel_auto.ps1 or can be local IP
        return 'https://adjustment-wilderness-midnight-recordings.trycloudflare.com';
    }

    // Fallback for production if no env var is set
    return 'https://assemblyweb.vercel.app';
};

export const API_URL = getBaseUrl();
