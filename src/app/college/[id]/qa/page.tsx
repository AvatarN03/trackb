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
        setQuestions(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch questions')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newQuestionTitle,
          body: newQuestion,
          collegeId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQuestions([data.data, ...questions])
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
        headers: { 'Content-Type': 'application/json' },
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Q&A Discussion</h1>

      {/* Ask Question Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
        <form onSubmit={handleAskQuestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
            <input
              type="text"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              placeholder="What's your question?"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Provide more details..."
              rows={4}
              className="input-field"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Post Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Questions ({questions.length})</h2>

        {questions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 text-lg">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h3>
                <p className="text-gray-700 mb-3">{question.body}</p>
                <div className="text-sm text-gray-500">
                  Asked by <span className="font-semibold">{question.user.email}</span> •{' '}
                  {new Date(question.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-900 mb-4">Answers ({question.answers.length})</h4>
                  <div className="space-y-4">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="bg-white p-3 rounded">
                        <p className="text-gray-700 mb-2">{answer.body}</p>
                        <div className="text-xs text-gray-500">
                          By <span className="font-semibold">{answer.user.email}</span> •{' '}
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Form */}
              <div className="border-t pt-4">
                <textarea
                  value={newAnswers[question.id] || ''}
                  onChange={(e) => setNewAnswers({ ...newAnswers, [question.id]: e.target.value })}
                  placeholder="Write your answer..."
                  rows={3}
                  className="input-field mb-2"
                ></textarea>
                <button
                  onClick={() => handlePostAnswer(question.id)}
                  className="btn-primary"
                >
                  Post Answer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
