import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Phone, Shield } from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from './admin/Editable';

export default function Footer() {
  const { config } = useAdminEdit();

  // Fallbacks
  const company = config?.company || {
    name: 'ArivTek LLP',
    description: 'A technology company that develops software, provides IT services, and builds innovative digital products under one ecosystem.',
    email: 'contact@arivtek.com',
    phone: '+91 80 4930 2000'
  };

  const contactData = config?.contactInfo || {
    cin: 'U72900KA2026LLP123456',
    gst: '29AAFCA1234F1Z5'
  };

  return (
    <footer className="bg-slate-50 dark:bg-darkCard border-t border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-primary-800 dark:from-white dark:to-accent-200 bg-clip-text text-transparent">
                <EditableText path="company.name">{company.name}</EditableText>
              </span>
            </Link>
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              <EditableArea path="company.description">{company.description}</EditableArea>
            </p>
            <div className="flex space-x-3 pt-2 text-slate-500 dark:text-slate-400">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-primary-100 dark:bg-slate-800 dark:hover:bg-primary-950 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-all duration-200" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200" aria-label="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-display font-semibold text-sm tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-display font-semibold text-sm tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/internships" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-accent-400 text-sm transition-colors">Internships</Link>
              </li>
            </ul>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-slate-100 font-display font-semibold text-sm tracking-wider uppercase flex items-center space-x-1">
              <Shield className="w-4 h-4 text-accent-500" />
              <span>Corporate Info</span>
            </h3>
            <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Entity:</span>{' '}
                <EditableText path="company.name">{company.name}</EditableText>
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-300">CIN:</span>{' '}
                <EditableText path="contactInfo.cin" skipReload>{contactData.cin}</EditableText>
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-300">GSTIN:</span>{' '}
                <EditableText path="contactInfo.gst" skipReload>{contactData.gst}</EditableText>
              </p>
              <p className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                <EditableText path="company.email">{company.email}</EditableText>
              </p>
              <p className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                <EditableText path="company.phone">{company.phone}</EditableText>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} <EditableText path="company.name">{company.name}</EditableText>. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary-600 dark:hover:text-accent-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-accent-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-accent-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
