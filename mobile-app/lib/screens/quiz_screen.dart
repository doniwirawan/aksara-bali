import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../converter.dart';
import '../words_data.dart';
import '../theme.dart';
import '../balinese_keyboard.dart';

// Pass threshold (out of 100) to unlock the next level.
const int kPassScore = 70;

enum _QuizMode { reading, typing }

class _Level {
  const _Level(this.name, this.subtitle, this.diffs, this.count);
  final String name;
  final String subtitle;
  final List<String> diffs; // difficulty buckets this level draws from
  final int count; // number of questions
}

const List<_Level> _levels = [
  _Level('Pemula', 'Kenali dasar aksara.', ['easy'], 8),
  _Level('Mampu', 'Latih kemampuan lebih dalam.', ['easy', 'medium'], 10),
  _Level('Cakap', 'Uji pemahaman aksara.', ['medium'], 10),
  _Level('Ahli', 'Tantangan pertanyaan lanjutan.', ['medium', 'hard'], 10),
  _Level('Master', 'Tes ketajaman pemahaman.', ['hard'], 10),
  _Level('GrandMaster', 'Buktikan kamu sang master.', ['easy', 'medium', 'hard'], 12),
];

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});
  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final _rng = Random();
  final Map<int, int> _best = {}; // level index -> best score (0..100)
  bool _loaded = false;
  _QuizMode _mode = _QuizMode.reading;

  int? _active; // null = level list; otherwise index of level being played
  List<Map<String, String?>> _queue = [];
  int _index = 0;
  int _correct = 0;

  // reading-mode state
  List<String> _options = [];
  String? _selected;

  // typing-mode state
  final _typeController = TextEditingController();
  bool _checked = false;
  bool _lastCorrect = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _typeController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < _levels.length; i++) {
      _best[i] = prefs.getInt('quiz_best_$i') ?? 0;
    }
    if (mounted) setState(() => _loaded = true);
  }

  bool _unlocked(int i) => i == 0 || (_best[i - 1] ?? 0) >= kPassScore;

  String _norm(String s) => s.replaceAll('​', '').trim();

  void _start(int level) {
    final pool = kWords.where((w) => _levels[level].diffs.contains(w['difficulty'])).toList()..shuffle(_rng);
    setState(() {
      _active = level;
      _queue = pool.take(_levels[level].count).toList();
      _index = 0;
      _correct = 0;
      _selected = null;
      _checked = false;
      _typeController.clear();
      _buildOptions();
    });
  }

  void _buildOptions() {
    if (_index >= _queue.length) return;
    final correct = _queue[_index]['latin']!;
    final others = (kWords.map((e) => e['latin']!).toSet()..remove(correct)).toList()..shuffle(_rng);
    _options = [correct, ...others.take(3)]..shuffle(_rng);
  }

  bool get _answered => _mode == _QuizMode.reading ? _selected != null : _checked;

  void _answer(String latin) {
    if (_selected != null) return;
    setState(() {
      _selected = latin;
      if (latin == _queue[_index]['latin']) _correct++;
    });
  }

  void _check() {
    if (_checked) return;
    final ok = _norm(_typeController.text) == _norm(latinToBalinese(_queue[_index]['latin'] ?? ''));
    setState(() { _checked = true; _lastCorrect = ok; if (ok) _correct++; });
  }

  Future<void> _next() async {
    if (_index + 1 >= _queue.length) {
      await _finish();
    } else {
      setState(() {
        _index++;
        _selected = null;
        _checked = false;
        _typeController.clear();
        _buildOptions();
      });
    }
  }

  Future<void> _finish() async {
    final total = _queue.length;
    final score = total == 0 ? 0 : (_correct / total * 100).round();
    final level = _active!;
    if (score > (_best[level] ?? 0)) {
      _best[level] = score;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('quiz_best_$level', score);
    }
    if (!mounted) return;

    final correct = _correct;
    final wrong = total - _correct;
    final passed = score >= kPassScore;
    final allDone = _levels.asMap().keys.every((i) => (_best[i] ?? 0) >= kPassScore);

    final replay = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (_) => _ResultDialog(
        correct: correct, score: score, wrong: wrong,
        passed: passed, allDone: allDone, levelName: _levels[level].name,
      ),
    );

    if (!mounted) return;
    if (replay == true) {
      _start(level);
    } else {
      setState(() => _active = null); // back to the level list
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_loaded) return const Center(child: CircularProgressIndicator());
    return _active == null ? _buildLevels() : _buildPlay();
  }

  // ── Level list ──────────────────────────────────────────────────────────
  Widget _buildLevels() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Quiz', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: kInk)),
        const SizedBox(height: 4),
        const Text('Taklukkan tiap level untuk membuka tingkat berikutnya.',
            style: TextStyle(color: kMuted, fontSize: 13)),
        const SizedBox(height: 14),
        Center(
          child: SegmentedButton<_QuizMode>(
            segments: const [
              ButtonSegment(value: _QuizMode.reading, label: Text('Membaca'), icon: Icon(Icons.menu_book_outlined, size: 18)),
              ButtonSegment(value: _QuizMode.typing, label: Text('Menulis'), icon: Icon(Icons.keyboard_outlined, size: 18)),
            ],
            selected: {_mode},
            onSelectionChanged: (s) => setState(() => _mode = s.first),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          _mode == _QuizMode.reading
              ? 'Lihat aksara, pilih bacaan Latin yang benar.'
              : 'Lihat kata Latin, tulis aksaranya dengan papan aksara.',
          textAlign: TextAlign.center,
          style: const TextStyle(color: kMuted, fontSize: 12),
        ),
        const SizedBox(height: 16),
        for (int i = 0; i < _levels.length; i++) ...[
          _levelCard(i),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _levelCard(int i) {
    final lv = _levels[i];
    final unlocked = _unlocked(i);
    final best = _best[i] ?? 0;
    return Opacity(
      opacity: unlocked ? 1 : 0.6,
      child: Material(
        color: kCardBg,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: unlocked ? () => _start(i) : null,
          child: Container(
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), border: Border.all(color: kBorder)),
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              Container(
                width: 44, height: 44,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: unlocked ? kBlue.withValues(alpha: 0.12) : const Color(0xFFEDEDF0),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: unlocked
                    ? Text('${i + 1}', style: const TextStyle(fontWeight: FontWeight.w800, color: kBlue, fontSize: 18))
                    : const Icon(Icons.lock_outline, size: 20, color: kMuted),
              ),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(lv.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: kInk)),
                const SizedBox(height: 2),
                Text(lv.subtitle, style: const TextStyle(fontSize: 12, color: kMuted)),
              ])),
              const SizedBox(width: 8),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                const Text('Score', style: TextStyle(fontSize: 11, color: kMuted)),
                Text('$best', style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.w800,
                    color: best >= kPassScore ? const Color(0xFF16A34A) : kInk)),
              ]),
            ]),
          ),
        ),
      ),
    );
  }

  // ── Playing a level ─────────────────────────────────────────────────────
  Widget _buildPlay() {
    final lv = _levels[_active!];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(children: [
          IconButton(
            onPressed: () => setState(() => _active = null),
            icon: const Icon(Icons.arrow_back), tooltip: 'Kembali', padding: EdgeInsets.zero,
            constraints: const BoxConstraints(), visualDensity: VisualDensity.compact,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(lv.name, style: const TextStyle(fontWeight: FontWeight.w800, color: kInk, fontSize: 16))),
          Text('Benar: $_correct', style: const TextStyle(color: kBlue, fontWeight: FontWeight.w700)),
        ]),
        const SizedBox(height: 12),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: (_index + 1) / _queue.length,
            minHeight: 6, backgroundColor: kBorder, valueColor: const AlwaysStoppedAnimation(kBlue),
          ),
        ),
        const SizedBox(height: 12),
        if (_mode == _QuizMode.reading) ..._readingQuestion() else ..._typingQuestion(),
        if (_answered) ...[
          const SizedBox(height: 8),
          FilledButton(
            onPressed: _next,
            style: FilledButton.styleFrom(backgroundColor: kBlue, minimumSize: const Size.fromHeight(48)),
            child: Text(_index + 1 >= _queue.length ? 'Lihat hasil' : 'Lanjut'),
          ),
        ],
      ]),
    );
  }

  // Reading: show aksara, pick the Latin reading.
  List<Widget> _readingQuestion() {
    final q = _queue[_index];
    return [
      Text('Soal ${_index + 1}/${_queue.length}  ·  Aksara apa ini?', style: const TextStyle(color: kMuted)),
      const SizedBox(height: 12),
      Container(
        decoration: cardDecoration(),
        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 16),
        alignment: Alignment.center,
        child: SizedBox(
          width: double.infinity,
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(latinToBalinese(q['latin'] ?? ''),
                maxLines: 1,
                style: const TextStyle(fontFamily: kBaliFont, fontSize: 56, color: kInk)),
          ),
        ),
      ),
      const SizedBox(height: 20),
      for (final opt in _options) _optionButton(opt, q['latin']!),
    ];
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

  // Typing: show the Latin word, type the aksara with the on-screen keyboard.
  List<Widget> _typingQuestion() {
    final q = _queue[_index];
    final answer = latinToBalinese(q['latin'] ?? '');
    return [
      Text('Soal ${_index + 1}/${_queue.length}  ·  Tulis aksara untuk:', style: const TextStyle(color: kMuted)),
      const SizedBox(height: 12),
      Container(
        decoration: cardDecoration(),
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        alignment: Alignment.center,
        child: Column(children: [
          Text(q['latin'] ?? '', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: kInk)),
          if (q['meaning'] != null) ...[
            const SizedBox(height: 4),
            Text(q['meaning']!, style: const TextStyle(fontSize: 13, color: kMuted)),
          ],
        ]),
      ),
      const SizedBox(height: 14),
      Container(
        decoration: cardDecoration(),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: TextField(
          controller: _typeController,
          readOnly: true,
          showCursor: true,
          style: const TextStyle(fontFamily: kBaliFont, fontSize: 28, color: kInk),
          decoration: const InputDecoration(border: InputBorder.none, hintText: 'Ketik aksara di sini…'),
        ),
      ),
      const SizedBox(height: 12),
      BalineseKeyboard(controller: _typeController, onChanged: () => setState(() {})),
      const SizedBox(height: 14),
      if (!_checked)
        FilledButton.icon(
          onPressed: _norm(_typeController.text).isEmpty ? null : _check,
          style: FilledButton.styleFrom(backgroundColor: kBlue, minimumSize: const Size.fromHeight(48)),
          icon: const Icon(Icons.check, size: 18),
          label: const Text('Periksa'),
        )
      else
        Container(
          decoration: BoxDecoration(
            color: (_lastCorrect ? const Color(0xFF16A34A) : const Color(0xFFDC2626)).withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: (_lastCorrect ? const Color(0xFF16A34A) : const Color(0xFFDC2626)).withValues(alpha: 0.4)),
          ),
          padding: const EdgeInsets.all(14),
          child: Row(children: [
            Icon(_lastCorrect ? Icons.check_circle : Icons.cancel,
                color: _lastCorrect ? const Color(0xFF16A34A) : const Color(0xFFDC2626)),
            const SizedBox(width: 10),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_lastCorrect ? 'Benar!' : 'Belum tepat',
                  style: TextStyle(fontWeight: FontWeight.w700,
                      color: _lastCorrect ? const Color(0xFF166534) : const Color(0xFF991B1B))),
              if (!_lastCorrect) Text('Jawaban: $answer',
                  style: const TextStyle(fontFamily: kBaliFont, fontSize: 22, color: kInk)),
            ])),
          ]),
        ),
      const SizedBox(height: 8),
    ];
  }
}

