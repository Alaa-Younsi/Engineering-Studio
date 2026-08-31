# One-off: build public/og-image.png (1200x630) by cropping an existing hero photo.
# Run from the repo root:  powershell -ExecutionPolicy Bypass -File scripts/gen-og-image.ps1
#
# Social cards render the site name / title / description as text ABOVE the image,
# so a real photo beats a text card here. Re-run if the source art changes.

Add-Type -AssemblyName System.Drawing

$src  = "public/Assets/images/Intro-07 + Loading page.jpg"
$out  = "public/og-image.png"
$outW = 1200
$outH = 630

if (-not (Test-Path $src)) { Write-Error "Source not found: $src"; exit 1 }

$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))

# Scale so the image covers 1200x630, then center-crop.
$scale = [Math]::Max($outW / $img.Width, $outH / $img.Height)
# NOTE: [Math]::Round returns [double]; the Bitmap ctor throws on non-int args.
$scaledW = [int][Math]::Round($img.Width * $scale)
$scaledH = [int][Math]::Round($img.Height * $scale)
$offX = [int][Math]::Round(($scaledW - $outW) / 2)
$offY = [int][Math]::Round(($scaledH - $outH) / 2)

$bmp = New-Object System.Drawing.Bitmap($outW, $outH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, -$offX, -$offY, $scaledW, $scaledH)
$g.Dispose()

$bmp.Save((Join-Path (Get-Location) $out), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()

Write-Host "Wrote $out ($outW x $outH). Verify it is not blank before committing."
