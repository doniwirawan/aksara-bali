import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';
import '../l10n.dart';

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
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 24, offset: const Offset(0, 8))],
            ),
            child: Image.asset('assets/icon/logo.png', width: 84, height: 84),
          ),
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
        Center(child: Text('Version 1.0.0', style: TextStyle(color: kTextMuted, fontSize: 12, fontWeight: FontWeight.w600))),
        const SizedBox(height: 6),
        Center(child: Text(tr(context, 'Free educational tool for preserving Aksara Bali', 'Alat edukasi gratis untuk melestarikan Aksara Bali'),
            textAlign: TextAlign.center, style: TextStyle(color: kTextMuted, fontSize: 12, height: 1.4))),
        const SizedBox(height: 18),
        Center(
          child: Material(
            color: kAccentSoft,
            borderRadius: BorderRadius.circular(20),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
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
              decoration: BoxDecoration(color: kAccentSoft, borderRadius: BorderRadius.circular(11)),
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
