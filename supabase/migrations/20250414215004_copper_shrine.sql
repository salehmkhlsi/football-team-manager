/*
  # Initial Schema Setup for Football Academy Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, linked to auth.users)
      - `full_name` (text)
      - `role` (text: admin, coach, player)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `players`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `national_id` (text)
      - `birth_date` (date)
      - `position` (text)
      - `team` (text)
      - `height` (numeric)
      - `weight` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `evaluations`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `coach_id` (uuid, references profiles)
      - `passing` (integer)
      - `shooting` (integer)
      - `dribbling` (integer)
      - `technique` (integer)
      - `tactical` (integer)
      - `physical` (integer)
      - `speed` (integer)
      - `aerial` (integer)
      - `defending` (integer)
      - `morale` (integer)
      - `notes` (text)
      - `evaluation_date` (date)
      - `created_at` (timestamp)
    
    - `attendance`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `session_date` (date)
      - `status` (text: present, absent, late)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'coach', 'player')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create players table
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  national_id text UNIQUE,
  birth_date date NOT NULL,
  position text,
  team text,
  height numeric,
  weight numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create evaluations table
CREATE TABLE evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) NOT NULL,
  coach_id uuid REFERENCES profiles(id) NOT NULL,
  passing integer CHECK (passing BETWEEN 1 AND 10),
  shooting integer CHECK (shooting BETWEEN 1 AND 10),
  dribbling integer CHECK (dribbling BETWEEN 1 AND 10),
  technique integer CHECK (technique BETWEEN 1 AND 10),
  tactical integer CHECK (tactical BETWEEN 1 AND 10),
  physical integer CHECK (physical BETWEEN 1 AND 10),
  speed integer CHECK (speed BETWEEN 1 AND 10),
  aerial integer CHECK (aerial BETWEEN 1 AND 10),
  defending integer CHECK (defending BETWEEN 1 AND 10),
  morale integer CHECK (morale BETWEEN 1 AND 10),
  notes text,
  evaluation_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) NOT NULL,
  session_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Players policies
CREATE POLICY "Players are viewable by authenticated users"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert players"
  ON players FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update players"
  ON players FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Evaluations policies
CREATE POLICY "Evaluations are viewable by authenticated users"
  ON evaluations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches and admins can insert evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coach')
    )
  );

-- Attendance policies
CREATE POLICY "Attendance records are viewable by authenticated users"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches and admins can manage attendance"
  ON attendance FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coach')
    )
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();