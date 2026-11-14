import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../converter.dart';
import '../theme.dart';
import '../l10n.dart';
import '../balinese_keyboard.dart';
import '../sfx.dart';

const _diacritics = ['ā', 'ī', 'ū', 'ě', 'ṇ'];
// Word-art colours: the website's set (paper, black, bang red, turmeric, gold, blue, teal).
const _textSwatches = [
  Color(0xFFF7F6F2), Color(0xFF17140F), Color(0xFFB4232B), Color(0xFFE2A41C),
  Color(0xFFD8A84E), Color(0xFF2B5C9E), Color(0xFF0F766E),
];
const _bgSwatches = [
  Color(0xFFB4232B), Color(0xFFFFFFFF), Color(0xFF151411), Color(0xFFE2A41C),
  Color(0xFFD8A84E), Color(0xFF2B5C9E), Color(0xFF0F766E),
];

class ConvertScreen extends StatefulWidget {
  const ConvertScreen({super.key});
  @override
  State<ConvertScreen> createState() => _ConvertScreenState();
}

class _ConvertScreenState extends State<ConvertScreen> {
  final _controller = TextEditingController();
  String _output = '';
  bool _reverse = false; // false: Latin → Balinese, true: Balinese → Latin
  bool _showKeyboard = true; // on-screen Balinese keyboard (reverse mode)

  // Output styling (null colors follow the current theme)
  final _captureKey = GlobalKey();
  bool _showStyle = false;
  bool _transparent = false; // export PNG with a transparent background
  double _fontSize = 30;
  TextAlign _align = TextAlign.left;
  Color? _textColor;
  Color? _bgColor;

  Future<void> _downloadImage() async {
    try {
      final boundary = _captureKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 3);
      final data = await image.toByteData(format: ui.ImageByteFormat.png);
      image.dispose();
      final bytes = data!.buffer.asUint8List();
      final file = await File('${Directory.systemTemp.path}/aksara_${DateTime.now().millisecondsSinceEpoch}.png')
          .writeAsBytes(bytes);
      await SharePlus.instance.share(ShareParams(files: [XFile(file.path, mimeType: 'image/png')]));
    } catch (_) {/* render not ready / cancelled */}
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _convert(String text) {
    setState(() => _output = _reverse ? balineseToLatin(text) : latinToBalinese(text));
  }

  void _swap() {
    Sfx.instance.tap();
    setState(() {
      _reverse = !_reverse;
      final prev = _output;
      _controller.text = prev;
      _output = prev.isEmpty
          ? ''
          : (_reverse ? balineseToLatin(prev) : latinToBalinese(prev));
    });
  }

  // Longer output → smaller text, but never below a minimum (lowest limit).
  double _autoSize() {
    final n = _output.replaceAll('​', '').length;
    if (n <= 14) return _fontSize;
    return (_fontSize - (n - 14) * 0.4).clamp(16.0, _fontSize);
  }

