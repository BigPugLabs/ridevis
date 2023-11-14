import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RideViz',
    description: 'Visualisation for rides',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="h-10 bg-gradient-to-b from-slate-800 to-slate-900 border-b-4 border-slate-700">
                    <h1>Ride Viz</h1>
                </header>
                <div id="page" className="flex">
                    <div id="sidebar" className="w-1/5">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/login">Login</Link></li>
                            <li><Link href="/profile">Profile</Link></li>
                            <li><Link href="/">Home</Link></li>
                        </ul>
                    </div>
                    <div id="content" className="w-4/5 max-w-4xl">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
