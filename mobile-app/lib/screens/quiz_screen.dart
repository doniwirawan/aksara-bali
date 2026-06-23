import 'dart:math';
import 'package:flutter/material.dart';
import '../api.dart';
import '../theme.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});
  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final _rng = Random();
  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> _pool = [];
  List<Map<String, dynamic>> _queue = [];
  int _index = 0;
  int _score = 0;
  List<String> _options = [];
  String? _selected;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final w = await Api.words();
      _pool = w.where((e) => (e['balinese'] ?? '').toString().isNotEmpty).toList();
      _restart();
    } catch (_) {
      if (mounted) setState(() => _error = 'Network error — check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _restart() {
    _queue = [..._pool]..shuffle(_rng);
    if (_queue.length > 10) _queue = _queue.sublist(0, 10);
    _index = 0;
    _score = 0;
    _selected = null;
    _buildOptions();
  }

  void _buildOptions() {
    if (_index >= _queue.length) return;
    final correct = _queue[_index]['latin'] as String;
    final others = (_pool.map((e) => e['latin'] as String).toSet()..remove(correct)).toList()..shuffle(_rng);
    _options = [correct, ...others.take(3)]..shuffle(_rng);
  }

  void _answer(String latin) {
    if (_selected != null) return;
    setState(() {
      _selected = latin;
      if (latin == _queue[_index]['latin']) _score++;
    });
  }

  void _next() {
    setState(() {
      _index++;
      _selected = null;
      _buildOptions();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        Text(_error!, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 12),
        OutlinedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('Retry')),
      ]));
    }
    if (_pool.length < 4) {
      return const Center(child: Text('Not enough words to start a quiz.'));
    }

    final done = _index >= _queue.length;
    if (done) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.emoji_events, size: 56, color: kBlue),
          const SizedBox(height: 12),
          Text('Score: $_score / ${_queue.length}',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: kInk)),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () => setState(_restart),
            style: FilledButton.styleFrom(backgroundColor: kBlue),
            icon: const Icon(Icons.replay),
            label: const Text('Play again'),
          ),
        ]),
      );
    }

    final q = _queue[_index];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Question ${_index + 1}/${_queue.length}', style: const TextStyle(color: kMuted)),
            Text('Score: $_score', style: const TextStyle(color: kBlue, fontWeight: FontWeight.w700)),
          ]),
          const SizedBox(height: 16),
          const Text('Which Latin reading is this?', style: TextStyle(color: kMuted)),
          const SizedBox(height: 12),
          Container(
            decoration: cardDecoration(),
            padding: const EdgeInsets.symmetric(vertical: 28),
            alignment: Alignment.center,
            child: Text('${q['balinese']}',
                style: const TextStyle(fontFamily: kBaliFont, fontSize: 56, color: kInk)),
          ),
          const SizedBox(height: 20),
          for (final opt in _options) _optionButton(opt, q['latin'] as String),
          if (_selected != null) ...[
            const SizedBox(height: 8),
            FilledButton(
              onPressed: _next,
              style: FilledButton.styleFrom(backgroundColor: kBlue, minimumSize: const Size.fromHeight(48)),
              child: Text(_index + 1 >= _queue.length ? 'See result' : 'Next'),
            ),
          ],
        ],
      ),
    );
  }

  Widget _optionButton(String opt, String correct) {
    Color? bg;
    Color fg = kInk;
    if (_selected != null) {
      if (opt == correct) { bg = const Color(0xFFDCFCE7); fg = const Color(0xFF166534); }
      else if (opt == _selected) { bg = const Color(0xFFFEE2E2); fg = const Color(0xFF991B1B); }
    }
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: bg ?? kCardBg,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () => _answer(opt),
          child: Container(
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(12), border: Border.all(color: kBorder)),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Text(opt, style: TextStyle(fontSize: 16, color: fg, fontWeight: FontWeight.w600)),
          ),
        ),
      ),
    );
  }
}
