import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../converter.dart';
import '../theme.dart';

class ConvertScreen extends StatefulWidget {
  const ConvertScreen({super.key});
  @override
  State<ConvertScreen> createState() => _ConvertScreenState();
}

class _ConvertScreenState extends State<ConvertScreen> {
  final _controller = TextEditingController();
  String _output = '';
  bool _reverse = false; // false: Latin → Balinese, true: Balinese → Latin

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
      // carry the previous output across as the new input
      final prev = _output;
      _controller.text = prev;
      _output = prev.isEmpty
          ? ''
          : (_reverse ? balineseToLatin(prev) : latinToBalinese(prev));
    });
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
              autofocus: true,
              maxLines: 3,
              minLines: 1,
              style: inFont.copyWith(color: kInk),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: _reverse ? 'ᬑᬁᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ' : 'e.g. om swastiastu',
                suffixIcon: _controller.text.isEmpty ? null : IconButton(
                  icon: const Icon(Icons.clear, size: 20),
                  onPressed: () { _controller.clear(); _convert(''); },
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          Text(outLabel, style: const TextStyle(fontWeight: FontWeight.w600, color: kMuted, fontSize: 12)),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            constraints: const BoxConstraints(minHeight: 140),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FF),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFC5D8FC)),
            ),
            padding: const EdgeInsets.all(20),
            child: SelectableText(
              hasOut ? _output : (outIsBali ? 'ᬳᬓ᭄ᬱᬭᬩᬮᬶ' : 'aksara bali'),
              style: TextStyle(
                fontFamily: outIsBali ? kBaliFont : null,
                fontSize: outIsBali ? 40 : 24,
                height: 1.6,
                color: hasOut ? kInk : const Color(0x33000000),
              ),
            ),
          ),
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
            const SizedBox(width: 12),
            Expanded(child: FilledButton.icon(
              onPressed: hasOut ? () => SharePlus.instance.share(
                ShareParams(text: '$_output\n\n(${_controller.text.trim()}) — via Aksara Bali')) : null,
              style: FilledButton.styleFrom(backgroundColor: kBlue),
              icon: const Icon(Icons.share, size: 18),
              label: const Text('Share'),
            )),
          ]),
        ],
      ),
    );
  }
}
