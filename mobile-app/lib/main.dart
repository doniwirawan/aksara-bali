import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'l10n.dart';
import 'gamification.dart';
import 'screens/convert_screen.dart';
import 'screens/write_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/reference_screen.dart';
import 'screens/about_screen.dart';
import 'screens/achievements_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Keep the app fully offline: never fetch fonts over the network (falls back
  // to the bundled/system font). Lets us declare "no data collected" on Play.
  GoogleFonts.config.allowRuntimeFetching = false;
  await loadLang();
  await loadStats();
  runApp(const AksaraBaliApp());
}

class AksaraBaliApp extends StatelessWidget {
  const AksaraBaliApp({super.key});

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(colorSchemeSeed: kBlue, useMaterial3: true, scaffoldBackgroundColor: kPageBg);
    return ValueListenableBuilder<AppLang>(
      valueListenable: appLang,
      builder: (_, lang, __) => LangScope(
        lang: lang,
        child: MaterialApp(
          title: 'Aksara Bali',
          debugShowCheckedModeBanner: false,
          theme: base.copyWith(
            textTheme: GoogleFonts.interTextTheme(base.textTheme),
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.white, foregroundColor: kInk, elevation: 0, scrolledUnderElevation: 1),
          ),
          home: const HomeShell(),
        ),
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _tab = 0;
  final _screens = const [ConvertScreen(), WriteScreen(), QuizScreen(), ReferenceScreen(), AboutScreen()];

  @override
  void initState() {
    super.initState();
    pendingUnlock.addListener(_showUnlock);
  }

  @override
  void dispose() {
    pendingUnlock.removeListener(_showUnlock);
    super.dispose();
  }

  void _showUnlock() {
    final id = pendingUnlock.value;
    if (id == null || !mounted) return;
    final a = achievementById(id);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      backgroundColor: kInk,
      duration: const Duration(seconds: 3),
      content: Row(children: [
        Icon(a.icon, color: const Color(0xFFF59E0B)),
        const SizedBox(width: 12),
        Expanded(child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(tr(context, 'Achievement unlocked!', 'Pencapaian terbuka!'),
              style: const TextStyle(color: Colors.white70, fontSize: 12)),
          Text(a.title(context), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
        ])),
      ]),
    ));
    pendingUnlock.value = null;
  }

  @override
  Widget build(BuildContext context) {
    final isId = LangScope.of(context) == AppLang.id;
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(color: Colors.white, padding: const EdgeInsets.all(2),
                child: Image.asset('assets/icon/logo.png', width: 30, height: 30)),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text('Aksara Bali', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, height: 1.1)),
                Text('CONVERTER', style: TextStyle(fontSize: 10, color: kMuted, letterSpacing: 1.2)),
              ],
            ),
          ],
        ),
        actions: [
          // Daily streak "fire" → opens Achievements
          ValueListenableBuilder<int>(
            valueListenable: streakCount,
            builder: (context, streak, _) => InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AchievementsScreen())),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                child: Row(children: [
                  Icon(Icons.local_fire_department, size: 22, color: streak > 0 ? const Color(0xFFF59E0B) : kMuted),
                  const SizedBox(width: 2),
                  Text('$streak', style: TextStyle(fontWeight: FontWeight.w800, color: streak > 0 ? kInk : kMuted)),
                ]),
              ),
            ),
          ),
          TextButton.icon(
            onPressed: () => setLang(isId ? AppLang.en : AppLang.id),
            icon: const Icon(Icons.language, size: 18),
            label: Text(isId ? 'ID' : 'EN', style: const TextStyle(fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: 4),
        ],
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Divider(height: 1, color: kBorder)),
      ),
      body: IndexedStack(index: _tab, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.translate_outlined), selectedIcon: const Icon(Icons.translate), label: tr(context, 'Convert', 'Konversi')),
          NavigationDestination(icon: const Icon(Icons.edit_outlined), selectedIcon: const Icon(Icons.edit), label: tr(context, 'Write', 'Tulis')),
          NavigationDestination(icon: const Icon(Icons.quiz_outlined), selectedIcon: const Icon(Icons.quiz), label: tr(context, 'Quiz', 'Kuis')),
          NavigationDestination(icon: const Icon(Icons.table_chart_outlined), selectedIcon: const Icon(Icons.table_chart), label: tr(context, 'Aksara', 'Aksara')),
          NavigationDestination(icon: const Icon(Icons.info_outline), selectedIcon: const Icon(Icons.info), label: tr(context, 'About', 'Tentang')),
        ],
      ),
    );
  }
}
