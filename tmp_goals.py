from pathlib import Path
lines=Path('src/pages/GoalsCenterView.jsx').read_text().splitlines()
for i in range(90, 190):
    print(f"{i+1}:{lines[i]}")
