import 'package:audioplayers/audioplayers.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Duolingo-style UI sound effects, played from small bundled WAV assets.
/// A single shared instance; call [init] once at startup.
class Sfx {
  Sfx._();
  static final Sfx instance = Sfx._();

  bool _enabled = true;
  bool get enabled => _enabled;

  // One preloaded player per sound so they can overlap and re-trigger fast.
  final AudioPlayer _correct = AudioPlayer();
  final AudioPlayer _wrong = AudioPlayer();
  final AudioPlayer _complete = AudioPlayer();
  final AudioPlayer _tap = AudioPlayer();

  Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _enabled = prefs.getBool('sfx_enabled') ?? true;
      for (final p in [_correct, _wrong, _complete, _tap]) {
        await p.setReleaseMode(ReleaseMode.stop);
      }
      await _correct.setSource(AssetSource('sfx/correct.wav'));
      await _wrong.setSource(AssetSource('sfx/wrong.wav'));
      await _complete.setSource(AssetSource('sfx/complete.wav'));
      await _tap.setSource(AssetSource('sfx/tap.wav'));
    } catch (_) {
      // Audio unavailable on this device — sounds simply won't play.
    }
  }

  Future<void> setEnabled(bool v) async {
    _enabled = v;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('sfx_enabled', v);
    } catch (_) {}
  }

  void _play(AudioPlayer p) {
    if (!_enabled) return;
    // Rewind to the start so rapid re-triggers always play from the top.
    p.seek(Duration.zero).then((_) => p.resume()).catchError((_) {});
  }

  void correct() => _play(_correct);
  void wrong() => _play(_wrong);
  void complete() => _play(_complete);
  void tap() => _play(_tap);
}
