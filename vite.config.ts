import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // הזרקה מפורשת של המפתח מהסביבה של Vercel אל הקוד שרץ בדפדפן
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
