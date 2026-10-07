const { put, get } = require('@vercel/blob');

const PATH = 'comments.json';

async function readAll() {
  const r = await get(PATH, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return {};
  const text = await new Response(r.stream).text();
  try { return JSON.parse(text); } catch (e) { return {}; }
}

async function writeAll(data) {
  await put(PATH, JSON.stringify(data), {
    access: 'private',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

const okKey = (k) => typeof k === 'string' && /^[\w.\-]{1,60}$/.test(k);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const all = await readAll();
      const key = req.query.key;
      if (!okKey(key)) return res.status(400).json({ error: 'bad key' });
      return res.status(200).json(all[key] || []);
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { key } = body;
    if (!okKey(key)) return res.status(400).json({ error: 'bad key' });
    const all = await readAll();
    const list = all[key] || [];
    if (req.method === 'POST') {
      const { id, x, y, text } = body;
      if (typeof text !== 'string' || !text.trim() || typeof id !== 'string' || !/^[\w-]{1,40}$/.test(id)
        || typeof x !== 'number' || typeof y !== 'number') return res.status(400).json({ error: 'bad comment' });
      const item = { id, x, y, text: text.trim().slice(0, 1000), at: Date.now() };
      if (Number.isInteger(body.a) && body.a >= 0 && body.a < 20) item.a = body.a;
      list.push(item);
      if (list.length > 300) list.shift();
    } else if (req.method === 'PUT') {
      const c = list.find((it) => it.id === body.id);
      if (c && typeof body.x === 'number' && typeof body.y === 'number') { c.x = body.x; c.y = body.y; }
    } else if (req.method === 'DELETE') {
      const i = list.findIndex((c) => c.id === body.id);
      if (i >= 0) list.splice(i, 1);
    } else {
      return res.status(405).json({ error: 'method' });
    }
    all[key] = list;
    await writeAll(all);
    return res.status(200).json(list);
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
