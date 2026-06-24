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
      padding: const EdgeInsets.all(16),
      children: [
        const SizedBox(height: 8),
        Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(color: Colors.white, padding: const EdgeInsets.all(10),
              child: Image.asset('assets/icon/logo.png', width: 96, height: 96)),
          ),
        ),
        const SizedBox(height: 12),
        const Center(child: Text('Aksara Bali Converter',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: kInk))),
        const SizedBox(height: 4),
        Center(child: Text(tr(context, 'Latin → Balinese script • learn & practice', 'Latin → aksara Bali • belajar & berlatih'),
            style: const TextStyle(color: kMuted, fontSize: 13))),
        const SizedBox(height: 24),
        Container(
          decoration: cardDecoration(),
          child: Column(
            children: [
              for (int i = 0; i < links.length; i++) ...[
                ListTile(
                  leading: Icon(links[i]['icon'] as IconData, color: kBlue),
                  title: Text(links[i]['label'] as String),
                  trailing: const Icon(Icons.open_in_new, size: 16, color: kMuted),
                  onTap: () => _open(links[i]['url'] as String),
                ),
                if (i != links.length - 1) const Divider(height: 1, color: kBorder),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),
        const Center(child: Text('Version 1.0.0', style: TextStyle(color: kMuted, fontSize: 12))),
        const SizedBox(height: 4),
        Center(child: Text(tr(context, 'Free educational tool for preserving Aksara Bali', 'Alat edukasi gratis untuk melestarikan Aksara Bali'),
            textAlign: TextAlign.center, style: const TextStyle(color: kMuted, fontSize: 12))),
      ],
    );
  }
}
