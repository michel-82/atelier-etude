import { getStore } from '@netlify/blobs';

export default async (req) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code || !/^[A-Za-z0-9]{4,12}$/.test(code)) {
          return new Response(JSON.stringify({ error: 'Code famille invalide (4 a 12 caracteres alphanumeriques)' }), {
                  status: 400, headers: { 'Content-Type': 'application/json' }
          });
    }

    const store = getStore('atelier-etude-data');
    const blobKey = `family-${code.toLowerCase()}.json`;

    if (req.method === 'GET') {
          try {
                  const data = await store.get(blobKey, { type: 'json' });
                  return new Response(JSON.stringify({ assignments: data?.assignments || [] }), {
                            status: 200, headers: { 'Content-Type': 'application/json' }
                  });
          } catch (err) {
                  return new Response(JSON.stringify({ error: err.message }), {
                            status: 500, headers: { 'Content-Type': 'application/json' }
                  });
          }
    }

    if (req.method === 'POST') {
          try {
                  const body = await req.json();
                          const assignments = Array.isArray(body.assignments) ? body.assignments : [];
                  await store.setJSON(blobKey, { assignments, updatedAt: new Date().toISOString() });
                  return new Response(JSON.stringify({ ok: true, count: assignments.length }), {
                            status: 200, headers: { 'Content-Type': 'application/json' }
                  });
          } catch (err) {
                  return new Response(JSON.stringify({ error: err.message }), {
                            status: 500, headers: { 'Content-Type': 'application/json' }
                  });
          }
    }

    return new Response(JSON.stringify({ error: 'Methode non autorisee' }), {
          status: 405, headers: { 'Content-Type': 'application/json' }
    });
};
