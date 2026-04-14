import type { ThemeMode } from '@/store/themeSlice'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
export default function ThemeSync() {
  const mode = useSelector((state: {theme: {mode: ThemeMode}}) => state.theme.mode)

  useEffect(() => {
    const root = window.document.documentElement

    const apply = () => {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    apply()

    // Listen for system preference changes when in 'system' mode
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => {
      if (mode === 'system') apply()
    }
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [mode])

  return null
}