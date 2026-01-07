'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/auth/UserMenu'
import { PomodoroTimer } from '@/components/study/PomodoroTimer'
import { Menu, X, Timer } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false)

  return (
    <nav className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-display font-bold gradient-text group-hover:scale-105 transition-transform">
              &lt;SınavTakip /&gt;
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/exams" className="text-slate-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Sınavlar
            </Link>
            <Link href="/pricing" className="text-slate-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Fiyatlar
            </Link>
            <Link href="/about" className="text-slate-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Hakkımızda
            </Link>
            <Link href="/study" className="flex items-center gap-2 text-slate-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium" title="Pomodoro Sayacı">
              <Timer className="w-5 h-5" />
              <span>Pomodoro</span>
            </Link>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-slate-200 dark:border-dark-border">
            <Link
              href="/exams"
              className="block px-4 py-2 text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sınavlar
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Fiyatlar
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              href="/study"
              className="block px-4 py-2 text-slate-700 dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pomodoro
            </Link>
            <div className="px-4 space-y-2">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Giriş Yap</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Kayıt Ol</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
