import 'package:flutter/material.dart';
import '../theme.dart';
import '../l10n.dart';
import '../gamification.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(tr(context, 'Achievements', 'Pencapaian'))),
      body: ValueListenableBuilder<Set<String>>(
        valueListenable: unlocked,
        builder: (context, done, _) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Streak header
            ValueListenableBuilder<int>(
              valueListenable: streakCount,
              builder: (context, streak, __) => Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEF4444)]),
                  borderRadius: BorderRadius.circular(16),
                ),
                padding: const EdgeInsets.all(18),
                child: Row(children: [
                  const Icon(Icons.local_fire_department, color: Colors.white, size: 44),
                  const SizedBox(width: 14),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('$streak', style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w900, height: 1)),
                    Text(tr(context, 'day streak', 'hari beruntun'),
                        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                  ]),
                  const Spacer(),
                  Text('${done.length}/${achievements.length}',
                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
                ]),
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Text(tr(context, 'Keep practising daily to grow your streak.',
                      'Berlatih tiap hari untuk menambah streak-mu.'),
                  style: const TextStyle(color: kMuted, fontSize: 12)),
            ),
            for (final a in achievements) _tile(context, a, done.contains(a.id)),
          ],
        ),
      ),
    );
  }

  Widget _tile(BuildContext context, Achievement a, bool earned) {
    final color = earned ? kBlue : kMuted;
    return Opacity(
      opacity: earned ? 1 : 0.55,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: cardDecoration(),
        padding: const EdgeInsets.all(14),
        child: Row(children: [
          Container(
            width: 48, height: 48, alignment: Alignment.center,
            decoration: BoxDecoration(
              color: (earned ? kBlue : kMuted).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(earned ? a.icon : Icons.lock_outline, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(a.title(context), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: kInk)),
            const SizedBox(height: 2),
            Text(a.desc(context), style: const TextStyle(fontSize: 12, color: kMuted)),
          ])),
          if (earned) const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 22),
        ]),
      ),
    );
  }
}
