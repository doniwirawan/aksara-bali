import 'package:flutter/material.dart';
import '../converter.dart';
import '../words_data.dart';
import '../theme.dart';

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});
  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  String _difficulty = 'easy';

  @override
  Widget build(BuildContext context) {
    final words = kWords.where((w) => w['difficulty'] == _difficulty).toList();
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
                onSelected: (_) => setState(() => _difficulty = d),
              ),
          ]),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
            itemCount: words.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (_, i) {
              final w = words[i];
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
                  Text(latinToBalinese(w['latin'] ?? ''),
                      style: const TextStyle(fontFamily: kBaliFont, fontSize: 30, color: kBlue)),
                ]),
              );
            },
          ),
        ),
      ],
    );
  }
}
