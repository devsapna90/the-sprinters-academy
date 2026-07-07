# The_Sprinters Accacaddmy - Localhost Server (no Node.js required)
$Port = 3000
$Root = Join-Path $PSScriptRoot "public"

$coursesJson = '[{"id":"gold-trading","title":"Gold Trading Masterclass","subtitle":"Master XAU/USD & MCX Gold Futures","icon":"GOLD","duration":"8 Weeks","sessions":24,"level":"Beginner to Advanced","price":"Rs.14,999","description":"Learn professional gold trading strategies including technical analysis, global macro factors, MCX & COMEX execution, and risk management from industry expert Amit Chaudhary.","topics":["Gold market fundamentals & global drivers","Support/Resistance & chart patterns on gold","MCX Gold Mini & Gold Petal trading","Hedging strategies for jewellers & investors","Live market sessions every Saturday"],"color":"#d4af37"},{"id":"nifty-fifty","title":"Nifty 50 Trading Mastery","subtitle":"Index Futures, Options & Swing Trading","icon":"NIFTY","duration":"10 Weeks","sessions":30,"level":"Beginner to Pro","price":"Rs.18,999","description":"Complete Nifty 50 program covering index futures, options strategies, bank nifty correlation, and systematic swing trading with live mentorship by Amit Chaudhary.","topics":["Nifty 50 index structure & F&O basics","Option chain reading & OI analysis","Intraday & swing trading setups","Risk-reward ratio & position sizing","Weekly live Q&A with Amit Chaudhary"],"color":"#00c896"}]'

$instructorJson = '{"name":"Amit Chaudhary","title":"Senior Market Analyst & Course Master","experience":"12+ Years","students":"5,000+","bio":"Amit Chaudhary is a renowned stock market educator with over 12 years of experience in equity, derivatives, and commodity trading. He has trained thousands of traders across India and is known for his practical, no-nonsense approach to market education.","credentials":["NSE Certified Market Professional","Former Senior Analyst at leading brokerage","Featured speaker at Traders Summit 2024","Specialist in Gold & Index Derivatives"]}'

$sessionsJson = '[{"day":"Monday","time":"7:00 PM - 8:30 PM","topic":"Live Market Analysis - Nifty 50","course":"nifty-fifty"},{"day":"Wednesday","time":"7:00 PM - 8:30 PM","topic":"Gold Market Deep Dive","course":"gold-trading"},{"day":"Friday","time":"6:30 PM - 8:00 PM","topic":"Options & F&O Strategies","course":"nifty-fifty"},{"day":"Saturday","time":"10:00 AM - 12:00 PM","topic":"Live Trading Session with Amit","course":"both"}]'

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}

function Get-MarketDataJson {
  $gold = 62450 + (Get-Random -Minimum -400 -Maximum 400)
  $nifty = 22450 + (Get-Random -Minimum -100 -Maximum 100)
  $goldChange = [math]::Round((Get-Random -Minimum -20000 -Maximum 20000) / 100, 2)
  $niftyChange = [math]::Round((Get-Random -Minimum -7500 -Maximum 7500) / 100, 2)
  return "{`"success`":true,`"data`":{`"gold`":{`"symbol`":`"GOLD (MCX)`",`"price`":$gold,`"change`":$goldChange,`"unit`":`"Rs./10g`"},`"nifty`":{`"symbol`":`"NIFTY 50`",`"price`":$nifty,`"change`":$niftyChange,`"unit`":`"pts`"},`"updatedAt`":`"$((Get-Date).ToUniversalTime().ToString('o'))`"}}"
}

function Send-Response($response, $statusCode, $contentType, $body) {
  try {
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($body)
    $response.StatusCode = $statusCode
    $response.ContentType = $contentType
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.ContentLength64 = $buffer.Length
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
  } finally {
    try { $response.OutputStream.Close() } catch {}
    try { $response.Close() } catch {}
  }
}

function Handle-Request($context) {
  $request = $context.Request
  $response = $context.Response
  $path = $request.Url.LocalPath

  try {
    if ($request.HttpMethod -eq "OPTIONS") {
      Send-Response $response 204 "text/plain" ""
      return
    }

    switch ($path) {
      "/api/courses" {
        Send-Response $response 200 "application/json; charset=utf-8" "{`"success`":true,`"data`":$coursesJson}"
        return
      }
      "/api/instructor" {
        Send-Response $response 200 "application/json; charset=utf-8" "{`"success`":true,`"data`":$instructorJson}"
        return
      }
      "/api/sessions" {
        Send-Response $response 200 "application/json; charset=utf-8" "{`"success`":true,`"data`":$sessionsJson}"
        return
      }
      "/api/market" {
        Send-Response $response 200 "application/json; charset=utf-8" (Get-MarketDataJson)
        return
      }
      "/api/enroll" {
        if ($request.HttpMethod -ne "POST") {
          Send-Response $response 405 "application/json; charset=utf-8" '{"success":false,"message":"Method not allowed"}'
          return
        }
        $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
        $raw = $reader.ReadToEnd()
        $body = $raw | ConvertFrom-Json
        if (-not $body.name -or -not $body.email -or -not $body.phone -or -not $body.courseId) {
          Send-Response $response 400 "application/json; charset=utf-8" '{"success":false,"message":"All fields are required."}'
          return
        }
        $courseTitles = @{
          "gold-trading" = "Gold Trading Masterclass"
          "nifty-fifty"  = "Nifty 50 Trading Mastery"
        }
        if (-not $courseTitles.ContainsKey([string]$body.courseId)) {
          Send-Response $response 400 "application/json; charset=utf-8" '{"success":false,"message":"Invalid course selected."}'
          return
        }
        $title = $courseTitles[[string]$body.courseId]
        $msg = "Thank you, $($body.name)! You have been enrolled in $title. Amit Chaudhary's team will contact you shortly."
        $escaped = $msg -replace '\\','\\' -replace '"','\"'
        Send-Response $response 201 "application/json; charset=utf-8" "{`"success`":true,`"message`":`"$escaped`"}"
        return
      }
    }

    $filePath = if ($path -eq "/") { Join-Path $Root "index.html" } else { Join-Path $Root ($path.TrimStart("/")) }

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
      $content = [System.IO.File]::ReadAllBytes($filePath)
      $response.StatusCode = 200
      $response.ContentType = $mime
      $response.ContentLength64 = $content.Length
      $response.OutputStream.Write($content, 0, $content.Length)
      $response.OutputStream.Close()
      $response.Close()
    } else {
      Send-Response $response 404 "text/plain; charset=utf-8" "404 Not Found"
    }
  } catch {
    try {
      Send-Response $response 500 "text/plain; charset=utf-8" "Internal Server Error"
    } catch {}
  }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host ""
Write-Host "  The_Sprinters Accacaddmy is running!" -ForegroundColor Green
Write-Host "  Open http://localhost:$Port in your browser" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor DarkGray
Write-Host ""

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    Handle-Request $context
  }
} finally {
  $listener.Stop()
}
