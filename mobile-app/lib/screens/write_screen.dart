import 'dart:math';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import '../converter.dart';
import '../words_data.dart';
import '../theme.dart';
import '../l10n.dart';
import '../gamification.dart';
import '../balinese_keyboard.dart';

class WriteScreen extends StatefulWidget {
  const WriteScreen({super.key});
  @override
  State<WriteScreen> createState() => _WriteScreenState();
}

class _WriteScreenState extends State<WriteScreen> {
  final _rng = Random();
  final _canvasKey = GlobalKey();
  final List<List<Offset>> _strokes = [];
  bool _showGuide = true;
  bool _checking = false;
  _ScoreResult? _result;
  late Map<String, String?> _word;

  // Type mode: reproduce the aksara with the on-screen Balinese keyboard.
  bool _typeMode = false;
  final _typed = TextEditingController();
  bool? _typeCorrect; // null = not checked yet

  @override
  void initState() {
    super.initState();
    _word = kWords[_rng.nextInt(kWords.length)];
  }

  @override
  void dispose() {
    _typed.dispose();
    super.dispose();
  }

  void _newWord() {
    setState(() {
      _word = kWords[_rng.nextInt(kWords.length)];
      _strokes.clear();
      _result = null;
      _typed.clear();
      _typeCorrect = null;
    });
  }

  // Compare the typed aksara to the target. Single words → exact-match check
  // (zero-width space from the keyboard's "Spasi" key is ignored).
  void _checkTyped() {
    final target = latinToBalinese(_word['latin'] ?? '');
    final typed = _typed.text.replaceAll('​', '').trim();
    final ok = typed.isNotEmpty && typed == target;
    setState(() => _typeCorrect = ok);
    if (ok) {
      recordDailyActivity();
      recordWritingCorrect();
      Future.delayed(const Duration(milliseconds: 1300), () {
        if (mounted && _typeCorrect == true) _newWord();
      });
    }
  }

