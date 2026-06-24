import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../theme.dart';
import '../l10n.dart';
import '../gamification.dart';

const _targets = [3, 7, 14, 30, 50, 75, 100, 125, 150, 200, 300, 365];

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
            // Streak header with next-target progress + share
            ValueListenableBuilder<int>(
              valueListenable: streakCount,
              builder: (context, streak, __) {
                final next = _targets.firstWhere((t) => t > streak, orElse: () => _targets.last);
                final prev = _targets.where((t) => t <= streak).fold<int>(0, (a, b) => b > a ? b : a);
                final maxed = streak >= _targets.last;
                final progress = maxed ? 1.0 : (next > prev ? (streak - prev) / (next - prev) : 0.0);
                return Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEF4444)]),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  padding: const EdgeInsets.all(18),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      const Icon(Icons.local_fire_department, color: Colors.white, size: 44),
                      const SizedBox(width: 14),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('$streak', style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w900, height: 1)),
                        Text(tr(context, 'day streak', 'hari beruntun'),
                            style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                      ]),
                      const Spacer(),
                      IconButton(
                        tooltip: tr(context, 'Share streak', 'Bagikan streak'),
                        onPressed: () => SharePlus.instance.share(ShareParams(text: tr(context,
                            '🔥 $streak-day streak learning Aksara Bali! Try it: $kWebUrl',
                            '🔥 Beruntun $streak hari belajar Aksara Bali! Coba juga: $kWebUrl'))),
                        icon: const Icon(Icons.share, color: Colors.white),
                      ),
                    ]),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: progress.clamp(0.0, 1.0), minHeight: 8,
                        backgroundColor: Colors.white24,
                        valueColor: const AlwaysStoppedAnimation(Colors.white),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      maxed
                          ? tr(context, 'Max streak reached — legend! 🏆', 'Streak maksimum — legenda! 🏆')
                          : '${tr(context, 'Next target', 'Target berikutnya')}: $next ${tr(context, 'days', 'hari')}  ·  $streak/$next',
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ]),
                );
              },
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Text('${done.length}/${achievements.length} ${tr(context, 'unlocked', 'terbuka')}  ·  ${tr(context, 'Keep practising daily to grow your streak.', 'Berlatih tiap hari untuk menambah streak-mu.')}',
                  style: TextStyle(color: kMuted, fontSize: 12)),
            ),
            for (final a in achievements) _tile(context, a, done.contains(a.id)),
          ],
        ),
      ),
    );
  }

  Widget _tile(BuildContext context, Achievement a, bool earned) {
    final color = earned ? kAccent : kMuted;
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
              color: (earned ? kAccent : kMuted).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(earned ? a.icon : Icons.lock_outline, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(a.title(context), style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: kInk)),
            const SizedBox(height: 2),
            Text(a.desc(context), style: TextStyle(fontSize: 12, color: kMuted)),
          ])),
          if (earned) const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 22),
        ]),
      ),
    );
  }
}
