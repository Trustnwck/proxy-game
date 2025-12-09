// Games gallery script
// Loads a manifest from /games/games.json and renders a searchable grid.
async function loadGames(){
    try{
        const res = await fetch('games/games.json');
        if(!res.ok) throw new Error('Failed to fetch games manifest');
        const games = await res.json();
        window.__GAMES = games;

        const cats = [...new Set(games.map(g=>g.category || 'Uncategorized'))].sort();
        const catSel = document.getElementById('categoryFilter');
        // clear existing and add default
        catSel.innerHTML = '<option value="">All Categories</option>';
        for(const c of cats){
            const opt = document.createElement('option'); opt.value=c; opt.textContent=c; catSel.appendChild(opt);
        }

        renderGames(games);
    }catch(err){
        console.error(err);
        const grid = document.getElementById('gamesGrid');
        if(grid) grid.innerHTML = '<div class="error">Failed to load games manifest.</div>';
    }
}

function renderGames(list){
    const grid = document.getElementById('gamesGrid'); if(!grid) return;
    grid.innerHTML='';
    const countEl = document.getElementById('resultsCount'); if(countEl) countEl.textContent = list.length;
    for(const g of list){
        const card = document.createElement('div'); card.className='game-card';
        const safePath = g.path || '#';
        // show thumbnail image when available, otherwise icon emoji
        const thumbHtml = g.thumbnail ? `<img src="${g.thumbnail}" alt="${g.title} thumbnail" class="game-thumb" style="width:48px;height:48px;border-radius:6px;object-fit:cover">` : `<div class="game-icon">${g.icon || '🎮'}</div>`;
        const isExternal = /^https?:\/\//i.test(safePath);
        // choose click action: external open in new tab, internal navigate
        const playAction = isExternal ? `window.open('${safePath}','_blank')` : `location.href='${safePath}'`;
        card.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center">
              ${thumbHtml}
              <div style="flex:1">
                <h2 class="game-title">${g.title}</h2>
                <p class="game-desc">${g.description || ''}</p>
              </div>
            </div>
            <div class="game-meta">
                <button class="play-btn" onclick="${playAction}">Play</button>
                <div class="category">${g.category || 'Uncategorized'}</div>
            </div>`;
        grid.appendChild(card);
    }
}

function applyFilters(){
    const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('categoryFilter')?.value || '';
    if(!window.__GAMES) return;
    let out = window.__GAMES.filter(g=>{
        if(cat && (g.category || '') !== cat) return false;
        if(!q) return true;
        if((g.title||'').toLowerCase().includes(q)) return true;
        if((g.description||'').toLowerCase().includes(q)) return true;
        if(g.tags && g.tags.join(' ').toLowerCase().includes(q)) return true;
        return false;
    });
    renderGames(out);
}

document.addEventListener('DOMContentLoaded', ()=>{
    // wire up inputs
    document.addEventListener('input', (e)=>{
        if(e.target && (e.target.id==='searchInput' || e.target.id==='categoryFilter')) applyFilters();
    });
    const clearBtn = document.getElementById('clearBtn');
    if(clearBtn) clearBtn.addEventListener('click', ()=>{document.getElementById('searchInput').value='';document.getElementById('categoryFilter').value='';applyFilters();});
    loadGames();
});

// Export for console / Intellisense in editor
window.gamesGallery = { loadGames, renderGames, applyFilters };
