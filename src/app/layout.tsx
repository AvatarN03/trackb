import type { Metadata } from 'next'
import { Navbar } from '@/components/common/Navbar'
import { ToastContainer } from '@/components/common/Toast'
import { AuthProvider } from '@/hooks/useAuth'
import './globals.css'

export const metadata: Metadata = {
  title: 'College Discovery Platform',
  description: 'Discover, compare, and choose the best college for your future',
  icons:{
    icon: '/logo.png',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ToastContainer />
          <footer className="border-t border-slate-200 bg-white/85 py-4 text-center text-slate-600 backdrop-blur">
            <p>&copy; 2026 College Discovery Platform. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
