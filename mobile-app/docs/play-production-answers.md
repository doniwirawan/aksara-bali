# "Apply for production" — draft answers

Fill the `<<...>>` placeholders with **real** data from your closed test before
submitting. Reviewers read these; invented specifics are worse than short honest
ones. Everything unbracketed below is already true of the app as it ships.

---

## Part 1 — About your closed test

**How did you recruit your testers?**

> I recruited testers from my personal and professional network and from
> communities with a direct interest in Balinese script: friends and family in
> Bali, <<students/lecturers from the Balinese Literature department at ...>>,
> <<teachers of Bahasa Bali at ...>>, and members of <<Balinese-culture groups on
> WhatsApp/Instagram/Reddit>>. I chose them because they are representative of the
> app's intended users — learners, students and teachers of Aksara Bali — rather
> than general testers, so their feedback reflects real classroom and study use.
> In total <<N>> testers opted in, of whom <<N>> remained enrolled for the full
> 14-day period.

**How did your testers provide feedback? / What feedback did you receive?**

> Testers gave feedback through <<a WhatsApp group and direct messages>>, and
> through the private testing-feedback channel in Google Play. The main themes were:
>
> 1. **Transliteration accuracy** — <<testers checked Latin → Balinese output
>    against words they knew; they reported ... >>
> 2. **Writing-practice scoring** — <<the trace-scoring felt too strict/lenient
>    on ... >>
> 3. **Quiz difficulty curve** — <<the jump between level X and Y felt too steep>>
> 4. **Wording and labels** — <<some Indonesian labels were unclear / truncated>>
>
> <<Add anything real, even if minor. "No feedback" is a red flag.>>

**What changes did you make as a result?**

> <<Released version 1.5.2 during the test window, which: fixed ...; adjusted ...;
> clarified the label ... . Testers confirmed the fixes on their devices.>>
>
> *(If you genuinely changed nothing, say what you validated instead and why no
> change was needed — but shipping at least one feedback-driven update during the
> window is strongly recommended. See the day 9–10 step in `tester-recruitment.md`.)*

**How many testers were opted in, and for how long?**

> <<N>> testers were opted in continuously for <<N>> days, from <<DD Mon YYYY>>
> to <<DD Mon YYYY>>.

---

## Part 2 — About your app

**What does your app do? Who is it for?**

> Aksara Bali Converter is a free educational tool for reading and writing
> **Aksara Bali**, the traditional Balinese script. It is aimed at students,
> teachers and anyone wanting to learn or preserve the script — a writing system
> that is part of the school curriculum in Bali but is increasingly rarely used
> in daily life.
>
> The app has four parts:
> - **Convert** — two-way transliteration between Latin and Balinese script,
>   with support for diacritics (ā ī ū ě ṇ), detection of Sanskrit (murda) forms,
>   an on-screen Balinese keyboard for reverse input, and a styling panel to
>   format the result and share it as an image.
> - **Write** — a tracing canvas for practising the shapes of the characters,
>   scored automatically by comparing the user's strokes against the reference
>   glyph.
> - **Quiz** — six levels (Pemula → GrandMaster), unlocked progressively, in two
>   modes: *Membaca* (reading, multiple choice) and *Menulis* (writing, typed with
>   the on-screen Balinese keyboard).
> - **About** — links to the web version, FAQ, privacy policy and source code.
>
> The interface is bilingual (Indonesian and English), defaulting to Indonesian.

**Does the app work offline? Does it collect data?**

> The app runs **entirely on-device**. The transliteration engine, the word list
> and all quiz content are bundled into the app; there is no backend and no
> network call in the Play build. There are **no user accounts**, **no ads**, **no
> analytics**, and **no advertising ID**. Progress (quiz scores, language
> preference) is stored locally on the device with `shared_preferences` and never
> leaves it. The Data safety declaration is accordingly "no data collected, no
> data shared."

**Is any of the content user-generated or shared with other users?**

> No. Users can convert their own text and share the result to other apps via the
> Android share sheet, but nothing is uploaded, stored on a server, or visible to
> other users. There is no social or communication surface.

**Monetisation**

> None. The app is free, contains no ads, and has no in-app purchases.

---

## Part 3 — Production readiness

**Is your store listing accurate and complete?**

> Yes. The listing name, descriptions, icon, feature graphic and screenshots all
> reflect version 1.5.1 as tested. The screenshots show the four screens that
> exist in the app (Convert, Write, Quiz, About). The privacy policy at
> https://aksarabali.doniwirawan.xyz/privacy covers the Android app and states
> that no data is collected.

**Have you tested on a range of devices?**

> <<Testers used a range of Android phones (<<list a few real ones — e.g. Samsung
> A-series, Xiaomi Redmi, Oppo>>) across Android <<versions>>. The app supports
> Android 7.0 (API 24) and above. I also reviewed the Play pre-launch report and
> resolved the issues it raised.>>
>
> *(Do run the pre-launch report — Test and release → Pre-launch report — before
> you apply. It's free, automatic, and reviewers can see it.)*

**Are you ready to support users in production?**

> Yes. Support is provided by email (<<your support email>>) and through the
> project's public issue tracker at
> https://github.com/doniwirawan/aksara-bali/issues. The app is actively
> maintained alongside its web version at https://aksarabali.doniwirawan.xyz, and
> I intend to keep releasing updates — the next planned features are a dark mode
> and a conversion history.

**Anything else we should know?**

> The app is a non-commercial cultural-preservation project. Aksara Bali is
> endangered in everyday use, and there are very few digital tools for learning
> it; the goal is to make it easy for Balinese students and anyone else to read
> and write the script on a phone, with no cost and no data collection.

---

## Before you hit submit

- [ ] Every `<<placeholder>>` replaced with something true.
- [ ] ≥12 testers still showing as opted in **today** (check the Testers tab —
      people quietly leave).
- [ ] Pre-launch report run and clean.
- [ ] Store listing screenshots match the shipped app (no removed screens).
- [ ] Privacy policy page explicitly covers the Android app.
