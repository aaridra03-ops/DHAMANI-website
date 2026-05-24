const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log("Navigating to Google Drive folder...");
    await page.goto("https://drive.google.com/drive/folders/19ZyHlIzwlPVNjKkvSzxsi07jJpaZ8z_b?usp=drive_link", { waitUntil: 'networkidle0' });
    
    console.log("Page loaded. Extracting HTML...");
    const content = await page.content();
    
    // Save for inspection if needed
    fs.writeFileSync('drive_render.html', content);
    
    // The typical structure is ["1AbCdEfigHIJKlmno_PQRst_UVwxY-Z", "filename.jpg"]
    // Let's find IDs. We know the filenames exactly from what you wanted earlier:
    const targets = [
        "6x3 - Dhamani Stage Banner -  color .jpg",
        "8x6 - Dhamani - Banner (1).jpg",
        "Dhamani Invitation A5 - 2.jpg",
        "IMG-20240204-WA0001.jpg",
        "IMG-20240208-WA0000.jpg"
    ];

    const foundFiles = [];
    
    for (const target of targets) {
        // We will try to find the ID nearby. Drive puts them in arrays usually.
        // Let's use a regex looking for `["<ID>","<filename>"`
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\["([\\w-]{25,40})","${escaped}"`, 'i');
        const match = content.match(regex);
        
        if (match) {
            foundFiles.push({ id: match[1], name: target });
        } else {
            console.log(`Could not find ID for ${target}`);
        }
    }
    
    console.log(`Found ${foundFiles.length} files.`);
    
    // Fallback: If we can't find explicitly, let's just grab all image names and IDs
    if (foundFiles.length === 0) {
        const allMatches = [...content.matchAll(/\["([\w-]{25,40})","([^"]+\.(?:jpg|jpeg|png))"/ig)];
        allMatches.forEach(m => {
            if (!foundFiles.some(f => f.id === m[1])) {
                foundFiles.push({ id: m[1], name: m[2] });
            }
        });
        console.log(`Fallback strategy found ${foundFiles.length} files.`);
    }

    for (const file of foundFiles) {
        console.log(`Downloading: ${file.name} (ID: ${file.id})`);
        const url = `https://drive.google.com/uc?id=${file.id}&export=download`;
        
        // simple promise wrapper for download
        await new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(file.name);
            const request = https.get(url, function(response) {
                if (response.statusCode === 302 || response.statusCode === 303) {
                    https.get(response.headers.location, function(redirectRes) {
                        redirectRes.pipe(dest);
                        redirectRes.on('end', () => {
                            console.log(`Success: ${file.name}`);
                            resolve();
                        });
                    }).on('error', reject);
                } else {
                    response.pipe(dest);
                    response.on('end', () => {
                        console.log(`Success: ${file.name}`);
                        resolve();
                    });
                }
            }).on('error', reject);
        });
    }

    await browser.close();
})();
