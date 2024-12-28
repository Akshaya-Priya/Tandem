/*
  # Update schema for enhanced volunteer management

  1. Changes
    - Modified Users table to include organizer role
    - Added Organizers table
    - Updated Events table to link with organizers
    - Simplified VolunteerParticipation table
    - Updated RLS policies for new schema

  2. New Tables
    - Organizers:
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - specialization (text)
      - created_at (timestamptz)

  3. Security
    - Added RLS policies for Organizers table
    - Updated existing policies for new roles
*/

-- Modify Users table to support organizer role
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'organizer', 'volunteer'));

-- Create Organizers table
CREATE TABLE IF NOT EXISTS organizers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Update Events table
ALTER TABLE events
ADD COLUMN organizer_id uuid REFERENCES users(id) ON DELETE CASCADE;

-- Enable RLS on new table
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- Organizers policies
CREATE POLICY "Organizers can view their own profile"
  ON organizers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all organizers"
  ON organizers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage organizers"
  ON organizers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update Events policies for organizers
CREATE POLICY "Organizers can manage their events"
  ON events FOR ALL
  USING (
    organizer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update Participations policies for organizers
CREATE POLICY "Organizers can view their event participations"
  ON participations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = participations.event_id
      AND events.organizer_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );