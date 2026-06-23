import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'screens/convert_screen.dart';
import 'screens/write_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/learn_screen.dart';
import 'screens/about_screen.dart';

void main() => runApp(const AksaraBaliApp());

class AksaraBaliApp extends StatelessWidget {
  const AksaraBaliApp({super.key});

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(colorSchemeSeed: kBlue, useMaterial3: true, scaffoldBackgroundColor: kPageBg);
    return MaterialApp(
      title: 'Aksara Bali',
      debugShowCheckedModeBanner: false,
      theme: base.copyWith(
        textTheme: GoogleFonts.interTextTheme(base.textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white, foregroundColor: kInk, elevation: 0, scrolledUnderElevation: 1),
      ),
      home: const HomeShell(),
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
  final _screens = const [ConvertScreen(), WriteScreen(), QuizScreen(), LearnScreen(), AboutScreen()];

  @override
  Widget build(BuildContext context) {
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
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Divider(height: 1, color: kBorder)),
      ),
      body: IndexedStack(index: _tab, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.translate_outlined), selectedIcon: Icon(Icons.translate), label: 'Convert'),
          NavigationDestination(icon: Icon(Icons.edit_outlined), selectedIcon: Icon(Icons.edit), label: 'Write'),
          NavigationDestination(icon: Icon(Icons.quiz_outlined), selectedIcon: Icon(Icons.quiz), label: 'Quiz'),
          NavigationDestination(icon: Icon(Icons.school_outlined), selectedIcon: Icon(Icons.school), label: 'Learn'),
          NavigationDestination(icon: Icon(Icons.info_outline), selectedIcon: Icon(Icons.info), label: 'About'),
        ],
      ),
    );
  }
}
