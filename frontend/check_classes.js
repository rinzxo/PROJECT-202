const url = "https://reneacacfdielrdpytbk.supabase.co/rest/v1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmVhY2FjZmRpZWxyZHB5dGJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY2ODQwMCwiZXhwIjoyMTA0MjQ0NDAwfQ.kiF8aOpBqFBmE_drIi2rkABNNPk4JapaLzuCqLBwd8g";

const headers = {
  "apikey": key,
  "Authorization": `Bearer ${key}`,
  "Content-Type": "application/json"
};

async function checkClasses() {
  const res = await fetch(`${url}/voters?status=eq.Sudah%20Memilih&select=kelas`, { headers });
  const voters = await res.json();
  
  const classCount = {};
  voters.forEach(v => {
    classCount[v.kelas] = (classCount[v.kelas] || 0) + 1;
  });
  
  console.log("Sudah Memilih distribution by class:");
  for (const [cls, count] of Object.entries(classCount)) {
    console.log(`${cls}: ${count}`);
  }
}

checkClasses();
