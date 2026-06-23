# Aksara Bali — Mobile App (handoff & TODO)

Flutter app **`aksara_bali_mobile`** that talks to the existing Aksara Bali web API.
This doc is the single source of truth to **continue in a fresh session**.

## Context (read first)
- **Location**: `mobile-app/` inside the main repo (Next.js web app is the parent).
- **API base**: `https://transliterasi-latin-ke-bahasa-bali.vercel.app`
  - `GET|POST /api/convert/` → `{ "latin": "...", "balinese": "..." }` (CORS, public)
  - `GET /api/words/?difficulty=easy|medium|hard` → `{ count, words:[{latin,meaning,category,difficulty,balinese}] }`
  - Always use the **trailing slash** (site has `trailingSlash: true` → 308 otherwise).
- **Flutter**: 3.27.2 / Dart 3.6.1, installed at `C:\Users\doniw\dev\flutter`.
- **Key files**: `lib/main.dart` (converter screen), `pubspec.yaml` (deps + font),
  `assets/fonts/NotoSansBalinese-Regular.ttf`, `test/widget_test.dart`.
- **Run**: `cd mobile-app && flutter pub get && flutter run`
- **Check**: `flutter analyze` (currently clean, 0 issues).

## ✅ Done
- [x] Scaffold Flutter project (Android + iOS), package `aksara_bali_mobile`
- [x] `http` package added
- [x] Converter screen: Latin input → live Aksara Bali via `/api/convert/` (debounced, loading/error states, clear button)
- [x] Bundled **Noto Sans Balinese** font and applied it to the output → script renders on all devices
- [x] Smoke test + `flutter analyze` clean
- [x] Web platform enabled; `flutter test` passes and `flutter build web` succeeds
- [x] **Redesigned to match the website**: blue (#0D6EFD) theme, Inter font (google_fonts),
      light bg, white cards, logo header with "Aksara Bali / CONVERTER"
- [x] Bottom nav: **Convert** (input → output card, Copy + Share) and **Learn**
      (word list from `/api/words/` with easy/medium/hard chips)
- [x] Copy (clipboard) + Share (share_plus); logo asset bundled
- [x] **All core pages**: Convert, Quiz (multiple-choice via `/api/words/`),
      Learn (word reference w/ difficulty filter), About (links to web/blog/faq/
      privacy/terms via url_launcher). 4-tab bottom nav.
- [x] **App launcher icon + splash** generated (flutter_launcher_icons + native_splash)
- [x] Code split into `lib/api.dart`, `lib/theme.dart`, `lib/screens/*`

## 🟡 Next up (priority order)
- [ ] Build a signed **release APK** and add a **Download** button on the web landing page
- [ ] Recent-conversions history (`shared_preferences`)
- [ ] Replace the wordmark launcher icon with a dedicated **square** icon (the
      wordmark gets cropped in the adaptive/circle mask)
- [ ] Better offline UX: cache last conversion / words list
- [ ] Optional: on-device writing canvas (gesture/touch) to mirror the web

## 🔵 Practice features (mirror the web app)
- [ ] Quiz mode using `/api/words/` (multiple choice: show Balinese, pick Latin)
- [ ] Flashcards from the word list (flip Latin ↔ Balinese + meaning, filter by difficulty)
- [ ] Writing practice canvas (on-device drawing; scoring client-side for now)

## 🟣 Backend / API (web repo, not this folder)
- [ ] Optional reverse endpoint `bali-to-latin` if the app needs it (no reverse converter exists yet)
- [ ] Rate limiting / API key if usage grows

## 🟢 Release
- [ ] Android signing (`android/key.properties` + keystore)
- [ ] iOS bundle id + signing in Xcode
- [ ] Store listings (icon, screenshots, description, privacy policy)
- [ ] CI (GitHub Actions) to build APK/IPA

## ⚠️ Known issues / notes
- **Android build needs JDK 17–20.** `flutter create` warned the configured Java is
  newer than the scaffold's Gradle expects. If `flutter run` (Android) fails, run
  `flutter config --jdk-dir=<path-to-JDK-17..20>` or bump the Gradle wrapper
  (`android/gradle/wrapper/gradle-wrapper.properties`) to 8.4–8.7. iOS unaffected.
- The app is **not committed** to git yet — decide whether to track it in the main
  repo or split into its own repo. If tracking, ensure `mobile-app/build/`,
  `.dart_tool/`, etc. are gitignored (Flutter's own `.gitignore` is inside this folder).
