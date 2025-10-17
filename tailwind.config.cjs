/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [
      'light',
      'dracula',
      {
        professional: {
          primary: '#1e40af', // blue-700
          secondary: '#64748b', // slate-500
          accent: '#f59e0b', // amber-500
          neutral: '#374151', // gray-700
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#e5e7eb',
          'base-content': '#111827',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      }
    ]
  }
};

