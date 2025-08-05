"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import * as google from "google.maps"

interface MapComponentProps {
  center: { lat: number; lng: number }
  zoom: number
  gardens: any[]
  umkmData: any[]
}

const MapComponent = ({ center, zoom, gardens, umkmData }: MapComponentProps) => {
  const mapRef = useRef<google.maps.Map>()
  const [map, setMap] = useState<google.maps.Map>()

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMap(map)
  }, [])

  useEffect(() => {
    if (map) {
      // Clear existing markers
      // Add garden markers
      gardens.forEach((garden: any) => {
        const marker = new google.maps.Marker({
          position: { lat: garden.coordinates[0], lng: garden.coordinates[1] },
          map,
          title: garden.name,
          icon: {
            url:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10B981"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
          },
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="font-weight: bold; color: #059669; margin: 0 0 8px 0; font-size: 16px;">${garden.name}</h3>
              <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px 0; line-height: 1.4;">${garden.description.slice(0, 100)}...</p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0;">${garden.address}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      })

      // Add UMKM markers
      umkmData.forEach((umkm: any) => {
        const marker = new google.maps.Marker({
          position: { lat: umkm.coordinates[0], lng: umkm.coordinates[1] },
          map,
          title: umkm.name,
          icon: {
            url:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#F59E0B"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
          },
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="font-weight: bold; color: #D97706; margin: 0 0 8px 0; font-size: 16px;">${umkm.name}</h3>
              <p style="font-size: 14px; color: #6B7280; margin: 0 0 8px 0; line-height: 1.4;">${umkm.description.slice(0, 100)}...</p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 4px 0;">${umkm.address}</p>
              <p style="font-size: 12px; color: #059669; font-weight: 600; margin: 0;">${umkm.priceRange}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      })
    }
  }, [map, gardens, umkmData])

  return (
    <div
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      ref={(node) => {
        if (node && !map) {
          const newMap = new google.maps.Map(node, {
            center,
            zoom,
            styles: [
              {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "poi.medical",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "poi.place_of_worship",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          })
          onLoad(newMap)
        }
      }}
    />
  )
}

export default MapComponent
