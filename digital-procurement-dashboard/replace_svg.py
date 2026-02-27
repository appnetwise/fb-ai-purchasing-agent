import re

with open('Medusa - A Commerce Platform for Developers and Agents.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The user provided a rect: <rect x="-0.00285524" y="0.495269" width="307" height="94" rx="9.5" transform="matrix(0.865865 0.500278 -0.871576 0.490261 182.503 23.1656)" stroke="#a1a1aa"></rect>
# Let's find the nearest <g style="pointer-events: auto;"> before this, and the corresponding </g>

start_str = '<g style="pointer-events: auto;">'
# find all occurrences of start_str
starts = [m.start() for m in re.finditer(re.escape(start_str), text)]

rect_str = 'transform="matrix(0.865865 0.500278 -0.871576 0.490261 182.503 23.1656)"'
rect_match = text.find(rect_str)

last_start = None
for s in starts:
    if s < rect_match:
        last_start = s

# Now find the matching </g> for last_start
def find_matching_end(text, start_idx):
    depth = 0
    i = start_idx
    while i < len(text):
        if text.startswith('<g', i):
            depth += 1
            i += 2
        elif text.startswith('</g>', i):
            depth -= 1
            if depth == 0:
                return i + 4
            i += 4
        else:
            i += 1
    return -1

if last_start is not None:
    end_idx = find_matching_end(text, last_start)
    g_content = text[last_start:end_idx]
    with open('g_content.txt', 'w', encoding='utf-8') as out:
        out.write(g_content)
    print("Exported g_content of length", len(g_content))
else:
    print("Could not find start!")

