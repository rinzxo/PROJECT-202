const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://reneacacfdielrdpytbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmVhY2FjZmRpZWxyZHB5dGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Njg0MDAsImV4cCI6MjEwNDI0NDQwMH0.CoSYgUN2sfXGaX0AprJT4RvXjCk4CkCBBRpjujByQWU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('voters').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
