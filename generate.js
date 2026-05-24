const fs = require('fs');

const works = [
    { id: 'chiguru', title: 'CHIGURU', img: 'kuni_kuni_navile_play_1774001389463.png' },
    { id: 'raja-rangu', title: 'RAJA RANGU', img: 'kodalla_andre_kodalla_play_1774001457744.png' },
    { id: 'uthsava', title: 'UTHSAVA', img: 'surya_chandra_play_1774001484526.png' },
    { id: 'collabs', title: 'COLLABS', img: 'kuni_kuni_navile_play_1774001389463.png' },
    { id: 'fests', title: 'FESTS', img: 'kodalla_andre_kodalla_play_1774001457744.png' }
];

works.forEach(w => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${w.title} | DHAMANI TEKKATE</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&family=Noto+Sans+Kannada:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="smooth-scroll">
    <div class="noise-overlay"></div>
    <div class="vignette-overlay"></div>
    <div class="gradient-overlay"></div>
    
    <div class="container" style="padding-top:4rem;">
        <a href="index.html#works" class="btn-ink-spread" style="margin-bottom:2rem; display:inline-block;"><i class="fa-solid fa-arrow-left"></i> RETURN TO STAGE</a>
        
        <div class="work-subpage-header reveal active">
            <h1>${w.title}</h1>
            <p>Experience the cinematic journey, visual poetry, and dramatic storytelling woven into this theatrical chapter.</p>
        </div>
        
        <div class="work-gallery-grid reveal active">
            <div class="work-gallery-card">
                <img src="${w.img}" alt="Poster" class="work-gallery-img">
                <div class="work-gallery-overlay"><h4>Scene I: The Awakening</h4></div>
            </div>
            <div class="work-gallery-card">
                <img src="${w.img}" alt="Poster" class="work-gallery-img">
                <div class="work-gallery-overlay"><h4>Scene II: Midnight Dialogue</h4></div>
            </div>
            <div class="work-gallery-card">
                <img src="${w.img}" alt="Poster" class="work-gallery-img">
                <div class="work-gallery-overlay"><h4>Scene III: Curtain Fall</h4></div>
            </div>
        </div>
    </div>
</body>
</html>`;
    fs.writeFileSync('work-' + w.id + '.html', html);
});
console.log("5 Sub-pages flawlessly generated!");