  Future<void> _check() async {
    final size = _canvasKey.currentContext?.size;
    if (size == null || _strokes.isEmpty) return;
    setState(() => _checking = true);

    final balinese = latinToBalinese(_word['latin'] ?? '');
    final w = size.width.round();
    final h = size.height.round();

    final userBytes = await _rasterize(w, h, (canvas) {
      _StrokePainter(_strokes).paint(canvas, size);
    });
    final refBytes = await _rasterize(w, h, (canvas) {
      final fontSize = min(h * 0.65, w * 0.45);
      final tp = TextPainter(
        text: TextSpan(
          text: balinese,
          style: TextStyle(fontFamily: kBaliFont, fontSize: fontSize, color: Colors.black),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset((w - tp.width) / 2, (h - tp.height) / 2));
    });

    final result = _score(userBytes, refBytes, w, h);
    if (mounted) setState(() { _result = result; _checking = false; });

    // If the writing is good: record progress and move to the next word.
    if (result.isCorrect) {
      recordDailyActivity();
      recordWritingCorrect();
      Future.delayed(const Duration(milliseconds: 1300), () {
        if (mounted && _result != null && _result!.isCorrect) _newWord();
      });
    }
  }

  // Render [draw] onto an offscreen canvas and return its raw RGBA pixels.
  Future<Uint8List> _rasterize(int w, int h, void Function(Canvas) draw) async {
    final recorder = ui.PictureRecorder();
    draw(Canvas(recorder));
    final image = await recorder.endRecording().toImage(w, h);
    final data = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
    image.dispose();
    return data!.buffer.asUint8List();
  }

  @override
  Widget build(BuildContext context) {
    final balinese = latinToBalinese(_word['latin'] ?? '');

    final prompt = Container(
      decoration: cardDecoration(),
      padding: const EdgeInsets.all(14),
      child: Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(tr(context, 'Write this:', 'Tulis ini:'), style: TextStyle(color: kMuted, fontSize: 12)),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(balinese, maxLines: 1,
                style: TextStyle(fontFamily: kBaliFont, fontSize: 30, color: kInk, height: 1.6)),
          ),
          const SizedBox(height: 6),
          Text('${_word['latin']}  ·  ${_word['meaning'] ?? ''}',
              style: TextStyle(fontSize: 13, color: kMuted)),
        ])),
        TextButton.icon(onPressed: _newWord, icon: const Icon(Icons.shuffle, size: 16), label: Text(tr(context, 'New', 'Baru'))),
      ]),
    );

    final canvas = Container(
      key: _canvasKey,
      clipBehavior: Clip.hardEdge,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: kBorder),
      ),
      child: Stack(children: [
        if (_showGuide)
          Align(
            alignment: const Alignment(0, -0.28), // nudge the guide a bit higher
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(balinese, maxLines: 1, textAlign: TextAlign.center,
                    textHeightBehavior: const TextHeightBehavior(
                        applyHeightToFirstAscent: false, applyHeightToLastDescent: false),
                    style: TextStyle(fontFamily: kBaliFont, fontSize: 120, color: Colors.black.withValues(alpha: 0.10))),
              ),
            ),
          ),
        GestureDetector(
          onPanStart: (d) => setState(() { _result = null; _strokes.add([d.localPosition]); }),
          onPanUpdate: (d) => setState(() {
            if (_strokes.isNotEmpty) _strokes.last.add(d.localPosition);
          }),
          child: CustomPaint(painter: _StrokePainter(_strokes), size: Size.infinite),
        ),
      ]),
    );

    final undoBtn = OutlinedButton.icon(
      onPressed: _strokes.isEmpty ? null : () => setState(() { _strokes.removeLast(); _result = null; }),
      icon: const Icon(Icons.undo, size: 18),
      label: FittedBox(fit: BoxFit.scaleDown, child: Text(tr(context, 'Undo', 'Urungkan'), maxLines: 1, softWrap: false)),
    );
    final clearBtn = OutlinedButton.icon(
      onPressed: _strokes.isEmpty ? null : () => setState(() { _strokes.clear(); _result = null; }),
      icon: const Icon(Icons.delete_outline, size: 18),
      label: FittedBox(fit: BoxFit.scaleDown, child: Text(tr(context, 'Clear', 'Hapus'), maxLines: 1, softWrap: false)),
    );
    final guideBtn = FilledButton.icon(
      onPressed: () => setState(() => _showGuide = !_showGuide),
      style: FilledButton.styleFrom(backgroundColor: _showGuide ? kAccent : Colors.grey),
      icon: Icon(_showGuide ? Icons.visibility : Icons.visibility_off, size: 18),
      label: FittedBox(fit: BoxFit.scaleDown, child: Text(tr(context, 'Guide', 'Panduan'), maxLines: 1, softWrap: false)),
    );
    final controls = Row(children: [
      Expanded(child: undoBtn),
      const SizedBox(width: 10),
      Expanded(child: clearBtn),
      const SizedBox(width: 10),
      Expanded(child: guideBtn),
    ]);

    final checkButton = FilledButton.icon(
      onPressed: (_strokes.isEmpty || _checking) ? null : _check,
      icon: _checking
          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
          : const Icon(Icons.check_circle_outline, size: 18),
      label: Text(_checking
          ? tr(context, 'Checking…', 'Memeriksa…')
          : tr(context, 'Check my writing', 'Periksa tulisan')),
    );

    final hint = Text(
        tr(context, 'Trace the faint aksara, then tap Check to score how close your shape is.',
            'Jiplak aksara samar, lalu ketuk Periksa untuk menilai seberapa mirip bentukmu.'),
        textAlign: TextAlign.center, style: TextStyle(color: kMuted, fontSize: 12));

    final modeToggle = Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: kBorder),
      ),
      child: Row(children: [
        _modeChip(tr(context, 'Draw', 'Gambar'), Icons.draw_outlined, !_typeMode,
            () => setState(() { _typeMode = false; _typeCorrect = null; })),
        _modeChip(tr(context, 'Type', 'Ketik'), Icons.keyboard_outlined, _typeMode,
            () => setState(() { _typeMode = true; _result = null; })),
      ]),
    );

    // Type mode: reproduce the aksara with the on-screen Balinese keyboard.
    if (_typeMode) {
      final typedDisplay = Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 84),
        padding: const EdgeInsets.all(16),
        alignment: Alignment.centerLeft,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: kBorder),
        ),
        child: _typed.text.isEmpty
            ? Text(tr(context, 'Type the aksara above…', 'Ketik aksara di atas…'),
                style: TextStyle(color: kMuted, fontSize: 14, fontStyle: FontStyle.italic))
            : Text(_typed.text,
                style: TextStyle(fontFamily: kBaliFont, fontSize: 34, color: kInk, height: 1.6)),
      );

      final typeCheckButton = FilledButton.icon(
        onPressed: _typed.text.replaceAll('​', '').trim().isEmpty ? null : _checkTyped,
        icon: const Icon(Icons.check_circle_outline, size: 18),
        label: Text(tr(context, 'Check my writing', 'Periksa tulisan')),
      );

      return SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          prompt,
          const SizedBox(height: 12),
          modeToggle,
          const SizedBox(height: 14),
          typedDisplay,
          const SizedBox(height: 12),
          if (_typeCorrect != null) ...[_TypeResultCard(_typeCorrect!), const SizedBox(height: 12)],
          BalineseKeyboard(controller: _typed, onChanged: () => setState(() => _typeCorrect = null)),
          const SizedBox(height: 12),
          typeCheckButton,
          const SizedBox(height: 10),
          Text(
              tr(context, 'Tap the aksara keys to rebuild the word, then Check.',
                  'Ketuk tombol aksara untuk menyusun kata, lalu Periksa.'),
              textAlign: TextAlign.center, style: TextStyle(color: kMuted, fontSize: 12)),
        ]),
      );
    }

    return LayoutBuilder(builder: (context, c) {
      // Landscape / wide: controls on the left, big canvas filling the height on the right.
      if (c.maxWidth > c.maxHeight) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            SizedBox(
              width: 320,
              child: SingleChildScrollView(
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  prompt,
                  const SizedBox(height: 12),
                  modeToggle,
                  const SizedBox(height: 12),
                  if (_result != null) ...[_ScoreCard(_result!), const SizedBox(height: 12)],
                  undoBtn,
                  const SizedBox(height: 8),
                  clearBtn,
                  const SizedBox(height: 8),
                  guideBtn,
                  const SizedBox(height: 10),
                  checkButton,
                  const SizedBox(height: 10),
                  hint,
                ]),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(child: canvas),
          ]),
        );
      }

      // Portrait
      return SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            prompt,
            const SizedBox(height: 12),
            modeToggle,
            const SizedBox(height: 14),
            AspectRatio(aspectRatio: 1.5, child: canvas),
            const SizedBox(height: 12),
            if (_result != null) ...[_ScoreCard(_result!), const SizedBox(height: 12)],
            controls,
            const SizedBox(height: 10),
            checkButton,
            const SizedBox(height: 10),
            hint,
          ],
        ),
      );
    });
  }

  Widget _modeChip(String label, IconData icon, bool selected, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? kAccent : Colors.transparent,
            borderRadius: BorderRadius.circular(9),
          ),
          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            Icon(icon, size: 16, color: selected ? Colors.white : kMuted),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(
                color: selected ? Colors.white : kMuted, fontWeight: FontWeight.w600, fontSize: 13)),
          ]),
        ),
      ),
    );
  }
}

