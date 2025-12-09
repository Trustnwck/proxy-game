# Proxy Game

A fast-paced, browser-based space shooter game built with vanilla JavaScript, HTML5 Canvas, and CSS.

## Features

- **Dynamic Gameplay**: Dodge incoming enemies and shoot them down
- **Progressive Difficulty**: Game gets harder as your score increases
- **Lives System**: Start with 3 lives, lose them by colliding with enemies
- **Score & Level Tracking**: Track your progress with real-time scoring
- **Pause Feature**: Press 'P' to pause and resume the game
- **Particle Effects**: Explosions and visual feedback for destroyed enemies
- **Responsive Design**: Works on desktop and tablet devices

````markdown
# Proxy Game

A fast-paced, browser-based space shooter game built with vanilla JavaScript, HTML5 Canvas, and CSS.

## Features

- **Dynamic Gameplay**: Dodge incoming enemies and shoot them down
- **Progressive Difficulty**: Game gets harder as your score increases
- **Lives System**: Start with 3 lives, lose them by colliding with enemies
- **Score & Level Tracking**: Track your progress with real-time scoring
- **Pause Feature**: Press 'P' to pause and resume the game
- **Particle Effects**: Explosions and visual feedback for destroyed enemies
- **Responsive Design**: Works on desktop and tablet devices

## How to Play

1. Open `index.html` in your web browser
2. Use **Arrow Keys** to move your ship left and right
3. Press **Space** to shoot bullets at incoming enemies
4. Press **P** to pause/resume the game
5. Avoid collisions with enemies and keep your lives!

## Controls

| Key | Action |
|-----|--------|
| ← → | Move left/right |
| Space | Shoot |
| P | Pause/Resume |

## Game Mechanics

- **Enemies**: Triangular enemies spawn from the top and move downward
- **Scoring**: Destroy enemies to earn points (10 points × current level)
- **Level System**: Your level increases every 500 points
- **Difficulty**: Enemy speed increases with your level
- **Game Over**: Lose when all 3 lives are depleted

## File Structure

```
├── index.html      # Game HTML structure (plays the canvas game)
├── games.html      # Games gallery (browse multiple games)
├── games/          # Games manifest and related assets
│   └── games.json  # Games manifest used by `games.html`
├── styles.css      # Game styling and layout
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## Games Gallery

- Open `games.html` to view a small gallery that loads `games/games.json`.
- Use the search input and category filter to find games; click "Play" to open the game's `path` (for the included demo the path is `index.html`).

## Technical Details

- **Canvas Size**: 800 × 600 pixels
- **Built With**: Vanilla JavaScript (no frameworks)
- **Browser Support**: All modern browsers with HTML5 Canvas support

## Future Enhancements

- [ ] Power-ups and special weapons
- [ ] Boss battles
- [ ] Sound effects and background music
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Different enemy types
- [ ] Upgradeable ship abilities

## License

MIT License - Feel free to use this project for learning and personal use.

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests.

---

**Enjoy the game and happy coding!** 🚀

````
