# Google Play — closed testing → production playbook

For **personal developer accounts created after 13 Nov 2023**, Play requires a
closed test with **≥12 testers opted in continuously for ≥14 days** before you
can apply for production access. This file is the release-side checklist and the
Play Console click-path. Tester outreach copy lives in
[`tester-recruitment.md`](./tester-recruitment.md).

App facts (keep these consistent everywhere):

| | |
|---|---|
| App name | Aksara Bali Converter |
| Package | `xyz.doniwirawan.aksara_bali_mobile` |
| Version | 1.5.2 (versionCode 8) |
| Website | https://aksarabali.doniwirawan.xyz |
| Privacy policy | https://aksarabali.doniwirawan.xyz/privacy |
| Data collected | None — app is fully offline, no accounts |

---

## 1. Build the Play AAB

**Always pass `--dart-define=PLAY_STORE=true` for anything you upload to Play.**

```bash
cd mobile-app
flutter build appbundle --release --dart-define=PLAY_STORE=true
# → build/app/outputs/bundle/release/app-release.aab
```

Without the flag, the About screen ships a "Check for updates" button that
fetches the GitHub releases API and offers a direct `.apk` download. Distributing
or self-updating an app outside Play violates Play's **Device and Network Abuse**
policy and is a likely rejection — especially on a new personal account. The flag
compiles that path out entirely (verified: the GitHub API URL is absent from the
resulting `libapp.so`).

The **GitHub-distributed APK is unaffected** — build it without the flag and it
keeps the updater:

```bash
flutter build apk --release --split-per-abi   # GitHub Releases build, updater intact
```

## 2. Pre-upload checklist

- [x] Release signed by the upload key (`android/key.properties` present, gitignored)
- [x] `targetSdk` 36 — meets Play's requirement (deadline 31 Aug 2026)
- [x] `minSdk` 24 (needed by `flutter_tts`)
- [x] No `INTERNET`-dependent features in the Play build (updater compiled out)
- [ ] **Back up `android/app/upload-keystore.jks`** somewhere off this machine.
      Losing it blocks all future updates. Enrolling in **Play App Signing**
      (offered on first upload — accept it) means Google holds the *app signing*
      key and you can reset a lost *upload* key, so this is much less scary. Accept it.
- [ ] **Fresh screenshots.** The ones in `docs/screenshots/` are from v1.1.0 and
      one shows a **Reference/Learn tab that no longer exists** (removed in 1.5.x).
      A listing that advertises a missing screen gets flagged. Recapture on a
      1080×2400 emulator: **Convert · Write · Quiz · About** (min 2, max 8).
- [ ] **Privacy policy must cover the Android app.** The current
      `/privacy` page reads as a *website* policy and never mentions the app,
      Android, or Google Play. Play requires the linked policy to explicitly
      cover the app you're publishing. Add a short "Mobile app (Android)"
      section stating: no data collected, no accounts, runs entirely on-device.

## 3. Store listing assets you'll need

| Asset | Spec |
|---|---|
| App icon | 512×512 PNG (32-bit, no alpha) |
| Feature graphic | 1024×500 PNG/JPG — **required**, easy to forget |
| Phone screenshots | 2–8, 1080×2400 works |
| Short description | ≤80 chars |
| Full description | ≤4000 chars |

**Short description (ID, 74 chars):**
> Ubah Latin ke aksara Bali, latih menulis, dan uji kemampuan lewat kuis.

**Full description (ID)** — draft, edit to taste:
> Aksara Bali Converter adalah alat edukasi gratis untuk belajar dan melestarikan
> aksara Bali. Seluruh fitur berjalan **sepenuhnya offline** di perangkat Anda —
> tanpa akun, tanpa iklan, tanpa pengumpulan data.
>
> **Fitur**
> • **Konversi dua arah** — Latin → aksara Bali dan sebaliknya, lengkap dengan
>   dukungan diakritik (ā ī ū ě ṇ) dan deteksi bentuk Sanskerta (murda).
> • **Panel gaya** — atur ukuran huruf, perataan, warna teks dan latar, lalu
>   bagikan hasilnya sebagai gambar.
> • **Latihan menulis** — telusuri bentuk aksara di kanvas dan dapatkan skor
>   otomatis berdasarkan ketepatan goresan Anda.
> • **Kuis berjenjang** — 6 tingkat, dari Pemula hingga GrandMaster, dengan mode
>   **Membaca** (pilihan ganda) dan **Menulis** (mengetik dengan papan ketik
>   aksara Bali di layar). Skor terbaik tersimpan di perangkat.
> • **Dwibahasa** — antarmuka Indonesia dan Inggris.
>
> Cocok untuk pelajar, mahasiswa, guru, dan siapa saja yang ingin membaca dan
> menulis aksara Bali.

