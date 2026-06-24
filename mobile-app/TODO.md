# Aksara Bali — Mobile App (handoff & TODO)

Flutter app **`aksara_bali_mobile`** (`mobile-app/`). Single source of truth to
continue in a fresh session.

## Context
- **Runs fully on-device** — no API needed. Transliteration + word list are bundled.
- **Flutter** 3.27.2 / Dart 3.6.1 (`C:\Users\doniw\dev\flutter`).
- **Android build chain**: Gradle 8.7, AGP 8.6.0, Kotlin 2.2.0, target SDK 35, JDK = Android Studio JBR 21.
- **Emulator**: `Medium_Phone_API_35` (`emulator-5554`). adb at `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`.
- **Run**: `cd mobile-app && flutter pub get && flutter run -d emulator-5554` (or `-d chrome`).
- **Check**: `flutter analyze` (clean), `flutter test` (passes).
- **Key files**: `lib/main.dart` (5-tab shell), `lib/converter.dart` (engine),
  `lib/words_data.dart`, `lib/sanskrit_data.dart`, `lib/balinese_keyboard.dart`,
  `lib/screens/{convert,write,quiz,about}_screen.dart`, `lib/theme.dart`.
- **Regenerate data**: `node scripts/gen_words.py`-style via `python scripts/gen_words.py`
  (pipe `/api/words`) and `node scripts/gen_sanskrit.mjs`.

## ✅ Done
- [x] Scaffold (Android + iOS + web), package `xyz.doniwirawan.aksara_bali_mobile`
- [x] 5 tabs: **Convert · Write · Quiz · Learn · About**, web-matching design (blue/Inter, logo header)
- [x] Bundled **Noto Sans Balinese** font; **launcher icon** (real logo) + splash
- [x] **On-device converter** ported 1:1 from web: `latinToBalinese` + `balineseToLatin`
      (two-way), Sanskrit detection + murda toggle, full mapping
- [x] **Two-way** Convert with swap toggle; **Balinese on-screen keyboard** for reverse input
- [x] Bundled **word list** (Quiz + Learn read it locally, no API)
- [x] **Writing practice** (trace canvas): undo / clear / guide toggle / shuffle word
- [x] **Writing scoring** — pixel-overlap precision/recall F1 ported 1:1 from web
      (`_score` in `write_screen.dart`); shows score%, bar, precision + coverage
- [x] Copy + Share (`share_plus`); About links open externally (Android 11+ `<queries>`)
- [x] **Play signing**: upload keystore + `android/key.properties` (both gitignored);
      release build signed by the upload key (verified)
- [x] Built signed **AAB** (`build/app/outputs/bundle/release/app-release.aab`) + signed APK
- [x] Published APK to GitHub Releases **v1.0.0** (landing-page Download button links to it)
- [x] **App icon** — white aksara on a blue→violet gradient (`assets/icon/icon_app.png`
      + `icon_fg.png`), adaptive bg `#6A6BF0` (replaced earlier blue-square/gold-medallion)
- [x] **Language toggle EN/ID** (default **Indonesian**), persisted; all screens + nav
      translated via `lib/l10n.dart` (`tr(context, en, id)` + `LangScope`)
- [x] **Quiz: per-mode scores** (reading vs writing tracked separately), each level shows
      **Best + Last**, levels revisitable
- [x] **Writing auto-advance** to next word after a good check (mobile + web)
- [x] **Removed share-as-image** from converter (mobile button + web Download card)
- [x] **Account (mobile)** — About links to web `/dashboard` for account + delete account
      (web already has self-service delete; app stays offline-first)
- [x] **Removed the Learn tab** (mobile) — nav now Convert · Write · Quiz · About;
      deleted `lib/screens/learn_screen.dart`
- [x] **Leveled Quiz** — 6 tiers (Pemula→GrandMaster), locked until previous passed (≥70),
      best scores persisted (`shared_preferences`); **two modes** Membaca (reading, MCQ) +
      Menulis (typing with on-screen Balinese keyboard + check/feedback); results popup
      (Benar/Score/Salah · Ulangi/Lihat Detail). All in `lib/screens/quiz_screen.dart`

## 🟡 Next up
- [ ] **Dark mode** (`shared_preferences` already added; needs a ThemeExtension +
      toggle + screen color refactor)
- [ ] **Recent conversions** history (persist with `shared_preferences`)
- [ ] In-app **language toggle** (ID/EN) to match the website
- [x] **Converter styling panel (mobile)** — diacritic input buttons `ā ī ū ě ṇ`
      (normalized in `converter.dart` via `_latinDiacritics`), output font-size slider,
      alignment, text color + background swatches, **share-as-image** (RepaintBoundary→PNG)
- [x] **Hide/show on-screen Balinese keyboard** in reverse (Aksara→Latin) mode (toggle)
- [x] **Write screen landscape/wide support** — `LayoutBuilder`: portrait = column,
      landscape = controls panel (320px) left + canvas filling height on the right
- [x] **Web: leveled Quiz** (Pemula→GrandMaster, locked/unlocked, best scores in
      `localStorage`) + **Membaca/Menulis** modes + **results popup** — rewrote
      `components/practice/QuizMode.jsx` (dark-mode + id/en preserved)
- [x] **Web: diacritic input** — normalization mirrored in `utils/balineseConverter.js`
      (`LATIN_DIACRITICS`); `ā ī ū ě ṇ` buttons added to `LatinBalineseConverter.jsx`
- [x] **Web: converter styling panel + share-as-image** — added a styled preview card
      below the output with font-size slider, alignment, text + background swatches, and
      **Download Image** via native Canvas (no extra deps) in `LatinBalineseConverter.jsx`
- [ ] (Web reverse mode uses a plain textarea — no on-screen keyboard, so "hide keyboard" N/A)

## 🟢 Release (Play Store)
- [ ] **Back up the keystore** (`android/app/upload-keystore.jks`, pass `AksaraBali2026`,
      alias `upload`) — losing it blocks updates. Prefer enrolling in **Play App Signing**.
- [ ] Play Console: create app, upload the **AAB**, fill store listing (icon, screenshots,
      short/full description), **Data Safety** (app is offline; only Share + external links),
      content rating, **privacy policy URL** → `https://aksarabali.doniwirawan.xyz/privacy`
- [ ] iOS: bundle id + signing in Xcode; App Store listing (later)
- [ ] CI (GitHub Actions) to build APK/AAB on tag

## ⚠️ Notes
- Reverse (Balinese→Latin) is **best-effort/lossy** (long vowels & some marks collapse).
- Murda (Sanskrit) forms map to the same glyphs as their base — detection is ported
  for parity but doesn't change visible output (matches the web).
- First-ever Android build downloads Gradle + AndroidX deps; on a flaky network it may
  need retries (deps cache after one success).
