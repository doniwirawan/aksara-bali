import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Font + external links.
const kBaliFont = 'NotoSansBalinese';
const String kApiBase = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app';
const String kWebUrl = 'https://aksarabali.doniwirawan.xyz';

// ── Warm "lontar manuscript / Balinese stone" palette ───────────────────────
// Dark is the primary theme; light is a warm-paper variant.
class _Pal {
  const _Pal({
    required this.bg, required this.surface, required this.surfaceRaised,
    required this.accent, required this.accentSoft, required this.onAccent,
    required this.textPrimary, required this.textSecondary, required this.textMuted,
    required this.outline,
  });
  final Color bg, surface, surfaceRaised, accent, accentSoft, onAccent,
      textPrimary, textSecondary, textMuted, outline;
}

const _dark = _Pal(
  bg: Color(0xFF151411),
  surface: Color(0xFF201E19),
  surfaceRaised: Color(0xFF29261F),
  accent: Color(0xFFD8A84E),
  accentSoft: Color(0xFF4A3A1C),
  onAccent: Color(0xFF231B0C),
  textPrimary: Color(0xFFF4EFE5),
  textSecondary: Color(0xFFB9B0A1),
  textMuted: Color(0xFF81796D),
  outline: Color(0xFF3B352A),
);

const _light = _Pal(
  bg: Color(0xFFF1ECE0),
  surface: Color(0xFFFBF7EE),
  surfaceRaised: Color(0xFFFFFFFF),
  accent: Color(0xFFA9772A),
  accentSoft: Color(0xFFEDE0C5),
  onAccent: Color(0xFFFFFFFF),
  textPrimary: Color(0xFF2A2620),
  textSecondary: Color(0xFF6B6354),
  textMuted: Color(0xFF938A7A),
  outline: Color(0xFFDED5C3),
);

// ── Light / dark mode (dark is the default) ─────────────────────────────────
final ValueNotifier<bool> darkMode = ValueNotifier(true);

Future<void> loadTheme() async {
  final p = await SharedPreferences.getInstance();
  darkMode.value = p.getBool('dark_mode') ?? true;
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

// Legacy aliases so existing widgets keep working.
Color get kPageBg => kBg;
Color get kCardBg => kSurface;
Color get kBorder => kOutline;
Color get kInk => kTextPrimary;
Color get kMuted => kTextSecondary;
Color get kAccentColor => kAccent;

// Calm card surface — relies on contrast/elevation, not a visible border.
BoxDecoration cardDecoration() => BoxDecoration(
      color: kSurface,
      borderRadius: BorderRadius.circular(16),
    );

ThemeData buildAppTheme() {
  final dark = darkMode.value;
  final scheme = ColorScheme.fromSeed(
    seedColor: kAccent,
    brightness: dark ? Brightness.dark : Brightness.light,
  ).copyWith(
    primary: kAccent,
    onPrimary: kOnAccent,
    secondary: kAccent,
    onSecondary: kOnAccent,
    surface: kSurface,
    onSurface: kTextPrimary,
    surfaceContainerHighest: kSurfaceRaised,
    outline: kOutline,
    outlineVariant: kOutline,
  );
  final base = ThemeData(useMaterial3: true, colorScheme: scheme, scaffoldBackgroundColor: kBg);
  return base.copyWith(
    textTheme: GoogleFonts.interTextTheme(base.textTheme)
        .apply(bodyColor: kTextPrimary, displayColor: kTextPrimary),
    scaffoldBackgroundColor: kBg,
    dividerColor: kOutline,
    appBarTheme: AppBarTheme(
      backgroundColor: kBg,
      foregroundColor: kTextPrimary,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      titleTextStyle: TextStyle(color: kTextPrimary, fontSize: 16, fontWeight: FontWeight.w700),
    ),
    cardTheme: CardThemeData(
      color: kSurface,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: kSurface,
      surfaceTintColor: Colors.transparent,
      indicatorColor: kAccentSoft,
      elevation: 0,
      height: 66,
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((s) => TextStyle(
            fontSize: 12,
            fontWeight: s.contains(WidgetState.selected) ? FontWeight.w600 : FontWeight.w500,
            color: s.contains(WidgetState.selected) ? kTextPrimary : kTextMuted,
          )),
      iconTheme: WidgetStateProperty.resolveWith((s) => IconThemeData(
            size: 24,
            color: s.contains(WidgetState.selected) ? kAccent : kTextMuted,
          )),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kSurface,
      hintStyle: TextStyle(color: kTextMuted),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: kOutline)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: kOutline)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: kAccent, width: 1.5)),
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: kAccent,
      thumbColor: kAccent,
      inactiveTrackColor: kOutline,
    ),
  );
}
