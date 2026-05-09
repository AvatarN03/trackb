'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { showToast } from '@/components/common/Toast'
import { LoadingState, ErrorState } from '@/components/common/LoadingStates'

interface Question {
  id: string
  title: string
  body: string
  createdAt: string
  user: { email: string }
  answers: Array<{
    id: string
    body: string
    createdAt: string
    user: { email: string }
  }>
}

export default function CollegeQAPage() {
  const params = useParams()
  const collegeId = params.id as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newQuestionTitle, setNewQuestionTitle] = useState('')
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchQuestions()
  }, [collegeId])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?collegeId=${collegeId}`)
      const data = await response.json()

      if (data.success) {
        setQuestions(data.data || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch questions')
        setQuestions([])
      }
    } catch (err) {
      setError('Failed to fetch questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('auth-token')
    if (!token) {
      showToast('Please login to ask questions', 'info')
      return
    }

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newQuestionTitle,
          body: newQuestion,
          collegeId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add answers array to new question if it doesn't exist
        const newQuestion = {
          ...data.data,
          answers: data.data.answers || [],
        }
        setQuestions([newQuestion, ...questions])
        setNewQuestion('')
        setNewQuestionTitle('')
        showToast('Question posted successfully!', 'success')
      } else {
        showToast(data.error || 'Failed to post question', 'error')
      }
    } catch (err) {
      showToast('Failed to post question', 'error')
    }
  }

  const handlePostAnswer = async (questionId: string) => {
    const answerText = newAnswers[questionId]
    if (!answerText) {
      showToast('Please enter an answer', 'error')
      return
    }

    const token = localStorage.getItem('auth-token')
    if (!token) {
      showToast('Please login to answer questions', 'info')
      return
    }

    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId,
          body: answerText,
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchQuestions()
        setNewAnswers({ ...newAnswers, [questionId]: '' })
        showToast('Answer posted successfully!', 'success')
      } else {
        showToast(data.error || 'Failed to post answer', 'error')
      }
    } catch (err) {
      showToast('Failed to post answer', 'error')
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-2">💬 Q&A Discussion</h1>
          <p className="section-subtitle">Ask questions and share insights with other students</p>
        </div>

        {/* Ask Question Form */}
        <div className="card-elevated p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-950 mb-6">❓ Ask a Question</h2>
          <form onSubmit={handleAskQuestion} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Question Title</label>
              <input
                type="text"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                placeholder="What would you like to know?"
                className="input-field-lg"
                required
              />
              <p className="text-xs text-slate-500 mt-2">Be specific and clear (at least 5 characters)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Details</label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Provide more context and details about your question..."
                rows={5}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/10"
                required
              />
              <p className="text-xs text-slate-500 mt-2">Minimum 10 characters</p>
            </div>

            <button type="submit" className="btn-primary w-full md:w-auto">
              ✨ Post Question
            </button>
          </form>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">📝 Questions</h2>
              <p className="text-slate-600 mt-1"><span className="badge-primary">{questions.length}</span></p>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="card-elevated p-16 text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-slate-600 text-lg">No questions yet. Be the first to ask!</p>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="card-elevated p-8 hover:border-amber-300">
                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-950 mb-3">{question.title}</h3>
                  <p className="text-slate-700 text-base leading-relaxed mb-4">{question.body}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      👤 <span className="font-semibold text-slate-700">{question.user.email}</span>
                    </span>
                    <span>📅 {new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Answers */}
                {question.answers.length > 0 && (
                  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/50 border-2 border-blue-200">
                    <h4 className="font-bold text-slate-950 mb-4 flex items-center gap-2">
                      ✅ Answers <span className="badge-primary">{question.answers.length}</span>
                    </h4>
                    <div className="space-y-4">
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="bg-white p-4 rounded-xl border border-blue-100">
                          <p className="text-slate-700 mb-3 text-sm">{answer.body}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>👤 {answer.user.email}</span>
                            <span>📅 {new Date(answer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Form */}
                <div className="border-t-2 border-slate-200 pt-6">
                  <h4 className="font-bold text-slate-950 mb-4">💭 Your Answer</h4>
                  <textarea
                    value={newAnswers[question.id] || ''}
                    onChange={(e) => setNewAnswers({ ...newAnswers, [question.id]: e.target.value })}
                    placeholder="Write your answer here... (minimum 5 characters)"
                    rows={3}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/10 mb-3"
                  />
                  <button
                    onClick={() => handlePostAnswer(question.id)}
                    className="btn-primary"
                  >
                    📤 Post Answer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