// Pixel-comparison scoring, ported 1:1 from the web (HandGestureCanvas).
// Normalizes user ink and reference glyph into a 64×64 grid by bounding box,
// dilates for stroke-width tolerance, then returns the precision/recall F1.
_ScoreResult _score(Uint8List user, Uint8List ref, int w, int h) {
  const norm = 64;
  const dil = 3;
  bool userTest(int idx) => user[idx + 3] > 50; // alpha
  bool refTest(int idx) => ref[idx + 3] > 50; // alpha

  ({int minX, int minY, int w, int h})? bbox(bool Function(int) test) {
    int minX = w, minY = h, maxX = -1, maxY = -1;
    for (int py = 0; py < h; py++) {
      for (int px = 0; px < w; px++) {
        if (test((py * w + px) * 4)) {
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
    }
    if (maxX < 0) return null;
    return (minX: minX, minY: minY, w: maxX - minX + 1, h: maxY - minY + 1);
  }

  Uint8List rasterize(bool Function(int) test, ({int minX, int minY, int w, int h}) bb) {
    final grid = Uint8List(norm * norm);
    final scale = (norm - 2) / max(bb.w, bb.h);
    final offX = (norm - bb.w * scale) / 2;
    final offY = (norm - bb.h * scale) / 2;
    for (int py = bb.minY; py < bb.minY + bb.h; py++) {
      for (int px = bb.minX; px < bb.minX + bb.w; px++) {
        if (!test((py * w + px) * 4)) continue;
        final gx = (offX + (px - bb.minX) * scale).floor();
        final gy = (offY + (py - bb.minY) * scale).floor();
        if (gx >= 0 && gx < norm && gy >= 0 && gy < norm) grid[gy * norm + gx] = 1;
      }
    }
    return grid;
  }

  // User ink below the "something was drawn" threshold → empty.
  int userPixels = 0;
  for (int i = 0; i < w * h; i++) {
    if (userTest(i * 4)) userPixels++;
  }
  if (userPixels < 30) return _ScoreResult.empty();

  final ubb = bbox(userTest);
  final rbb = bbox(refTest);
  if (ubb == null || rbb == null) return _ScoreResult.empty();

  final userGrid = rasterize(userTest, ubb);
  final refGrid = rasterize(refTest, rbb);

  Uint8List dilate(Uint8List grid) {
    final out = Uint8List(norm * norm);
    for (int gy = 0; gy < norm; gy++) {
      for (int gx = 0; gx < norm; gx++) {
        if (grid[gy * norm + gx] == 0) continue;
        for (int dy = -dil; dy <= dil; dy++) {
          for (int dx = -dil; dx <= dil; dx++) {
            final ny = gy + dy, nx = gx + dx;
            if (ny >= 0 && ny < norm && nx >= 0 && nx < norm) out[ny * norm + nx] = 1;
          }
        }
      }
    }
    return out;
  }

  final dilRef = dilate(refGrid);
  final dilUser = dilate(userGrid);

  int userCells = 0, userInRef = 0, refCells = 0, refCovered = 0;
  for (int i = 0; i < norm * norm; i++) {
    if (userGrid[i] != 0) { userCells++; if (dilRef[i] != 0) userInRef++; }
    if (refGrid[i] != 0) { refCells++; if (dilUser[i] != 0) refCovered++; }
  }

  final precision = userCells > 0 ? userInRef / userCells * 100 : 0.0;
  final recall = refCells > 0 ? refCovered / refCells * 100 : 0.0;
  final score = (precision > 0 && recall > 0) ? 2 * precision * recall / (precision + recall) : 0.0;

  return _ScoreResult(
    score: score.round(),
    precision: precision.round(),
    recall: recall.round(),
  );
}

class _ScoreResult {
  const _ScoreResult({required this.score, required this.precision, required this.recall});
  _ScoreResult.empty() : score = 0, precision = 0, recall = 0;
  final int score;
  final int precision;
  final int recall;

  bool get isCorrect => score >= 55;
  bool get isPartial => score >= 30 && score < 55;

  Color get color {
    if (score >= 55) return const Color(0xFF16A34A); // green
    if (score >= 30) return const Color(0xFFD97706); // amber
    return const Color(0xFFDC2626); // red
  }
}

class _ScoreCard extends StatelessWidget {
  const _ScoreCard(this.r);
  final _ScoreResult r;

  @override
  Widget build(BuildContext context) {
    final big = r.isCorrect
        ? tr(context, 'Great job!', 'Bagus sekali!')
        : r.isPartial
            ? tr(context, 'Almost there!', 'Hampir!')
            : tr(context, 'Try again', 'Coba lagi');
    final sub = r.isCorrect
        ? tr(context, 'Moving to the next word…', 'Lanjut ke kata berikutnya…')
        : r.isPartial
            ? tr(context, 'Keep practising the shape.', 'Terus latih bentuknya.')
            : tr(context, 'Trace the faint guide and retry.', 'Jiplak panduan samar lalu ulangi.');
    return Container(
      decoration: BoxDecoration(
        color: r.color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: r.color.withValues(alpha: 0.4)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            width: 48, height: 48, alignment: Alignment.center,
            decoration: BoxDecoration(color: r.color.withValues(alpha: 0.15), shape: BoxShape.circle),
            child: Icon(r.isCorrect ? Icons.emoji_events : (r.isPartial ? Icons.adjust : Icons.refresh), color: r.color, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(big, style: TextStyle(color: r.color, fontWeight: FontWeight.w800, fontSize: 18)),
            const SizedBox(height: 2),
            Text(sub, style: TextStyle(color: kMuted, fontSize: 12)),
          ])),
          Text('${r.score}%', style: TextStyle(color: r.color, fontWeight: FontWeight.w900, fontSize: 24)),
        ]),
        const SizedBox(height: 12),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: r.score / 100,
            minHeight: 8,
            backgroundColor: kBorder,
            valueColor: AlwaysStoppedAnimation(r.color),
          ),
        ),
        const SizedBox(height: 8),
        Text('${tr(context, 'Precision', 'Presisi')}: ${r.precision}%   ·   ${tr(context, 'Coverage', 'Cakupan')}: ${r.recall}%',
            style: TextStyle(color: kMuted, fontSize: 12)),
      ]),
    );
  }
}

