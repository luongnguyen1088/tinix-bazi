$file = "c:\Users\ADMIN\Desktop\Code\Antigravity 2026\tinix-bazi\frontend\src\index.css"
$content = Get-Content $file -Raw
$content = $content -replace "overscroll-behavior-y: contain;", ""
$content = $content -replace "display: flex;(\s+)flex-direction: column;", ""
$content = $content -replace "overflow-y: auto;", ""
Set-Content $file $content
