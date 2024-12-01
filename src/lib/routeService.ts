interface RouteResponse {
  walkingRoute: {
    duration: string;
    distance: string;
    steps: string[];
    recommended: boolean;
  };
  drivingRoute: {
    duration: string;
    distance: string;
    steps: string[];
    recommended: boolean;
  };
  recommendedMode: 'WALK' | 'DRIVE';
}

export async function getRouteInfo(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): Promise<RouteResponse> {
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Yürüme rotası isteği
  const walkingRequest = {
    origin: {
      location: {
        latLng: {
          latitude: startLat,
          longitude: startLon
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: endLat,
          longitude: endLon
        }
      }
    },
    travelMode: "WALK",
    routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    languageCode: "tr-TR",
    units: "METRIC"
  };

  // Araç rotası isteği
  const drivingRequest = {
    ...walkingRequest,
    travelMode: "DRIVE"
  };

  // Routes API çağrıları
  const [walkingResponse, drivingResponse] = await Promise.all([
    fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.steps.navigationInstruction'
      },
      body: JSON.stringify(walkingRequest)
    }),
    fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.steps.navigationInstruction'
      },
      body: JSON.stringify(drivingRequest)
    })
  ]);

  try {
    const walkingData = await walkingResponse.json();
    const drivingData = await drivingResponse.json();

    // API yanıtlarının doğru formatta olduğunu kontrol et
    if (!walkingData?.routes?.[0] || !drivingData?.routes?.[0]) {
      throw new Error('Geçersiz rota yanıtı');
    }

    // Süre ve mesafe formatlama fonksiyonları
    const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours} saat ${minutes} dakika`;
      }
      return `${minutes} dakika`;
    };

    const formatDistance = (meters: number): string => {
      if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
      }
      return `${meters} metre`;
    };

    // Mesafe ve süre hesaplamaları
    const walkingDistanceMeters = walkingData.routes[0].distanceMeters || 0;
    const walkingDurationSeconds = Number(walkingData.routes[0].duration?.slice(0, -1)) || 0;
    const drivingDistanceMeters = drivingData.routes[0].distanceMeters || 0;
    const drivingDurationSeconds = Number(drivingData.routes[0].duration?.slice(0, -1)) || 0;

    // Rota önerisi için mantık
    // - 2 km'den kısa mesafeler için yürüyüş
    // - 2 km'den uzun mesafeler için araç önerilir
    const recommendedMode = walkingDistanceMeters <= 2000 ? 'WALK' : 'DRIVE';

    return {
      walkingRoute: {
        duration: formatDuration(walkingDurationSeconds),
        distance: formatDistance(walkingDistanceMeters),
        steps: walkingData.routes[0].legs?.[0]?.steps?.map(
          (step: any) => step.navigationInstruction?.instructions
        ) || [],
        recommended: recommendedMode === 'WALK'
      },
      drivingRoute: {
        duration: formatDuration(drivingDurationSeconds),
        distance: formatDistance(drivingDistanceMeters),
        steps: drivingData.routes[0].legs?.[0]?.steps?.map(
          (step: any) => step.navigationInstruction?.instructions
        ) || [],
        recommended: recommendedMode === 'DRIVE'
      },
      recommendedMode
    };
  } catch (error) {
    console.error('Rota hesaplama hatası:', error);
    throw new Error('Rota bilgileri hesaplanırken bir hata oluştu');
  }
} 