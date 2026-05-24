const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('drive.html', 'utf8');

// Regex to find file names and their IDs
// Google drive typically embeds metadata containing ["filename", "id"] or similar structures
// A more robust way: search for `"mimeType":"image/` and then look around, or just regex for IDs.
// Let's extract anything that looks like a file ID with a jpg/png extension.
// Specifically, Google Drive folder HTML contains: `["1XYZ...","filename.jpg"]`

const matches = [...html.matchAll(/\["([^"]{25,40})","([^"]+\.(?:jpg|jpeg|png))"/ig)];

if (matches.length === 0) {
    console.log("No images found in drive.html");
}

let downloaded = 0;

matches.forEach(match => {
    const fileId = match[1];
    const fileName = match[2];
    console.log(`Found: ${fileName} (ID: ${fileId})`);
    
    const dest = fs.createWriteStream(fileName);
    const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
    
    https.get(url, function(response) {
        if (response.statusCode === 302 || response.statusCode === 303) {
            // handle redirect
            https.get(response.headers.location, function(redirectRes) {
                redirectRes.pipe(dest);
                redirectRes.on('end', () => {
                    console.log(`Downloaded: ${fileName}`);
                    downloaded++;
                });
            });
        } else {
            response.pipe(dest);
            response.on('end', () => {
                console.log(`Downloaded: ${fileName}`);
                downloaded++;
            });
        }
    }).on('error', function(err) {
        console.error(`Error downloading ${fileName}:`, err);
    });
});
