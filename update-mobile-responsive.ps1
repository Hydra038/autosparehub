# PowerShell script to make all pages mobile responsive
# Replace "container mx-auto px-4 py-8" with mobile responsive version

$files = @(
    "app\privacy\page.tsx",
    "app\returns\page.tsx",
    "app\shipping\page.tsx",
    "app\terms\page.tsx",
    "app\cookies\page.tsx",
    "app\track-order\page.tsx",
    "app\categories\page.tsx"
)

foreach ($file in $files) {
    $filePath = "C:\Users\wisem\OneDrive\Desktop\carparts\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Updating $file..." -ForegroundColor Green
        
        # Read the file
        $content = Get-Content $filePath -Raw
        
        # Replace py-8 with responsive padding
        $content = $content -replace 'className="container mx-auto px-4 py-8"', 'className="container mx-auto px-4 py-6 sm:py-8"'
        
        # Replace text-3xl with responsive text
        $content = $content -replace 'text-3xl font-bold', 'text-2xl font-bold sm:text-3xl'
        
        # Replace text-2xl with responsive text
        $content = $content -replace 'text-2xl font-semibold', 'text-lg font-semibold sm:text-2xl'
        $content = $content -replace 'text-2xl font-bold', 'text-lg font-bold sm:text-2xl'
        
        # Replace text-xl with responsive text
        $content = $content -replace 'text-xl font-semibold', 'text-lg font-semibold sm:text-xl'
        $content = $content -replace 'text-xl font-bold', 'text-lg font-bold sm:text-xl'
        
        # Write back to file
        Set-Content -Path $filePath -Value $content -NoNewline
        
        Write-Host "✓ Updated $file" -ForegroundColor Cyan
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ All files updated for mobile responsiveness!" -ForegroundColor Green
