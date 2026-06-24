import 'package:flutter/material.dart';
import '../theme.dart';
import '../l10n.dart';

class _Glyph {
  const _Glyph(this.char, this.latin);
  final String char;
  final String latin;
}

class _Section {
  const _Section(this.titleEn, this.titleId, this.subEn, this.subId, this.glyphs, {this.big = 30});
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
  ], big: 28),
  _Section('Pangangge Tengenan', 'Pangangge Tengenan', 'Final-sound signs',
      'Tanda penutup suku kata', [
    _Glyph('◌ᬂ', 'ng (cecek)'), _Glyph('◌ᬄ', 'h (bisah)'), _Glyph('◌᭄', '◌ (adeg-adeg)'),
  ], big: 28),
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
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(tr(context, 'Aksara Reference', 'Referensi Aksara'),
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: kInk)),
        const SizedBox(height: 4),
        Text(tr(context, 'The full Balinese writing system — tap to learn each letter.',
                'Sistem penulisan aksara Bali lengkap — pelajari tiap huruf.'),
            style: const TextStyle(color: kMuted, fontSize: 13)),
        const SizedBox(height: 16),
        for (final s in _sections) ...[
          Text(isId ? s.titleId : s.titleEn,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: kInk)),
          const SizedBox(height: 2),
          Text(isId ? s.subId : s.subEn, style: const TextStyle(color: kMuted, fontSize: 12)),
          const SizedBox(height: 10),
          Wrap(spacing: 10, runSpacing: 10, children: [
            for (final g in s.glyphs) _cell(g, s.big),
          ]),
          const SizedBox(height: 22),
        ],
      ],
    );
  }

  Widget _cell(_Glyph g, double big) {
    return Container(
      width: 76,
      decoration: cardDecoration(),
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(children: [
        Text(g.char, style: TextStyle(fontFamily: kBaliFont, fontSize: big, color: kInk, height: 1.1)),
        const SizedBox(height: 4),
        Text(g.latin, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: kMuted)),
      ]),
    );
  }
}
