'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function validateTokenAction(token: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('voters')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('validateTokenAction error:', error);
    return { data: null, error: error.message };
  }
}

export async function submitVoteAction(voterId: string, candidateId: string) {
  try {
    // 1. Insert vote
    const { error: voteError } = await supabaseAdmin
      .from('votes')
      .insert([{
        voter_id: voterId,
        candidate_id: candidateId,
        waktu_voting: new Date().toISOString()
      }]);

    if (voteError) throw voteError;

    // 2. Update voter status
    const { error: updateError } = await supabaseAdmin
      .from('voters')
      .update({ status: 'Sudah Memilih' })
      .eq('id', voterId);

    if (updateError) throw updateError;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('submitVoteAction error:', error);
    return { success: false, error: error.message || 'Gagal mengirim suara' };
  }
}
