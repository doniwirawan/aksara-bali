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

  // A vertical drag on the drawing canvas used to be claimed by the surrounding
  // SingleChildScrollView, so the page scrolled instead of drawing a stroke.
  testWidgets('vertical stroke draws instead of scrolling the write screen', (WidgetTester tester) async {
    // Portrait phone: that layout puts the canvas inside a scroll view.
    tester.view.physicalSize = const Size(460, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const AksaraBaliApp());
    await tester.tap(find.byIcon(Icons.draw_outlined).last);
    await tester.pump(const Duration(milliseconds: 400));

    final canvas = find.byWidgetPredicate((w) => w.runtimeType.toString() == '_DrawCanvas');
    expect(canvas, findsOneWidget);

    final offsetBefore = Scrollable.of(tester.element(canvas)).position.pixels;

    await tester.drag(canvas, const Offset(0, 120));
    await tester.pump(const Duration(milliseconds: 400));

    expect(Scrollable.of(tester.element(canvas)).position.pixels, offsetBefore,
        reason: 'the page must not scroll while drawing');
    // Undo is disabled until at least one stroke exists.
    // (byWidgetPredicate, because OutlinedButton.icon builds a private subclass.)
    final undo = tester.widget<OutlinedButton>(find
        .ancestor(of: find.byIcon(Icons.undo), matching: find.byWidgetPredicate((w) => w is OutlinedButton))
        .first);
    expect(undo.onPressed, isNotNull, reason: 'the drag should have produced a stroke');
  });
}
