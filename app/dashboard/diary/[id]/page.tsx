'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Entry = {
  id: string;
  title: string;
  content: string;
  entry_date: string;
  word_count: number;
};

export default function DiaryEditor() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const diaryId = params?.id as string;

  const [diary, setDiary] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (diaryId) {
      fetchDiary();
      fetchEntries();
    }
  }, [diaryId]);

  const fetchDiary = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', diaryId)
        .single();

      if (error) throw error;

      setDiary(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diary:', error);
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('diary_id', diaryId)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const saveDiary = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('diaries')
        .update({
          title,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', diaryId);

      if (error) throw error;
      alert('Diary saved!');
    } catch (error) {
      console.error('Error saving diary:', error);
      alert('Failed to save diary');
    }
    setSaving(false);
  };

  const saveEntry = async () => {
    if (!entryContent.trim()) {
      alert('Entry content cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const wordCount = entryContent.trim().split(/\s+/).length;

      if (selectedEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('entries')
          .update({
            title: entryTitle,
            content: entryContent,
            entry_date: entryDate,
            word_count: wordCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedEntry.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('entries')
          .insert({
            diary_id: diaryId,
            title: entryTitle,
            content: entryContent,
            entry_date: entryDate,
            word_count: wordCount,
          });

        if (error) throw error;
      }

      fetchEntries();
      clearEntryForm();
      alert('Entry saved!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    }
    setSaving(false);
  };

  const loadEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryDate(entry.entry_date);
  };

  const clearEntryForm = () => {
    setSelectedEntry(null);
    setEntryTitle('');
    setEntryContent('');
    setEntryDate(new Date().toISOString().split('T')[0]);
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) {
        clearEntryForm();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const wordCount = entryContent.trim() ? entryContent.trim().split(/\s+/).length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white"
              placeholder="Diary Title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-2"
              placeholder="Add a description..."
            />
          </div>
          <button
            onClick={saveDiary}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Entries List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Entries</h2>
                <button
                  onClick={clearEntryForm}
                  className="p-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-900"
                />
              </div>

              {/* Entries */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEntries.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No entries yet</p>
                ) : (
                  filteredEntries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => loadEntry(entry)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedEntry?.id === entry.id
                          ? 'bg-[#ff6b35] text-white'
                          : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs opacity-75">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEntry(entry.id);
                          }}
                          className="text-xs opacity-75 hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="font-medium text-sm line-clamp-1">
                        {entry.title || 'Untitled'}
                      </p>
                      <p className="text-xs opacity-75 line-clamp-2 mt-1">
                        {entry.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Entry Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-900"
                  />
                </div>

                {/* Entry Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                  <input
                    type="text"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                    placeholder="Entry title..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-900"
                  />
                </div>

                {/* Entry Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Content</label>
                    <span className="text-sm text-gray-500">{wordCount} words</span>
                  </div>
                  <textarea
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    placeholder="What's on your mind today?"
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent bg-white dark:bg-gray-900 resize-none"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={saveEntry}
                  disabled={saving || !entryContent.trim()}
                  className="w-full py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#ff5722] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : selectedEntry ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }
