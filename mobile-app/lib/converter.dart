// On-device Latin <-> Balinese (Aksara Bali) transliteration.
// Faithful 1:1 port of the web app's converter (components/LatinBalineseConverter.jsx),
// including Sanskrit detection + murda toggle, plus a reverse (Balinese -> Latin).
import 'sanskrit_data.dart';

const Map<String, String> balineseMapping = {
  'ka': 'ᬓ', 'kha': 'ᬔ', 'ga': 'ᬕ', 'gha': 'ᬖ', 'nga': 'ᬗ',
  'ca': 'ᬘ', 'cha': 'ᬙ', 'ja': 'ᬚ', 'jha': 'ᬛ', 'nya': 'ᬜ',
  'tha': 'ᬝ', 'thha': 'ᬞ', 'dha': 'ᬟ', 'dhha': 'ᬠ', 'nna': 'ᬡ',
  'ta': 'ᬢ', 'ttha': 'ᬣ', 'da': 'ᬤ', 'ddha': 'ᬥ', 'na': 'ᬦ',
  'pa': 'ᬧ', 'pha': 'ᬨ', 'ba': 'ᬩ', 'bha': 'ᬪ', 'ma': 'ᬫ',
  'ya': 'ᬬ', 'ra': 'ᬭ', 'la': 'ᬮ',
  'wa': 'ᬯ', 'va': 'ᬯ',
  'sha': 'ᬰ', 'ssa': 'ᬱ', 'sa': 'ᬲ', 'ha': 'ᬳ',
  // Murda (Sanskrit) forms — same codepoints as their base in this implementation
  'kha_murda': 'ᬔ', 'gha_murda': 'ᬖ', 'cha_murda': 'ᬙ', 'jha_murda': 'ᬛ',
  'tha_murda': 'ᬝ', 'dha_murda': 'ᬟ', 'nna_murda': 'ᬡ', 'pha_murda': 'ᬨ',
  'bha_murda': 'ᬪ', 'sha_murda': 'ᬰ',
  'a': 'ᬅ', 'i': 'ᬇ', 'u': 'ᬉ', 'e': 'ᬏ', 'o': 'ᬑ',
  'aa': 'ᬆ', 'ii': 'ᬇᬷ', 'uu': 'ᬉᬹ',
  'aa_mark': 'ᬵ', 'i_mark': 'ᬶ', 'ii_mark': 'ᬷ',
  'u_mark': 'ᬸ', 'uu_mark': 'ᬹ', 'e_mark': 'ᬾ', 'o_mark': 'ᭀ',
  'ai_mark': 'ᬿ', 'au_mark': 'ᭁ', 're_mark': 'ᭂ',
  'ng': 'ᬂ', 'r_sound': 'ᬃ', 'h_sound': 'ᬄ', 'virama': '᭄', 'om': 'ᬀ',
  '0': '᭐', '1': '᭑', '2': '᭒', '3': '᭓', '4': '᭔',
  '5': '᭕', '6': '᭖', '7': '᭗', '8': '᭘', '9': '᭙',
  'dot': '᭟', 'comma': '᭞', 'cecek': '᬴', 'bisah': 'ᬁ',
};

const Map<String, String> _longVowelMark = {'aa': 'aa_mark', 'ii': 'ii_mark', 'uu': 'uu_mark'};

bool _isVowel(String? c) => c != null && c.isNotEmpty && ['a', 'i', 'u', 'e', 'o'].contains(c.toLowerCase());
bool _isConsonant(String? c) => c != null && c.isNotEmpty && 'bcdfghjklmnpqrstvwxyz'.contains(c.toLowerCase());
bool _isPunct(String c) => '.,!?;:()[]{}"\'-'.contains(c);
String _normCons(String c) => c.toLowerCase() == 'v' ? 'w' : c.toLowerCase();
String _normVW(String w) => w.replaceFirst(RegExp('^v', caseSensitive: false), 'w')
    .replaceAllMapped(RegExp('([aeiou])v', caseSensitive: false), (m) => '${m[1]}w');

bool _detectSanskrit(String word) {
  final w = word.toLowerCase();
  if (kSanskritWords.contains(w)) return true;
  if (kSanskritWords.contains(_normVW(w))) return true;
  final rev = w.replaceFirst(RegExp('^w', caseSensitive: false), 'v')
      .replaceAllMapped(RegExp('([aeiou])w', caseSensitive: false), (m) => '${m[1]}v');
  return kSanskritWords.contains(rev);
}

List<String> _wordsOf(String text) =>
    text.toLowerCase().split(RegExp("[\\s.,!?;:()\\[\\]{}\"'-]+")).where((w) => w.isNotEmpty).toList();

bool _isStartOfSanskritWord(String text, int position) {
  final lower = text.toLowerCase();
  int pos = 0;
  for (final word in _wordsOf(text)) {
    final start = lower.indexOf(word, pos);
    if (start < 0) continue;
    final end = start + word.length;
    if (position >= start && position < end) return _detectSanskrit(word);
    pos = end;
  }
  return false;
}

// Latin diacritics (from the ā ī ū ě ṇ … input helpers) normalized to the plain
// sequences the mapping below already understands. Keep in sync with the web app.
const Map<String, String> _latinDiacritics = {
  'ā': 'aa', 'â': 'aa', 'ī': 'ii', 'î': 'ii', 'ū': 'uu', 'û': 'uu',
  'é': 'e', 'è': 'e', 'ě': 'e', 'ĕ': 'e', 'ö': 'e',
  'ṛ': 're', 'ṝ': 're', 'ṇ': 'nna', 'ṅ': 'ng', 'ñ': 'nya',
  'ś': 'sa', 'ṣ': 'sa', 'ṭ': 'ta', 'ḍ': 'da', 'ḥ': 'h', 'ṁ': 'ng', 'ṃ': 'ng',
};

String _normalizeDiacritics(String s) {
  var r = s;
  _latinDiacritics.forEach((k, v) => r = r.replaceAll(k, v));
  return r;
}

String latinToBalinese(String text) {
  if (text.isEmpty) return '';
  final s = _normalizeDiacritics(text.toLowerCase().trim());
  final buf = StringBuffer();
  int i = 0;
  while (i < s.length) {
    bool matched = false;
    final cur = s[i];
    if (cur == ' ') { buf.write('​'); i++; continue; }
    if (cur == '.') { buf.write(balineseMapping['dot']); i++; continue; }
    if (cur == ',') { buf.write(balineseMapping['comma']); i++; continue; }
    if (RegExp(r'[0-9]').hasMatch(cur)) { buf.write(balineseMapping[cur] ?? cur); i++; continue; }

    final sanskrit = _isStartOfSanskritWord(s, i);
    String look = '';
    final maxLook = (s.length - i) < 4 ? (s.length - i) : 4;
    for (int j = 0; j < maxLook; j++) {
      look += s[i + j];
      bool found = false;
      for (int len = (look.length < 4 ? look.length : 4); len >= 1; len--) {
        final sub = look.substring(0, len);
        if (len == 4 && ['thha', 'dhha', 'ttha', 'ddha'].contains(sub)) {
          final key = sanskrit ? '${sub}_murda' : sub;
          buf.write(balineseMapping[key] ?? balineseMapping[sub]); i += len; matched = found = true; break;
        }
        if (len == 3 && ['nga','nya','nna','kha','gha','cha','jha','tha','dha','pha','bha','sha','ssa'].contains(sub)) {
          final murda = balineseMapping['${sub}_murda'];
          buf.write(sanskrit && murda != null ? murda : balineseMapping[sub]!); i += len; matched = found = true; break;
        }
        if (len == 2 && sub == 'ng') { buf.write(balineseMapping['ng']); i += len; matched = found = true; break; }
        if (len == 2 && ['aa','ii','uu'].contains(sub)) {
          if (i == 0 || s[i - 1] == ' ' || !_isConsonant(s[i - 1])) {
            buf.write(balineseMapping[sub]);
          } else {
            buf.write(balineseMapping[_longVowelMark[sub]] ?? '');
          }
          i += len; matched = found = true; break;
        }
        if (len == 2 && _isConsonant(sub[0]) && _isVowel(sub[1])) {
          final cwa = '${_normCons(sub[0])}a';
          final murda = balineseMapping['${cwa}_murda'];
          final base = (sanskrit && murda != null) ? murda : balineseMapping[cwa];
          if (base != null) {
            buf.write(sub[1] == 'a' ? base : base + (balineseMapping['${sub[1]}_mark'] ?? ''));
            i += len; matched = found = true; break;
          }
        }
      }
      if (found) break;
    }

    if (!matched) {
      if (_isVowel(cur)) {
        final prev = i > 0 ? s[i - 1] : null;
        buf.write((prev == null || prev == ' ' || !_isConsonant(prev))
            ? (balineseMapping[cur] ?? cur)
            : (balineseMapping['${cur}_mark'] ?? cur));
        i++; continue;
      }
      if (_isConsonant(cur)) {
        final next = i + 1 < s.length ? s[i + 1] : null;
        final cwa = '${_normCons(cur)}a';
        final murda = balineseMapping['${cwa}_murda'];
        final base = (sanskrit && murda != null) ? murda : balineseMapping[cwa];
        if (base != null) {
          final virama = next == null || next == ' ' || _isPunct(next) ||
              RegExp(r'[0-9]').hasMatch(next) || _isConsonant(next) || !_isVowel(next);
          buf.write(base + (virama ? balineseMapping['virama']! : ''));
        } else {
          buf.write(cur);
        }
        i++; continue;
      }
      buf.write(cur); i++;
    }
  }
  return buf.toString();
}

// ── Reverse: Balinese -> Latin ───────────────────────────────────────────────
final Map<String, String> _consRoot = () {
  final m = <String, String>{};
  for (final e in balineseMapping.entries) {
    final k = e.key;
    if (k.length >= 2 && k.endsWith('a') && _isConsonant(k[0]) && !k.contains('_')) {
      m.putIfAbsent(e.value, () => k.substring(0, k.length - 1));
    }
  }
  return m;
}();

const Map<String, String> _indepVowel = {'ᬅ': 'a', 'ᬇ': 'i', 'ᬉ': 'u', 'ᬏ': 'e', 'ᬑ': 'o', 'ᬆ': 'aa'};
const Map<String, String> _vowelMark = {
  'ᬵ': 'a', 'ᬶ': 'i', 'ᬷ': 'i', 'ᬸ': 'u', 'ᬹ': 'u',
  'ᬾ': 'e', 'ᭀ': 'o', 'ᬿ': 'ai', 'ᭁ': 'au', 'ᭂ': 're',
};
const String _viramaCh = '᭄';
const Map<String, String> _digit = {
  '᭐': '0', '᭑': '1', '᭒': '2', '᭓': '3', '᭔': '4',
  '᭕': '5', '᭖': '6', '᭗': '7', '᭘': '8', '᭙': '9',
};

String balineseToLatin(String text) {
  if (text.isEmpty) return '';
  final buf = StringBuffer();
  final chars = text.split('');
  for (int i = 0; i < chars.length; i++) {
    final c = chars[i];
    final root = _consRoot[c];
    if (root != null) {
      final next = i + 1 < chars.length ? chars[i + 1] : null;
      if (next == _viramaCh) { buf.write(root); i++; }
      else if (next != null && _vowelMark.containsKey(next)) { buf.write(root + _vowelMark[next]!); i++; }
      else { buf.write('${root}a'); }
      continue;
    }
    if (_indepVowel.containsKey(c)) { buf.write(_indepVowel[c]); continue; }
    if (_digit.containsKey(c)) { buf.write(_digit[c]); continue; }
    if (c == '​') { buf.write(' '); continue; }
    if (c == '᭟') { buf.write('.'); continue; }
    if (c == '᭞') { buf.write(','); continue; }
    if (c == 'ᬂ' || c == '᬴') { buf.write('ng'); continue; }
    if (c == 'ᬁ' || c == 'ᬄ') { buf.write('h'); continue; }
    if (_vowelMark.containsKey(c)) { buf.write(_vowelMark[c]); continue; }
    buf.write(c);
  }
  return buf.toString();
}
