import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../converter.dart';
import '../words_data.dart';
import '../theme.dart';
import '../l10n.dart';
import '../balinese_keyboard.dart';

// Pass threshold (out of 100) to unlock the next level.
const int kPassScore = 70;

const _praisesEn = ['Nice!', 'Correct!', 'Great job!', 'Well done!', 'Awesome!'];
const _praisesId = ['Mantap!', 'Benar!', 'Kerja bagus!', 'Hebat!', 'Keren!'];
const _green = Color(0xFF16A34A);
const _red = Color(0xFFDC2626);

enum _QuizMode { reading, typing }

class _Level {
  const _Level(this.name, this.subEn, this.subId, this.diffs, this.count);
  final String name;
  final String subEn;
  final String subId;
  final List<String> diffs; // difficulty buckets this level draws from
  final int count; // number of questions
}

const List<_Level> _levels = [
  _Level('Pemula', 'Learn the basics.', 'Kenali dasar aksara.', ['easy'], 8),
  _Level('Mampu', 'Build deeper skill.', 'Latih kemampuan lebih dalam.', ['easy', 'medium'], 10),
  _Level('Cakap', 'Test your understanding.', 'Uji pemahaman aksara.', ['medium'], 10),
  _Level('Ahli', 'Advanced challenges.', 'Tantangan pertanyaan lanjutan.', ['medium', 'hard'], 10),
  _Level('Master', 'Sharpen your mastery.', 'Tes ketajaman pemahaman.', ['hard'], 10),
  _Level('GrandMaster', 'Prove you are the master.', 'Buktikan kamu sang master.', ['easy', 'medium', 'hard'], 12),
];

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});
  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final _rng = Random();
  // Scores are tracked separately per mode (reading vs. writing).
  final Map<_QuizMode, Map<int, int>> _best = {_QuizMode.reading: {}, _QuizMode.typing: {}};
  final Map<_QuizMode, Map<int, int>> _last = {_QuizMode.reading: {}, _QuizMode.typing: {}};
  bool _loaded = false;
  _QuizMode _mode = _QuizMode.reading;

  String _modeKey(_QuizMode m) => m == _QuizMode.reading ? 'reading' : 'typing';

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
  int _praiseIdx = 0;

  bool get _lastAnswerCorrect =>
      _mode == _QuizMode.reading ? _selected == _queue[_index]['latin'] : _lastCorrect;

  String _praise() => (LangScope.of(context) == AppLang.id ? _praisesId : _praisesEn)[_praiseIdx % 5];

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
    for (final m in _QuizMode.values) {
      final mk = _modeKey(m);
      for (int i = 0; i < _levels.length; i++) {
        _best[m]![i] = prefs.getInt('quiz_${mk}_best_$i') ?? 0;
        _last[m]![i] = prefs.getInt('quiz_${mk}_last_$i') ?? -1; // -1 = not played
      }
    }
    if (mounted) setState(() => _loaded = true);
  }

  bool _unlocked(int i) => i == 0 || (_best[_mode]![i - 1] ?? 0) >= kPassScore;

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
      _praiseIdx = _rng.nextInt(5);
      if (latin == _queue[_index]['latin']) _correct++;
    });
  }

  void _check() {
    if (_checked) return;
    final ok = _norm(_typeController.text) == _norm(latinToBalinese(_queue[_index]['latin'] ?? ''));
    setState(() { _checked = true; _lastCorrect = ok; _praiseIdx = _rng.nextInt(5); if (ok) _correct++; });
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
    final mode = _mode;
    final mk = _modeKey(mode);
    final prefs = await SharedPreferences.getInstance();
    _last[mode]![level] = score;
    await prefs.setInt('quiz_${mk}_last_$level', score);
    if (score > (_best[mode]![level] ?? 0)) {
      _best[mode]![level] = score;
      await prefs.setInt('quiz_${mk}_best_$level', score);
    }
    if (!mounted) return;

    final correct = _correct;
    final wrong = total - _correct;
    final passed = score >= kPassScore;
    final allDone = _levels.asMap().keys.every((i) => (_best[mode]![i] ?? 0) >= kPassScore);

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
        Text(tr(context, 'Quiz', 'Kuis'), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: kInk)),
        const SizedBox(height: 4),
        Text(tr(context, 'Conquer each level to unlock the next.', 'Taklukkan tiap level untuk membuka tingkat berikutnya.'),
            style: const TextStyle(color: kMuted, fontSize: 13)),
        const SizedBox(height: 14),
        Center(
          child: SegmentedButton<_QuizMode>(
            showSelectedIcon: false, // the auto checkmark widens the segment and wraps the label
            segments: [
              ButtonSegment(value: _QuizMode.reading,
                  label: Text(tr(context, 'Reading', 'Membaca'), maxLines: 1, softWrap: false),
                  icon: const Icon(Icons.menu_book_outlined, size: 18)),
              ButtonSegment(value: _QuizMode.typing,
                  label: Text(tr(context, 'Writing', 'Menulis'), maxLines: 1, softWrap: false),
                  icon: const Icon(Icons.keyboard_outlined, size: 18)),
            ],
            selected: {_mode},
            onSelectionChanged: (s) => setState(() => _mode = s.first),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          _mode == _QuizMode.reading
              ? tr(context, 'See the aksara, pick the correct Latin reading.', 'Lihat aksara, pilih bacaan Latin yang benar.')
              : tr(context, 'See the Latin word, write the aksara with the keyboard.', 'Lihat kata Latin, tulis aksaranya dengan papan aksara.'),
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
    final best = _best[_mode]![i] ?? 0;
    final last = _last[_mode]![i] ?? -1;
    final sub = LangScope.of(context) == AppLang.id ? lv.subId : lv.subEn;
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
                Text(sub, style: const TextStyle(fontSize: 12, color: kMuted)),
              ])),
              const SizedBox(width: 8),
              Column(crossAxisAlignment: CrossAxisAlignment.end, mainAxisSize: MainAxisSize.min, children: [
                Row(mainAxisSize: MainAxisSize.min, children: [
                  Text('${tr(context, 'Best', 'Terbaik')} ', style: const TextStyle(fontSize: 11, color: kMuted)),
                  Text('$best', style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w800,
                      color: best >= kPassScore ? const Color(0xFF16A34A) : kInk)),
                ]),
                Text(last < 0 ? tr(context, 'Last —', 'Terakhir —') : '${tr(context, 'Last', 'Terakhir')} $last',
                    style: const TextStyle(fontSize: 11, color: kMuted)),
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
            icon: const Icon(Icons.arrow_back), tooltip: tr(context, 'Back', 'Kembali'), padding: EdgeInsets.zero,
            constraints: const BoxConstraints(), visualDensity: VisualDensity.compact,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(lv.name, style: const TextStyle(fontWeight: FontWeight.w800, color: kInk, fontSize: 16))),
          Text('${tr(context, 'Correct', 'Benar')}: $_correct', style: const TextStyle(color: kBlue, fontWeight: FontWeight.w700)),
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
          if (_mode == _QuizMode.reading) ...[_feedbackBanner(), const SizedBox(height: 10)],
          FilledButton(
            onPressed: _next,
            style: FilledButton.styleFrom(
              backgroundColor: _lastAnswerCorrect ? _green : _red,
              minimumSize: const Size.fromHeight(50),
            ),
            child: Text(_index + 1 >= _queue.length ? tr(context, 'See result', 'Lihat hasil') : tr(context, 'Continue', 'Lanjut')),
          ),
        ],
      ]),
    );
  }

  // Reading: show aksara, pick the Latin reading.
  List<Widget> _readingQuestion() {
    final q = _queue[_index];
    return [
      Text('${tr(context, 'Q', 'Soal')} ${_index + 1}/${_queue.length}  ·  ${tr(context, 'Which aksara is this?', 'Aksara apa ini?')}', style: const TextStyle(color: kMuted)),
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

  // Duolingo-style feedback shown after answering a reading question.
  Widget _feedbackBanner() {
    final ok = _lastAnswerCorrect;
    final color = ok ? _green : _red;
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      padding: const EdgeInsets.all(14),
      child: Row(children: [
        Icon(ok ? Icons.check_circle : Icons.cancel, color: color, size: 30),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(ok ? _praise() : tr(context, 'Correct answer:', 'Jawaban benar:'),
              style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 17)),
          if (!ok) Text(_queue[_index]['latin'] ?? '',
              style: const TextStyle(color: kInk, fontSize: 15, fontWeight: FontWeight.w600)),
        ])),
      ]),
    );
  }

  // Typing: show the Latin word, type the aksara with the on-screen keyboard.
  List<Widget> _typingQuestion() {
    final q = _queue[_index];
    final answer = latinToBalinese(q['latin'] ?? '');
    return [
      Text('${tr(context, 'Q', 'Soal')} ${_index + 1}/${_queue.length}  ·  ${tr(context, 'Write the aksara for:', 'Tulis aksara untuk:')}', style: const TextStyle(color: kMuted)),
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
          decoration: InputDecoration(border: InputBorder.none, hintText: tr(context, 'Type the aksara here…', 'Ketik aksara di sini…')),
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
          label: Text(tr(context, 'Check', 'Periksa')),
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
              Text(_lastCorrect ? tr(context, 'Correct!', 'Benar!') : tr(context, 'Not quite', 'Belum tepat'),
                  style: TextStyle(fontWeight: FontWeight.w700,
                      color: _lastCorrect ? const Color(0xFF166534) : const Color(0xFF991B1B))),
              if (!_lastCorrect) Text('${tr(context, 'Answer:', 'Jawaban:')} $answer',
                  style: const TextStyle(fontFamily: kBaliFont, fontSize: 22, color: kInk)),
            ])),
          ]),
        ),
      const SizedBox(height: 8),
    ];
  }
}