  void _insertDiacritic(String ch) {
    Sfx.instance.tap();
    final sel = _controller.selection;
    final text = _controller.text;
    final start = sel.isValid ? sel.start : text.length;
    final end = sel.isValid ? sel.end : text.length;
    final newText = text.replaceRange(start, end, ch);
    _controller.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: start + ch.length),
    );
    _convert(newText);
  }

  @override
  Widget build(BuildContext context) {
    final hasOut = _output.isNotEmpty;
    final inLabel = _reverse ? 'Aksara Bali' : 'Latin';
    final outLabel = _reverse ? 'Latin' : 'Aksara Bali';
    final inFont = _reverse ? const TextStyle(fontFamily: kBaliFont, fontSize: 22) : const TextStyle(fontSize: 18);
    final outIsBali = !_reverse;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 4),
          Row(
            children: [
              Expanded(
                child: Text('$inLabel → $outLabel',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: -0.4, color: kInk)),
              ),
              IconButton.filledTonal(
                onPressed: _swap,
                icon: const Icon(Icons.swap_horiz),
                tooltip: tr(context, 'Swap direction', 'Tukar arah'),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(tr(context, 'Runs fully on your device — no internet needed.',
                  'Berjalan penuh di perangkat — tanpa internet.'),
              style: TextStyle(color: kMuted, fontSize: 13)),
          const SizedBox(height: 16),

          Text(inLabel, style: TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12)),
          const SizedBox(height: 6),
          Container(
            decoration: cardDecoration(),
            padding: const EdgeInsets.all(14),
            child: TextField(
              controller: _controller,
              onChanged: _convert,
              autofocus: !_reverse,
              readOnly: _reverse,   // use the on-screen Balinese keyboard instead
              showCursor: true,
              maxLines: 8,
              minLines: 3,
              keyboardType: TextInputType.multiline,
              textInputAction: TextInputAction.newline,
              style: inFont.copyWith(color: kInk),
              // The hairline frame around this field is the container's; no second box inside it.
              decoration: InputDecoration(
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                filled: false,
                contentPadding: EdgeInsets.zero,
                hintText: _reverse
                    ? tr(context, 'Type with the aksara keyboard below', 'Ketik dengan papan aksara di bawah')
                    : tr(context, 'Type a word, sentence, or paragraph…', 'Ketik kata, kalimat, atau paragraf…'),
                suffixIcon: _controller.text.isEmpty ? null : IconButton(
                  icon: const Icon(Icons.clear, size: 20),
                  onPressed: () { _controller.clear(); _convert(''); },
                ),
              ),
            ),
          ),
          // Diacritic quick-input (Latin → Balinese only)
          if (!_reverse)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Wrap(spacing: 8, runSpacing: 8, children: [
                for (final c in _diacritics)
                  OutlinedButton(
                    onPressed: () => _insertDiacritic(c),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(46, 40),
                      padding: EdgeInsets.zero,
                      side: BorderSide(color: kBorder),
                    ),
                    child: Text(c, style: TextStyle(fontSize: 18, color: kInk)),
                  ),
              ]),
            ),
          if (_reverse) ...[
            const SizedBox(height: 8),
            Row(children: [
              Expanded(child: Text(tr(context, 'Aksara Keyboard', 'Papan Aksara'),
                  style: TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12))),
              TextButton.icon(
                onPressed: () => setState(() => _showKeyboard = !_showKeyboard),
                icon: Icon(_showKeyboard ? Icons.keyboard_hide_outlined : Icons.keyboard_outlined, size: 18),
                label: Text(_showKeyboard ? tr(context, 'Hide', 'Sembunyikan') : tr(context, 'Show', 'Tampilkan')),
              ),
            ]),
            if (_showKeyboard)
              BalineseKeyboard(controller: _controller, onChanged: () => _convert(_controller.text)),
          ],
          const SizedBox(height: 16),

          Text(outLabel, style: TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12)),
          const SizedBox(height: 6),
          RepaintBoundary(
            key: _captureKey,
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(minHeight: 140),
              decoration: BoxDecoration(
                color: _transparent ? Colors.transparent : (_bgColor ?? kScriptField),
              ),
              padding: const EdgeInsets.all(20),
              child: SelectableText(
                hasOut ? _output : (outIsBali ? 'ᬳᬓ᭄ᬱᬭᬩᬮᬶ' : 'aksara bali'),
                textAlign: _align,
                style: TextStyle(
                  fontFamily: outIsBali ? kBaliFont : null,
                  fontSize: outIsBali ? _autoSize() : _fontSize * 0.7,
                  height: 1.7,
                  color: hasOut ? (_textColor ?? _defaultInk) : (_textColor ?? _defaultInk).withValues(alpha: 0.45),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Collapsible styling panel (optional — keeps the converter clean for text)
          if (outIsBali) ...[
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton.icon(
                onPressed: () => setState(() => _showStyle = !_showStyle),
                icon: Icon(_showStyle ? Icons.expand_less : Icons.tune, size: 18),
                label: Text(tr(context, 'Customize style', 'Sesuaikan gaya')),
              ),
            ),
            if (_showStyle) _stylePanel(),
          ],
          const SizedBox(height: 14),

          Row(children: [
            Expanded(child: OutlinedButton.icon(
              onPressed: hasOut ? () async {
                await Clipboard.setData(ClipboardData(text: _output));
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(tr(context, 'Copied to clipboard', 'Disalin ke papan klip')),
                        duration: const Duration(seconds: 1)));
                }
              } : null,
              icon: const Icon(Icons.copy, size: 18),
              label: Text(tr(context, 'Copy', 'Salin')),
            )),
            const SizedBox(width: 12),
            Expanded(child: FilledButton.icon(
              onPressed: hasOut ? () => SharePlus.instance.share(
                ShareParams(text: '$_output\n\n(${_controller.text.trim()}) — via Aksara Bali')) : null,
              style: FilledButton.styleFrom(backgroundColor: kAccent),
              icon: const Icon(Icons.share, size: 18),
              label: Text(tr(context, 'Share', 'Bagikan')),
            )),
          ]),
        ],
      ),
    );
  }

  Widget _stylePanel() {
    return Container(
      decoration: cardDecoration(),
      padding: const EdgeInsets.fromLTRB(14, 6, 14, 12),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.format_size, size: 18, color: kMuted),
          Expanded(child: Slider(
            min: 24, max: 80, value: _fontSize,
            onChanged: (v) => setState(() => _fontSize = v),
          )),
          Row(children: [
            _alignButton(Icons.format_align_left, TextAlign.left),
            _alignButton(Icons.format_align_center, TextAlign.center),
            _alignButton(Icons.format_align_right, TextAlign.right),
          ]),
        ]),
        const SizedBox(height: 4),
        _swatchRow(tr(context, 'Text', 'Teks'), _textSwatches, _textColor, (c) => setState(() => _textColor = c)),
        const SizedBox(height: 10),
        _swatchRow(tr(context, 'Background', 'Latar'), _bgSwatches, _bgColor, (c) => setState(() => _bgColor = c)),
        const SizedBox(height: 6),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          dense: true,
          title: Text(tr(context, 'Transparent background', 'Latar transparan'),
              style: TextStyle(fontSize: 13, color: kInk)),
          value: _transparent,
          onChanged: (v) => setState(() => _transparent = v),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: _output.isEmpty ? null : _downloadImage,
            icon: const Icon(Icons.download, size: 18),
            label: Text(tr(context, 'Download PNG', 'Unduh PNG')),
          ),
        ),
      ]),
    );
  }

  // Text on the default red field is paper-white; on a picked background it
  // follows the theme until the user picks a text colour.
  Color get _defaultInk => (_bgColor == null && !_transparent) ? kPaper : kTextPrimary;

  Widget _alignButton(IconData icon, TextAlign value) {
    final selected = _align == value;
    return IconButton(
      onPressed: () => setState(() => _align = value),
      icon: Icon(icon, size: 20),
      color: selected ? kTextPrimary : kMuted,
      style: IconButton.styleFrom(backgroundColor: selected ? kAccentSoft : null),
      visualDensity: VisualDensity.compact,
      tooltip: value.name,
    );
  }

  Widget _swatchRow(String label, List<Color> colors, Color? selected, ValueChanged<Color> onPick) {
    return Row(children: [
      SizedBox(width: 70, child: Text(label, style: TextStyle(color: kMuted, fontSize: 12))),
      const SizedBox(width: 4),
      Expanded(child: Wrap(spacing: 10, children: [
        for (final c in colors)
          GestureDetector(
            onTap: () => onPick(c),
            child: Container(
              width: 26, height: 26,
              decoration: BoxDecoration(
                color: c,
                shape: BoxShape.rectangle,
                border: Border.all(
                  color: c == selected ? kTurmeric : kBorder,
                  width: c == selected ? 3 : 1,
                ),
              ),
            ),
          ),
      ])),
    ]);
  }
}
