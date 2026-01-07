'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'

export default function InstitutionLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Normal login API'sini kullan, role kontrolü backend'de yapılacak
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Giriş başarısız')
        return
      }

      // Role kontrolü - INSTITUTION_ADMIN ise kurum dashboard'a yönlendir
      if (data.user.role === 'INSTITUTION_ADMIN') {
        router.push('/institutions/dashboard')
      } else {
        setError('Bu hesap kurum hesabı değil')
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-4">
            <Building2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
              KURUM GİRİŞ
            </code>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
            Kurum Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-dark-muted">
            Veya{' '}
            <Link href="/institutions/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              yeni kurum hesabı oluşturun
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
                placeholder="Kurum e-posta adresi"
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
