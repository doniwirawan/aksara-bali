import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../api.dart';
import '../theme.dart';

class ConvertScreen extends StatefulWidget {
  const ConvertScreen({super.key});
  @override
  State<ConvertScreen> createState() => _ConvertScreenState();
}

class _ConvertScreenState extends State<ConvertScreen> {
  final _controller = TextEditingController();
  String _balinese = '';
  bool _loading = false;
  String? _error;
  Timer? _debounce;

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String v) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), () => _convert(v));
  }

  Future<void> _convert(String text) async {
    final t = text.trim();
    if (t.isEmpty) {
      setState(() { _balinese = ''; _error = null; });
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final out = await Api.convert(t);
      if (mounted) setState(() => _balinese = out);
    } catch (_) {
      if (mounted) setState(() => _error = 'Network error — check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasOut = _balinese.isNotEmpty;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 4),
          Text('Latin → Aksara Bali',
              style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: kInk)),
          const SizedBox(height: 4),
          const Text('Type Latin text to convert it to Balinese script in real time.',
              style: TextStyle(color: kMuted, fontSize: 13)),
          const SizedBox(height: 16),
          Container(
            decoration: cardDecoration(),
            padding: const EdgeInsets.all(14),
            child: TextField(
              controller: _controller,
              onChanged: _onChanged,
              autofocus: true,
              maxLines: 3,
              minLines: 1,
              style: const TextStyle(fontSize: 18, color: kInk),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: 'e.g. om swastiastu',
                suffixIcon: _controller.text.isEmpty ? null : IconButton(
                  icon: const Icon(Icons.clear, size: 20),
                  onPressed: () { _controller.clear(); _onChanged(''); },
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            constraints: const BoxConstraints(minHeight: 160),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FF),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFC5D8FC)),
            ),
            padding: const EdgeInsets.all(20),
            child: _loading
                ? const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()))
                : _error != null
                    ? Text(_error!, style: const TextStyle(color: Colors.red))
                    : SelectableText(
                        hasOut ? _balinese : 'ᬳᬓ᭄ᬱᬭᬩᬮᬶ',
                        style: TextStyle(
                          fontFamily: kBaliFont,
                          fontSize: 44,
                          height: 1.6,
                          color: hasOut ? kInk : const Color(0x33000000),
                        ),
                      ),
          ),
          const SizedBox(height: 14),
          Row(children: [
            Expanded(child: OutlinedButton.icon(
              onPressed: hasOut ? () async {
                await Clipboard.setData(ClipboardData(text: _balinese));
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
                ShareParams(text: '$_balinese\n\n(${_controller.text.trim()}) — via Aksara Bali')) : null,
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
