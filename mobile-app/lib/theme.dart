import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Font + external links.
const kBaliFont = 'NotoSansBalinese';
const kUiFont = 'SchibstedGrotesk';
const String kApiBase = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app';
const String kWebUrl = 'https://aksarabali.doniwirawan.xyz';

// ── Tridatu ─────────────────────────────────────────────────────────────────
// The same world as the website: Nawa Sanga colours as flat fields. Bang (red)
// holds the script, selem (black) holds the shell, putih (white) is the ground,
// kuning (turmeric) marks the active choice. Square corners, hairlines, no
// shadows; the braided red-white-black thread is the one ornament.
const kRed = Color(0xFFB4232B);
const kRedDeep = Color(0xFF8E1A21);
const kBlack = Color(0xFF17140F);
const kPaper = Color(0xFFF7F6F2);
const kTurmeric = Color(0xFFE2A41C);
const kBraidRed = Color(0xFFD6343D);
const kShellMuted = Color(0xFFBDB7AA); // secondary text on the black shell

class _Pal {
  const _Pal({
    required this.bg, required this.surface, required this.surfaceRaised,
    required this.accent, required this.accentSoft, required this.onAccent,
    required this.textPrimary, required this.textSecondary, required this.textMuted,
    required this.outline, required this.script,
  });
  final Color bg, surface, surfaceRaised, accent, accentSoft, onAccent,
      textPrimary, textSecondary, textMuted, outline, script;
}

const _light = _Pal(
  bg: kPaper,
  surface: Color(0xFFFFFFFF),
  surfaceRaised: Color(0xFFEFEDE6),
  accent: kRed,
  accentSoft: Color(0xFFFBF0D6), // turmeric wash: selection and active states
  onAccent: Color(0xFFFFFFFF),
  textPrimary: kBlack,
  textSecondary: Color(0xFF5E594F),
  textMuted: Color(0xFF7A7468),
  outline: Color(0xFFDEDBD2),
  script: kRed,
);

const _dark = _Pal(
  bg: Color(0xFF12100C),
  surface: Color(0xFF1C1915),
  surfaceRaised: Color(0xFF26221C),
  accent: Color(0xFFC0313A),
  accentSoft: Color(0xFF352A12),
  onAccent: Color(0xFFFFFFFF),
  textPrimary: Color(0xFFF1EEE6),
  textSecondary: Color(0xFFA9A396),
  textMuted: Color(0xFF8C8579),
  outline: Color(0xFF3A352D),
  script: Color(0xFFC0313A),
);

// ── Light / dark mode (light is the default, as on the website) ─────────────
final ValueNotifier<bool> darkMode = ValueNotifier(false);

Future<void> loadTheme() async {
  final p = await SharedPreferences.getInstance();
  darkMode.value = p.getBool('dark_mode') ?? false;
}

Future<void> setDark(bool v) async {
  darkMode.value = v;
  final p = await SharedPreferences.getInstance();
  await p.setBool('dark_mode', v);
}

_Pal get _p => darkMode.value ? _dark : _light;

// Semantic theme tokens (getters → react to [darkMode] on rebuild).
Color get kBg => _p.bg;
Color get kSurface => _p.surface;
Color get kSurfaceRaised => _p.surfaceRaised;
Color get kAccent => _p.accent;
Color get kAccentSoft => _p.accentSoft;
Color get kOnAccent => _p.onAccent;
Color get kTextPrimary => _p.textPrimary;
Color get kTextSecondary => _p.textSecondary;
Color get kTextMuted => _p.textMuted;
Color get kOutline => _p.outline;
/// The flat red field the script sits on.
Color get kScriptField => _p.script;

// Legacy aliases so existing widgets keep working.
Color get kPageBg => kBg;
Color get kCardBg => kSurface;
Color get kBorder => kOutline;
Color get kInk => kTextPrimary;
Color get kMuted => kTextSecondary;
Color get kAccentColor => kAccent;

const _square = RoundedRectangleBorder(borderRadius: BorderRadius.zero);

// Flat panel: a hairline, square corners, no shadow.
BoxDecoration cardDecoration() => BoxDecoration(
      color: kSurface,
      border: Border.all(color: kOutline),
    );

/// The braided red-white-black tridatu thread, as a horizontal band.
class Thread extends StatelessWidget {
  const Thread({super.key, this.height = 6});
  final double height;
  @override
  Widget build(BuildContext context) =>
      SizedBox(height: height, width: double.infinity, child: CustomPaint(painter: _ThreadPainter()));
}

