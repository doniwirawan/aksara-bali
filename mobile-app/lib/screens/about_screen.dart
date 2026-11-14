import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';
import '../l10n.dart';
import '../update_check.dart';
import '../update_sheet.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  Future<void> _open(String url) async {
    final uri = Uri.parse(url);
    try {
      final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (!ok) await launchUrl(uri, mode: LaunchMode.platformDefault);
    } catch (_) {
      try { await launchUrl(uri, mode: LaunchMode.platformDefault); } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    final links = <Map<String, dynamic>>[
      {'icon': Icons.public, 'label': tr(context, 'Open web app', 'Buka aplikasi web'), 'url': kWebUrl},
      {'icon': Icons.article_outlined, 'label': 'Blog', 'url': '$kWebUrl/blog'},
      {'icon': Icons.help_outline, 'label': 'FAQ', 'url': '$kWebUrl/faq'},
      {'icon': Icons.privacy_tip_outlined, 'label': tr(context, 'Privacy Policy', 'Kebijakan Privasi'), 'url': '$kWebUrl/privacy'},
      {'icon': Icons.description_outlined, 'label': tr(context, 'Terms of Service', 'Ketentuan Layanan'), 'url': '$kWebUrl/terms'},
      {'icon': Icons.code, 'label': tr(context, 'Source code (GitHub)', 'Kode sumber (GitHub)'), 'url': 'https://github.com/doniwirawan/aksara-bali'},
    ];

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 28, 16, 28),
      children: [
        // Hero
        Center(
          child: Image.asset('assets/icon/logo.png', width: 96, height: 96),
        ),
        const SizedBox(height: 20),
        Center(child: Text('Aksara Bali Converter',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: kTextPrimary))),
        const SizedBox(height: 6),
        Center(child: Text(tr(context, 'Latin → Balinese script • learn & practice', 'Latin → aksara Bali • belajar & berlatih'),
            textAlign: TextAlign.center, style: TextStyle(color: kTextSecondary, fontSize: 13))),
        const SizedBox(height: 28),

        // Links
        Container(
          decoration: cardDecoration(),
          clipBehavior: Clip.antiAlias,
          child: Column(children: [
            for (int i = 0; i < links.length; i++) ...[
              _linkRow(links[i]['icon'] as IconData, links[i]['label'] as String, () => _open(links[i]['url'] as String)),
              if (i != links.length - 1)
                Divider(height: 1, thickness: 1, indent: 66, color: kOutline.withValues(alpha: 0.6)),
            ],
          ]),
        ),
        const SizedBox(height: 28),

        // Footer
        Center(child: Text('Version $kAppVersion', style: TextStyle(color: kTextMuted, fontSize: 12, fontWeight: FontWeight.w600))),
        if (!kPlayStoreBuild) ...[
          const SizedBox(height: 12),
          const _UpdateCheckButton(),
        ],
        const SizedBox(height: 14),
        Center(child: Text(tr(context, 'Free educational tool for preserving Aksara Bali', 'Alat edukasi gratis untuk melestarikan Aksara Bali'),
            textAlign: TextAlign.center, style: TextStyle(color: kTextMuted, fontSize: 12, height: 1.4))),
        const SizedBox(height: 18),
        Center(
          child: Material(
            color: kAccentSoft,
            borderRadius: BorderRadius.zero,
            child: InkWell(
              borderRadius: BorderRadius.zero,
              onTap: () => _open('https://www.linkedin.com/in/doniwirawan/'),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.link, size: 15, color: kAccent),
                  const SizedBox(width: 8),
                  Text(tr(context, 'Made by Doni Wirawan', 'Dibuat oleh Doni Wirawan'),
                      style: TextStyle(fontSize: 13, color: kAccent, fontWeight: FontWeight.w700)),
                ]),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _linkRow(IconData icon, String label, VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
          child: Row(children: [
            Container(
              width: 38, height: 38, alignment: Alignment.center,
              decoration: BoxDecoration(color: kAccentSoft, borderRadius: BorderRadius.zero),
              child: Icon(icon, size: 20, color: kAccent),
            ),
            const SizedBox(width: 14),
            Expanded(child: Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: kTextPrimary))),
            Icon(Icons.open_in_new, size: 16, color: kTextMuted),
          ]),
        ),
      ),
    );
  }
}

// Manual update check. The app also checks on launch (see HomeShell); this
// button checks right away and opens the same update sheet.
class _UpdateCheckButton extends StatefulWidget {
  const _UpdateCheckButton();
  @override
  State<_UpdateCheckButton> createState() => _UpdateCheckButtonState();
}

class _UpdateCheckButtonState extends State<_UpdateCheckButton> {
  bool _busy = false;
  String? _state; // null = not checked, 'latest', 'error'
  UpdateInfo? _update;

  Future<void> _check() async {
    setState(() => _busy = true);
    try {
      final u = await checkForUpdate();
      if (!mounted) return;
      setState(() { _update = u; _state = u == null ? 'latest' : null; _busy = false; });
      if (u != null) showUpdateSheet(context, u);
    } catch (_) {
      if (!mounted) return;
      setState(() { _state = 'error'; _busy = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_update != null) {
      final u = _update!;
      return Container(
        decoration: BoxDecoration(
          color: kAccentSoft,
          borderRadius: BorderRadius.zero,
          border: Border.all(color: kAccent.withValues(alpha: 0.4)),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          Row(children: [
            Icon(Icons.system_update, color: kAccent),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(tr(context, 'Update available', 'Pembaruan tersedia'),
                  style: TextStyle(color: kAccent, fontWeight: FontWeight.w800, fontSize: 15)),
              Text(tr(context, 'Version ${u.version} is ready to install.', 'Versi ${u.version} siap dipasang.'),
                  style: TextStyle(color: kTextSecondary, fontSize: 12)),
            ])),
          ]),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () => showUpdateSheet(context, u),
              icon: const Icon(Icons.download, size: 18),
              label: Text(tr(context, 'Update to v${u.version}', 'Perbarui ke v${u.version}')),
            ),
          ),
          const SizedBox(height: 4),
          Text(
              tr(context, 'Installs over your current app — no reinstall needed.',
                  'Terpasang menimpa aplikasi saat ini — tanpa instal ulang.'),
              textAlign: TextAlign.center, style: TextStyle(color: kTextMuted, fontSize: 11)),
        ]),
      );
    }

    final (label, icon, color) = _busy
        ? (tr(context, 'Checking…', 'Memeriksa…'), null, kTextSecondary)
        : _state == 'latest'
            ? (tr(context, "You're on the latest version", 'Anda memakai versi terbaru'),
                Icons.check_circle_outline, const Color(0xFF16A34A))
            : _state == 'error'
                ? (tr(context, "Couldn't check — tap to retry", 'Gagal memeriksa — ketuk untuk ulangi'),
                    Icons.error_outline, const Color(0xFFDC2626))
                : (tr(context, 'Check for updates', 'Periksa pembaruan'),
                    Icons.system_update, kTextSecondary);

    return Center(
      child: OutlinedButton.icon(
        onPressed: _busy ? null : _check,
        icon: _busy
            ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
            : Icon(icon, size: 18, color: color),
        label: Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
      ),
    );
  }
}
