import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Brand accent + font are constant across themes.
const kBlue = Color(0xFF0D6EFD);
const kBaliFont = 'NotoSansBalinese';

const String kApiBase = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app';
const String kWebUrl = 'https://aksarabali.doniwirawan.xyz';

// ── Light / dark mode ───────────────────────────────────────────────────────
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

bool get _d => darkMode.value;

// Theme-aware palette (getters so they react to [darkMode]). Wrap the app in a
// ValueListenableBuilder on [darkMode] so these resolve correctly on rebuild.
Color get kPageBg => _d ? const Color(0xFF101016) : const Color(0xFFF5F5F0);
Color get kCardBg => _d ? const Color(0xFF1B1B24) : const Color(0xFFFFFFFF);
Color get kBorder => _d ? const Color(0xFF2C2C38) : const Color(0xFFE0E0D8);
Color get kInk => _d ? const Color(0xFFE9E9EE) : const Color(0xFF1A1A1A);
Color get kMuted => _d ? const Color(0xFF9596A2) : const Color(0xFF6B7280);

BoxDecoration cardDecoration() => BoxDecoration(
      color: kCardBg,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: kBorder),
    );