class _ThreadPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, Paint()..color = kBlack);
    final h = size.height;
    final stripe = h * 1.4;
    const colors = [kBraidRed, kPaper, kBlack];
    var i = 0;
    for (double x = -h * 2; x < size.width + h * 2; x += stripe) {
      final path = Path()
        ..moveTo(x, h)
        ..lineTo(x + stripe, h)
        ..lineTo(x + stripe + h * 0.9, 0)
        ..lineTo(x + h * 0.9, 0)
        ..close();
      canvas.drawPath(path, Paint()..color = colors[i % 3]);
      i++;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

ThemeData buildAppTheme() {
  final dark = darkMode.value;
  final scheme = ColorScheme.fromSeed(
    seedColor: kRed,
    brightness: dark ? Brightness.dark : Brightness.light,
  ).copyWith(
    primary: kAccent,
    onPrimary: kOnAccent,
    secondary: kTurmeric,
    onSecondary: kBlack,
    secondaryContainer: kAccentSoft,
    onSecondaryContainer: kTextPrimary,
    surface: kSurface,
    onSurface: kTextPrimary,
    surfaceContainerHighest: kSurfaceRaised,
    outline: kOutline,
    outlineVariant: kOutline,
  );
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: kBg,
    fontFamily: kUiFont,
  );
  final buttonText = const TextStyle(fontFamily: kUiFont, fontWeight: FontWeight.w700, fontSize: 15);
  return base.copyWith(
    textTheme: base.textTheme
        .apply(fontFamily: kUiFont, bodyColor: kTextPrimary, displayColor: kTextPrimary)
        .copyWith(
          headlineSmall: base.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -0.4),
          titleLarge: base.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -0.3),
        ),
    scaffoldBackgroundColor: kBg,
    dividerColor: kOutline,
    textSelectionTheme: TextSelectionThemeData(
      cursorColor: kRed,
      selectionColor: kTurmeric.withValues(alpha: 0.45),
      selectionHandleColor: kTurmeric,
    ),
    // The shell is black in both themes, like the website header.
    appBarTheme: const AppBarTheme(
      backgroundColor: kBlack,
      foregroundColor: kPaper,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      titleTextStyle: TextStyle(fontFamily: kUiFont, color: kPaper, fontSize: 17, fontWeight: FontWeight.w800),
      iconTheme: IconThemeData(color: kShellMuted),
      actionsIconTheme: IconThemeData(color: kShellMuted),
    ),
    cardTheme: CardThemeData(
      color: kSurface,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(side: BorderSide(color: kOutline)),
      margin: EdgeInsets.zero,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        shape: _square,
        backgroundColor: kAccent,
        foregroundColor: kOnAccent,
        minimumSize: const Size(48, 48),
        textStyle: buttonText,
        elevation: 0,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(shape: _square, elevation: 0, textStyle: buttonText, minimumSize: const Size(48, 48)),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        shape: _square,
        foregroundColor: kTextPrimary,
        side: BorderSide(color: kOutline),
        minimumSize: const Size(48, 48),
        textStyle: buttonText,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(shape: _square, foregroundColor: kTextPrimary, textStyle: buttonText),
    ),
    iconButtonTheme: IconButtonThemeData(style: IconButton.styleFrom(shape: _square)),
    segmentedButtonTheme: SegmentedButtonThemeData(
      style: SegmentedButton.styleFrom(
        shape: _square,
        selectedBackgroundColor: kAccentSoft,
        selectedForegroundColor: kTextPrimary,
        side: BorderSide(color: kOutline),
      ),
    ),
    chipTheme: ChipThemeData(
      shape: RoundedRectangleBorder(side: BorderSide(color: kOutline)),
      backgroundColor: kSurface,
      selectedColor: kAccentSoft,
      labelStyle: TextStyle(fontFamily: kUiFont, color: kTextPrimary, fontWeight: FontWeight.w600),
      side: BorderSide(color: kOutline),
    ),
    dialogTheme: DialogThemeData(shape: _square, backgroundColor: kSurface, surfaceTintColor: Colors.transparent),
    bottomSheetTheme: BottomSheetThemeData(shape: _square, backgroundColor: kSurface, surfaceTintColor: Colors.transparent),
    snackBarTheme: const SnackBarThemeData(
      shape: _square,
      backgroundColor: kBlack,
      contentTextStyle: TextStyle(fontFamily: kUiFont, color: kPaper),
      actionTextColor: kTurmeric,
    ),
    progressIndicatorTheme: ProgressIndicatorThemeData(color: kAccent, linearTrackColor: kSurfaceRaised),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? kOnAccent : kTextMuted),
      trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? kAccent : kSurfaceRaised),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: kSurface,
      surfaceTintColor: Colors.transparent,
      indicatorColor: kAccentSoft,
      indicatorShape: _square,
      elevation: 0,
      height: 66,
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((s) => TextStyle(
            fontFamily: kUiFont,
            fontSize: 12,
            fontWeight: s.contains(WidgetState.selected) ? FontWeight.w800 : FontWeight.w600,
            color: s.contains(WidgetState.selected) ? kTextPrimary : kTextMuted,
          )),
      iconTheme: WidgetStateProperty.resolveWith((s) => IconThemeData(
            size: 24,
            color: s.contains(WidgetState.selected) ? kTextPrimary : kTextMuted,
          )),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kSurface,
      hintStyle: TextStyle(color: kTextMuted),
      border: OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: kOutline)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: kOutline)),
      focusedBorder: const OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: kTurmeric, width: 2)),
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: kAccent,
      thumbColor: kAccent,
      inactiveTrackColor: kOutline,
    ),
  );
}
