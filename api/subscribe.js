// POST /api/subscribe — adds an email to a Mailjet contact list.
//
// Deployed automatically by Vercel as a Serverless Function (the /api folder),
// alongside the static Astro site. No npm dependencies: it calls the Mailjet
// REST API directly with fetch.
//
// REQUIRED environment variables (Vercel → Project → Settings → Environment
// Variables, for Production + Preview):
//   MJ_APIKEY_PUBLIC    your Mailjet API Key   (public)
//   MJ_APIKEY_PRIVATE   your Mailjet Secret Key (private)
// OPTIONAL:
//   MAILJET_LIST_ID     numeric ID of the contact list to add people to.
//   MAILJET_LIST_NAME   list name to find-or-create if no ID is set
//                       (default: "Sacred Intel Newsletter").
//
// Keys are never stored in this repo. The browser only sends { email }.

var API = 'https://api.mailjet.com/v3/REST';

function readRawBody(req) {
  return new Promise(function (resolve) {
    var data = '';
    req.on('data', function (chunk) { data += chunk; });
    req.on('end', function () { resolve(data); });
    req.on('error', function () { resolve(''); });
  });
}

function validEmail(e) {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  var pub = process.env.MJ_APIKEY_PUBLIC;
  var priv = process.env.MJ_APIKEY_PRIVATE;
  if (!pub || !priv) {
    return res.status(500).json({ error: 'The newsletter isn’t connected yet. Add your Mailjet keys in Vercel.' });
  }
  var auth = 'Basic ' + Buffer.from(pub + ':' + priv).toString('base64');

  // Parse body (pre-parsed by Vercel, or raw JSON / form-encoded).
  var body = req.body;
  if (!body || typeof body === 'string') {
    var raw = body || (await readRawBody(req)) || '';
    try {
      body = JSON.parse(raw);
    } catch (e) {
      body = {};
      // application/x-www-form-urlencoded fallback
      try { new URLSearchParams(raw).forEach(function (v, k) { body[k] = v; }); } catch (_) {}
    }
  }

  var email = body && typeof body.email === 'string' ? body.email.trim() : '';
  var name = body && typeof body.name === 'string' ? body.name.trim() : '';
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  async function mj(method, path, payload) {
    var r = await fetch(API + path, {
      method: method,
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    var data = null;
    try { data = await r.json(); } catch (_) {}
    return { ok: r.ok, status: r.status, data: data };
  }

  try {
    // 1) Resolve the target list.
    var listId = process.env.MAILJET_LIST_ID && String(process.env.MAILJET_LIST_ID).trim();
    var listName = (process.env.MAILJET_LIST_NAME || 'Sacred Intel Newsletter').trim();

    if (!listId) {
      var found = await mj('GET', '/contactslist?Name=' + encodeURIComponent(listName) + '&Limit=1');
      if (found.ok && found.data && found.data.Count > 0 && found.data.Data[0]) {
        listId = String(found.data.Data[0].ID);
      } else {
        var created = await mj('POST', '/contactslist', { Name: listName });
        if (created.ok && created.data && created.data.Data && created.data.Data[0]) {
          listId = String(created.data.Data[0].ID);
        } else {
          return res.status(502).json({ error: 'Could not reach the newsletter list. Please try again.' });
        }
      }
    }

    // 2) Add (or re-add) the contact to the list. managecontact creates the
    //    contact if needed. "addnoforce" respects anyone who unsubscribed.
    var sub = await mj('POST', '/contactslist/' + listId + '/managecontact', {
      Email: email,
      Action: 'addnoforce',
      Name: name || undefined,
    });

    if (!sub.ok) {
      var msg = (sub.data && (sub.data.ErrorMessage || sub.data.ErrorInfo)) || 'Subscription failed. Please try again.';
      return res.status(502).json({ error: msg });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach the newsletter service. Please try again.' });
  }
};
