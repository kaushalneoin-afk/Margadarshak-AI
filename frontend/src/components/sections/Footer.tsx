'use client'

import Link from 'next/link'
import { TrafficCone, Globe, MessageCircle, Mail, MapPin, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Live Demo', href: '/demo' },
    { label: '3D City View', href: '/dashboard/3d' },
    { label: 'Analytics', href: '/dashboard/analytics' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'About', href: '/about' },
  ],
  Company: [
    { label: 'Our Mission', href: '/about' },
    { label: 'Contact', href: 'mailto:hello@traffictwin.ai' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <TrafficCone className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">AI Traffic Twin</span>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Smart City Platform</p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Next-generation AI-powered traffic management platform for smart cities.
              Real-time monitoring, predictive analytics, and intelligent emergency response coordination.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Mail, href: 'mailto:hello@traffictwin.ai' },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} AI Urban Traffic Digital Twin Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <MapPin className="w-3 h-3" />
            Built for smarter, safer cities
          </div>
        </div>
      </div>
    </footer>
  )
}
