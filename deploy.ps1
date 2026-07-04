<#
.SYNOPSIS
  AI Study 배포 스크립트
.DESCRIPTION
  HTML 파일의 캐시 버스팅(?v=) 자동 갱신 → git push → 버전 태그 생성
.PARAMETER Version
  릴리즈 태그명 (예: v2.0). 생략하면 마지막 태그에서 자동 증가.
.PARAMETER Message
  태그 설명. 생략하면 실행 중 입력 프롬프트.
.EXAMPLE
  .\deploy.ps1
  .\deploy.ps1 -Version v2.0 -Message "AI논문 기능 추가"
#>

param(
  [string]$Version = "",
  [string]$Message = ""
)

Set-Location $PSScriptRoot
$ErrorActionPreference = "Stop"

# ── 헤더 ──────────────────────────────────────────────
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   AI Study  배포 스크립트" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# ── STEP 1: 버전 결정 ─────────────────────────────────
if (-not $Version) {
  $lastTag = ""
  try { $lastTag = (git describe --tags --abbrev=0 2>$null).Trim() } catch {}

  if ($lastTag -match '^v(\d+)\.(\d+)$') {
    $Version = "v$($Matches[1]).$([int]$Matches[2] + 1)"
  } elseif ($lastTag -match '^v(\d+)$') {
    $Version = "v$([int]$Matches[1]).1"
  } else {
    $Version = "v1.0"
  }
}

# 태그 설명 입력 (파라미터 없을 때만)
if (-not $Message) {
  Write-Host ""
  Write-Host "  릴리즈 설명을 입력하세요 (Enter = 자동):" -ForegroundColor Gray
  $input = Read-Host "  > "
  $Message = if ($input) { $input } else { "Release $Version — $(Get-Date -Format 'yyyy-MM-dd')" }
}

Write-Host ""
Write-Host "  버전   : $Version" -ForegroundColor White
Write-Host "  설명   : $Message" -ForegroundColor White
Write-Host ""

# ── STEP 2: 캐시 버스팅 자동 갱신 ───────────────────────
$stamp = Get-Date -Format "yyyyMMddHHmm"
Write-Host "[1/4] 캐시 버스팅 갱신 → $stamp" -ForegroundColor Yellow

$updated = @()
Get-ChildItem -Path $PSScriptRoot -Filter "*.html" |
  Where-Object { $_.FullName -notlike "*\docs\*" } |
  ForEach-Object {
    $raw = Get-Content $_.FullName -Raw -Encoding UTF8
    $new = $raw -replace '\?v=[A-Za-z0-9]+', "?v=$stamp"
    if ($raw -ne $new) {
      Set-Content $_.FullName $new -Encoding UTF8
      $updated += $_.Name
    }
  }

if ($updated.Count -gt 0) {
  Write-Host "  갱신 파일: $($updated -join ', ')" -ForegroundColor Gray
} else {
  Write-Host "  갱신할 파일 없음 (버전 참조 없는 파일만 존재)" -ForegroundColor Gray
}

# ── STEP 3: git commit ────────────────────────────────
Write-Host "[2/4] 변경사항 커밋..." -ForegroundColor Yellow

$status = git status --porcelain
if ($status) {
  git add -A
  git commit -m "deploy $Version : cache bust $stamp"
  Write-Host "  커밋 완료" -ForegroundColor Gray
} else {
  Write-Host "  커밋할 변경사항 없음" -ForegroundColor Gray
}

# ── STEP 4: git push ──────────────────────────────────
Write-Host "[3/4] GitHub Pages 배포 (push)..." -ForegroundColor Yellow
git push
Write-Host "  Push 완료" -ForegroundColor Gray

# ── STEP 5: 버전 태그 생성 ───────────────────────────
Write-Host "[4/4] 버전 태그 생성: $Version" -ForegroundColor Yellow

# 동일 태그가 이미 있으면 삭제 후 재생성
$existingTag = git tag -l $Version
if ($existingTag) {
  git tag -d $Version | Out-Null
  git push origin ":refs/tags/$Version" 2>$null | Out-Null
}

git tag -a $Version -m $Message
git push origin $Version
Write-Host "  태그 완료" -ForegroundColor Gray

# ── 완료 ──────────────────────────────────────────────
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   배포 완료!" -ForegroundColor Green
Write-Host "   버전   : $Version" -ForegroundColor White
Write-Host "   스탬프 : $stamp" -ForegroundColor White
Write-Host "   URL    : https://yangguibee.github.io" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "   [롤백 방법]" -ForegroundColor DarkGray
Write-Host "   git checkout $Version   # 해당 버전으로 전환" -ForegroundColor DarkGray
Write-Host "   git log --oneline --tags --decorate  # 태그 목록" -ForegroundColor DarkGray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
