'use client';

import { BookOpen, Sparkles, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-[#ff6b35]">Nice Diaries</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your personal space to write, share, and discover amazing stories from people around the world.
              Create beautiful diaries, share your journey, and connect with readers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="https://nicediaries.vercel.app/signup"
              className="px-8 py-4 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign Up Free
            </Link>
            <Link
              href="https://nicediaries.vercel.app/browse"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:border-[#ff6b35] transition-all duration-300 transform hover:scale-105"
            >
              Browse Stories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Why Choose Nice Diaries?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Easy Writing',
                description: 'Beautiful editor that makes writing a joy. Create entries effortlessly.',
              },
              {
                icon: Users,
                title: 'Share & Connect',
                description: 'Publish your stories and connect with readers who appreciate your journey.',
              },
              {
                icon: Lock,
                title: 'Private & Secure',
                description: 'Your private entries stay private. You control what gets published.',
              },
              {
                icon: Sparkles,
                title: 'Discover Stories',
                description: 'Browse amazing diaries from creators around the world.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <Icon className="w-12 h-12 text-[#ff6b35] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Start Your Story Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join our community of writers and readers. Your story matters.
          </p>
          <Link
            href="https://nicediaries.vercel.app/signup"
            className="inline-block px-10 py-4 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
