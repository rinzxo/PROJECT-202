const url = "https://reneacacfdielrdpytbk.supabase.co/rest/v1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmVhY2FjZmRpZWxyZHB5dGJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY2ODQwMCwiZXhwIjoyMTA0MjQ0NDAwfQ.kiF8aOpBqFBmE_drIi2rkABNNPk4JapaLzuCqLBwd8g";

const headers = {
  "apikey": key,
  "Authorization": `Bearer ${key}`,
  "Content-Type": "application/json"
};

async function updateVoters() {
  console.log('Fetching votes...');
  const res = await fetch(`${url}/votes?select=voter_id`, { headers });
  const votes = await res.json();
  
  const voterIds = votes.map(v => v.voter_id);
  console.log(`Found ${voterIds.length} votes. Updating voters...`);
  
  const chunkSize = 100;
  for (let i = 0; i < voterIds.length; i += chunkSize) {
    const chunkIds = voterIds.slice(i, i + chunkSize);
    const updateRes = await fetch(`${url}/voters?id=in.(${chunkIds.join(',')})`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Sudah Memilih' })
    });
    
    if (!updateRes.ok) {
      console.error(`Failed chunk ${i}`, await updateRes.text());
    } else {
      console.log(`Updated chunk ${i / chunkSize + 1}`);
    }
  }
  console.log('Done.');
}

updateVoters();
