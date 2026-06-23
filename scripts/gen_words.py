import sys, json, io

data = json.load(sys.stdin)
words = data["words"]

def dart_str(s):
    if s is None:
        return "null"
    # JSON string literal is valid Dart (double-quoted); also escape $ for Dart.
    return json.dumps(s, ensure_ascii=False).replace("$", r"\$")

out = io.StringIO()
out.write("// Auto-generated practice word list (offline). Source: /api/words.\n")
out.write("// Balinese is computed on-device by converter.dart.\n")
out.write("const List<Map<String, String?>> kWords = [\n")
for w in words:
    out.write("  {\"latin\": %s, \"meaning\": %s, \"category\": %s, \"difficulty\": %s},\n" % (
        dart_str(w.get("latin")), dart_str(w.get("meaning")),
        dart_str(w.get("category")), dart_str(w.get("difficulty"))))
out.write("];\n")

with open("lib/words_data.dart", "w", encoding="utf-8") as f:
    f.write(out.getvalue())
print("wrote lib/words_data.dart with", len(words), "words")
