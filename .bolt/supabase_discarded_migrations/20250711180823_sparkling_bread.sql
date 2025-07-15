/*
  # Create tags table for global tag management

  1. New Tables
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `color` (text, default color)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tags` table
    - Add policies for authenticated users to manage tags
*/

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all tags
CREATE POLICY "Users can read all tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to create tags
CREATE POLICY "Users can create tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update tags
CREATE POLICY "Users can update tags"
  ON tags
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete tags
CREATE POLICY "Users can delete tags"
  ON tags
  FOR DELETE
  TO authenticated
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default tags
INSERT INTO tags (name, color) VALUES
  ('VIP', '#F59E0B'),
  ('Premium', '#8B5CF6'),
  ('New', '#10B981'),
  ('Priority', '#EF4444'),
  ('Enterprise', '#6366F1')
ON CONFLICT (name) DO NOTHING;