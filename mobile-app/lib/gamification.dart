import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'l10n.dart';

/// Daily streak ("fire") + achievements, all stored locally.
final ValueNotifier<int> streakCount = ValueNotifier(0);
final ValueNotifier<Set<String>> unlocked = ValueNotifier(<String>{});
final ValueNotifier<String?> pendingUnlock = ValueNotifier(null); // id to toast

class Achievement {
  const Achievement(this.id, this.icon, this.titleEn, this.titleId, this.descEn, this.descId);
  final String id;
  final IconData icon;
  final String titleEn, titleId, descEn, descId;
  String title(BuildContext c) => LangScope.of(c) == AppLang.id ? titleId : titleEn;
  String desc(BuildContext c) => LangScope.of(c) == AppLang.id ? descId : descEn;
}

const List<Achievement> achievements = [
  Achievement('first_steps', Icons.flag, 'First Steps', 'Langkah Pertama',
      'Finish your first quiz', 'Selesaikan kuis pertamamu'),
  Achievement('perfect', Icons.star, 'Perfect!', 'Sempurna!',
      'Score 100 on a level', 'Raih skor 100 di satu level'),
  Achievement('streak_3', Icons.local_fire_department, 'On Fire', 'Membara',
      '3-day streak', 'Beruntun 3 hari'),
  Achievement('streak_7', Icons.whatshot, 'Unstoppable', 'Tak Terbendung',
      '7-day streak', 'Beruntun 7 hari'),
  Achievement('reading_pro', Icons.menu_book, 'Reader', 'Pembaca Ulung',
      'Pass all reading levels', 'Lulus semua level membaca'),
  Achievement('writing_pro', Icons.draw, 'Scribe', 'Penulis Ulung',
      'Pass all writing levels', 'Lulus semua level menulis'),
  Achievement('scribe_25', Icons.edit, 'Diligent', 'Rajin',
      'Write 25 aksara correctly', 'Tulis 25 aksara dengan benar'),
  Achievement('streak_30', Icons.calendar_month, 'Devoted', 'Setia',
      '30-day streak', 'Beruntun 30 hari'),
  Achievement('streak_100', Icons.military_tech, 'Centurion', 'Centurion',
      '100-day streak', 'Beruntun 100 hari'),
  Achievement('quiz_10', Icons.workspace_premium, 'Quiz Regular', 'Rajin Kuis',
      'Finish 10 quizzes', 'Selesaikan 10 kuis'),
  Achievement('quiz_50', Icons.emoji_events, 'Quiz Master', 'Master Kuis',
      'Finish 50 quizzes', 'Selesaikan 50 kuis'),
  Achievement('perfect_5', Icons.auto_awesome, 'Flawless', 'Tanpa Cela',
      'Score 100 on 5 levels', 'Raih skor 100 di 5 level'),
  Achievement('scribe_100', Icons.history_edu, 'Master Scribe', 'Juru Tulis',
      'Write 100 aksara correctly', 'Tulis 100 aksara dengan benar'),
  Achievement('grandmaster', Icons.stars, 'Grandmaster', 'Mahaguru',
      'Pass every level in both modes', 'Lulus semua level di kedua mode'),
];

String _dateStr(DateTime d) => '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

Future<void> loadStats() async {
  final prefs = await SharedPreferences.getInstance();
  unlocked.value = (prefs.getStringList('ach_unlocked') ?? const []).toSet();
  int count = prefs.getInt('streak_count') ?? 0;
  final last = prefs.getString('streak_last');
  if (last != null) {
    final today = _dateStr(DateTime.now());
    final yest = _dateStr(DateTime.now().subtract(const Duration(days: 1)));
    if (last != today && last != yest) count = 0; // streak broken
  }
  streakCount.value = count;
}

/// Call when the user completes a learning activity (quiz/writing). Updates the
/// daily streak and returns the new streak count.
Future<int> recordDailyActivity() async {
  final prefs = await SharedPreferences.getInstance();
  final today = _dateStr(DateTime.now());
  final last = prefs.getString('streak_last');
  int count = prefs.getInt('streak_count') ?? 0;
  if (last == today) { streakCount.value = count; return count; }
  final yest = _dateStr(DateTime.now().subtract(const Duration(days: 1)));
  count = (last == yest) ? count + 1 : 1;
  await prefs.setString('streak_last', today);
  await prefs.setInt('streak_count', count);
  streakCount.value = count;
  if (count >= 3) await unlock('streak_3');
  if (count >= 7) await unlock('streak_7');
  if (count >= 30) await unlock('streak_30');
  if (count >= 100) await unlock('streak_100');
  return count;
}

/// Call when a quiz level is finished. [score] is 0..100.
Future<void> recordQuizDone(int score) async {
  final prefs = await SharedPreferences.getInstance();
  final q = (prefs.getInt('quiz_done_count') ?? 0) + 1;
  await prefs.setInt('quiz_done_count', q);
  if (q >= 10) await unlock('quiz_10');
  if (q >= 50) await unlock('quiz_50');
  if (score >= 100) {
    final p = (prefs.getInt('perfect_count') ?? 0) + 1;
    await prefs.setInt('perfect_count', p);
    if (p >= 5) await unlock('perfect_5');
  }
  if (unlocked.value.contains('reading_pro') && unlocked.value.contains('writing_pro')) {
    await unlock('grandmaster');
  }
}

Future<bool> unlock(String id) async {
  if (unlocked.value.contains(id)) return false;
  final next = {...unlocked.value, id};
  unlocked.value = next;
  final prefs = await SharedPreferences.getInstance();
  await prefs.setStringList('ach_unlocked', next.toList());
  pendingUnlock.value = id;
  return true;
}

Future<void> recordWritingCorrect() async {
  final prefs = await SharedPreferences.getInstance();
  final c = (prefs.getInt('writing_correct_count') ?? 0) + 1;
  await prefs.setInt('writing_correct_count', c);
  if (c >= 25) await unlock('scribe_25');
  if (c >= 100) await unlock('scribe_100');
}

Achievement achievementById(String id) => achievements.firstWhere((a) => a.id == id);
