"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { Video, X, Maximize, ArrowLeft } from "lucide-react"
import { api } from '@/lib/api'

// Dynamically import leaflet components for better performance
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="w-full h-full bg-gradient-to-br from-blue-950/30 to-slate-900/30 flex items-center justify-center"><div className="text-white">Loading map...</div></div> }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

export default function MapsPage() {
  const [buildings, setBuildings] = useState<any[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [selectedCctv, setSelectedCctv] = useState<any>(null)
  const [streamData, setStreamData] = useState<any>(null)
  const [showLiveStream, setShowLiveStream] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  
  // Load leaflet dynamically only on client side
  useEffect(() => {
    setMounted(true)
    const loadLeaflet = async () => {
      const L = await import('leaflet')
      leafletRef.current = L
    }
    loadLeaflet()
  }, [])
  
  // Fetch buildings data
  const fetchBuildings = useCallback(async () => {
    try {
      const data = await api.getBuildings()
      // Ensure data is an array
      if (Array.isArray(data)) {
        setBuildings(data)
      } else {
        setBuildings([])
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error)
      setBuildings([])
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Initialize data fetching
  useEffect(() => {
    if (mounted) {
      fetchBuildings()
    }
  }, [mounted, fetchBuildings])
  
  const handleBuildingClick = (building: any) => {
    // Check if latitude and longitude exist and are valid
    if (mapRef.current && building.latitude && building.longitude) {
      const lat = parseFloat(building.latitude);
      const lng = parseFloat(building.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Set selected building to show its rooms
        setSelectedBuilding(building)
        // Zoom to the building location
        mapRef.current.flyTo([lat, lng], 17, {
          duration: 1.5, // Animation duration in seconds
          animate: true
        })
      }
    }
  }
  
  const handleBackToBuildings = () => {
    // Zoom back to the selected building's location
    if (mapRef.current && selectedBuilding && selectedBuilding.latitude && selectedBuilding.longitude) {
      const lat = parseFloat(selectedBuilding.latitude);
      const lng = parseFloat(selectedBuilding.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Zoom back to the building location
        mapRef.current.flyTo([lat, lng], 15, {
          duration: 1.5,
          animate: true
        })
        
        // After zooming back to the building, show all buildings
        setTimeout(() => {
          setSelectedBuilding(null)
        }, 1500)
      } else {
        // Fallback to default behavior
        setSelectedBuilding(null)
      }
    } else {
      // Fallback to default behavior
      setSelectedBuilding(null)
    }
  }
  
  const handleLiveStream = useCallback(async (cctv: any) => {
    try {
      setSelectedCctv(cctv)
      setShowLiveStream(true)
      // Fetch stream URL
      const streamData = await api.getCctvStreamUrl(cctv.id)
      setStreamData(streamData)
    } catch (error) {
      console.error('Failed to fetch stream URL:', error)
    }
  }, [])
  
  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLiveStream(false)
        setStreamData(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])
  
  // Memoized icon creation function
  const createCustomIcon = useCallback((iconUrl: string, isRoom: boolean = false, size: [number, number] = [32, 32]) => {
    if (!leafletRef.current) return undefined;
    
    // If we're using the default Blade UI Kit URLs, create enhanced SVG icons
    if (isRoom) {
      // Enhanced room icon (CCTV camera) - more detailed design
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
          <defs>
            <radialGradient id="cameraGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#047857" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="1" dy="1" result="offset"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Perfect circle base -->
          <circle cx="16" cy="16" r="15" fill="url(#cameraGradient)" filter="url(#shadow)"/>
          <!-- Camera lens -->
          <circle cx="16" cy="14" r="7" fill="#ffffff"/>
          <circle cx="16" cy="14" r="5" fill="#1e293b"/>
          <circle cx="16" cy="14" r="2" fill="#10b981"/>
          <!-- Camera mount -->
          <rect x="14" y="21" width="4" height="4" rx="1" fill="#047857"/>
          <rect x="12" y="25" width="8" height="2" rx="1" fill="#047857"/>
          <!-- Camera indicator light -->
          <circle cx="20" cy="12" r="1.5" fill="#ef4444"/>
        </svg>
      `;
      
      return new leafletRef.current.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1]]
      });
    } else {
      // Enhanced building icon - perfectly circular design
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
          <defs>
            <radialGradient id="buildingGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#1d4ed8" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="1" dy="1" result="offset"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Perfect circle base -->
          <circle cx="16" cy="16" r="15" fill="url(#buildingGradient)" filter="url(#shadow)"/>
          <!-- Building silhouette -->
          <g transform="translate(8, 8)">
            <!-- Main building structure -->
            <rect x="4" y="4" width="8" height="12" rx="1" fill="#ffffff" opacity="0.9"/>
            <!-- Building roof -->
            <polygon points="8,0 14,4 2,4" fill="#ffffff" opacity="0.9"/>
            <!-- Windows -->
            <rect x="5" y="6" width="2" height="2" rx="0.3" fill="#3b82f6"/>
            <rect x="9" y="6" width="2" height="2" rx="0.3" fill="#3b82f6"/>
            <rect x="5" y="10" width="2" height="2" rx="0.3" fill="#3b82f6"/>
            <rect x="9" y="10" width="2" height="2" rx="0.3" fill="#3b82f6"/>
            <!-- Door -->
            <rect x="7" y="13" width="2" height="3" rx="0.5" fill="#f59e0b"/>
          </g>
        </svg>
      `;
      
      return new leafletRef.current.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1]]
      });
    }
  }, [])
  
  if (!mounted) {
    return (
      <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 py-8 min-h-[calc(100vh-140px)] flex flex-col">
        <div className="pt-4 pb-6 px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">Maps</h1>
        </div>
        <div className="px-4 pb-6 flex-grow flex justify-center">
          <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl z-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-950/30 to-slate-900/30 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-white/50 font-semibold">Loading map...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 py-8 min-h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="pt-4 pb-6 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">Maps</h1>
      </div>
      
      {/* Back Button - only shown when rooms are displayed */}
      {selectedBuilding && (
        <div className="px-4 pb-2 flex justify-start">
          <button 
            onClick={handleBackToBuildings}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Buildings</span>
          </button>
        </div>
      )}
      
      {/* Map Container - reduced width */}
      <div className="px-4 pb-6 flex-grow flex justify-center">
        <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl z-0">
          {!loading ? (
            <MapContainer 
              center={[-6.1751, 108.2146]} 
              zoom={selectedBuilding ? 17 : 13} 
              style={{ height: "100%", width: "100%" }}
              className="z-0"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {/* Building Markers (Blue Icons) - Only shown when not in room view */}
              {!selectedBuilding && buildings.filter(b => b.latitude && b.longitude).map((building) => (
                <Marker 
                  key={`building-${building.id}`} 
                  position={[parseFloat(building.latitude), parseFloat(building.longitude)]}
                  icon={createCustomIcon(building.marker_icon_url || 'https://blade-ui-kit.com/blade-icons/govicon-building', false, [32, 32])}
                  eventHandlers={{
                    click: () => handleBuildingClick(building)
                  }}
                />
              ))}
              {/* Room Markers (Green Icons) - Only shown for selected building */}
              {selectedBuilding && selectedBuilding.rooms && Array.isArray(selectedBuilding.rooms) && 
                selectedBuilding.rooms.filter((room: any) => room.latitude && room.longitude).map((room: any) => (
                  <Marker 
                    key={`room-${room.id}`} 
                    position={[parseFloat(room.latitude), parseFloat(room.longitude)]}
                    icon={createCustomIcon(room.marker_icon_url || 'https://blade-ui-kit.com/blade-icons/tabler-device-cctv-f', true, [24, 24])}
                  >
                    <Popup>
                      <div className="p-3 max-w-xs">
                        <h3 className="font-bold text-lg text-green-600 mb-1">{room.name || 'Unnamed Room'}</h3>
                        <p className="text-sm text-gray-600 mb-2">{room.cctvs && Array.isArray(room.cctvs) ? room.cctvs.length : 0} CCTV</p>
                        <div className="space-y-2">
                          {room.cctvs && Array.isArray(room.cctvs) ? (
                            room.cctvs.length > 0 ? (
                              room.cctvs.map((cctv: any) => (
                                <button
                                  key={`cctv-${cctv.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLiveStream(cctv);
                                  }}
                                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                  {/* Enhanced CCTV icon with gradient */}
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                    <defs>
                                      <linearGradient id="btnCameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#f3f4f6" />
                                      </linearGradient>
                                    </defs>
                                    <circle cx="12" cy="12" r="9" fill="url(#btnCameraGradient)" stroke="#dc2626" strokeWidth="1"/>
                                    <circle cx="12" cy="12" r="4" fill="#dc2626"/>
                                    <circle cx="16" cy="12" r="1" fill="#ffffff"/>
                                  </svg>
                                  <span className="truncate font-medium">{cctv.name || 'Unnamed CCTV'}</span>
                                </button>
                              ))
                            ) : (
                              // Show a default live stream button when there are no CCTVs
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Create a dummy CCTV object for the handler
                                  const dummyCctv = {
                                    id: `room-${room.id}-default`,
                                    name: `${room.name || 'Room'} Camera`,
                                    room: room
                                  };
                                  handleLiveStream(dummyCctv);
                                }}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              >
                                {/* Enhanced live stream icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                  <defs>
                                    <linearGradient id="btnLiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#ffffff" />
                                      <stop offset="100%" stopColor="#f3f4f6" />
                                    </linearGradient>
                                  </defs>
                                  <circle cx="12" cy="12" r="9" fill="url(#btnLiveGradient)" stroke="#dc2626" strokeWidth="1"/>
                                  <circle cx="12" cy="12" r="4" fill="#dc2626"/>
                                  <circle cx="16" cy="12" r="1" fill="#ffffff"/>
                                </svg>
                                <span className="truncate font-medium">Live Stream</span>
                              </button>
                            )
                          ) : (
                            // Show a default live stream button when cctvs is not an array
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Create a dummy CCTV object for the handler
                                const dummyCctv = {
                                  id: `room-${room.id}-default`,
                                  name: `${room.name || 'Room'} Camera`,
                                  room: room
                                };
                                handleLiveStream(dummyCctv);
                              }}
                              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                              {/* Enhanced live stream icon */}
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                <defs>
                                  <linearGradient id="btnLiveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="100%" stopColor="#f3f4f6" />
                                  </linearGradient>
                                </defs>
                                <circle cx="12" cy="12" r="9" fill="url(#btnLiveGradient2)" stroke="#dc2626" strokeWidth="1"/>
                                <circle cx="12" cy="12" r="4" fill="#dc2626"/>
                                <circle cx="16" cy="12" r="1" fill="#ffffff"/>
                              </svg>
                              <span className="truncate font-medium">Live Stream</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              }
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-950/30 to-slate-900/30 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-white/50 font-semibold">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Live Stream Modal - medium-sized modal */}
      {showLiveStream && selectedCctv && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-blue-950 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-red-400" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{selectedCctv.name || 'Unnamed CCTV'}</span>
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const videoElement = document.querySelector('.live-stream-video');
                    if (videoElement && videoElement.requestFullscreen) {
                      videoElement.requestFullscreen();
                    }
                  }}
                  className="text-white/70 hover:text-white transition p-1"
                  aria-label="Full Screen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setShowLiveStream(false)
                    setStreamData(null)
                  }} 
                  className="text-white/70 hover:text-white transition p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Video Player - responsive aspect ratio */}
            <div className="aspect-video bg-black/50 flex items-center justify-center flex-grow relative">
              {streamData ? (
                <div className="w-full h-full flex flex-col">
                  {/* Video placeholder with instructions */}
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="text-center p-4">
                      <Video className="w-16 h-16 text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 font-semibold text-lg">Live Stream Player</p>
                      <p className="text-white/30 text-sm mt-2">Stream connection established</p>
                      <div className="mt-6 text-xs text-white/40 space-y-1">
                        <p>Camera: {selectedCctv.name || 'Unnamed CCTV'}</p>
                        <p>Location: {selectedCctv.room?.name || 'Unknown Room'} - {selectedCctv.room?.building?.name || 'Unknown Building'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-white/50 font-semibold">Loading stream...</p>
                </div>
              )}
            </div>
            
            {/* Footer with actions */}
            <div className="p-4 border-t border-white/10 flex justify-end gap-2">
              <button 
                onClick={() => {
                  setShowLiveStream(false)
                  setStreamData(null)
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}