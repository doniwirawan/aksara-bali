// Basic smoke test for the Aksara Bali converter app.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:aksara_bali_mobile/main.dart';

void main() {
  testWidgets('Converter screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(const AksaraBaliApp());

    expect(find.text('Aksara Bali'), findsWidgets);
    expect(find.byType(TextField), findsOneWidget);
  });
}
