import 'dart:convert';
import 'package:http/http.dart' as http;

/// Installed app version. Bump alongside `version:` in pubspec.yaml on release.
/// Also shown in the About footer.
const kAppVersion = '1.5.1';

/// Latest release of the public APK repo. The app is offline-by-default, so this
/// is only ever fetched when the user taps "Check for updates" in About.
const _releasesApi =
    'https://api.github.com/repos/doniwirawan/aksara-bali/releases/latest';
const _releasesPage =
    'https://github.com/doniwirawan/aksara-bali/releases/latest';

class UpdateInfo {
  const UpdateInfo({required this.version, this.downloadUrl, required this.releaseUrl});
  final String version; // e.g. "1.3.0"
  final String? downloadUrl; // direct .apk asset, when present
  final String releaseUrl; // release page fallback
}

/// Returns an [UpdateInfo] when the latest GitHub release is newer than the
/// installed build, or null when already up to date. Throws on network/parse
/// failure so the caller can show a "couldn't check" state.
Future<UpdateInfo?> checkForUpdate() async {
  const current = kAppVersion;

  final res = await http
      .get(Uri.parse(_releasesApi), headers: {'Accept': 'application/vnd.github+json'})
      .timeout(const Duration(seconds: 12));
  if (res.statusCode != 200) {
    throw Exception('GitHub returned ${res.statusCode}');
  }

  final data = jsonDecode(res.body) as Map<String, dynamic>;
  final latest = ((data['tag_name'] as String?) ?? '').replaceFirst(RegExp(r'^v'), '');
  if (latest.isEmpty) throw Exception('Release has no tag');

  String? apkUrl;
  for (final a in (data['assets'] as List? ?? const [])) {
    final name = ((a as Map)['name'] as String?) ?? '';
    if (name.toLowerCase().endsWith('.apk')) {
      apkUrl = a['browser_download_url'] as String?;
      break;
    }
  }

  if (!_isNewer(latest, current)) return null;
  return UpdateInfo(
    version: latest,
    downloadUrl: apkUrl,
    releaseUrl: (data['html_url'] as String?) ?? _releasesPage,
  );
}

/// True when semantic version [a] is greater than [b] (major.minor.patch).
bool _isNewer(String a, String b) {
  final pa = _parts(a), pb = _parts(b);
  for (var i = 0; i < 3; i++) {
    if (pa[i] != pb[i]) return pa[i] > pb[i];
  }
  return false;
}

List<int> _parts(String v) {
  final segs = v.split('.');
  return List.generate(3, (i) {
    if (i >= segs.length) return 0;
    return int.tryParse(RegExp(r'^\d+').firstMatch(segs[i])?.group(0) ?? '') ?? 0;
  });
}
