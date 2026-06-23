import 'dart:math';
import 'package:flutter/material.dart';
import '../converter.dart';
import '../words_data.dart';
import '../theme.dart';

class WriteScreen extends StatefulWidget {
  const WriteScreen({super.key});
  @override
  State<WriteScreen> createState() => _WriteScreenState();
}

class _WriteScreenState extends State<WriteScreen> {
  final _rng = Random();
  final List<List<Offset>> _strokes = [];
  bool _showGuide = true;
  late Map<String, String?> _word;

  @override
  void initState() {
    super.initState();
    _word = kWords[_rng.nextInt(kWords.length)];
  }

  void _newWord() {
    setState(() {
      _word = kWords[_rng.nextInt(kWords.length)];
      _strokes.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final balinese = latinToBalinese(_word['latin'] ?? '');
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Word prompt
          Container(
            decoration: cardDecoration(),
            padding: const EdgeInsets.all(14),
            child: Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Write this:', style: TextStyle(color: kMuted, fontSize: 12)),
                const SizedBox(height: 2),
                Text(balinese, style: const TextStyle(fontFamily: kBaliFont, fontSize: 30, color: kInk)),
                Text('${_word['latin']}  ·  ${_word['meaning'] ?? ''}',
                    style: const TextStyle(fontSize: 13, color: kMuted)),
              ])),
              TextButton.icon(onPressed: _newWord, icon: const Icon(Icons.shuffle, size: 16), label: const Text('New')),
            ]),
          ),
          const SizedBox(height: 14),

          // Drawing canvas
          AspectRatio(
            aspectRatio: 1.5,
            child: Container(
              clipBehavior: Clip.hardEdge,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: kBorder),
              ),
              child: Stack(children: [
                if (_showGuide)
                  Center(child: Text(balinese,
                      style: TextStyle(fontFamily: kBaliFont, fontSize: 120, height: 1, color: Colors.black.withValues(alpha: 0.10)))),
                GestureDetector(
                  onPanStart: (d) => setState(() => _strokes.add([d.localPosition])),
                  onPanUpdate: (d) => setState(() {
                    if (_strokes.isNotEmpty) _strokes.last.add(d.localPosition);
                  }),
                  child: CustomPaint(painter: _StrokePainter(_strokes), size: Size.infinite),
                ),
              ]),
            ),
          ),
          const SizedBox(height: 12),

          Row(children: [
            Expanded(child: OutlinedButton.icon(
              onPressed: _strokes.isEmpty ? null : () => setState(() => _strokes.removeLast()),
              icon: const Icon(Icons.undo, size: 18), label: const Text('Undo'),
            )),
            const SizedBox(width: 10),
            Expanded(child: OutlinedButton.icon(
              onPressed: _strokes.isEmpty ? null : () => setState(_strokes.clear),
              icon: const Icon(Icons.delete_outline, size: 18), label: const Text('Clear'),
            )),
            const SizedBox(width: 10),
            Expanded(child: FilledButton.icon(
              onPressed: () => setState(() => _showGuide = !_showGuide),
              style: FilledButton.styleFrom(backgroundColor: _showGuide ? kBlue : Colors.grey),
              icon: Icon(_showGuide ? Icons.visibility : Icons.visibility_off, size: 18),
              label: Text(_showGuide ? 'Guide' : 'Guide'),
            )),
          ]),
          const SizedBox(height: 10),
          const Text('Trace the faint aksara with your finger to practice the strokes.',
              textAlign: TextAlign.center, style: TextStyle(color: kMuted, fontSize: 12)),
        ],
      ),
    );
  }
}

class _StrokePainter extends CustomPainter {
  _StrokePainter(this.strokes);
  final List<List<Offset>> strokes;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = kBlue
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    for (final stroke in strokes) {
      if (stroke.length < 2) {
        if (stroke.isNotEmpty) {
          canvas.drawCircle(stroke.first, 3, Paint()..color = kBlue);
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