// ── Result popup ────────────────────────────────────────────────────────────
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
        ? tr(context, 'Congratulations, you conquered every level brilliantly!',
            'Selamat, Kamu Berhasil Menaklukkan Semua Level dengan Luar Biasa!')
        : passed
            ? tr(context, 'Great! Level $levelName done!', 'Hebat! Level $levelName selesai!')
            : tr(context, 'Not passed — try again!', 'Belum lulus — coba lagi ya!');
    final body = allDone
        ? tr(context, 'You finished all levels! The challenge is done, but keep practising to sharpen your skills. Thanks for keeping it up!',
            'Kamu telah berhasil menyelesaikan semua level! Tantangan selesai, tapi kamu bisa terus berlatih untuk mengasah kemampuanmu. Terima kasih sudah terus berprestasi!')
        : passed
            ? tr(context, 'Your score is $score. The next level is unlocked — keep going!',
                'Skor kamu $score. Level berikutnya sudah terbuka — lanjutkan tantanganmu!')
            : tr(context, 'You need at least $kPassScore to unlock the next level. Give it another go!',
                'Kamu butuh skor minimal $kPassScore untuk membuka level berikutnya. Ayo ulangi!');

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
            _stat(Icons.check_circle, const Color(0xFF16A34A), '$correct', tr(context, 'Correct', 'Benar')),
            _stat(Icons.emoji_events, const Color(0xFFF59E0B), '$score', tr(context, 'Score', 'Skor')),
            _stat(Icons.cancel, const Color(0xFFDC2626), '$wrong', tr(context, 'Wrong', 'Salah')),
          ]),
          const SizedBox(height: 22),
          Row(children: [
            Expanded(child: OutlinedButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(tr(context, 'Retry', 'Ulangi')),
            )),
            const SizedBox(width: 12),
            Expanded(child: FilledButton(
              onPressed: () => Navigator.pop(context, false),
              style: FilledButton.styleFrom(backgroundColor: kBlue),
              child: Text(tr(context, 'See Details', 'Lihat Detail')),
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
