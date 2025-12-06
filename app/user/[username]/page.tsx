'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import DiaryCard from '@/components/DiaryCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type UserProfile = {
  id: string;
  username: string;
  bio: string | null;
  profile_picture: string | null;
  created_at: string;
};

type Diary = {
  id: string;
  title: string;
  description: string;
  is_18_plus: boolean;
  topics: string[];
  user_id: string;
  username: string;
  profile_picture: string | null;
  created_at: string;
};

export default function PublicProfile() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, bio, profile_picture, created_at')
        .eq('username', username)
        .single();

      if (userError) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setUser(userData);

      // Fetch published diaries
      const { data: diariesData, error: diariesError } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', userData.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (diariesError) throw diariesError;

      const formattedDiaries = diariesData.map(diary => ({
        ...diary,
        username: userData.username,
        profile_picture: userData.profile_picture,
      }));

      setDiaries(formattedDiaries);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The user @{username} doesn't exist
          </p>
          <a
            href="https://nicediaries.vercel.app/browse"
            className="px-6 py-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-all inline-block"
          >
            Browse Diaries
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#ff6b35]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#ff6b35] flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                @{user.username}
              </h1>
              {user.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ff6b35]" />
                  <span className="font-semibold">{diaries.length}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {diaries.length === 1 ? 'Diary' : 'Diaries'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff6b35]" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Published Diaries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Published Diaries
          </h2>

          {diaries.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No published diaries yet
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaries.map((diary, index) => (
                <DiaryCard key={diary.id} diary={diary} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
