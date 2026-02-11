#!/usr/bin/env zsh

# Script to convert all .md files to PDF using md-to-pdf

echo "🚀 Converting all Markdown files to PDF..."
echo ""

# Create output directory
OUTPUT_DIR="pdf-exports"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Counters
success=0
failed=0
total=0

# Find and convert each markdown file
find . -name "*.md" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/.venv/*" \
    -not -path "*/pdf-exports/*" \
    -type f | while read -r md_file; do
    
    total=$((total + 1))
    
    # Get file info
    relative_path="${md_file#./}"
    filename=$(basename "$md_file")
    filename_no_ext="${filename%.md}"
    dir_path=$(dirname "$relative_path")
    
    echo "📄 [$total] Converting: $relative_path"
    
    # Convert file
    npx md-to-pdf "$md_file" > /dev/null 2>&1
    
    # Check if PDF was created
    pdf_file="${md_file%.md}.pdf"
    if [[ -f "$pdf_file" ]]; then
        # Create output directory structure
        output_subdir="$OUTPUT_DIR/$dir_path"
        mkdir -p "$output_subdir"
        
        # Move PDF
        mv "$pdf_file" "$output_subdir/"
        success=$((success + 1))
        echo "   ✅ Success"
    else
        failed=$((failed + 1))
        echo "   ❌ Failed"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Complete!"
echo "   ✅ Success: Check pdf-exports/ folder"
echo ""

# Count PDFs
pdf_count=$(find "$OUTPUT_DIR" -name "*.pdf" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "📁 Generated $pdf_count PDF files in: ./$OUTPUT_DIR/"
echo ""
echo "📂 File list:"
find "$OUTPUT_DIR" -name "*.pdf" -type f | sort | sed 's|^./||'
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
