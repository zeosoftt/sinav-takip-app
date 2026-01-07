export const features = [
  {
    icon: '📅',
    title: 'Tüm Sınav Takvimi',
    description: 'Türkiye\'de yapılan tüm devlet sınavlarının güncel takvimini görüntüleyin',
  },
  {
    icon: '🔔',
    title: 'Akıllı Bildirimler',
    description: 'Başvuru tarihleri, sınav günleri ve sonuç açıklamaları için otomatik bildirimler alın',
  },
  {
    icon: '📊',
    title: 'Kişisel Takip',
    description: 'İlgilendiğiniz sınavları takip edin ve başvuru durumunuzu yönetin',
  },
  {
    icon: '💳',
    title: 'Esnek Ödeme',
    description: 'Aylık veya yıllık abonelik seçenekleri ile size uygun planı seçin',
  },
  {
    icon: '📱',
    title: 'Mobil Uyumlu',
    description: 'Her cihazdan erişebileceğiniz responsive tasarım',
  },
  {
    icon: '🔒',
    title: 'Güvenli Platform',
    description: 'Verileriniz güvende, ödeme işlemleriniz şifrelenmiş',
  },
]

export const examTypes = [
  { value: 'KPSS', label: 'KPSS' },
  { value: 'ALES', label: 'ALES' },
  { value: 'YDS', label: 'YDS' },
  { value: 'YKS', label: 'YKS' },
  { value: 'DGS', label: 'DGS' },
  { value: 'TUS', label: 'TUS' },
  { value: 'STS', label: 'STS' },
  { value: 'EKPSS', label: 'EKPSS' },
  { value: 'MEMUR_SINAVI', label: 'Memur Sınavları' },
  { value: 'OTHER', label: 'Diğer' },
]

export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Aylık',
    price: 99,
    period: 'ay',
    features: [
      'Tüm sınav takvimi',
      'Bildirimler',
      'Kişisel takip',
      '7/24 destek',
    ],
  },
  {
    id: 'yearly',
    name: 'Yıllık',
    price: 999,
    period: 'yıl',
    originalPrice: 1188,
    discount: 16,
    features: [
      'Tüm sınav takvimi',
      'Bildirimler',
      'Kişisel takip',
      '7/24 destek',
      'Öncelikli destek',
    ],
    popular: true,
  },
]
