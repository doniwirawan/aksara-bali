// On-device Latin <-> Balinese (Aksara Bali) transliteration.
// Ported from the web app's utils/balineseConverter.js, plus a reverse direction.

const Map<String, String> _map = {
  'ka': 'ᬓ', 'kha': 'ᬔ', 'ga': 'ᬕ', 'gha': 'ᬖ', 'nga': 'ᬗ',
  'ca': 'ᬘ', 'cha': 'ᬙ', 'ja': 'ᬚ', 'jha': 'ᬛ', 'nya': 'ᬜ',
  'tha': 'ᬝ', 'thha': 'ᬞ', 'dha': 'ᬟ', 'dhha': 'ᬠ', 'nna': 'ᬡ',
  'ta': 'ᬢ', 'ttha': 'ᬣ', 'da': 'ᬤ', 'ddha': 'ᬥ', 'na': 'ᬦ',
  'pa': 'ᬧ', 'pha': 'ᬨ', 'ba': 'ᬩ', 'bha': 'ᬪ', 'ma': 'ᬫ',
  'ya': 'ᬬ', 'ra': 'ᬭ', 'la': 'ᬮ',
  'wa': 'ᬯ', 'va': 'ᬯ',
  'sha': 'ᬰ', 'ssa': 'ᬱ', 'sa': 'ᬲ', 'ha': 'ᬳ',
  'a': 'ᬅ', 'i': 'ᬇ', 'u': 'ᬉ', 'e': 'ᬏ', 'o': 'ᬑ',
  'aa': 'ᬆ', 'ii': 'ᬇᬷ', 'uu': 'ᬉᬹ',
  'aa_mark': 'ᬵ', 'i_mark': 'ᬶ', 'ii_mark': 'ᬷ',
  'u_mark': 'ᬸ', 'uu_mark': 'ᬹ', 'e_mark': 'ᬾ', 'o_mark': 'ᭀ',
  'ng': 'ᬂ', 'virama': '᭄',
  '0': '᭐', '1': '᭑', '2': '᭒', '3': '᭓', '4': '᭔',
  '5': '᭕', '6': '᭖', '7': '᭗', '8': '᭘', '9': '᭙',
  'dot': '᭟', 'comma': '᭞',
};

bool _isVowel(String? c) => c != null && ['a', 'i', 'u', 'e', 'o'].contains(c.toLowerCase());
bool _isConsonant(String? c) => c != null && 'bcdfghjklmnpqrstvwxyz'.contains(c.toLowerCase());
bool _isPunct(String c) => '.,!?;:()[]{}"\'-'.contains(c);
String _norm(String c) => c.toLowerCase() == 'v' ? 'w' : c.toLowerCase();

String latinToBalinese(String text) {
  if (text.isEmpty) return '';
  final s = text.toLowerCase().trim();
  final buf = StringBuffer();
  int i = 0;
  while (i < s.length) {
    bool matched = false;
    final cur = s[i];
    if (cur == ' ') { buf.write('​'); i++; continue; }
    if (cur == '.') { buf.write(_map['dot']); i++; continue; }
    if (cur == ',') { buf.write(_map['comma']); i++; continue; }
    if (RegExp(r'[0-9]').hasMatch(cur)) { buf.write(_map[cur] ?? cur); i++; continue; }

    String look = '';
    final maxLook = (s.length - i) < 4 ? (s.length - i) : 4;
    for (int j = 0; j < maxLook; j++) {
      look += s[i + j];
      bool found = false;
      for (int len = (look.length < 4 ? look.length : 4); len >= 1; len--) {
        final sub = look.substring(0, len);
        if (len == 4 && ['thha', 'dhha', 'ttha', 'ddha'].contains(sub)) {
          buf.write(_map[sub] ?? sub); i += len; matched = found = true; break;
        }
        if (len == 3 && ['nga','nya','nna','kha','gha','cha','jha','tha','dha','pha','bha','sha','ssa'].contains(sub)) {
          buf.write(_map[sub] ?? sub); i += len; matched = found = true; break;
        }
        if (len == 2 && sub == 'ng') { buf.write(_map['ng']); i += len; matched = found = true; break; }
        if (len == 2 && ['aa','ii','uu'].contains(sub)) {
          if (i == 0 || s[i - 1] == ' ' || !_isConsonant(s[i - 1])) {
            buf.write(_map[sub]);
          } else {
            buf.write(_map['${sub[0]}a_mark'] ?? _map['${sub[0]}_mark'] ?? '');
          }
          i += len; matched = found = true; break;
        }
        if (len == 2 && _isConsonant(sub[0]) && _isVowel(sub[1])) {
          final base = _map['${_norm(sub[0])}a'];
          if (base != null) {
            buf.write(sub[1] == 'a' ? base : base + (_map['${sub[1]}_mark'] ?? ''));
            i += len; matched = found = true; break;
          }
        }
      }
      if (found) break;
    }

    if (!matched) {
      if (_isVowel(cur)) {
        final prev = i > 0 ? s[i - 1] : null;
        if (prev == null || prev == ' ' || !_isConsonant(prev)) {
          buf.write(_map[cur] ?? cur);
        } else {
          buf.write(_map['${cur}_mark'] ?? cur);
        }
        i++; continue;
      }
      if (_isConsonant(cur)) {
        final next = i + 1 < s.length ? s[i + 1] : null;
        final base = _map['${_norm(cur)}a'];
        if (base != null) {
          final needsVirama = next == null || next == ' ' || _isPunct(next) ||
              RegExp(r'[0-9]').hasMatch(next) || _isConsonant(next) || !_isVowel(next);
          buf.write(base + (needsVirama ? _map['virama']! : ''));
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
  for (final e in _map.entries) {
    final k = e.key;
    if (k.length >= 2 && k.endsWith('a') && _isConsonant(k[0]) && !k.contains('_')) {
      m.putIfAbsent(e.value, () => k.substring(0, k.length - 1)); // 'ka'->'k', 'nga'->'ng'
    }
  }
  return m;
}();

const Map<String, String> _indepVowel = {
  'ᬅ': 'a', 'ᬇ': 'i', 'ᬉ': 'u', 'ᬏ': 'e', 'ᬑ': 'o',
};
const Map<String, String> _vowelMark = {
  'ᬵ': 'a', 'ᬶ': 'i', 'ᬷ': 'i', 'ᬸ': 'u', 'ᬹ': 'u',
  'ᬾ': 'e', 'ᭀ': 'o', 'ᬿ': 'ai', 'ᭁ': 'au', 'ᭂ': 're',
};
const String _virama = '᭄';
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
      if (next == _virama) { buf.write(root); i++; }
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
    if (c == 'ᬀ') { buf.write('om'); continue; }
    // standalone vowel marks / unknown
    if (_vowelMark.containsKey(c)) { buf.write(_vowelMark[c]); continue; }
    buf.write(c);
  }
  return buf.toString();
}
