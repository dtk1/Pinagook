import PublicLayout from './layouts/PublicLayout';
import Button from './components/Button';
import Card from './components/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <PublicLayout>

      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9F6F8] text-[#0EA5B7] text-sm font-medium">
              <span>🐬</span>
              <span>Dolphin-smooth teaching workspace</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Teach smarter, not harder.
          </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Plan lessons, organize materials, and track student progress — all in one calm, organized workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button variant="primary" className="text-lg px-8 py-4">
                  Start free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="text-lg px-8 py-4">
                  Watch demo
                </Button>
              </Link>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e0f2fe] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0EA5B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Build a lesson in minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e0f2fe] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0EA5B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Reuse templates & materials</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e0f2fe] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0EA5B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Track progress after every class</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#D9F6F8] to-[#3BC7D8] rounded-3xl p-8 shadow-xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gradient-to-br from-[#0EA5B7] to-[#3BC7D8] rounded-lg mt-4"></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg w-48 mx-auto">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-20 bg-[#e0f2fe] rounded-lg mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="w-full max-w-[1440px] mx-auto px-8 py-12">
        <div className="text-center space-y-6">
          <p className="text-gray-600 text-lg">Built for 1:1 lessons and small groups</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 font-medium">Pilot Teacher</div>
            <div className="px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 font-medium">Pilot Teacher</div>
            <div className="px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 font-medium">Pilot Teacher</div>
            <div className="px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 font-medium">Pilot Teacher</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full max-w-[1440px] mx-auto px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need in one place</h2>
          <p className="text-xl text-gray-600">Streamline your teaching workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="w-12 h-12 rounded-xl bg-[#0EA5B7] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lesson Planner</h3>
            <p className="text-gray-600">Create structured lessons with drag-and-drop ease.</p>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-xl bg-[#0EA5B7] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Materials Library</h3>
            <p className="text-gray-600">Organize and reuse your teaching resources effortlessly.</p>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-xl bg-[#0EA5B7] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Profiles</h3>
            <p className="text-gray-600">Track progress and notes for each student individually.</p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0EA5B7] flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create lesson</h3>
            <p className="text-gray-600">Build your lesson plan using templates or start from scratch.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0EA5B7] flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Attach materials</h3>
            <p className="text-gray-600">Add worksheets, videos, and resources from your library.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0EA5B7] flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Teach & track progress</h3>
            <p className="text-gray-600">Conduct your lesson and update student progress notes.</p>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="w-full max-w-[1440px] mx-auto px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Templates</h2>
          <p className="text-xl text-gray-600">Ready-to-use lesson plans for every level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="h-32 bg-gradient-to-br from-[#0EA5B7] to-[#3BC7D8] rounded-xl mb-4"></div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">A2</span>
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">Kids</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Beginner Basics</h3>
            <p className="text-sm text-gray-600">Essential vocabulary and grammar</p>
          </Card>

          <Card>
            <div className="h-32 bg-gradient-to-br from-[#3BC7D8] to-[#0EA5B7] rounded-xl mb-4"></div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">B1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Intermediate Conversations</h3>
            <p className="text-sm text-gray-600">Practice speaking and listening</p>
          </Card>

          <Card>
            <div className="h-32 bg-gradient-to-br from-[#0ea5e9] to-[#0891b2] rounded-xl mb-4"></div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">IELTS</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">IELTS Prep</h3>
            <p className="text-sm text-gray-600">Exam preparation materials</p>
          </Card>

          <Card>
            <div className="h-32 bg-gradient-to-br from-[#14b8a6] to-[#0891b2] rounded-xl mb-4"></div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">B1</span>
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-xs font-medium">Business</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Business English</h3>
            <p className="text-sm text-gray-600">Professional communication skills</p>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="secondary">Explore all templates</Button>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Up to 5 students</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Basic templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Lesson planning</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full">Get started</Button>
            </div>
          </Card>

          <Card className="relative border-2 border-[#0ea5e9]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] text-white rounded-full text-sm font-medium">
                Most popular
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Unlimited students</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All templates & packs</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <Link href="/register">
                <Button variant="primary" className="w-full">Start free trial</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-[1440px] mx-auto px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <Card hover={false}>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-gray-900">How do I create an account?</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Simply click "Start free" and sign up with your email. No credit card required for the free plan.</p>
            </details>
          </Card>

          <Card hover={false}>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-gray-900">Can I upload my own materials?</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Yes! You can upload PDFs, images, videos, and other files to your materials library and attach them to any lesson.</p>
            </details>
          </Card>

          <Card hover={false}>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-gray-900">Does it work for online teaching?</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Absolutely! Pinagook works seamlessly for both online and in-person lessons. Share materials and track progress regardless of your teaching format.</p>
            </details>
          </Card>

          <Card hover={false}>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-gray-900">Can I export my lesson plans?</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Yes, Pro users can export lesson plans as PDFs or share them directly with students or other teachers.</p>
            </details>
          </Card>

          <Card hover={false}>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-gray-900">What languages are supported?</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Pinagook is designed for English teachers, but you can use it to teach any language. The interface is currently available in English.</p>
            </details>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to teach with less stress?</h2>
          <p className="text-xl mb-8 opacity-90">Join independent teachers who are already using Pinagook</p>
          <Link href="/register">
            <Button variant="secondary" className="text-lg px-8 py-4">
              Start free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="w-full max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🐬</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Pinagook</span>
              </div>
              <p className="text-gray-600 text-sm">Dolphin-smooth teaching workspace for independent English teachers.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Features</a></li>
                <li><a href="#templates" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Templates</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#blog" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Blog</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Privacy</a></li>
                <li><a href="#terms" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Terms</a></li>
                <li><a href="#support" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2024 Pinagook. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0ea5e9] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
}
