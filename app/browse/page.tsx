'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import DiaryCard from '@/components/DiaryCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TOPICS = [
  'Adventure', 'Coding', 'Gaming', 'Travel', 'Food', 'Fitness',
  'Music', 'Art', 'Photography', 'Writing', 'Technology', 'Science',
  'Fashion', 'Business', 'Education', 'Health', 'Sports', 'Movies',
  'Books', 'Nature', 'Lifestyle', 'Relationships'
];

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

export default function Browse() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<Diary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [ageFilter, setAgeFilter] = useState<'all' | '18-' | '18+'>('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    filterDiaries();
  }, [searchTerm, ageFilter, selectedTopics, diaries]);

  const fetchDiaries = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select(`
          id,
          title,
          description,
          is_18_plus,
          topics,
          user_id,
          created_at,
          users!inner(username, profile_picture)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDiaries = data.map((diary: any) => ({
        id: diary.id,
        title: diary.title,
        description: diary.description,
        is_18_plus: diary.is_18_plus,
        topics: diary.topics || [],
        user_id: diary.user_id,
        username: diary.users.username,
        profile_picture: diary.users.profile_picture,
        created_at: diary.created_at,
      }));

      setDiaries(formattedDiaries);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setLoading(false);
    }
  };

  const filterDiaries = () => {
    let filtered = [...diaries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(diary =>
        diary.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Age filter
    if (ageFilter === '18-') {
      filtered = filtered.filter(diary => !diary.is_18_plus);
    } else if (ageFilter === '18+') {
      filtered = filtered.filter(diary => diary.is_18_plus);
    }

    // Topics filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(diary =>
        selectedTopics.some(topic => diary.topics.includes(topic))
      );
    }

    setFilteredDiaries(filtered);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Browse <span className="text-[#ff6b35]">Diaries</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover amazing stories from our community
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6"
            >
              {/* Age Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Age Rating</h3>
                <div className="flex gap-3">
                  {['all', '18-', '18+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeFilter(age as any)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        ageFilter === age
                          ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                          : 'border-gray-300 dark:border-gray-700 hover:border-[#ff6b35]'
                      }`}
                    >
                      {age === 'all' ? 'All Ages' : age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTopics.includes(topic)
                          ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                          : 'border-gray-300 dark:border-gray-700 hover:border-[#ff6b35]'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedTopics.length > 0 || ageFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedTopics([]);
                    setAgeFilter('all');
                  }}
                  className="text-[#ff6b35] hover:text-[#ff5722] text-sm font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          Found {filteredDiaries.length} {filteredDiaries.length === 1 ? 'diary' : 'diaries'}
        </div>

        {/* Diary Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading diaries...</p>
          </div>
        ) : filteredDiaries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">No diaries found</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiaries.slice(0, displayCount).map((diary, index) => (
                <DiaryCard key={diary.id} diary={diary} index={index} />
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < filteredDiaries.length && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
                      }
