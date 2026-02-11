#!/usr/bin/env bash

# Batch convert all .md files to PDF

echo "🚀 Batch PDF Generation Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Setup
OUTPUT_DIR="pdf-exports"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Use npx md-to-pdf with glob patterns
echo "📥 Converting all markdown files..."
echo ""

# Convert all files in root
npx md-to-pdf ./*.md 2>/dev/null
sleep 1

# Convert all files in docs/
npx md-to-pdf ./docs/*.md 2>/dev/null
sleep 1

# Move all generated PDFs to output directory
echo ""
echo "📦 Organizing PDFs..."

# Move root PDFs
if ls ./*.pdf 1> /dev/null 2>&1; then
    mkdir -p "$OUTPUT_DIR"
    for pdf in ./*.pdf; do
        if [[ "$pdf" != "./project x.pdf" ]]; then  # Skip existing PDF
            mv "$pdf" "$OUTPUT_DIR/"
            echo "   ✅ $(basename "$pdf")"
        fi
    done
fi

# Move docs PDFs
if ls ./docs/*.pdf 1> /dev/null 2>&1; then
    mkdir -p "$OUTPUT_DIR/docs"
    for pdf in ./docs/*.pdf; do
        mv "$pdf" "$OUTPUT_DIR/docs/"
        echo "   ✅ docs/$(basename "$pdf")"
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count PDFs
pdf_count=$(find "$OUTPUT_DIR" -name "*.pdf" | wc -l | tr -d ' ')
echo ""
echo "✅ Generated $pdf_count PDF files"
echo "📁 Location: ./$OUTPUT_DIR/"
echo ""
echo "📂 Files:"
find "$OUTPUT_DIR" -name "*.pdf" | sort | sed 's|pdf-exports/|  |'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Done! All PDFs are in the pdf-exports folder"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
