const path = require('path')
const { exec } = require('child_process')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

// Create Express app
const app = express()
const port = process.env.PORT || 8000

// Serve static files from Laravel's public directory
app.use(express.static(path.join(__dirname, 'public')))

// Proxy API requests to Laravel
app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}))

// Proxy admin requests to Laravel
app.use('/admin', createProxyMiddleware({
  target: 'http://127.0.0.1:8000',
  changeOrigin: true
}))

// Serve Next.js frontend for all other routes
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:3001',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err)
    res.status(500).send('Frontend proxy error')
  }
}))

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)

  // Start Laravel server
  const laravel = exec('php artisan serve --port=8001', { cwd: __dirname })
  laravel.stdout.on('data', (data) => {
    console.log(`Laravel: ${data}`)
  })
  laravel.stderr.on('data', (data) => {
    console.error(`Laravel Error: ${data}`)
  })

  // Start Next.js development server
  const nextjs = exec('npm run dev', { cwd: path.join(__dirname, '..', 'v0-pertamina-frontend-build') })
  nextjs.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`)
  })
  nextjs.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`)
  })
})
