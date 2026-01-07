import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-dark-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-display font-bold mb-4">
              &lt;SınavTakip /&gt;
            </h3>
            <p className="text-sm text-dark-muted">
              Türkiye'de devlet tarafından yapılan tüm sınavları takip edin.
            </p>
            <p className="text-xs text-dark-muted mt-2 font-mono">
              Built with Next.js & TypeScript
            </p>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/exams" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Sınavlar
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Fiyatlar
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Destek</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-dark-muted hover:text-primary-400 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-dark-muted hover:text-primary-400 transition-colors">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-dark-muted hover:text-primary-400 transition-colors">
                  Gizlilik
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-dark-muted font-mono">
              <li>info@sinavtakip.com</li>
              <li>+90 (555) 123 45 67</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-border mt-8 pt-8 text-center text-sm text-dark-muted font-mono">
          <p>&copy; {new Date().getFullYear()} Sınav Takip. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
