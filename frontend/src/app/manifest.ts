import  type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vyay',
    short_name: 'Vyay',
    description: 'Track expenses, analyze spending, and get AI-powered financial insights — all in one beautifully simple app.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#00000',
    theme_color: '#8BEB0B',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}