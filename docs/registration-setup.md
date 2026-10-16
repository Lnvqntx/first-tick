# Registration setup (Google Sheet + Apps Script)

The website does not store anything itself. Registrations are sent to a
small Google Apps Script web app that appends them to a Google Sheet the
club owns. Until the endpoint is set, the form runs in **demo mode**:
nothing is sent and the success screen says "Demo mode, nothing was saved".

## 1. Create the Sheet

1. Sign in with the **club's** Google account (not a personal one).
2. Create a new Google Sheet, for example "First Tick registrations".
   You do not need to add headers; the script adds the header row
   (`Timestamp, Full name, Email, Year, Branch, WhatsApp, Experience`)
   on the first registration.

## 2. Add the script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the sample code and paste the whole of `docs/apps-script.gs`.
3. Save (name the project "First Tick registration").

## 3. Deploy as a web app

1. **Deploy → New deployment**, type **Web app**.
2. Execute as: **Me** (the club account).
3. Who has access: **Anyone**. (Required so students' browsers can post
   without signing in. The URL only accepts registrations; it never
   returns the Sheet's data.)
4. Click **Deploy**, approve the permissions, and copy the **Web app URL**
   (it ends in `/exec`).
5. Open the URL in a browser. You should see
   `{"ok":true,"service":"first-tick-registration"}`.

## 4. Connect the site

1. In `src/config/event.ts`, set
   `links.registrationEndpoint` to the `/exec` URL.
2. Run `npm run build`, commit and push. Vercel redeploys automatically.
3. Register once with a test email on the live site. Check the row in the
   Sheet, then submit the same email again: you should see
   "This email is already registered".
4. Delete the test row.

## Updating the script later

Edit the code, then **Deploy → Manage deployments → (pencil) → Version:
New version → Deploy**. This keeps the same URL. Creating a *new*
deployment gives a new URL, which you would then have to update in
`event.ts`.

## How it behaves

| Situation | Response | What the student sees |
|---|---|---|
| Saved | `{ ok: true }` | Confirmation and WhatsApp buttons |
| Email already in the Sheet | `{ ok: false, error: 'duplicate' }` | "This email is already registered…" |
| Missing / malformed data | `{ ok: false, error: 'missing_fields' \| 'invalid_email' \| 'invalid_json' }` | "We could not save your registration…" |
| Script error | `{ ok: false, error: 'server_error' }` | Same as above |
| No network | (fetch fails) | "Network problem…" |

Notes:
- The site sends the JSON body as `Content-Type: text/plain` so the
  browser skips the CORS preflight, which Apps Script cannot answer.
- A script lock makes duplicate checks safe when two people submit at once.
- Values starting with `=`, `+`, `-` or `@` are stored as text so they
  cannot run as formulas.
- Only the six form fields plus a timestamp are stored.

## Privacy

Share the Sheet only with the organisers who need it. After the event
(once certificates are issued), consider deleting the WhatsApp numbers
column. The site promises that details are used only to run First Tick.
