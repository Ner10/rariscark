/**
 * Raris Çark Cloudflare Worker
 * 
 * This serves as a template for handling requests in a Cloudflare Worker environment.
 * It can be used for edge-side processing, caching, or API request handling.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle incoming requests
 * @param {Request} request
 */
async function handleRequest(request) {
  // URL parsing
  const url = new URL(request.url)
  const path = url.pathname

  // Simple routing
  if (path.startsWith('/api/')) {
    return handleApiRequest(request, path)
  }

  // Serve static assets or fallback to index.html for SPA
  try {
    // Attempt to get the asset from KV storage or origin
    let response = await fetch(request)
    
    // If the page is not found, return the index page for client-side routing
    if (response.status === 404) {
      return fetch(`${url.origin}/index.html`)
    }
    
    return response
  } catch (e) {
    return new Response('Server Error', { status: 500 })
  }
}

/**
 * Handle API requests
 * @param {Request} request 
 * @param {string} path 
 */
async function handleApiRequest(request, path) {
  // Simple API request handling example
  if (path === '/api/health') {
    return new Response(
      JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  // For other API requests, you would typically proxy to your backend
  // or handle directly here depending on your architecture
  
  return new Response('Not Found', { status: 404 })
}