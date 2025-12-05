# Supabase Database Setup

## 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project

## 2. Get Your Credentials
1. Go to Project Settings > API
2. Copy `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add these to your `.env.local` file

## 3. Create Database Tables

Go to SQL Editor in Supabase and run these queries:

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  bio TEXT,
  profile_picture TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
  provider TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Diaries Table
```sql
CREATE TABLE diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_18_plus BOOLEAN DEFAULT FALSE,
  allow_download BOOLEAN DEFAULT TRUE,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_diaries_published ON diaries(is_published);
```

### Entries Table
```sql
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  entry_date DATE NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entries_diary_id ON entries(diary_id);
CREATE INDEX idx_entries_date ON entries(entry_date);
```

### Publication Requests Table
```sql
CREATE TABLE publication_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diary_id UUID REFERENCES diaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pub_requests_status ON publication_requests(status);
CREATE INDEX idx_pub_requests_user_id ON publication_requests(user_id);
```

## 4. Enable Row Level Security (RLS)

For security, enable RLS on all tables:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_requests ENABLE ROW LEVEL SECURITY;

-- Users: Can read all, but only update their own
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Diaries: Can read published ones, or own diaries
CREATE POLICY "Anyone can view published diaries"
  ON diaries FOR SELECT
  USING (is_published = true OR user_id = auth.uid());

CREATE POLICY "Users can manage own diaries"
  ON diaries FOR ALL
  USING (user_id = auth.uid());

-- Entries: Can read if diary is published or owned
CREATE POLICY "Users can view entries of published/own diaries"
  ON entries FOR SELECT
  USING (
    diary_id IN (
      SELECT id FROM diaries 
      WHERE is_published = true OR user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own entries"
  ON entries FOR ALL
  USING (
    diary_id IN (
      SELECT id FROM diaries WHERE user_id = auth.uid()
    )
  );

-- Publication Requests: Admins can view all, users can view their own
CREATE POLICY "Users can view own publication requests"
  ON publication_requests FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'owner')
  ));

CREATE POLICY "Users can create publication requests"
  ON publication_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

## 5. Test Your Setup

Run this query to verify:
```sql
SELECT * FROM users LIMIT 1;
```

If it works, your database is ready! 🎉
