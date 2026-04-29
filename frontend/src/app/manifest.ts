import  type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vyay',
    short_name: 'Vyay',
    description: 'Track expenses, analyze spending, and get AI-powered financial insights — all in one beautifully simple app.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#0c0a09',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/cropped_circle_image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}