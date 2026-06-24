import 'package:flutter/material.dart';
import '../theme.dart';
import '../l10n.dart';

class _Glyph {
  const _Glyph(this.char, this.latin);
  final String char;
  final String latin;
}

class _Section {
  const _Section(this.titleEn, this.titleId, this.subEn, this.subId, this.glyphs, {this.big = 34});
  final String titleEn, titleId, subEn, subId;
  final List<_Glyph> glyphs;
  final double big;
}

const _sections = [
  _Section('Aksara Wianjana', 'Aksara Wianjana', 'Base consonants (each carries an inherent "a")',
      'Konsonan dasar (membawa vokal "a")', [
    _Glyph('ᬳ', 'ha'), _Glyph('ᬦ', 'na'), _Glyph('ᬘ', 'ca'), _Glyph('ᬭ', 'ra'),
    _Glyph('ᬓ', 'ka'), _Glyph('ᬤ', 'da'), _Glyph('ᬢ', 'ta'), _Glyph('ᬲ', 'sa'),
    _Glyph('ᬯ', 'wa'), _Glyph('ᬮ', 'la'), _Glyph('ᬫ', 'ma'), _Glyph('ᬕ', 'ga'),
    _Glyph('ᬩ', 'ba'), _Glyph('ᬗ', 'nga'), _Glyph('ᬧ', 'pa'), _Glyph('ᬚ', 'ja'),
    _Glyph('ᬬ', 'ya'), _Glyph('ᬜ', 'nya'),
  ]),
  _Section('Aksara Mahaprana', 'Aksara Mahaprana', 'Aspirated / Sanskrit consonants',
      'Konsonan aspirasi / Sanskerta', [
    _Glyph('ᬔ', 'kha'), _Glyph('ᬖ', 'gha'), _Glyph('ᬝ', 'tha'), _Glyph('ᬟ', 'dha'),
    _Glyph('ᬡ', 'ṇa'), _Glyph('ᬧ', 'pha'), _Glyph('ᬪ', 'bha'), _Glyph('ᬰ', 'śa'),
    _Glyph('ᬱ', 'ṣa'),
  ]),
  _Section('Aksara Suara', 'Aksara Suara', 'Independent vowels', 'Huruf vokal mandiri', [
    _Glyph('ᬅ', 'a'), _Glyph('ᬇ', 'i'), _Glyph('ᬉ', 'u'), _Glyph('ᬏ', 'e'), _Glyph('ᬑ', 'o'),
  ]),
  _Section('Pangangge Suara', 'Pangangge Suara', 'Vowel signs (attach to a consonant)',
      'Tanda vokal (menempel pada konsonan)', [
    _Glyph('◌ᬶ', 'i (ulu)'), _Glyph('◌ᬸ', 'u (suku)'), _Glyph('◌ᬾ', 'e (taleng)'),
    _Glyph('◌ᭀ', 'o'), _Glyph('◌ᬵ', 'ā (tedung)'),
  ], big: 30),
  _Section('Pangangge Tengenan', 'Pangangge Tengenan', 'Final-sound signs',
      'Tanda penutup suku kata', [
    _Glyph('◌ᬂ', 'ng (cecek)'), _Glyph('◌ᬄ', 'h (bisah)'), _Glyph('◌᭄', '◌ (adeg-adeg)'),
  ], big: 30),
  _Section('Angka', 'Angka', 'Balinese numerals', 'Angka Bali', [
    _Glyph('᭐', '0'), _Glyph('᭑', '1'), _Glyph('᭒', '2'), _Glyph('᭓', '3'), _Glyph('᭔', '4'),
    _Glyph('᭕', '5'), _Glyph('᭖', '6'), _Glyph('᭗', '7'), _Glyph('᭘', '8'), _Glyph('᭙', '9'),
  ]),
];

class ReferenceScreen extends StatelessWidget {
  const ReferenceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isId = LangScope.of(context) == AppLang.id;
    return LayoutBuilder(builder: (context, c) {
      final cols = c.maxWidth >= 900 ? 6 : (c.maxWidth >= 600 ? 5 : 4);
      const gap = 12.0;
      final cellW = (c.maxWidth - 32 - gap * (cols - 1)) / cols;
      return ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 28),
        children: [
          Text(tr(context, 'Aksara Reference', 'Referensi Aksara'),
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: kTextPrimary)),
          const SizedBox(height: 6),
          Text(tr(context, 'The full Balinese writing system — tap to learn each letter.',
                  'Sistem penulisan aksara Bali lengkap — pelajari tiap huruf.'),
              style: TextStyle(color: kTextSecondary, fontSize: 14, height: 1.4)),
          const SizedBox(height: 20),
          _howTo(context),
          const SizedBox(height: 28),
          for (final s in _sections) ...[
            Text(isId ? s.titleId : s.titleEn,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: kTextPrimary)),
            const SizedBox(height: 4),
            Text(isId ? s.subId : s.subEn, style: TextStyle(color: kTextSecondary, fontSize: 13)),
            const SizedBox(height: 14),
            Wrap(spacing: gap, runSpacing: gap, children: [
              for (final g in s.glyphs) _cell(g, s.big, cellW),
            ]),
            const SizedBox(height: 28),
          ],
        ],
      );
    });
  }

  Widget _howTo(BuildContext context) {
    final isId = LangScope.of(context) == AppLang.id;
    final tips = <List<String>>[
      ['ᬓ', isId ? "Tiap konsonan sudah membawa vokal 'a' (ᬓ = ka)." : "Each consonant carries an inherent 'a' (ᬓ = ka)."],
      ['ᬓᬶ', isId ? "Tambah tanda vokal untuk mengubah vokalnya (ᬓ + ◌ᬶ = ki)." : "Add a vowel sign to change the vowel (ᬓ + ◌ᬶ = ki)."],
      ['ᬓ᭄', isId ? "Adeg-adeg (◌᭄) menghapus bunyi 'a' (ᬓ᭄ = k)." : "Adeg-adeg (◌᭄) removes the 'a' sound (ᬓ᭄ = k)."],
      ['ᬩᬮᬶ', isId ? "Gabungkan untuk menulis kata (ᬩᬮᬶ = bali)." : "Combine them to write words (ᬩᬮᬶ = bali)."],
    ];
    return Container(
      decoration: cardDecoration(),
      padding: const EdgeInsets.all(14),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.lightbulb_outline, size: 18, color: kAccent),
          const SizedBox(width: 8),
          Text(tr(context, 'How it works', 'Cara membaca'),
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: kInk)),
        ]),
        const SizedBox(height: 12),
        for (final t in tips)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
              Container(
                width: 60, height: 48, alignment: Alignment.center,
                clipBehavior: Clip.hardEdge,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 5),
                decoration: BoxDecoration(color: kAccent.withValues(alpha: 0.10), borderRadius: BorderRadius.circular(8)),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(t[0], maxLines: 1,
                      style: TextStyle(fontFamily: kBaliFont, fontSize: 24, color: kInk)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text(t[1], style: TextStyle(fontSize: 13, color: kInk, height: 1.3))),
            ]),
          ),
      ]),
    );
  }

  Widget _cell(_Glyph g, double big, double width) {
    return SizedBox(
      width: width,
      child: Material(
        color: kSurfaceRaised,
        borderRadius: BorderRadius.circular(16),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(children: [
              Text(g.char, style: TextStyle(fontFamily: kBaliFont, fontSize: big, color: kTextPrimary, height: 1.1)),
              const SizedBox(height: 8),
              Text(g.latin, textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: kTextMuted)),
            ]),
          ),
        ),
      ),
    );
  }
}
