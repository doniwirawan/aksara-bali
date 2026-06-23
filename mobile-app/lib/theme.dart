import 'package:flutter/material.dart';

// Palette matching the website
const kBlue = Color(0xFF0D6EFD);
const kPageBg = Color(0xFFF5F5F0);
const kCardBg = Color(0xFFFFFFFF);
const kBorder = Color(0xFFE0E0D8);
const kInk = Color(0xFF1A1A1A);
const kMuted = Color(0xFF6B7280);
const kBaliFont = 'NotoSansBalinese';

const String kApiBase = 'https://transliterasi-latin-ke-bahasa-bali.vercel.app';
const String kWebUrl = 'https://aksarabali.doniwirawan.xyz';

BoxDecoration cardDecoration() => BoxDecoration(
      color: kCardBg,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: kBorder),
    );
