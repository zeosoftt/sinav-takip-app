'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Giriş başarısız')
        setLoading(false)
        return
      }

      // Başarılı giriş - redirect parametresine veya dashboard'a yönlendir
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-4">
            <code className="text-xs font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
              LOGIN
            </code>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-dark-muted">
            Veya{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              yeni hesap oluşturun
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg font-mono text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-dark-border placeholder-slate-400 dark:placeholder-dark-muted rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-dark-border placeholder-slate-400 dark:placeholder-dark-muted rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-dark-border rounded bg-white dark:bg-dark-surface"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-dark-text">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Şifremi unuttum
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-dark-muted font-mono">Yükleniyor...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
