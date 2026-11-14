import 'package:flutter/material.dart';
import 'theme.dart';
import 'l10n.dart';
import 'gamification.dart';
import 'sfx.dart';
import 'screens/convert_screen.dart';
import 'screens/write_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/reference_screen.dart';
import 'screens/about_screen.dart';
import 'screens/achievements_screen.dart';
import 'update_check.dart';
import 'update_sheet.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Fully offline: both typefaces are bundled assets, nothing is fetched.
  // Lets us declare "no data collected" on Play.
  await loadLang();
  await loadTheme();
  await loadStats();
  await Sfx.instance.init();
  runApp(const AksaraBaliApp());
}

class AksaraBaliApp extends StatelessWidget {
  const AksaraBaliApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: darkMode,
      builder: (_, dark, __) => ValueListenableBuilder<AppLang>(
        valueListenable: appLang,
        builder: (_, lang, ___) => LangScope(
          lang: lang,
          child: MaterialApp(
            title: 'Aksara Bali',
            debugShowCheckedModeBanner: false,
            theme: buildAppTheme(),
            home: const HomeShell(),
          ),
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
  // Keyed so state (quiz progress, text fields) survives the rebuild triggered
  // by a dark-mode toggle.
  final _keys = List.generate(5, (_) => GlobalKey());

  @override
  void initState() {
    super.initState();
    pendingUnlock.addListener(_showUnlock);
    // GitHub APK only: offer a newer release as soon as it is out.
    if (!kPlayStoreBuild) {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        final u = await autoCheckForUpdate();
        if (u != null && mounted) showUpdateSheet(context, u);
      });
    }
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
      backgroundColor: kSurfaceRaised,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 3),
      content: Row(children: [
        Icon(a.icon, color: kAccent),
        const SizedBox(width: 12),
        Expanded(child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(tr(context, 'Achievement unlocked!', 'Pencapaian terbuka!'),
              style: TextStyle(color: kTextSecondary, fontSize: 12)),
          Text(a.title(context), style: TextStyle(color: kTextPrimary, fontWeight: FontWeight.w700)),
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
            Image.asset('assets/icon/logo.png', width: 30, height: 30),
            const SizedBox(width: 10),
            const Text('Aksara Bali', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: kPaper)),
          ],
        ),
        actions: [
          // Daily streak "fire" → opens Achievements
          ValueListenableBuilder<int>(
            valueListenable: streakCount,
            builder: (context, streak, _) => InkWell(
              borderRadius: BorderRadius.zero,
              onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AchievementsScreen())),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                child: Row(children: [
                  Icon(Icons.local_fire_department, size: 22, color: streak > 0 ? kTurmeric : kShellMuted),
                  const SizedBox(width: 2),
                  Text('$streak', style: TextStyle(fontWeight: FontWeight.w800, color: streak > 0 ? kPaper : kShellMuted)),
                ]),
              ),
            ),
          ),
          ValueListenableBuilder<bool>(
            valueListenable: darkMode,
            builder: (context, dark, _) => IconButton(
              tooltip: tr(context, dark ? 'Light mode' : 'Dark mode', dark ? 'Mode terang' : 'Mode gelap'),
              icon: Icon(dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 20),
              onPressed: () => setDark(!dark),
            ),
          ),
          TextButton(
            onPressed: () => setLang(isId ? AppLang.en : AppLang.id),
            style: TextButton.styleFrom(
              foregroundColor: kShellMuted,
              minimumSize: const Size(40, 34),
              side: const BorderSide(color: Color(0xFF3A352D)),
              padding: const EdgeInsets.symmetric(horizontal: 10),
            ),
            child: Text(isId ? 'EN' : 'ID', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, letterSpacing: 0.8)),
          ),
          const SizedBox(width: 4),
        ],
        // The braided tridatu thread, as on the website header.
        flexibleSpace: const Align(alignment: Alignment.topCenter, child: SafeArea(bottom: false, child: Thread())),
      ),
      body: ValueListenableBuilder<bool>(
        valueListenable: darkMode,
        builder: (_, __, ___) => IndexedStack(
          index: _tab,
          children: [
            ConvertScreen(key: _keys[0]),
            WriteScreen(key: _keys[1]),
            QuizScreen(key: _keys[2]),
            ReferenceScreen(key: _keys[3]),
            AboutScreen(key: _keys[4]),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.translate_outlined), label: tr(context, 'Convert', 'Konversi')),
          NavigationDestination(icon: const Icon(Icons.draw_outlined), label: tr(context, 'Write', 'Tulis')),
          NavigationDestination(icon: const Icon(Icons.quiz_outlined), label: tr(context, 'Quiz', 'Kuis')),
          NavigationDestination(icon: const Icon(Icons.menu_book_outlined), label: tr(context, 'Aksara', 'Aksara')),
          NavigationDestination(icon: const Icon(Icons.info_outline), label: tr(context, 'About', 'Tentang')),
        ],
      ),
    );
  }
}
