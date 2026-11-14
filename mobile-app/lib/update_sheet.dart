import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'theme.dart';
import 'l10n.dart';
import 'update_check.dart';

/// The update prompt: what's new, then one button that downloads the APK and
/// hands it to Android's installer. Shown on launch when a release is newer
/// and from About → Check for updates.
Future<void> showUpdateSheet(BuildContext context, UpdateInfo u) => showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: kSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
      builder: (_) => _UpdateSheet(u),
    );

enum _Step { idle, downloading, needsPermission, installing, error }

class _UpdateSheet extends StatefulWidget {
  const _UpdateSheet(this.u);
  final UpdateInfo u;
  @override
  State<_UpdateSheet> createState() => _UpdateSheetState();
}

class _UpdateSheetState extends State<_UpdateSheet> with WidgetsBindingObserver {
  _Step _step = _Step.idle;
  double _progress = 0;
  String? _path;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // Back from "Install unknown apps" settings: carry on if it was allowed.
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _step == _Step.needsPermission) _install();
  }

  Future<void> _start() async {
    if (widget.u.downloadUrl == null) {
      await launchUrl(Uri.parse(widget.u.releaseUrl), mode: LaunchMode.externalApplication);
      return;
    }
    if (_path != null) return _install();
    setState(() { _step = _Step.downloading; _progress = 0; });
    try {
      _path = await downloadUpdate(widget.u, (p) {
        if (mounted) setState(() => _progress = p);
      });
      await _install();
    } catch (_) {
      _path = null;
      if (mounted) setState(() => _step = _Step.error);
    }
  }

  Future<void> _install() async {
    try {
      if (!await canInstallUpdates()) {
        if (mounted) setState(() => _step = _Step.needsPermission);
        return;
      }
      if (mounted) setState(() => _step = _Step.installing);
      await installUpdate(_path!);
    } catch (_) {
      if (mounted) setState(() => _step = _Step.error);
    }
  }

  @override
  Widget build(BuildContext context) {
    final u = widget.u;
    final mb = u.size > 0 ? ' · ${(u.size / 1048576).toStringAsFixed(1)} MB' : '';
    final busy = _step == _Step.downloading;

    return SafeArea(
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const Thread(),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(children: [
              Image.asset('assets/icon/logo.png', width: 44, height: 44),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(tr(context, 'New version available', 'Versi baru tersedia'),
                    style: TextStyle(color: kTextPrimary, fontWeight: FontWeight.w800, fontSize: 18, letterSpacing: -0.3)),
                const SizedBox(height: 2),
                Text('$kAppVersion → ${u.version}$mb',
                    style: TextStyle(color: kTextSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
              ])),
            ]),
            if (u.notes.isNotEmpty) ...[
              const SizedBox(height: 18),
              Text(tr(context, "What's new", 'Yang baru'),
                  style: TextStyle(color: kTextMuted, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 0.4)),
              const SizedBox(height: 8),
              for (final n in u.notes)
                Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 7, right: 10),
                      child: Container(width: 6, height: 6, color: kRed),
                    ),
                    Expanded(child: Text(n, style: TextStyle(color: kTextPrimary, fontSize: 14, height: 1.4))),
                  ]),
                ),
            ],
            const SizedBox(height: 18),
            if (busy) ...[
              LinearProgressIndicator(value: _progress > 0 ? _progress : null, minHeight: 6),
              const SizedBox(height: 8),
              Text(tr(context, 'Downloading… ${(_progress * 100).round()}%', 'Mengunduh… ${(_progress * 100).round()}%'),
                  style: TextStyle(color: kTextSecondary, fontSize: 13)),
            ] else if (_step == _Step.needsPermission) ...[
              _Note(tr(context,
                  'Android needs your OK once: allow “Install unknown apps” for Aksara Bali, then come back.',
                  'Android perlu izin sekali saja: izinkan “Instal aplikasi tak dikenal” untuk Aksara Bali, lalu kembali ke sini.')),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: openInstallSettings,
                icon: const Icon(Icons.settings, size: 18),
                label: Text(tr(context, 'Open settings', 'Buka pengaturan')),
              ),
            ] else ...[
              if (_step == _Step.error) ...[
                _Note(tr(context, "The update couldn't finish. Check your connection and try again.",
                    'Pembaruan gagal. Periksa koneksi lalu coba lagi.')),
                const SizedBox(height: 12),
              ],
              FilledButton.icon(
                onPressed: _start,
                icon: const Icon(Icons.system_update, size: 18),
                label: Text(_step == _Step.error
                    ? tr(context, 'Try again', 'Coba lagi')
                    : _step == _Step.installing
                        ? tr(context, 'Install', 'Pasang')
                        : tr(context, 'Update now', 'Perbarui sekarang')),
              ),
            ],
            const SizedBox(height: 6),
            TextButton(
              onPressed: busy ? null : () => Navigator.of(context).pop(),
              child: Text(tr(context, 'Later', 'Nanti'), style: TextStyle(color: kTextSecondary)),
            ),
            Text(
              tr(context, 'Installs over the current app. Your progress stays.',
                  'Terpasang menimpa aplikasi ini. Progres Anda tetap tersimpan.'),
              textAlign: TextAlign.center,
              style: TextStyle(color: kTextMuted, fontSize: 12),
            ),
          ]),
        ),
      ]),
    );
  }
}

class _Note extends StatelessWidget {
  const _Note(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(12),
        color: kAccentSoft,
        child: Text(text, style: TextStyle(color: kTextPrimary, fontSize: 13, height: 1.4)),
      );
}
