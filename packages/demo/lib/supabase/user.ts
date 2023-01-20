import { supabase } from '.';

export async function upsertUser({
  user_id,
  userInfo,
}: {
  user_id: string;
  userInfo: {};
}) {
  const user = {
    id: user_id,
    ...userInfo,
  };
  const { data, error } = await supabase.from('users').upsert(user).select();
  return data;
}

export async function getUserByAddress({ address }: { address: string }) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('address', address);
  return data?.length == 1 ? data[0] : undefined;
}
