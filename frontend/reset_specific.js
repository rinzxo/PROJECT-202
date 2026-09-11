const url = "https://reneacacfdielrdpytbk.supabase.co/rest/v1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmVhY2FjZmRpZWxyZHB5dGJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY2ODQwMCwiZXhwIjoyMTA0MjQ0NDAwfQ.kiF8aOpBqFBmE_drIi2rkABNNPk4JapaLzuCqLBwd8g";

const headers = {
  "apikey": key,
  "Authorization": `Bearer ${key}`,
  "Content-Type": "application/json"
};

const names = ["berna"];

async function resetVoters() {
  console.log('Fetching berna...');

  const voterIds = [];

  for (const name of names) {
    const searchTerm = `%${name}%`;
    const res = await fetch(`${url}/voters?nama=ilike.${encodeURIComponent(searchTerm)}&select=id,nama`, { headers });
    const match = await res.json();

    if (match && match.length > 0) {
      console.log(`Found: ${match[0].nama} (${match[0].id})`);
      voterIds.push(match[0].id);
    } else {
      console.log(`Could not find: ${name}`);
    }
  }

  if (voterIds.length === 0) {
    console.log("No voters found to reset.");
    return;
  }

  console.log('Deleting their votes...');
  const deleteRes = await fetch(`${url}/votes?voter_id=in.(${voterIds.join(',')})`, {
    method: 'DELETE',
    headers
  });

  if (!deleteRes.ok) {
    console.error('Failed to delete votes:', await deleteRes.text());
  } else {
    console.log('Votes deleted.');
  }

  console.log('Resetting their status to Belum Memilih...');
  const updateRes = await fetch(`${url}/voters?id=in.(${voterIds.join(',')})`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'Belum Memilih' })
  });

  if (!updateRes.ok) {
    console.error('Failed to reset status:', await updateRes.text());
  } else {
    console.log('Status reset successfully.');
  }
}

resetVoters();
