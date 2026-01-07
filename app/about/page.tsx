export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Hakkımızda</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Misyonumuz</h2>
          <p className="text-gray-700 leading-relaxed">
            Sınav Takip, Türkiye'de devlet tarafından yapılan tüm sınavların takibini kolaylaştırmak 
            için kurulmuş bir platformdur. Amacımız, sınav adaylarının başvuru tarihlerini, sınav 
            günlerini ve sonuç açıklamalarını kaçırmamalarını sağlamaktır.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vizyonumuz</h2>
          <p className="text-gray-700 leading-relaxed">
            Türkiye'nin en kapsamlı sınav takip platformu olmak ve binlerce adayın sınav 
            süreçlerini kolaylaştırmak. Teknoloji ve yenilikçi çözümlerle, sınav hazırlık 
            sürecinde adayların yanında olmak.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Özelliklerimiz</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Tüm devlet sınavlarının güncel takvimi</li>
            <li>Otomatik bildirimler ve hatırlatmalar</li>
            <li>Kişisel sınav takip sistemi</li>
            <li>Mobil uyumlu, her cihazdan erişim</li>
            <li>Güvenli ödeme sistemi</li>
            <li>7/24 müşteri desteği</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-700 leading-relaxed">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong>E-posta:</strong> info@sinavtakip.com</p>
            <p><strong>Telefon:</strong> +90 (555) 123 45 67</p>
          </div>
        </section>
      </div>
    </div>
  )
}
