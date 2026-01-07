'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'

export default function InstitutionRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    description: '',
    website: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    if (!formData.type) {
      setError('Kurum tipi seçiniz')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/institutions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: formData.type,
          description: formData.description,
          website: formData.website,
          phone: formData.phone,
          address: formData.address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kayıt başarısız')
        return
      }

      router.push('/institutions/dashboard')
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="text-center mb-4">
            <Building2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
              KURUM KAYIT
            </code>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-slate-900 dark:text-dark-text">
            Kurum Olarak Kayıt Olun
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-dark-muted">
            Öğrencilerinizi yönetin ve istatistiklerinizi görüntüleyin
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg font-mono text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Kurum Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Kurum adı"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Kurum Tipi *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">Seçiniz</option>
                <option value="SCHOOL">Okul</option>
                <option value="COACHING">Dershane</option>
                <option value="UNIVERSITY">Üniversite</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
              E-posta *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="kurum@example.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Şifre *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="En az 6 karakter"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Şifre Tekrar *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Kurum hakkında kısa bilgi"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Web Sitesi
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
                Telefon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="+90 555 123 45 67"
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-2">
              Adres
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Kurum adresi"
            />
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Kurum Olarak Kayıt Ol'}
            </Button>
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-dark-muted">
            Zaten hesabınız var mı?{' '}
            <Link href="/institutions/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              Giriş yapın
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