## 4. Play Console click-path

### 4a. Create the app
1. **Play Console → All apps → Create app.**
2. App name `Aksara Bali Converter` · default language **Indonesian (Bahasa Indonesia)** ·
   type **App** · **Free**.
3. Accept the declarations → **Create app**.

### 4b. Clear the Dashboard setup tasks
Under **Dashboard → Set up your app**, work top to bottom. All of these must be
green before Play lets you roll out even a closed test:

- **App access** — "All functionality is available without special access" (no accounts).
- **Ads** — **No**, the app contains no ads.
- **Content rating** — fill the questionnaire; an offline education app with no
  user content rates **Everyone / 3+**.
- **Target audience** — pick 13+ (or 18+) to stay out of the Families programme
  and its extra requirements, unless you specifically want under-13.
- **Data safety** — **No data collected, no data shared.** True here: the app has
  no accounts, no analytics, no network calls in the Play build.
  Also declare **no advertising ID**.
- **Government apps** — No. **Financial features** — None. **Health** — No.
- **Privacy policy** — `https://aksarabali.doniwirawan.xyz/privacy`
  (⚠️ update that page first — see §2).
- **Store listing** — name, descriptions, icon, feature graphic, screenshots.

### 4c. Create the closed test
1. **Test and release → Testing → Closed testing.**
2. Play gives you a default track named **Alpha**. Either use it or
   **Create track**. *(The track that counts toward the 14-day rule is whichever
   closed track your testers are opted into — Alpha is fine.)*
3. **Testers** tab → **Create email list** → name it e.g. `Aksara Bali Testers` →
   paste tester Gmail addresses (one per line, or upload CSV) → **Save**.
   - Addresses must be the **Google account each tester uses on the Play Store**.
     A non-Google email will silently never see the app.
4. **Create new release** → upload `app-release.aab` →
   accept **Play App Signing** when prompted.
5. Release name `1.5.1 (7)`, write release notes → **Next** → **Save and publish**.
6. Back on the **Testers** tab, copy the **"Copy link"** opt-in URL
   (looks like `https://play.google.com/apps/testing/xyz.doniwirawan.aksara_bali_mobile`).
   **This is the link you send testers.** It is the only way they can join.

> **The live links for this app:**
> - Closed-test opt-in — <https://play.google.com/apps/testing/xyz.doniwirawan.aksara_bali_mobile>
> - Store listing — <https://play.google.com/store/apps/details?id=xyz.doniwirawan.aksara_bali_mobile>
> - Internal track — <https://play.google.com/apps/internaltest/4700728977787153239>
>   (installs right away for accounts on the internal list, but those testers do
>   **not** count toward the 14-day requirement)

### 4d. The 14 days
- The clock starts when a tester **opts in via the link**, not when you add their
  email to the list. Adding 12 emails does nothing on its own — chase the opt-ins.
- Testers must **stay opted in continuously**. If someone leaves the programme and
  rejoins, their clock restarts.
- Aim for **14–16 testers**, not exactly 12. People drop out, use the wrong email,
  or never click the link, and you only find out on day 13.
- Keep them *using* the app. Play explicitly rejects applications where testers
  "were not engaged." See the engagement plan in `tester-recruitment.md`.
- Check **Ratings and reviews → Testing feedback** for private tester feedback.
  Ship at least one update during the window in response to it — it makes the
  "what did you change" answer in §5 real rather than invented.

## 5. Apply for production

After ≥12 testers have been opted in for ≥14 continuous days:
**Dashboard → Apply for production.** Draft answers are in
[`play-production-answers.md`](./play-production-answers.md).

Review takes ~7 days. If rejected, the usual causes are too few opted-in testers,
testers who never opened the app, or vague questionnaire answers.
