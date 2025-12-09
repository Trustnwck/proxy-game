// Game configuration
const CONFIG = {
    canvasWidth: 800,
    canvasHeight: 600,
    playerSpeed: 5,
    bulletSpeed: 7,
    enemySpeed: 2,
    enemySpawnRate: 0.02,
    maxEnemies: 10,
};

// Game state
let game = {
    score: 0,
    level: 1,
    lives: 3,
    isPaused: false,
    gameOver: false,
    
    // Canvas setup
    canvas: null,
    ctx: null,
    
    // Game objects
    player: null,
    enemies: [],
    bullets: [],
    particles: [],
    
    // Initialize game
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height - 50
        );
        
        this.setupEventListeners();
        this.gameLoop();
    },
    
    // Setup keyboard controls
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
                return;
            }
            this.player.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.player.handleKeyUp(e);
        });
    },
    
    // Toggle pause
    togglePause() {
        if (this.gameOver) return;
        this.isPaused = !this.isPaused;
        document.getElementById('pauseScreen').classList.toggle('hidden');
    },
    
    // Resume game
    resume() {
        this.isPaused = false;
        document.getElementById('pauseScreen').classList.add('hidden');
    },
    
    // Main game loop
    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(() => this.gameLoop());
    },
    
    // Update game state
    update() {
        if (this.isPaused) return;
        
        // Update player
        this.player.update(this.canvas.width);
        
        // Spawn enemies
        if (Math.random() < CONFIG.enemySpawnRate && this.enemies.length < CONFIG.maxEnemies) {
            this.enemies.push(new Enemy(
                Math.random() * this.canvas.width,
                -30,
                this.level
            ));
        }
        
        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            
            // Remove enemies that are off screen
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(index, 1);
                this.lives--;
                document.getElementById('lives').textContent = this.lives;
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
            
            // Check collision with player
            if (this.checkCollision(this.player, enemy)) {
                this.enemies.splice(index, 1);
                this.lives--;
                document.getElementById('lives').textContent = this.lives;
                this.createExplosion(this.player.x, this.player.y);
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Update bullets
        this.bullets.forEach((bullet, bulletIndex) => {
            bullet.update();
            
            // Remove bullets that are off screen
            if (bullet.y < 0) {
                this.bullets.splice(bulletIndex, 1);
                return;
            }
            
            // Check collision with enemies
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 10 * this.level;
                    this.createExplosion(enemy.x, enemy.y);
                    document.getElementById('score').textContent = this.score;
                    
                    // Level up
                    const newLevel = Math.floor(this.score / 500) + 1;
                    if (newLevel > this.level) {
                        this.level = newLevel;
                        document.getElementById('level').textContent = this.level;
                    }
                }
            });
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.update();
            if (!particle.alive) {
                this.particles.splice(index, 1);
            }
        });
    },
    
    // Draw game
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game objects
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
    },
    
    // Check collision between two objects
    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    },
    
    // Create explosion particles
    createExplosion(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const velocity = {
                x: Math.cos(angle) * 3,
                y: Math.sin(angle) * 3
            };
            this.particles.push(new Particle(x, y, velocity));
        }
    },
    
    // End game
    endGame() {
        this.gameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
};

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.speed = CONFIG.playerSpeed;
        this.keys = {};
    }
    
    handleKeyDown(e) {
        this.keys[e.key] = true;
        
        if (e.key === ' ') {
            e.preventDefault();
            this.shoot();
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    update(canvasWidth) {
        if (this.keys['ArrowLeft']) this.x -= this.speed;
        if (this.keys['ArrowRight']) this.x += this.speed;
        
        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    }
    
    shoot() {
        game.bullets.push(new Bullet(this.x + this.width / 2, this.y));
    }
    
    draw(ctx) {
        // Draw player ship
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw cabin
        ctx.fillStyle = '#ff8787';
        ctx.fillRect(this.x + 8, this.y + 5, 14, 15);
        
        // Draw window
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 10, this.y + 7, 10, 8);
    }
}

// Enemy class
class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.speed = CONFIG.enemySpeed + (level - 1) * 0.5;
    }
    
    update() {
        this.y += this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
    }
}

// Bullet class
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 15;
        this.speed = CONFIG.bulletSpeed;
    }
    
    update() {
        this.y -= this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        
        // Glow effect
        ctx.strokeStyle = '#ffed4e';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.width / 2 - 1, this.y - 1, this.width + 2, this.height + 2);
    }
}

// Particle class
class Particle {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.life = 1;
        this.decay = 0.02;
        this.alive = true;
    }
    
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 107, 107, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
    game.init();
});
