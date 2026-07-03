import 'package:flutter/material.dart';
import 'theme.dart';
import 'sfx.dart';

/// On-screen Balinese (Aksara Bali) keyboard. Inserts raw glyphs into [controller]
/// at the caret, then calls [onChanged]. Used so Balinese→Latin input doesn't need
/// the system keyboard.
class BalineseKeyboard extends StatelessWidget {
  const BalineseKeyboard({super.key, required this.controller, required this.onChanged});
  final TextEditingController controller;
  final VoidCallback onChanged;

  // Aksara wianjana (base consonants, carry inherent 'a')
  static const _cons = [
    'ᬳ', 'ᬦ', 'ᬘ', 'ᬭ', 'ᬓ', 'ᬤ', 'ᬢ', 'ᬲ', 'ᬯ',
    'ᬮ', 'ᬫ', 'ᬕ', 'ᬩ', 'ᬗ', 'ᬧ', 'ᬚ', 'ᬬ', 'ᬜ',
    'ᬔ', 'ᬖ', 'ᬪ', 'ᬝ', 'ᬟ',
  ];
  // Independent vowels
  static const _vowels = ['ᬅ', 'ᬇ', 'ᬉ', 'ᬏ', 'ᬑ'];
  // Pangangge (vowel marks) + adeg-adeg + cecek/bisah, shown on a dotted circle
  static const _marks = [
    ['◌ᬶ', 'ᬶ'], ['◌ᬸ', 'ᬸ'], ['◌ᬾ', 'ᬾ'], ['◌ᭀ', 'ᭀ'], ['◌ᬵ', 'ᬵ'],
    ['◌᭄', '᭄'], ['◌ᬂ', 'ᬂ'], ['◌ᬄ', 'ᬄ'],
  ];

  void _insert(String glyph) {
    Sfx.instance.tap();
    final sel = controller.selection;
    final text = controller.text;
    final start = sel.isValid ? sel.start : text.length;
    final end = sel.isValid ? sel.end : text.length;
    final newText = text.replaceRange(start, end, glyph);
    controller.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: start + glyph.length),
    );
    onChanged();
  }

  void _backspace() {
    Sfx.instance.tap();
    final text = controller.text;
    if (text.isEmpty) return;
    final sel = controller.selection;
    int start = sel.isValid ? sel.start : text.length;
    final int end = sel.isValid ? sel.end : text.length;
    if (start == end) {
      if (start == 0) return;
      start -= 1;
    }
    final newText = text.replaceRange(start, end, '');
    controller.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: start),
    );
    onChanged();
  }

  Widget _key(String glyph, {String? insert, double size = 22}) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: () => _insert(insert ?? glyph),
      child: Container(
        width: 44, height: 44, alignment: Alignment.center,
        decoration: BoxDecoration(
          color: kCardBg,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: kBorder),
        ),
        child: Text(glyph, style: TextStyle(fontFamily: kBaliFont, fontSize: size, color: kInk)),
      ),
    );
  }

  Widget _ctrl({required Widget child, required VoidCallback onTap, double width = 64}) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: onTap,
      child: Container(
        width: width, height: 44, alignment: Alignment.center,
        decoration: BoxDecoration(color: kCardBg, borderRadius: BorderRadius.circular(8), border: Border.all(color: kBorder)),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F8),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: kBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(spacing: 6, runSpacing: 6, children: [for (final g in _cons) _key(g)]),
          const SizedBox(height: 8),
          Wrap(spacing: 6, runSpacing: 6, children: [
            for (final v in _vowels) _key(v),
            for (final m in _marks) _key(m[0], insert: m[1], size: 20),
          ]),
          const SizedBox(height: 8),
          Row(children: [
            Expanded(child: _ctrl(width: double.infinity, onTap: () => _insert('​'),
                child: Text('Spasi', style: TextStyle(color: kMuted, fontSize: 13)))),
            const SizedBox(width: 6),
            _ctrl(onTap: _backspace, child: Icon(Icons.backspace_outlined, size: 20, color: kInk)),
            const SizedBox(width: 6),
            _ctrl(onTap: () { controller.clear(); onChanged(); }, child: const Icon(Icons.clear, size: 20, color: Color(0xFFEF4444))),
          ]),
        ],
      ),
    );
  }
}
