#!/bin/bash

# Script to convert all .md files to PDF
# Uses md-to-pdf npm package

echo "🚀 Starting MD to PDF conversion..."
echo ""

# Create output directory for PDFs
OUTPUT_DIR="pdf-exports"
rm -rf "$OUTPUT_DIR"  # Clean previous exports
mkdir -p "$OUTPUT_DIR"

# Counter for tracking
total=0
success=0
failed=0

# Store current directory
PROJECT_ROOT=$(pwd)

# Find all .md files (excluding node_modules, .git, .venv)
while IFS= read -r md_file; do
    total=$((total + 1))
    
    # Get filename and directory
    filename=$(basename "$md_file")
    filename_no_ext="${filename%.md}"
    dir_path=$(dirname "$md_file")
    
    # Calculate relative path
    relative_path="${md_file#$PROJECT_ROOT/}"
    relative_dir=$(dirname "$relative_path")
    
    echo "📄 Converting: $relative_path"
    
    # Create output subdirectory
    output_subdir="$PROJECT_ROOT/$OUTPUT_DIR/$relative_dir"
    mkdir -p "$output_subdir"
    
    # Go to the file's directory to run conversion
    cd "$dir_path" || continue
    
    # Convert using md-to-pdf (creates PDF in same directory)
    if npx md-to-pdf "$filename" --config-file "$PROJECT_ROOT/.md-to-pdf.json" > /dev/null 2>&1; then
        # Check if PDF was created
        if [[ -f "${filename_no_ext}.pdf" ]]; then
            # Move the generated PDF to output directory
            mv "${filename_no_ext}.pdf" "$output_subdir/"
            success=$((success + 1))
            echo "   ✅ Success → $OUTPUT_DIR/$relative_dir/${filename_no_ext}.pdf"
        else
            failed=$((failed + 1))
            echo "   ❌ Failed (PDF not created)"
        fi
    else
        failed=$((failed + 1))
        echo "   ❌ Failed (conversion error)"
    fi
    
    # Return to project root
    cd "$PROJECT_ROOT" || exit
    
done < <(find "$PROJECT_ROOT" -name "*.md" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/.venv/*" \
    -not -path "*/pdf-exports/*" \
    -type f)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Conversion Summary:"
echo "   Total files: $total"
echo "   ✅ Success: $success"
echo "   ❌ Failed: $failed"
echo ""
if [ $success -gt 0 ]; then
    echo "📁 PDFs saved to: ./$OUTPUT_DIR/"
    echo ""
    echo "📂 Directory structure:"
    tree "$OUTPUT_DIR" -L 2 2>/dev/null || find "$OUTPUT_DIR" -name "*.pdf" | sed 's|^./||' | sort
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
