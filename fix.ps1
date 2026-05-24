$css = Get-Content "styles.css" -Raw
$index = $css.IndexOf(".press-headline {")
$cleanCss = $css.Substring(0, $index)
$cleanCss += ".press-headline {
    font-family: var(--font-theatrical);
    font-size: 1.4rem;
    color: var(--bg-primary);
    margin-bottom: 1.2rem;
    letter-spacing: 0.15em;
    line-height: 1.4;
}

.press-excerpt {
    font-size: 0.85rem;
    color: var(--bg-secondary);
    line-height: 1.8;
    font-style: italic;
}

/* --- DUAL-MODE MODAL CONTRAST --- */
.subpage-earth .modal-card-unified {
    background: rgba(250, 246, 240, 0.15) !important;
    border: 1px solid rgba(250, 246, 240, 0.3) !important;
    color: #FAF6F0 !important;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5) !important;
}

.subpage-earth .modal-card-unified h2,
.subpage-earth .modal-card-unified h3,
.subpage-earth .modal-card-unified p {
    color: #FAF6F0 !important;
}

.subpage-earth .modal-card-unified .btn-theatrical {
    color: #FAF6F0 !important;
    border-color: rgba(250, 246, 240, 0.4) !important;
}

/* --- TYPEWRITER ANNOUNCEMENT --- */
.typewriter-popup {
    position: fixed;
    top: 15%;
    bottom: auto;
    left: 4%;
    transform: none;
    z-index: 1000;
    text-align: left;
    width: 90%;
    max-width: 600px;
    transition: all 0.8s ease;
}

.typewriter-popup.scrolled-away {
    opacity: 0;
    transform: translateX(-20px);
    pointer-events: none;
}

.typewriter-p {
    font-family: 'Courier New', Courier, monospace;
    color: #FAF6F0;
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9);
}

.typewriter-link {
    font-family: var(--font-theatrical);
    color: var(--accent-gold);
    text-decoration: underline;
    text-underline-offset: 4px;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    transition: opacity 1s ease, color 0.4s ease;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
}

.typewriter-link:hover {
    color: var(--hover-color);
}
"
[IO.File]::WriteAllText((Resolve-Path "styles.css").Path, $cleanCss)
