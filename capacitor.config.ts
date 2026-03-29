import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kennedy.jobinterviewtracker",
  appName: "Job Interview Tracker",
  webDir: "dist/spa",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
};

export default config;
