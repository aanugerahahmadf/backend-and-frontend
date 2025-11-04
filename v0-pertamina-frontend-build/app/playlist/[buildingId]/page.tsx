"use client"

import { useState, useEffect } from "react"
import { Search, DoorOpen, ArrowLeft, Video } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from '@/lib/api'

export default function PlaylistRoomPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const [searchTerm, setSearchTerm] = useState("")
  const [rooms, setRooms] = useState<any[]>([])
  const [building, setBuilding] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBuildingAndRooms = async () => {
      try {
        // Fetch building details
        const buildingData = await api.getBuilding(buildingId)
        setBuilding(buildingData)
        
        // Fetch rooms for this building
        const roomsData = await api.getRoomsByBuilding(buildingId)
        setRooms(roomsData)
      } catch (error) {
        console.error('Failed to fetch building or rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    if (buildingId) {
      fetchBuildingAndRooms()
    }
  }, [buildingId])

  const filteredRooms = rooms.filter((r) => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 py-8 min-h-[calc(100vh-140px)]">
      {/* Header - responsive design */}
      <div className="pt-4 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 md:gap-4">
          <Link href="/playlist" className="text-blue-300 hover:text-white transition p-2">
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-white truncate">
            {building ? building.name : 'Playlist'}
          </h1>
        </div>
      </div>

      {/* Search - responsive design */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-white/50" size={20} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 font-semibold focus:outline-none focus:border-white/40 transition"
          />
        </div>
      </div>

      {/* Rooms Grid - responsive layout */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-white/50 font-semibold">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <DoorOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold">No rooms available</p>
            <p className="text-white/30 text-sm mt-2">Rooms will appear once added in admin panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredRooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <DoorOpen className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  <h3 className="text-lg md:text-xl font-semibold text-white truncate">
                    {room.name}
                  </h3>
                </div>
                
                {/* CCTVs Section - responsive design */}
                <div className="space-y-2 mb-4">
                  {room.cctvs?.slice(0, 3).map((cctv: any) => (
                    <div key={cctv.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm truncate">{cctv.name}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real implementation, you would open a modal or navigate to live stream
                          alert(`Live stream for ${cctv.name} would open here`)
                        }}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition"
                      >
                        Live
                      </button>
                    </div>
                  ))}
                  {room.cctvs?.length > 3 && (
                    <div className="text-xs text-white/50 text-center">
                      +{room.cctvs.length - 3} more CCTVs
                    </div>
                  )}
                  {room.cctvs?.length === 0 && (
                    <div className="text-center py-1">
                      <p className="text-white/50 text-sm">No CCTVs available</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    {room.cctvs?.length || 0} CCTVs
                  </span>
                  <Link href={`/playlist/${buildingId}/${room.id}`}>
                    <button className="text-xs md:text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition">
                      View CCTVs
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}