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

const guruNames = [
  "Hj Ida", "Olina", "Erna", "Hj Neneng", "Sarkowih", "Afwa", "Mida", 
  "Hj Novi", "Wahyuning", "Nurhasanah", "Isro", "Deskha", "Ahmad nur sobirin", 
  "Slamet Turah", "Nurhidayat", "Marlianah", "Azhar", "Ali numan", "Nursaadah", 
  "Primas", "pamela", "nailul", "eka", "barkatin", "arif falatehan", "meidiana", "nurdin"
];

async function calculateGuru() {
  console.log('Fetching guru voters by names...');
  
  const foundVoters = [];
  const notFound = [];

  for (const name of guruNames) {
    // Search with case-insensitive contains, or try to match parts
    // To handle potential variations in spacing, let's search with ilike
    const searchTerm = `%${name.toLowerCase().trim()}%`;
    const res = await fetch(`${url}/voters?nama=ilike.${encodeURIComponent(searchTerm)}&select=id,nama`, { headers });
    const match = await res.json();
    
    if (match && match.length > 0) {
      foundVoters.push(match[0]);
    } else {
      notFound.push(name);
    }
  }

  console.log(`Found ${foundVoters.length} out of ${guruNames.length} names in the database.`);
  if (notFound.length > 0) {
    console.log("Could not find exact matches for:", notFound);
  }

  const totalVoters = foundVoters.length;
  if (totalVoters === 0) return;

  const c1Count = Math.round(totalVoters * 0.10);
  const c2Count = Math.round(totalVoters * 0.20);
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
      if (voterIndex >= foundVoters.length) break;
      const voterId = foundVoters[voterIndex].id;
      
      votesToInsert.push({
        voter_id: voterId,
        candidate_id: candidate.id,
        waktu_voting: new Date().toISOString()
      });
      votersToUpdate.push(voterId);
      voterIndex++;
    }
  }

  // Insert votes
  console.log('Inserting votes for Guru...');
  const insertRes = await fetch(`${url}/votes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(votesToInsert)
  });
  if (!insertRes.ok) {
    console.error('Failed to insert votes', await insertRes.text());
    return;
  }
  
  // Update voters
  console.log('Updating Guru statuses...');
  const chunkSize = 100;
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
  
  console.log('Done processing guru.');
}

calculateGuru();
