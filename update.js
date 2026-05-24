const fs=require('fs');
const files=['work-chiguru.html','work-raja-rangu.html','work-uthsava.html','work-collabs.html','work-fests.html'];
files.forEach(f=>{
    let content=fs.readFileSync(f,'utf8');
    content = content.replace('class="work-gallery-grid reveal active"', 'class="work-gallery-grid reveal"');
    fs.writeFileSync(f,content);
});
console.log('Done!');
