$p = 'c:\Users\Charitha Sharada\.gemini\antigravity\scratch\dhamani-thekkatte\styles.css'
$l = Get-Content -Path $p
$l[1928] = '    z-index: 100;'
$l[1929] = '}'
$l[1930] = ''
$l[1931] = ''
$l[1932] = ''
$l[1933] = ''
$l | Set-Content -Path $p
