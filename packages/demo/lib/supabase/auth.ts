import { supabase } from '.';

export async function createUser({ address }: { address: string }) {
  // const { data, error } = await supabase.auth.signUp({
  //   email: `${address}@email.com`,
  //   password: address,
  // });

  const { data, error } = await supabase.auth.admin.createUser({
    email: `${address}@email.com`,
    password: address,
    email_confirm: true,
  });

  if (error) {
    console.error(error);
  }

  return data;
}

export async function signinUser({ address }: { address: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${address}@email.com`,
    password: address,
  });
  if (error) {
    console.error(error);
  }
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return data;
}
