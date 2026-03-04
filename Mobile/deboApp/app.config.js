import 'dotenv/config';

// dynamic config so that expo start also receives the correct API URL
// process.env.EXPO_PUBLIC_API_URL should be defined in your shell or in
// a .env file (expo-constants loads it via dotenv). If it's missing we
// fall back to localhost so the app doesn't immediately crash.

export default ({ config }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

  if (!process.env.EXPO_PUBLIC_API_URL) {
    console.warn(
      'EXPO_PUBLIC_API_URL is not set; defaulting to', apiUrl,
      '\nSet it in your shell or add it to a .env file for development.'
    );
  }

  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      apiUrl,
    },
  };
};
