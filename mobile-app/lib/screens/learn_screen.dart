import 'package:flutter/material.dart';
import '../api.dart';
import '../theme.dart';

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});
  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  String _difficulty = 'easy';
  bool _loading = false;
  String? _error;
  List<Map<String, dynamic>> _words = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final w = await Api.words(difficulty: _difficulty);
      if (mounted) setState(() => _words = w);
    } catch (_) {
      if (mounted) setState(() => _error = 'Network error — check your connection.');
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
                  ? _Retry(error: _error!, onRetry: _load)
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                        itemCount: _words.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (_, i) {
                          final w = _words[i];
                          return Container(
                            decoration: cardDecoration(),
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
                                  style: const TextStyle(fontFamily: kBaliFont, fontSize: 30, color: kBlue)),
                            ]),
                          );
                        },
                      ),
                    ),
        ),
      ],
    );
  }
}

class _Retry extends StatelessWidget {
  const _Retry({required this.error, required this.onRetry});
  final String error;
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Text(error, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 12),
        OutlinedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Retry')),
      ]),
    );
  }
}
