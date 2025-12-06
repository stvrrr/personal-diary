'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit2, Trash2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Diary = {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
  entry_count?: number;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchDiaries();
    }
  }, [status, router]);

  const fetchDiaries = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          *,
          entries(count)
        `)
        .eq('user_id', session?.user?.userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDiaries = data.map((diary: any) => ({
        ...diary,
        entry_count: diary.entries?.[0]?.count || 0,
      }));

      setDiaries(formattedDiaries);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setLoading(false);
    }
  };

  const createNewDiary = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .insert({
          user_id: session?.user?.userId,
          title: 'Untitled Diary',
          description: '',
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/diary/${data.id}`);
    } catch (error) {
      console.error('Error creating diary:', error);
      alert('Failed to create diary');
    }
  };

  const deleteDiary = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diary? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('diaries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiaries(diaries.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting diary:', error);
      alert('Failed to delete diary');
    }
  };

  const filteredDiaries = diaries.filter(diary =>
    diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diary.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My <span className="text-[#ff6b35]">Dashboard</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your diaries and stories
            </p>
          </div>

          <button
            onClick={createNewDiary}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Diary
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your diaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
            />
          </div>
        </motion.div>

        {/* Diaries Grid */}
        {filteredDiaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No diaries yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'No diaries match your search' : 'Start by creating your first diary'}
            </p>
            {!searchTerm && (
              <button
                onClick={createNewDiary}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Your First Diary
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        diary.is_published
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {diary.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {diary.entry_count || 0} entries
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {diary.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {diary.description || 'No description'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/diary/${diary.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDiary(diary.id)}
                      className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
              }
