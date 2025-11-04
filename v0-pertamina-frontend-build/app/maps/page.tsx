"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Video, X, Maximize } from "lucide-react"
import { api } from '@/lib/api'

// Dynamically import leaflet components for better performance
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => {
  return mod.MapContainer
}), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-blue-950/30 to-slate-900/30 flex items-center justify-center">
    <p className="text-white/50 font-semibold">Loading map...</p>
  </div>
})

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => {
  return mod.TileLayer
}), { ssr: false })

const Marker = dynamic(() => import("react-leaflet").then((mod) => {
  return mod.Marker
}), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => {
  return mod.Popup
}), { ssr: false })

export default function MapsPage() {
  const [buildings, setBuildings] = useState<any[]>([])
  const [selectedCctv, setSelectedCctv] = useState<any>(null)
  const [showLiveStream, setShowLiveStream] = useState(false)
  const [streamData, setStreamData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const data = await api.getBuildings()
      setBuildings(data)
    } catch (error) {
      console.error('Failed to fetch buildings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuildingClick = (building: any) => {
    if (mapRef.current) {
      mapRef.current.flyTo([building.latitude, building.longitude], 15)
    }
  }

  const handleLiveStream = async (cctv: any) => {
    try {
      setSelectedCctv(cctv)
      setShowLiveStream(true)
      // Fetch stream URL
      const streamData = await api.getCctvStreamUrl(cctv.id)
      setStreamData(streamData)
    } catch (error) {
      console.error('Failed to fetch stream URL:', error)
    }
  }

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

  return (
    <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 py-8 min-h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="pt-4 pb-6 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">Maps</h1>
      </div>

      {/* Map Container - responsive height */}
      <div className="px-4 pb-6 flex-grow">
        <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] w-full rounded-2xl overflow-hidden shadow-2xl z-0">
          {mounted && !loading ? (
            // @ts-ignore - Dynamic import typing issue with Next.js
            <MapContainer 
              center={[-6.1751, 108.2146]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              className="z-0"
              ref={mapRef}
            >
              {/* @ts-ignore - Dynamic import typing issue with Next.js */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {/* Building Markers (Blue Icons) */}
              {buildings.map((building) => (
                // @ts-ignore - Dynamic import typing issue with Next.js
                <Marker 
                  key={`building-${building.id}`} 
                  position={[building.latitude, building.longitude]}
                >
                  {/* @ts-ignore - Dynamic import typing issue with Next.js */}
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-lg text-blue-600">{building.name}</h3>
                      <p className="text-sm text-gray-600">{building.rooms?.length || 0} Room</p>
                      <button 
                        onClick={() => handleBuildingClick(building)}
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded"
                      >
                        Zoom In
                      </button>
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {building.rooms?.map((room: any) => (
                          <div key={`room-${room.id}`} className="mb-2 p-2 border rounded">
                            <h4 className="font-semibold text-green-600">{room.name}</h4>
                            <p className="text-xs text-gray-600">{room.cctvs?.length || 0} CCTV</p>
                            <div className="mt-1 grid grid-cols-1 gap-1">
                              {room.cctvs?.map((cctv: any) => (
                                <button
                                  key={`cctv-${cctv.id}`}
                                  onClick={() => handleLiveStream(cctv)}
                                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1 px-2 rounded flex items-center justify-center gap-1"
                                >
                                  <Video className="w-3 h-3" />
                                  <span className="truncate">{cctv.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
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
                <span className="truncate max-w-[200px] sm:max-w-xs">{selectedCctv.name}</span>
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const videoElement = document.createElement('video')
                    videoElement.requestFullscreen()
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
                        <p>Camera: {selectedCctv.name}</p>
                        <p>Location: {selectedCctv.room?.name} - {selectedCctv.room?.building?.name}</p>
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