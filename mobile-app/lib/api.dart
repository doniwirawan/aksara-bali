import 'dart:convert';
import 'package:http/http.dart' as http;
import 'theme.dart';

/// Thin client for the public Aksara Bali API.
/// Endpoints use a trailing slash to avoid the site's 308 redirect.
class Api {
  /// Latin → Balinese. Throws on network/server error.
  static Future<String> convert(String text) async {
    final res = await http.post(
      Uri.parse('$kApiBase/api/convert/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'text': text}),
    );
    if (res.statusCode != 200) {
      throw Exception('Server error (${res.statusCode})');
    }
    return (jsonDecode(res.body)['balinese'] as String?) ?? '';
  }

  /// Practice words, optionally filtered by difficulty (easy|medium|hard).
  static Future<List<Map<String, dynamic>>> words({String? difficulty}) async {
    final q = difficulty != null ? '?difficulty=$difficulty' : '';
    final res = await http.get(Uri.parse('$kApiBase/api/words/$q'));
    if (res.statusCode != 200) {
      throw Exception('Server error (${res.statusCode})');
    }
    final list = (jsonDecode(res.body)['words'] as List?) ?? [];
    return list.cast<Map<String, dynamic>>();
  }
}
