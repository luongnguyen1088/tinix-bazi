$file = "c:\Users\ADMIN\Desktop\Code\Antigravity 2026\tinix-bazi\frontend\src\index.css"
$content = Get-Content $file -Raw
# Restore modal-body scroll
$content = $content -replace "\.modal-body \{(\s+)padding: 2rem;(\s+)background: transparent;(\s+)\}", ".modal-body {`n  padding: 2rem;`n  background: transparent;`n  max-height: 70vh;`n  overflow-y: auto;`n}"
Set-Content $file $content
