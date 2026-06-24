import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../converter.dart';
import '../theme.dart';
import '../balinese_keyboard.dart';

const _diacritics = ['ā', 'ī', 'ū', 'ě', 'ṇ'];
const _textSwatches = [
  kInk, kBlue, Color(0xFFDC2626), Color(0xFF16A34A),
  Color(0xFF7C3AED), Color(0xFFB8860B), Colors.white,
];
const _bgSwatches = [
  Color(0xFFF8F9FF), Colors.white, kBlue, Color(0xFFEF4444),
  Color(0xFF1A1A1A), Color(0xFFF59E0B), Color(0xFF0F766E),
];

class ConvertScreen extends StatefulWidget {
  const ConvertScreen({super.key});
  @override
  State<ConvertScreen> createState() => _ConvertScreenState();
}

class _ConvertScreenState extends State<ConvertScreen> {
  final _controller = TextEditingController();
  final _captureKey = GlobalKey();
  String _output = '';
  bool _reverse = false; // false: Latin → Balinese, true: Balinese → Latin
  bool _showKeyboard = true; // on-screen Balinese keyboard (reverse mode)

  // Output styling
  double _fontSize = 40;
  TextAlign _align = TextAlign.center;
  Color _textColor = kInk;
  Color _bgColor = const Color(0xFFF8F9FF);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _convert(String text) {
    setState(() => _output = _reverse ? balineseToLatin(text) : latinToBalinese(text));
  }

  void _swap() {
    setState(() {
      _reverse = !_reverse;
      final prev = _output;
      _controller.text = prev;
      _output = prev.isEmpty
          ? ''
          : (_reverse ? balineseToLatin(prev) : latinToBalinese(prev));
    });
  }

  void _insertDiacritic(String ch) {
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

  Future<void> _shareImage() async {
    try {
      final boundary = _captureKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 3);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      image.dispose();
      final bytes = byteData!.buffer.asUint8List();
      final file = await File('${Directory.systemTemp.path}/aksara_${DateTime.now().millisecondsSinceEpoch}.png')
          .writeAsBytes(bytes);
      await SharePlus.instance.share(ShareParams(files: [XFile(file.path)], text: 'via Aksara Bali'));
    } catch (_) {/* user cancelled or render not ready */}
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
                    style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: kInk)),
              ),
              IconButton.filledTonal(
                onPressed: _swap,
                icon: const Icon(Icons.swap_horiz),
                tooltip: 'Swap direction',
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text('Runs fully on your device — no internet needed.',
              style: TextStyle(color: kMuted, fontSize: 13)),
          const SizedBox(height: 16),

          Text(inLabel, style: const TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12)),
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
              maxLines: 3,
              minLines: 1,
              style: inFont.copyWith(color: kInk),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: _reverse ? 'Ketik dengan papan aksara di bawah' : 'e.g. om swastiastu',
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
                      side: const BorderSide(color: kBorder),
                    ),
                    child: Text(c, style: const TextStyle(fontSize: 18, color: kInk)),
                  ),
              ]),
            ),
          if (_reverse) ...[
            const SizedBox(height: 8),
            Row(children: [
              const Expanded(child: Text('Papan Aksara',
                  style: TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12))),
              TextButton.icon(
                onPressed: () => setState(() => _showKeyboard = !_showKeyboard),
                icon: Icon(_showKeyboard ? Icons.keyboard_hide_outlined : Icons.keyboard_outlined, size: 18),
                label: Text(_showKeyboard ? 'Sembunyikan' : 'Tampilkan'),
              ),
            ]),
            if (_showKeyboard)
              BalineseKeyboard(controller: _controller, onChanged: () => _convert(_controller.text)),
          ],
          const SizedBox(height: 16),

          Text(outLabel, style: const TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12)),
          const SizedBox(height: 6),
          RepaintBoundary(
            key: _captureKey,
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(minHeight: 140),
              decoration: BoxDecoration(
                color: _bgColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFC5D8FC)),
              ),
              padding: const EdgeInsets.all(20),
              child: Text(
                hasOut ? _output : (outIsBali ? 'ᬳᬓ᭄ᬱᬭᬩᬮᬶ' : 'aksara bali'),
                textAlign: _align,
                style: TextStyle(
                  fontFamily: outIsBali ? kBaliFont : null,
                  fontSize: outIsBali ? _fontSize : _fontSize * 0.6,
                  height: 1.6,
                  color: hasOut ? _textColor : _textColor.withValues(alpha: 0.25),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Styling panel
          if (outIsBali) _stylePanel(),
          const SizedBox(height: 14),

          Row(children: [
            Expanded(child: OutlinedButton.icon(
              onPressed: hasOut ? () async {
                await Clipboard.setData(ClipboardData(text: _output));
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Copied to clipboard'), duration: Duration(seconds: 1)));
                }
              } : null,
              icon: const Icon(Icons.copy, size: 18),
              label: const Text('Copy'),
            )),
            const SizedBox(width: 10),
            Expanded(child: OutlinedButton.icon(
              onPressed: hasOut ? () => SharePlus.instance.share(
                ShareParams(text: '$_output\n\n(${_controller.text.trim()}) — via Aksara Bali')) : null,
              icon: const Icon(Icons.share, size: 18),
              label: const Text('Share'),
            )),
            const SizedBox(width: 10),
            Expanded(child: FilledButton.icon(
              onPressed: hasOut ? _shareImage : null,
              style: FilledButton.styleFrom(backgroundColor: kBlue),
              icon: const Icon(Icons.image, size: 18),
              label: const Text('Image'),
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
          const Icon(Icons.format_size, size: 18, color: kMuted),
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
        _swatchRow('Teks', _textSwatches, _textColor, (c) => setState(() => _textColor = c)),
        const SizedBox(height: 10),
        _swatchRow('Latar', _bgSwatches, _bgColor, (c) => setState(() => _bgColor = c)),
      ]),
    );
  }

  Widget _alignButton(IconData icon, TextAlign value) {
    final selected = _align == value;
    return IconButton(
      onPressed: () => setState(() => _align = value),
      icon: Icon(icon, size: 20),
      color: selected ? kBlue : kMuted,
      visualDensity: VisualDensity.compact,
      tooltip: value.name,
    );
  }

  Widget _swatchRow(String label, List<Color> colors, Color selected, ValueChanged<Color> onPick) {
    return Row(children: [
      SizedBox(width: 44, child: Text(label, style: const TextStyle(color: kMuted, fontSize: 12))),
      const SizedBox(width: 4),
      Expanded(child: Wrap(spacing: 10, children: [
        for (final c in colors)
          GestureDetector(
            onTap: () => onPick(c),
            child: Container(
              width: 26, height: 26,
              decoration: BoxDecoration(
                color: c,
                shape: BoxShape.circle,
                border: Border.all(
                  color: c == selected ? kBlue : kBorder,
                  width: c == selected ? 3 : 1,
                ),
              ),
            ),
          ),
      ])),
    ]);
  }
}
