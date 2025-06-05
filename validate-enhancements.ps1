# Website Enhancement Validation Script (PowerShell)
# Validates all improvements made to Humanator Digital Services website

Write-Host "🚀 Starting Website Enhancement Validation..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

$passed = 0
$failed = 0
$warnings = 0

function Test-FileExists {
    param([string]$FilePath, [string]$Description)
    
    if (Test-Path $FilePath) {
        Write-Host "✅ $Description`: $FilePath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description`: $FilePath - FILE NOT FOUND" -ForegroundColor Red
        return $false
    }
}

function Test-FileContent {
    param([string]$FilePath, [string]$SearchString, [string]$Description)
    
    try {
        $content = Get-Content $FilePath -Raw -ErrorAction Stop
        if ($content -match [regex]::Escape($SearchString)) {
            Write-Host "✅ $Description found in $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description NOT found in $(Split-Path $FilePath -Leaf)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error reading $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-HTMLFile {
    param([string]$FilePath)
    
    $fileName = Split-Path $FilePath -Leaf
    Write-Host "🔍 Validating $fileName..." -ForegroundColor Yellow
    
    # Check for enhanced meta tags
    if (Test-FileContent $FilePath 'property="og:title"' 'Open Graph meta tags') { $global:passed++ } else { $global:failed++ }
    if (Test-FileContent $FilePath 'twitter:card' 'Twitter Card meta tags') { $global:passed++ } else { $global:failed++ }
    if (Test-FileContent $FilePath '@context' 'Structured data (JSON-LD)') { $global:passed++ } else { $global:failed++ }
    
    # Check for CSS file links
    if (Test-FileContent $FilePath 'performance.css' 'Performance CSS') { $global:passed++ } else { $global:failed++ }
    if (Test-FileContent $FilePath 'security.css' 'Security CSS') { $global:passed++ } else { $global:failed++ }
    
    # Check for accessibility features
    if (Test-FileContent $FilePath 'skip-link' 'Skip navigation link') { $global:passed++ } else { $global:failed++ }
    if (Test-FileContent $FilePath 'main-content' 'Main content landmark') { $global:passed++ } else { $global:failed++ }
    
    # Check for PWA features
    if (Test-FileContent $FilePath 'manifest.json' 'PWA Manifest') { $global:passed++ } else { $global:failed++ }
    if (Test-FileContent $FilePath 'theme-color' 'Theme color meta tag') { $global:passed++ } else { $global:failed++ }
    
    # Check for monitoring script
    if (Test-FileContent $FilePath 'monitor.js' 'Monitoring script') { $global:passed++ } else { $global:failed++ }
}
}

# File structure validation
Write-Host "📁 Checking file structure..." -ForegroundColor Yellow

$htmlFiles = @(
    ".\index.html",
    ".\about.html", 
    ".\contact.html",
    ".\services.html"
)

$cssFiles = @(
    ".\css\performance.css",
    ".\css\security.css",
    ".\css\style.css",
    ".\css\professional-theme.css"
)

$jsFiles = @(
    ".\script\main.js",
    ".\script\monitor.js"
)

# Check HTML files
foreach ($file in $htmlFiles) {
    if (Test-FileExists $file "HTML file") { 
        $passed++
        Test-HTMLFile $file
    } else { 
        $failed++ 
    }
}

# Check CSS files
foreach ($file in $cssFiles) {
    if (Test-FileExists $file "CSS file") { $passed++ } else { $failed++ }
}

# Check JS files
foreach ($file in $jsFiles) {
    if (Test-FileExists $file "JavaScript file") { $passed++ } else { $failed++ }
}

# Check other important files
if (Test-FileExists ".\sw.js" "Service Worker") { $passed++ } else { $failed++ }
if (Test-FileExists ".\manifest.json" "PWA Manifest") { $passed++ } else { $failed++ }
if (Test-FileExists ".\ENHANCEMENT_SUMMARY.md" "Enhancement Documentation") { $passed++ } else { $failed++ }

# Generate final report
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "📊 VALIDATION SUMMARY" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "✅ Tests Passed: $passed" -ForegroundColor Green
Write-Host "❌ Tests Failed: $failed" -ForegroundColor Red
Write-Host "⚠️  Warnings: $warnings" -ForegroundColor Yellow

$total = $passed + $failed
if ($total -gt 0) {
    $successRate = [math]::Round(($passed / $total) * 100, 1)
} else {
    $successRate = 0
}

Write-Host "📈 Success Rate: $successRate%" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "🎉 ALL VALIDATIONS PASSED! Website enhancement is complete and ready for deployment." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some validations failed. Please review the issues above before deployment." -ForegroundColor Yellow
}

# Create summary report
$reportData = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
    summary = @{
        passed = $passed
        failed = $failed
        warnings = $warnings
        successRate = "$successRate%"
    }
}

try {
    $reportData | ConvertTo-Json -Depth 3 | Out-File "validation-report.json" -Encoding UTF8
    Write-Host "📄 Detailed report saved to validation-report.json" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not save report: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🏁 Validation complete!" -ForegroundColor Green
