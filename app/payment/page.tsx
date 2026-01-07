import { Suspense } from 'react'
import PaymentForm from './PaymentForm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Prevent static generation
export function generateStaticParams() {
  return []
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <PaymentForm />
    </Suspense>
  )
}
