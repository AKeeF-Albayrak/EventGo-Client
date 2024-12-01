import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface RouteMapProps {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  showDirections?: boolean;
}

export default function RouteMap({ origin, destination, showDirections = true }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      const { Map } = await loader.importLibrary('maps');
      const { DirectionsService, DirectionsRenderer } = await loader.importLibrary('routes');

      const mapInstance = new Map(mapRef.current!, {
        center: destination,
        zoom: 14,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
        disableDefaultUI: true,
        zoomControl: true,
      });

      const renderer = new DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
        preserveViewport: true,
      });

      setMap(mapInstance);
      setDirectionsRenderer(renderer);

      // Başlangıç ve varış noktalarını işaretle
      new google.maps.Marker({
        position: origin,
        map: mapInstance,
        title: 'Konumunuz',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      new google.maps.Marker({
        position: destination,
        map: mapInstance,
        title: 'Etkinlik Konumu',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });
    };

    if (mapRef.current) {
      initMap();
    }
  }, [origin, destination]);

  useEffect(() => {
    if (map && directionsRenderer && showDirections) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }
  }, [map, directionsRenderer, origin, destination, showDirections]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
} 