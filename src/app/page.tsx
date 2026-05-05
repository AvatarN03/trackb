import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-slate-900/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mb-16 rounded-[2rem] border border-slate-200 bg-white/75 px-6 py-14 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Smarter college discovery, comparison, and admissions guidance
          </p>
          <h1 className="mb-5 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            Discover the college that matches your ambition.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Explore colleges with clean comparisons, practical admission predictions, and a student-driven Q&A layer that helps you make a confident choice.
          </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/colleges" className="btn-primary text-lg">
            Explore Colleges
          </Link>
          <Link href="/predictor" className="btn-secondary text-lg">
            Try Predictor
          </Link>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 text-4xl">🎓</div>
          <h3 className="mb-2 text-2xl font-bold text-slate-950">Browse Colleges</h3>
          <p className="text-slate-600">
            Explore thousands of colleges with detailed information about courses, placements, and fees.
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-4 text-4xl">⚖️</div>
          <h3 className="mb-2 text-2xl font-bold text-slate-950">Compare Institutions</h3>
          <p className="text-slate-600">
            Compare up to 3 colleges side-by-side to find the best fit for your goals.
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-4 text-4xl">🎯</div>
          <h3 className="mb-2 text-2xl font-bold text-slate-950">Predict Admissions</h3>
          <p className="text-slate-600">
            Get AI-powered predictions based on your exam scores and rank.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 px-8 py-10 text-center text-white shadow-[0_24px_90px_rgba(15,23,42,0.3)] md:px-12 md:py-14">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to find your college?</h2>
        <p className="mb-8 text-lg text-slate-300">
          Join thousands of students who have already discovered their perfect college.
        </p>
        <Link href="/colleges" className="inline-block rounded-full bg-white px-8 py-3 font-bold text-slate-950 transition hover:bg-amber-50">
          Start Exploring
        </Link>
      </section>

      {/* Stats Section */}
      <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="mb-2 text-4xl font-black text-slate-950">500+</div>
          <p className="text-slate-600 text-lg">Colleges Listed</p>
        </div>
        <div className="card p-6 text-center">
          <div className="mb-2 text-4xl font-black text-slate-950">50K+</div>
          <p className="text-slate-600 text-lg">Active Users</p>
        </div>
        <div className="card p-6 text-center">
          <div className="mb-2 text-4xl font-black text-slate-950">10K+</div>
          <p className="text-slate-600 text-lg">Comparisons Made</p>
        </div>
      </section>
    </div>
  )
}
