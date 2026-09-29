'use client';

import PublicLayout from './layouts/PublicLayout';
import Button from './components/Button';
import Card from './components/Card';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Briefcase, Users, CheckCircle2, BookOpen, Sparkles, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

const blobAnimation = {
  scale: [1, 1.1, 1],
  x: [0, 30, 0],
  y: [0, 20, 0],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export default function Home() {
  return (
    <PublicLayout>
      {/* Animated Background with Blobs and Grid */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
        
        {/* Animated Blobs */}
        <motion.div 
          className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div 
          className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 30, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50/80 backdrop-blur-sm border border-sky-100/50 text-sky-600 text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              <span>🐬</span>
              <span>Dolphin-smooth teaching workspace</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-700 via-sky-600 to-teal-500">
                Teach smarter, not harder.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-700 leading-relaxed"
            >
              Plan lessons, organize materials, and track student progress — all in one calm, organized workspace.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/auth/register">
                <Button variant="primary" className="text-lg px-8 py-4 transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-lg">
                  Start free
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="secondary" className="text-lg px-8 py-4 transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-md">
                  Watch demo
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="space-y-4 pt-4"
            >
              {[
                { text: 'Build a lesson in minutes', delay: 0 },
                { text: 'Reuse templates & materials', delay: 0.1 },
                { text: 'Track progress after every class', delay: 0.2 },
              ].map((item, idx) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + item.delay,
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 animate-float" style={{ animationDelay: `${idx * 0.3}s` }} />
                  </div>
                  <span className="text-gray-700 transition-colors duration-300 group-hover:text-gray-900">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image with Float Animation */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4,
              type: 'spring' as const,
              stiffness: 100,
              damping: 20,
            }}
          >
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-3xl"
              animate={floatAnimation}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <Image 
                src="/images/hero-student.png" 
                alt="Student studying at home - modern learning workspace"
                width={800}
                height={600}
                className="w-full h-auto object-cover rounded-3xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Proof */}
      <motion.section 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-6">
          <p className="text-gray-600 text-lg">Built for 1:1 lessons and small groups</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                className="px-6 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 text-gray-600 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Pilot Teacher
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features - Bento Grid */}
      <motion.section 
        id="features" 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need in one place</h2>
          <p className="text-xl text-gray-600">Streamline your teaching workflow</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First card - slightly larger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1,
              type: 'spring' as const,
              stiffness: 100,
              damping: 20,
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="md:col-span-2 transition-all duration-300 hover:shadow-xl relative group overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-teal-400/0 group-hover:from-sky-400/10 group-hover:to-teal-400/10 transition-all duration-500 blur-2xl -z-10"
              />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white animate-float" style={{ animationDuration: '4s' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Lesson Planner</h3>
              <p className="text-gray-600">Create structured lessons with drag-and-drop ease. Organize your content intuitively and build comprehensive lesson plans that adapt to your teaching style.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: 'spring' as const,
              stiffness: 100,
              damping: 20,
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="transition-all duration-300 hover:shadow-xl relative group overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-teal-400/0 group-hover:from-sky-400/10 group-hover:to-teal-400/10 transition-all duration-500 blur-2xl -z-10"
              />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="w-6 h-6 text-white animate-float" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Materials Library</h3>
              <p className="text-gray-600">Organize and reuse your teaching resources effortlessly.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              type: 'spring' as const,
              stiffness: 100,
              damping: 20,
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="transition-all duration-300 hover:shadow-xl relative group overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-teal-400/0 group-hover:from-sky-400/10 group-hover:to-teal-400/10 transition-all duration-500 blur-2xl -z-10"
              />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white animate-float" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Student Profiles</h3>
              <p className="text-gray-600">Track progress and notes for each student individually.</p>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
          <p className="text-xl text-gray-600">Get started in three simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: 1, title: 'Create lesson', desc: 'Build your lesson plan using templates or start from scratch.', icon: BookOpen },
            { num: 2, title: 'Attach materials', desc: 'Add worksheets, videos, and resources from your library.', icon: Sparkles },
            { num: 3, title: 'Teach & track progress', desc: 'Conduct your lesson and update student progress notes.', icon: Target }
          ].map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.1,
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
              }}
              className="text-center group"
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg transition-all duration-300 group-hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
              >
                <step.icon className="w-8 h-8 animate-float" style={{ animationDelay: `${idx * 0.3}s` }} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Templates */}
      <motion.section 
        id="templates" 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Popular Templates</h2>
          <p className="text-xl text-gray-600">Ready-to-use lesson plans for every level</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Beginner Basics', desc: 'Essential vocabulary and grammar', tags: ['A2', 'Kids'], gradient: 'from-sky-500 to-teal-500' },
            { title: 'Intermediate Conversations', desc: 'Practice speaking and listening', tags: ['B1'], gradient: 'from-teal-500 to-sky-500' },
            { title: 'IELTS Prep', desc: 'Exam preparation materials', tags: ['IELTS'], gradient: 'from-sky-500 to-sky-700' },
            { title: 'Business English', desc: 'Professional communication skills', tags: ['B1', 'Business'], gradient: 'from-teal-500 to-sky-700' }
          ].map((template, idx) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.1,
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="transition-all duration-300 hover:shadow-xl group overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-teal-400/0 group-hover:from-sky-400/10 group-hover:to-teal-400/10 transition-all duration-500 blur-2xl -z-10"
                />
                <div className={`h-32 bg-gradient-to-br ${template.gradient} rounded-xl mb-4 shadow-lg transition-all duration-300 group-hover:shadow-xl`}></div>
                <div className="flex gap-2 mb-3">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium border border-sky-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 tracking-tight">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <Link href="/courses">
            <Button variant="secondary" className="transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-md">
              Explore all templates
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Pricing */}
      <motion.section 
        id="pricing" 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that works for you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: 'Free',
              price: '$0',
              features: ['Up to 5 students', 'Basic templates', 'Lesson planning'],
              variant: 'secondary' as const,
              popular: false,
            },
            {
              title: 'Pro',
              price: '$19',
              features: ['Unlimited students', 'All templates & packs', 'Advanced analytics', 'Priority support'],
              variant: 'primary' as const,
              popular: true,
            },
          ].map((plan, idx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.1,
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
              }}
            >
              <Card className={`relative transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-2 border-sky-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{plan.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: idx * 0.1 + featureIdx * 0.05,
                          type: 'spring',
                          stiffness: 100,
                          damping: 20,
                        }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 animate-float" style={{ animationDelay: `${featureIdx * 0.2}s` }} />
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="w-full block">
                    <Button variant={plan.variant} className="w-full transition-all duration-300 active:scale-95 hover:scale-[1.02] hover:shadow-md">
                      {plan.popular ? 'Start free trial' : 'Get started'}
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'How do I create an account?', a: 'Simply click "Start free" and sign up with your email. No credit card required for the free plan.' },
            { q: 'Can I upload my own materials?', a: 'Yes! You can upload PDFs, images, videos, and other files to your materials library and attach them to any lesson.' },
            { q: 'Does it work for online teaching?', a: 'Absolutely! Pinagook works seamlessly for both online and in-person lessons. Share materials and track progress regardless of your teaching format.' },
            { q: 'Can I export my lesson plans?', a: 'Yes, Pro users can export lesson plans as PDFs or share them directly with students or other teachers.' },
            { q: 'What languages are supported?', a: 'Pinagook is designed for English teachers, but you can use it to teach any language. The interface is currently available in English.' }
          ].map((faq, idx) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.1,
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
              }}
            >
              <Card hover={false} className="transition-all duration-300 hover:shadow-lg">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">{faq.q}</span>
                    <Zap className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-all duration-300" />
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.a}</p>
                </details>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        className="relative w-full max-w-[1440px] mx-auto px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <motion.div 
          className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-3xl p-12 text-center text-white shadow-2xl transition-all duration-300 hover:shadow-3xl"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Ready to teach with less stress?</h2>
          <p className="text-xl mb-8 opacity-90">Join independent teachers who are already using Pinagook</p>
          <Link href="/auth/register">
            <Button variant="secondary" className="text-lg px-8 py-4 transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-lg">
              Start free
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative w-full bg-white/60 backdrop-blur-sm border-t border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🐬</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 tracking-tight">Pinagook</span>
              </div>
              <p className="text-gray-600 text-sm">Dolphin-smooth teaching workspace for independent English teachers.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Features</a></li>
                <li><a href="#templates" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Templates</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#blog" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Blog</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Privacy</a></li>
                <li><a href="#terms" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Terms</a></li>
                <li><a href="#support" className="text-gray-600 hover:text-sky-600 transition-colors duration-300">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2024 Pinagook. All rights reserved.</p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-sky-600 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                    {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                    {social === 'instagram' && <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </PublicLayout>
  );
}