// Feedback banner for Type mode — exact-match check, so it's pass/fail.
class _TypeResultCard extends StatelessWidget {
  const _TypeResultCard(this.correct);
  final bool correct;

  @override
  Widget build(BuildContext context) {
    final color = correct ? const Color(0xFF16A34A) : const Color(0xFFDC2626);
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(children: [
        Container(
          width: 48, height: 48, alignment: Alignment.center,
          decoration: BoxDecoration(color: color.withValues(alpha: 0.15), shape: BoxShape.circle),
          child: Icon(correct ? Icons.emoji_events : Icons.refresh, color: color, size: 28),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(correct ? tr(context, 'Great job!', 'Bagus sekali!') : tr(context, 'Not quite', 'Belum tepat'),
              style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 18)),
          const SizedBox(height: 2),
          Text(
              correct
                  ? tr(context, 'Moving to the next word…', 'Lanjut ke kata berikutnya…')
                  : tr(context, 'Compare each aksara and try again.', 'Bandingkan tiap aksara lalu coba lagi.'),
              style: TextStyle(color: kMuted, fontSize: 12)),
        ])),
      ]),
    );
  }
}

class _StrokePainter extends CustomPainter {
  _StrokePainter(this.strokes);
  final List<List<Offset>> strokes;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = kAccent
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    for (final stroke in strokes) {
      if (stroke.length < 2) {
        if (stroke.isNotEmpty) {
          canvas.drawCircle(stroke.first, 3, Paint()..color = kAccent);
        }
        continue;
      }
      final path = Path()..moveTo(stroke.first.dx, stroke.first.dy);
      for (int i = 1; i < stroke.length; i++) {
        path.lineTo(stroke[i].dx, stroke[i].dy);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(_StrokePainter old) => true;
}
