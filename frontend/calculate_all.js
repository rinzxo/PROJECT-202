const url = "https://reneacacfdielrdpytbk.supabase.co/rest/v1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmVhY2FjZmRpZWxyZHB5dGJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY2ODQwMCwiZXhwIjoyMTA0MjQ0NDAwfQ.kiF8aOpBqFBmE_drIi2rkABNNPk4JapaLzuCqLBwd8g";

const headers = {
  "apikey": key,
  "Authorization": `Bearer ${key}`,
  "Content-Type": "application/json"
};

const candidate1Id = 'c89f698b-bae4-436b-a43e-b5a764e06205'; // 10%
const candidate2Id = '224b9fd4-6bfc-412f-a5cc-f58e64a9280e'; // 20%
const candidate3Id = 'a38c36ca-6758-43c0-b91c-64ac6a49bf85'; // 70%

const targetClasses = [
  "XII A", "XII B", "XII C", "XII D", "XII E", "XII F", "XII G", "XII H", "XII I", "XII J",
  "XI A", "XI B", "XI C", "XI D", "XI E", "XI F", "XI G", "XI H", "XI I", "XI J",
  "X A", "X B", "X C"
];

async function calculateAll() {
  console.log('Fetching all votes to delete them temporarily...');
  await fetch(`${url}/votes?voter_id=not.is.null`, { method: 'DELETE', headers });
  
  console.log('Resetting all voter statuses to Belum Memilih...');
  await fetch(`${url}/voters?id=not.is.null`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'Belum Memilih' })
  });

  console.log('Fetching ALL voters from target classes...');
  
  const classFilter = targetClasses.join(',');
  const res = await fetch(`${url}/voters?kelas=in.(${encodeURIComponent(classFilter)})&select=id`, { headers });
  const voters = await res.json();
  
  const totalVoters = voters.length;
  console.log(`Found exactly ${totalVoters} voters in target classes (12A-10C).`);
  
  // Calculate counts based on percentages
  const c1Count = Math.round(totalVoters * 0.10);
  const c2Count = Math.round(totalVoters * 0.20);
  // Ensure the total perfectly matches totalVoters by giving the remainder to candidate 3
  const c3Count = totalVoters - c1Count - c2Count;

  const voteCounts = [
    { id: candidate1Id, count: c1Count, name: 'KAMILLA' },
    { id: candidate2Id, count: c2Count, name: 'ATHALLAH' },
    { id: candidate3Id, count: c3Count, name: 'KHANZA' }
  ];

  console.log(`Distribution: KAMILLA (${c1Count}), ATHALLAH (${c2Count}), KHANZA (${c3Count})`);

  let voterIndex = 0;
  const votesToInsert = [];
  const votersToUpdate = [];

  for (const candidate of voteCounts) {
    for (let i = 0; i < candidate.count; i++) {
      if (voterIndex >= voters.length) break;
      const voterId = voters[voterIndex].id;
      
      votesToInsert.push({
        voter_id: voterId,
        candidate_id: candidate.id,
        waktu_voting: new Date().toISOString()
      });
      votersToUpdate.push(voterId);
      voterIndex++;
    }
  }

  // Insert votes in chunks
  console.log('Inserting votes in chunks...');
  const chunkSize = 100;
  for (let i = 0; i < votesToInsert.length; i += chunkSize) {
    const chunk = votesToInsert.slice(i, i + chunkSize);
    const insertRes = await fetch(`${url}/votes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(chunk)
    });
    if (!insertRes.ok) {
      console.error('Failed to insert votes', await insertRes.text());
      return;
    }
  }
  
  // Update voters in chunks
  console.log('Updating voters in chunks...');
  for (let i = 0; i < votersToUpdate.length; i += chunkSize) {
    const chunkIds = votersToUpdate.slice(i, i + chunkSize);
    const updateRes = await fetch(`${url}/voters?id=in.(${chunkIds.join(',')})`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Sudah Memilih' })
    });
    
    if (!updateRes.ok) {
      console.error(`Failed chunk ${i}`, await updateRes.text());
    }
  }
  
  console.log('Done fixing all voter classes to 100% participation with exact percentages.');
}

calculateAll();
