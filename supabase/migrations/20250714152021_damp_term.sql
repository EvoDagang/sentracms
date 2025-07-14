-- Drop the existing restrictive insert policy for user_profiles
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;

-- Create a more permissive insert policy for user_profiles
CREATE POLICY "Allow authenticated users to insert user profiles" 
ON user_profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Also update the select policy to be more permissive
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
CREATE POLICY "Allow authenticated users to read user profiles" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Update the update policy
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_profiles;
CREATE POLICY "Allow authenticated users to update user profiles" 
ON user_profiles 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update the delete policy
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON user_profiles;
CREATE POLICY "Allow authenticated users to delete user profiles" 
ON user_profiles 
FOR DELETE 
TO authenticated 
USING (true);