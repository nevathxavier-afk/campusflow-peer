param (
    [int]$Port = 8080,
    [string]$Directory = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Write-Host "CampusFlow Peer running at http://localhost:$Port/"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $Directory $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = "application/octet-stream"
            if ($extension -eq ".html") { $mimeType = "text/html; charset=utf-8" }
            elseif ($extension -eq ".css") { $mimeType = "text/css; charset=utf-8" }
            elseif ($extension -eq ".js") { $mimeType = "application/javascript; charset=utf-8" }
            elseif ($extension -eq ".json") { $mimeType = "application/json; charset=utf-8" }
            elseif ($extension -eq ".svg") { $mimeType = "image/svg+xml" }
            elseif ($extension -eq ".txt") { $mimeType = "text/plain; charset=utf-8" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mimeType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.Close()
    }
} catch {
    Write-Host "Server halted."
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
