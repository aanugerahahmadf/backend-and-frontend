"use client"

import { useState, useEffect } from "react"
import { Search, Building2, DoorOpen, Video, X } from "lucide-react"
import Link from "next/link"
import { api } from '@/lib/api'

export default function PlaylistPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [buildings, setBuildings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCctv, setSelectedCctv] = useState<any>(null)
  const [streamData, setStreamData] = useState<any>(null)
  const [showLiveStream, setShowLiveStream] = useState(false)

  useEffect(() => {
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

    fetchBuildings()
  }, [])

  const handleLiveStream = async (cctv: any) => {
    try {
      setSelectedCctv(cctv)
      // Fetch stream URL
      const streamData = await api.getCctvStreamUrl(cctv.id)
      setStreamData(streamData)
      setShowLiveStream(true)
      console.log('Stream data:', streamData)
    } catch (error) {
      console.error('Failed to fetch stream URL:', error)
    }
  }

  const filteredBuildings = buildings.filter((b) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 py-8 min-h-[calc(100vh-140px)] w-full">
      {/* Header */}
      <div className="pt-4 pb-6 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">Playlist</h1>
      </div>

      {/* Search - responsive design */}
      <div className="max-w-7xl mx-auto px-4 pb-6 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-white/50" size={20} />
          <input
            key="search-input"
            type="text"
            placeholder="Search buildings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 font-semibold focus:outline-none focus:border-white/40 transition"
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* Buildings Grid - responsive layout */}
      <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-white/50 font-semibold">Loading buildings...</p>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold">No buildings available</p>
            <p className="text-white/30 text-sm mt-2">Buildings will appear once added in admin panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBuildings.map((building) => (
              <div key={building.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  <h3 className="text-lg md:text-xl font-semibold text-white truncate">
                    {building.name}
                  </h3>
                </div>
                
                {/* Rooms Section - responsive design */}
                <div className="space-y-3">
                  {building.rooms?.slice(0, 2).map((room: any) => (
                    <div key={room.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DoorOpen className="w-4 h-4 text-green-400" />
                          <span className="text-white text-sm font-medium truncate">{room.name}</span>
                        </div>
                        <Link href={`/playlist/${building.id}/${room.id}`}>
                          <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition">
                            View
                          </button>
                        </Link>
                      </div>
                      
                      {/* CCTVs Section - responsive design */}
                      <div className="mt-2 space-y-1">
                        {room.cctvs?.slice(0, 2).map((cctv: any) => (
                          <div key={cctv.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                            <div className="flex items-center gap-2">
                              <Video className="w-3 h-3 text-red-400" />
                              <span className="text-white/80 text-xs truncate">{cctv.name}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open live stream modal
                                handleLiveStream(cctv);
                              }}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded transition"
                            >
                              Live
                            </button>
                          </div>
                        ))}
                        {room.cctvs?.length > 2 && (
                          <div className="text-xs text-white/50 text-center">
                            +{room.cctvs.length - 2} more CCTVs
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {building.rooms?.length > 2 && (
                    <div className="text-center">
                      <Link href={`/playlist/${building.id}`}>
                        <button className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition">
                          View All {building.rooms.length} Rooms
                        </button>
                      </Link>
                    </div>
                  )}
                  {building.rooms?.length === 0 && (
                    <div className="text-center py-2">
                      <p className="text-white/50 text-sm">No rooms available</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  <span className="text-sm text-white/70">
                    {building.rooms?.length || 0} Rooms
                  </span>
                  <Link href={`/playlist/${building.id}`}>
                    <button className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition">
                      View Rooms
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Stream Modal - fully responsive */}
      {showLiveStream && selectedCctv && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-blue-950 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/10">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">{selectedCctv.name}</span>
              </h2>
              <button 
                onClick={() => {
                  setShowLiveStream(false)
                  setStreamData(null)
                  setSelectedCctv(null)
                }} 
                className="text-white/70 hover:text-white transition p-1"
                aria-label="Close"
              >
                <X size={20} className="sm:size-24 md:size-24" />
              </button>
            </div>

            {/* Video Player - responsive aspect ratio */}
            <div className="aspect-video bg-black/50 flex items-center justify-center flex-grow relative overflow-auto">
              {streamData ? (
                <div className="w-full h-full flex flex-col">
                  {/* Video placeholder with instructions */}
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="text-center p-2 sm:p-4 max-w-full">
                      <Video className="w-8 h-8 sm:w-12 sm:h-12 text-white/30 mx-auto mb-2 sm:mb-3" />
                      <p className="text-white/50 font-semibold text-sm sm:text-base">Live Stream Player</p>
                      <p className="text-white/30 text-xs sm:text-sm mt-1 sm:mt-2 break-all px-2">Stream URL: {streamData.hls_url || streamData.rtsp_url}</p>
                      <div className="mt-2 sm:mt-4 text-xs text-white/40 space-y-1">
                        <p>IP: {selectedCctv.ip_address}</p>
                        <p>Username: {selectedCctv.username}</p>
                        <p className="mt-1 sm:mt-2 text-yellow-400/80">To enable live streaming:</p>
                        <p className="text-xs">1. Install FFmpeg on the server</p>
                        <p className="text-xs">2. Configure HLS streaming</p>
                        <p className="text-xs">3. Restart the streaming service</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stream information */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white/80 text-xs">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <span className="bg-blue-500/20 px-1 py-0.5 sm:px-2 sm:py-1 rounded">HLS: {streamData.hls_url ? 'Available' : 'Not configured'}</span>
                      <span className="bg-green-500/20 px-1 py-0.5 sm:px-2 sm:py-1 rounded">RTSP: {streamData.rtsp_url ? 'Available' : 'Not configured'}</span>
                      <span className="bg-purple-500/20 px-1 py-0.5 sm:px-2 sm:py-1 rounded">Status: {streamData.note || 'Ready'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500 mb-2 sm:mb-3"></div>
                  <p className="text-white/50 font-semibold text-sm sm:text-base">Loading stream...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}