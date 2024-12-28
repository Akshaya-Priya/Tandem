import { createClient } from '@supabase/supabase-js';
import { type User } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SignUp: Create user in Supabase auth and insert user data into a database table.
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('User data is null');

  // Insert user into the database (users table) after successful sign-up
  const { error: insertError } = await supabase
    .from('users')
    .insert([{ id: data.user.id, email, name }]);

  if (insertError) throw insertError;

  return data;
}

// SignIn: Log in the user with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// SignOut: Log out the user
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ResetPassword: Reset password by email
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// Update Password: Update the password for the logged-in user
export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

// Get the authenticated user from Supabase auth
export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
}