// ── Result popup (screenshot #3) ────────────────────────────────────────────
class _ResultDialog extends StatelessWidget {
  const _ResultDialog({
    required this.correct, required this.score, required this.wrong,
    required this.passed, required this.allDone, required this.levelName,
  });
  final int correct, score, wrong;
  final bool passed, allDone;
  final String levelName;

  @override
  Widget build(BuildContext context) {
    final title = allDone
        ? 'Selamat, Kamu Berhasil Menaklukkan Semua Level dengan Luar Biasa!'
        : passed
            ? 'Hebat! Level $levelName selesai!'
            : 'Belum lulus — coba lagi ya!';
    final body = allDone
        ? 'Kamu telah berhasil menyelesaikan semua level! Tantangan selesai, tapi kamu bisa terus berlatih untuk mengasah kemampuanmu. Terima kasih sudah terus berprestasi!'
        : passed
            ? 'Skor kamu $score. Level berikutnya sudah terbuka — lanjutkan tantanganmu!'
            : 'Kamu butuh skor minimal $kPassScore untuk membuka level berikutnya. Ayo ulangi!';

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text(title, textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: kInk, height: 1.3)),
          const SizedBox(height: 16),
          Icon(passed ? Icons.emoji_events : Icons.refresh,
              size: 64, color: passed ? const Color(0xFFF59E0B) : kMuted),
          const SizedBox(height: 16),
          Text(body, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, color: kMuted, height: 1.4)),
          const SizedBox(height: 20),
          Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
            _stat(Icons.check_circle, const Color(0xFF16A34A), '$correct', 'Benar'),
            _stat(Icons.emoji_events, const Color(0xFFF59E0B), '$score', 'Score'),
            _stat(Icons.cancel, const Color(0xFFDC2626), '$wrong', 'Salah'),
          ]),
          const SizedBox(height: 22),
          Row(children: [
            Expanded(child: OutlinedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Ulangi'),
            )),
            const SizedBox(width: 12),
            Expanded(child: FilledButton(
              onPressed: () => Navigator.pop(context, false),
              style: FilledButton.styleFrom(backgroundColor: kBlue),
              child: const Text('Lihat Detail'),
            )),
          ]),
        ]),
      ),
    );
  }

  Widget _stat(IconData icon, Color color, String value, String label) {
    return Column(children: [
      Icon(icon, color: color, size: 22),
      const SizedBox(height: 4),
      Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: kInk)),
      Text(label, style: const TextStyle(fontSize: 11, color: kMuted)),
    ]);
  }
}
