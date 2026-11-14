import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Installed app version. Bump alongside `version:` in pubspec.yaml on release.
/// Also shown in the About footer.
const kAppVersion = '1.6.1';

/// True for builds distributed through Google Play. Play forbids an app from
/// updating itself or installing APKs sourced from outside Play, so the updater
/// below must not ship in the AAB. Build it with:
///   flutter build appbundle --dart-define=PLAY_STORE=true
/// The GitHub-distributed APK is built without the flag and keeps the updater
/// (android/app/build.gradle adds its permissions only to that build).
const kPlayStoreBuild = bool.fromEnvironment('PLAY_STORE');

/// Latest release of the public APK repo. Checked on launch (at most every
/// [_autoInterval]) and when the user taps "Check for updates" in About.
const _releasesApi =
    'https://api.github.com/repos/doniwirawan/aksara-bali/releases/latest';
const _releasesPage =
    'https://github.com/doniwirawan/aksara-bali/releases/latest';
const _autoInterval = Duration(hours: 12);
const _channel = MethodChannel('aksara/updater');

class UpdateInfo {
  const UpdateInfo({
    required this.version,
    required this.releaseUrl,
    this.downloadUrl,
    this.size = 0,
    this.notes = const [],
  });
  final String version; // e.g. "1.7.0"
  final String releaseUrl; // release page fallback
  final String? downloadUrl; // the .apk built for this phone, when present
  final int size; // bytes, 0 when unknown
  final List<String> notes; // bullet lines from the release notes
}

/// Returns an [UpdateInfo] when the latest GitHub release is newer than the
/// installed build, or null when already up to date. Throws on network/parse
/// failure so the caller can show a "couldn't check" state.
Future<UpdateInfo?> checkForUpdate() async {
  final res = await http
      .get(Uri.parse(_releasesApi), headers: {'Accept': 'application/vnd.github+json'})
      .timeout(const Duration(seconds: 12));
  if (res.statusCode != 200) {
    throw Exception('GitHub returned ${res.statusCode}');
  }

  final data = jsonDecode(res.body) as Map<String, dynamic>;
  final latest = ((data['tag_name'] as String?) ?? '').replaceFirst(RegExp(r'^v'), '');
  if (latest.isEmpty) throw Exception('Release has no tag');
  if (!_isNewer(latest, kAppVersion)) return null;

  // aksara-bali-vX.Y.Z.apk is arm64; -armeabi-v7a.apk is for 32-bit phones.
  final apks = [
    for (final a in (data['assets'] as List? ?? const []))
      if (((a as Map)['name'] as String? ?? '').toLowerCase().endsWith('.apk')) a,
  ];
  final abis = await _abis();
  final wantLegacy = !abis.contains('arm64-v8a');
  Map? asset;
  for (final a in apks) {
    final name = (a['name'] as String).toLowerCase();
    final legacy = name.contains('armeabi');
    if (name.contains('x86')) continue;
    if (legacy == wantLegacy) { asset = a; break; }
  }
  asset ??= apks.isEmpty ? null : apks.first;

  final notes = ((data['body'] as String?) ?? '')
      .split('\n')
      .where((l) => RegExp(r'^\s*[-*]\s+').hasMatch(l) && !l.toLowerCase().contains('.apk'))
      .map((l) => l
          .replaceFirst(RegExp(r'^\s*[-*]\s+'), '')
          .replaceAll('**', '')
          .replaceAll('`', '')
          .trim())
      .where((l) => l.isNotEmpty)
      .take(5)
      .toList();

  return UpdateInfo(
    version: latest,
    releaseUrl: (data['html_url'] as String?) ?? _releasesPage,
    downloadUrl: asset?['browser_download_url'] as String?,
    size: (asset?['size'] as num?)?.toInt() ?? 0,
    notes: notes,
  );
}

/// The launch-time check: quiet, throttled, and never throws. Returns an update
/// only when one exists; network trouble just means no prompt this time.
Future<UpdateInfo?> autoCheckForUpdate() async {
  if (kPlayStoreBuild) return null;
  try {
    final p = await SharedPreferences.getInstance();
    final last = p.getInt('update_last_check') ?? 0;
    final now = DateTime.now().millisecondsSinceEpoch;
    if (now - last < _autoInterval.inMilliseconds) return null;
    final u = await checkForUpdate();
    await p.setInt('update_last_check', now);
    return u;
  } catch (_) {
    return null;
  }
}

Future<List<String>> _abis() async {
  try {
    final info = await _channel.invokeMapMethod<String, dynamic>('info');
    return List<String>.from(info?['abis'] ?? const []);
  } catch (_) {
    return const [];
  }
}

/// Downloads the update APK into the app cache, reporting progress 0..1.
/// Returns the file path.
Future<String> downloadUpdate(UpdateInfo u, void Function(double) onProgress) async {
  final info = await _channel.invokeMapMethod<String, dynamic>('info');
  final dir = Directory(info!['dir'] as String);
  // Only the newest download is ever needed.
  for (final f in dir.listSync()) {
    try { f.deleteSync(); } catch (_) {}
  }
  final file = File('${dir.path}/aksara-bali-v${u.version}.apk');

  final client = http.Client();
  try {
    final res = await client.send(http.Request('GET', Uri.parse(u.downloadUrl!)));
    if (res.statusCode != 200) throw Exception('Download returned ${res.statusCode}');
    final total = res.contentLength ?? u.size;
    final sink = file.openWrite();
    var got = 0;
    try {
      await for (final chunk in res.stream.timeout(const Duration(seconds: 30))) {
        sink.add(chunk);
        got += chunk.length;
        if (total > 0) onProgress(got / total);
      }
    } finally {
      await sink.close();
    }
    if (total > 0 && got != total) throw Exception('Download incomplete');
    return file.path;
  } finally {
    client.close();
  }
}

/// Whether Android lets this app hand an APK to the installer
/// ("Install unknown apps" for Aksara Bali).
Future<bool> canInstallUpdates() async =>
    await _channel.invokeMethod<bool>('canInstall') ?? false;

Future<void> openInstallSettings() => _channel.invokeMethod('openInstallSettings');

/// Opens Android's installer for the downloaded APK. It installs over the
/// current app because every release is signed with the same key.
Future<void> installUpdate(String path) => _channel.invokeMethod('install', {'path': path});

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
