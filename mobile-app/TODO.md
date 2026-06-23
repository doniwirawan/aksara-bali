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
  `lib/screens/{convert,write,quiz,learn,about}_screen.dart`, `lib/theme.dart`.
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
- [x] Copy + Share (`share_plus`); About links open externally (Android 11+ `<queries>`)
- [x] **Play signing**: upload keystore + `android/key.properties` (both gitignored);
      release build signed by the upload key (verified)
- [x] Built signed **AAB** (`build/app/outputs/bundle/release/app-release.aab`) + signed APK
- [x] Published APK to GitHub Releases **v1.0.0** (landing-page Download button links to it)

## 🟡 Next up
- [ ] **Dark mode** (`shared_preferences` already added; needs a ThemeExtension +
      toggle + screen color refactor)
- [ ] **Writing scoring** — compare the drawing to the reference (pixel overlap) and
      show a score, like the web; currently trace-only
- [ ] **Recent conversions** history (persist with `shared_preferences`)
- [ ] In-app **language toggle** (ID/EN) to match the website
- [ ] Replace the wordmark launcher icon with a dedicated **square** mark (wordmark
      gets cropped in circular masks)

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
