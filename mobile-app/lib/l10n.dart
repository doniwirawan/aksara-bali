import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Minimal in-app localization: English / Bahasa Indonesia.
/// Strings are written inline at call sites via [tr]; the choice is persisted.
enum AppLang { en, id }

// Defaults to Bahasa Indonesia.
final ValueNotifier<AppLang> appLang = ValueNotifier(AppLang.id);

Future<void> loadLang() async {
  final p = await SharedPreferences.getInstance();
  appLang.value = p.getString('app_lang') == 'en' ? AppLang.en : AppLang.id;
}

Future<void> setLang(AppLang l) async {
  appLang.value = l;
  final p = await SharedPreferences.getInstance();
  await p.setString('app_lang', l == AppLang.id ? 'id' : 'en');
}

class LangScope extends InheritedWidget {
  const LangScope({super.key, required this.lang, required super.child});
  final AppLang lang;

  static AppLang of(BuildContext c) =>
      c.dependOnInheritedWidgetOfExactType<LangScope>()?.lang ?? AppLang.en;

  @override
  bool updateShouldNotify(LangScope oldWidget) => oldWidget.lang != lang;
}

/// Pick the [en] or [id] string for the current language.
String tr(BuildContext c, String en, String id) =>
    LangScope.of(c) == AppLang.id ? id : en;
