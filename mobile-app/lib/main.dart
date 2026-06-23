import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:share_plus/share_plus.dart';

void main() => runApp(const AksaraBaliApp());

/// Aksara Bali web API (see project README → Public API).
const String kApiBase = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app';

// Web palette (matches the website)
const kBlue = Color(0xFF0D6EFD);
const kPageBg = Color(0xFFF5F5F0);
const kCardBg = Color(0xFFFFFFFF);
const kBorder = Color(0xFFE0E0D8);
const kInk = Color(0xFF1A1A1A);
const kMuted = Color(0xFF6B7280);

class AksaraBaliApp extends StatelessWidget {
  const AksaraBaliApp({super.key});

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(colorSchemeSeed: kBlue, useMaterial3: true, scaffoldBackgroundColor: kPageBg);
    return MaterialApp(
      title: 'Aksara Bali',
      debugShowCheckedModeBanner: false,
      theme: base.copyWith(
        textTheme: GoogleFonts.interTextTheme(base.textTheme),
        appBarTheme: const AppBarTheme(backgroundColor: Colors.white, foregroundColor: kInk, elevation: 0, scrolledUnderElevation: 1),
      ),
      home: const HomeShell(),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(color: Colors.white, padding: const EdgeInsets.all(2),
                child: Image.asset('assets/icon/logo.png', width: 30, height: 30)),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text('Aksara Bali', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, height: 1.1)),
                Text('CONVERTER', style: TextStyle(fontSize: 10, color: kMuted, letterSpacing: 1.2)),
              ],
            ),
          ],
        ),
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Divider(height: 1, color: kBorder)),
      ),
      body: IndexedStack(index: _tab, children: const [ConvertScreen(), LearnScreen()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.translate_outlined), selectedIcon: Icon(Icons.translate), label: 'Convert'),
          NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Learn'),
        ],
      ),
    );
  }
}

BoxDecoration _card() => BoxDecoration(
      color: kCardBg,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: kBorder),
    );

// ── Converter ──────────────────────────────────────────────────────────────
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
      final res = await http.post(
        Uri.parse('$kApiBase/api/convert/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'text': t}),
      );
      if (res.statusCode == 200) {
        setState(() => _balinese = (jsonDecode(res.body)['balinese'] as String?) ?? '');
      } else {
        setState(() => _error = 'Server error (${res.statusCode})');
      }
    } catch (_) {
      setState(() => _error = 'Network error — check your connection.');
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

          // Input card
          Container(
            decoration: _card(),
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

          // Output card
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
                          fontFamily: 'NotoSansBalinese',
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
          const SizedBox(height: 16),
          const Center(child: Text('Powered by the Aksara Bali web API',
              style: TextStyle(fontSize: 12, color: kMuted))),
        ],
      ),
    );
  }
}

// ── Learn (practice words) ───────────────────────────────────────────────────
class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});
  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  String _difficulty = 'easy';
  bool _loading = false;
  String? _error;
  List<dynamic> _words = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final res = await http.get(Uri.parse('$kApiBase/api/words/?difficulty=$_difficulty'));
      if (res.statusCode == 200) {
        setState(() => _words = (jsonDecode(res.body)['words'] as List?) ?? []);
      } else {
        setState(() => _error = 'Server error (${res.statusCode})');
      }
    } catch (_) {
      setState(() => _error = 'Network error — check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Wrap(spacing: 8, children: [
            for (final d in ['easy', 'medium', 'hard'])
              ChoiceChip(
                label: Text(d[0].toUpperCase() + d.substring(1)),
                selected: _difficulty == d,
                onSelected: (_) { setState(() => _difficulty = d); _load(); },
              ),
          ]),
        ),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : _error != null
                  ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                      itemCount: _words.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (_, i) {
                        final w = _words[i] as Map<String, dynamic>;
                        return Container(
                          decoration: _card(),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          child: Row(children: [
                            Expanded(
                              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Text('${w['latin']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: kInk)),
                                if (w['meaning'] != null)
                                  Text('${w['meaning']}', style: const TextStyle(fontSize: 12, color: kMuted)),
                              ]),
                            ),
                            Text('${w['balinese'] ?? ''}',
                                style: const TextStyle(fontFamily: 'NotoSansBalinese', fontSize: 30, color: kBlue)),
                          ]),
                        );
                      },
                    ),
        ),
      ],
    );
  }
}
