$urls = @(
    "https://ceravo-3ogdsxcxb-shisfashion2-1514s-projects.vercel.app/",
    "https://ceravo.vercel.app/",
    "https://www.ceravo.online/",
    "https://ceravo.online/"
)

foreach ($url in $urls) {
    Write-Host "`n=========================================="
    Write-Host "Testing URL: $url"
    Write-Host "=========================================="
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop
        $statusCode = $resp.StatusCode
        $finalUrl = $resp.BaseResponse.ResponseUri.AbsoluteUri
        
        $title = "N/A"
        if ($resp.Content -match "(?i)<title>(.*?)</title>") {
            $title = $Matches[1].Trim()
        }
        
        $server = $resp.Headers["server"]
        $vercelId = $resp.Headers["x-vercel-id"]
        $vercelCache = $resp.Headers["x-vercel-cache"]
        
        Write-Host "Status Code: $statusCode"
        Write-Host "Final URL:   $finalUrl"
        Write-Host "Title:       $title"
        Write-Host "Server:      $server"
        Write-Host "Vercel ID:   $vercelId"
        Write-Host "Vercel Cache:$vercelCache"
    } catch {
        $statusCode = "Error"
        $finalUrl = "N/A"
        $title = "N/A"
        $server = "N/A"
        $vercelId = "N/A"
        $vercelCache = "N/A"
        
        if ($_.Exception -and $_.Exception.Response) {
            $response = $_.Exception.Response
            $statusCode = [int]$response.StatusCode
            $finalUrl = $response.ResponseUri.AbsoluteUri
            
            try {
                $stream = $response.GetResponseStream()
                if ($stream) {
                    $reader = New-Object System.IO.StreamReader($stream)
                    $body = $reader.ReadToEnd()
                    if ($body -match "(?i)<title>(.*?)</title>") {
                        $title = $Matches[1].Trim()
                    }
                }
            } catch {}
            
            $server = $response.Headers["server"]
            $vercelId = $response.Headers["x-vercel-id"]
            $vercelCache = $response.Headers["x-vercel-cache"]
        } else {
            Write-Host "Error: $($_.Exception.Message)"
        }
        
        Write-Host "Status Code: $statusCode"
        Write-Host "Final URL:   $finalUrl"
        Write-Host "Title:       $title"
        Write-Host "Server:      $server"
        Write-Host "Vercel ID:   $vercelId"
        Write-Host "Vercel Cache:$vercelCache"
    }
}
