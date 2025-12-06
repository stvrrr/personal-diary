'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from 'lucide-react';

type DiaryCardProps = {
  diary: {
    id: string;
    title: string;
    description: string;
    is_18_plus: boolean;
    topics: string[];
    user_id: string;
    username: string;
    profile_picture: string | null;
  };
  index: number;
};

export default function DiaryCard({ diary, index }: DiaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          {diary.profile_picture ? (
            <img
              src={diary.profile_picture}
              alt={diary.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <Link
              href={`https://nicediaries.vercel.app/user/${diary.username}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-[#ff6b35] transition-colors"
            >
              {diary.username}
            </Link>
            {diary.is_18_plus && (
              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                18+
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`https://nicediaries.vercel.app/diary/${diary.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-[#ff6b35] transition-colors line-clamp-2 cursor-pointer">
            {diary.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {diary.description}
        </p>

        {/* Topics */}
        {diary.topics && diary.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {diary.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-xs bg-orange-50 dark:bg-orange-900/20 text-[#ff6b35] px-2 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
            {diary.topics.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{diary.topics.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
