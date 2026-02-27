import sys

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('g_content.txt', 'r', encoding='utf-8') as f:
    g_lines = f.readlines()

# find line 1891 which is "<g style=\"pointer-events: auto;\">"
start_idx = 1891 - 1
end_idx = 1926 - 1

if '<g style="pointer-events: auto;">' in lines[start_idx] and '</g>' in lines[end_idx]:
    new_lines = lines[:start_idx] + g_lines + lines[end_idx+1:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Replaced successfully.")
else:
    print(f"Error: lines don't match exactly. start line is: {lines[start_idx].strip()} and end is {lines[end_idx].strip()}")

