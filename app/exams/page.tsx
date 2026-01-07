'use client'

import { useState, useEffect } from 'react'
import { ExamCard } from '@/components/exam/ExamCard'
import { Exam, ExamType } from '@/types'
import { examTypes } from '@/lib/constants'
import { Search, Filter } from 'lucide-react'

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<ExamType | 'ALL'>('ALL')

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exams')
      if (res.ok) {
        const data = await res.json()
        setExams(data)
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'ALL' || exam.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-dark-text mb-2">
          Tüm Sınavlar
        </h1>
        <p className="text-slate-600 dark:text-dark-muted">
          Türkiye'de yapılan tüm devlet sınavlarını görüntüleyin ve takip edin
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Sınav ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExamType | 'ALL')}
              className="input-field w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="ALL">Tüm Sınav Tipleri</option>
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-dark-muted font-mono">Yükleniyor...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600 dark:text-dark-muted">Aradığınız kriterlere uygun sınav bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  )
}
