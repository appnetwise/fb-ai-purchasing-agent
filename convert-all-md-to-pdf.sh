#!/bin/bash

# Script to convert all .md files to PDF
# Uses md-to-pdf npm package

echo "🚀 Starting MD to PDF conversion for all Markdown files..."
echo ""

# Create output directory for PDFs
OUTPUT_DIR="pdf-exports"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Counter for tracking
total=0
success=0
failed=0

# Get list of all markdown files
mapfile -t md_files < <(find . -name "*.md" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/.venv/*" \
    -not -path "*/pdf-exports/*" \
    -type f)

total=${#md_files[@]}

echo "Found $total markdown files to convert"
echo ""

# Convert all files using md-to-pdf with glob pattern
for md_file in "${md_files[@]}"; do
    # Get relative path
    relative_path="${md_file#./}"
    filename=$(basename "$md_file")
    filename_no_ext="${filename%.md}"
    dir_path=$(dirname "$relative_path")
    
    echo "📄 Converting: $relative_path"
    
    # Convert file
    if npx md-to-pdf "$md_file" > /dev/null 2>&1; then
        pdf_file="${md_file%.md}.pdf"
        
        if [[ -f "$pdf_file" ]]; then
            # Create output subdirectory structure
            output_subdir="$OUTPUT_DIR/$dir_path"
            mkdir -p "$output_subdir"
            
            # Move PDF to exports folder
            mv "$pdf_file" "$output_subdir/"
            success=$((success + 1))
            echo "   ✅ Saved to: $output_subdir/${filename_no_ext}.pdf"
        else
            failed=$((failed + 1))
            echo "   ❌ Failed (PDF not found)"
        fi
    else
        failed=$((failed + 1))
        echo "   ❌ Failed (conversion error)"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Summary:"
echo "   Total files: $total"
echo "   ✅ Success: $success"
echo "   ❌ Failed: $failed"
echo ""

if [ $success -gt 0 ]; then
    echo "📁 All PDFs saved to: ./$OUTPUT_DIR/"
    echo ""
    echo "📂 Generated files:"
    find "$OUTPUT_DIR" -name "*.pdf" -type f | sort | sed 's|^./||'
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
