import 'package:flutter_tts/flutter_tts.dart';

// On-device text-to-speech for aksara pronunciation. Uses the system TTS
// engine (no network), speaking the Latin reading with an Indonesian voice —
// close to Balinese phonology.
final FlutterTts _tts = FlutterTts();
bool _ready = false;

Future<void> _init() async {
  if (_ready) return;
  try {
    await _tts.setLanguage('id-ID');
    await _tts.setSpeechRate(0.4);
    await _tts.setPitch(1.0);
  } catch (_) {/* engine may not support the locale; speak anyway */}
  _ready = true;
}

/// Speak a Latin reading (e.g. "ka"). Strips any annotation like "i (ulu)".
Future<void> speakLatin(String latin) async {
  final say = latin.split(RegExp(r'[ (]')).first.trim();
  if (say.isEmpty) return;
  try {
    await _init();
    await _tts.stop();
    await _tts.speak(say);
  } catch (_) {/* TTS unavailable — silently ignore */}
}
