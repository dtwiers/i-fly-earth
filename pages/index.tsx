import Page from "@/components/page";
import { useClientSide } from "@/src/hooks/use-client-side";
import { Map, Marker } from "pigeon-maps";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const isClientSide = useClientSide();
  const [zoom, setZoom] = useState<number>(10)
  const incZoom = () => setZoom(z => z + 1);
  const decZoom = () => setZoom(z => z - 1);
  useEffect(() => {
    if ("geolocation" in navigator) {
      const interval = setInterval(
        () => navigator.geolocation.getCurrentPosition(setLocation),
        1000
      );
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Page>
      <section className="mt-20">
        <button type="button" onClick={incZoom}>+</button>
        <button type="button" onClick={decZoom}>-</button>
        <Map
          height={300}
          center={[
            location?.coords.latitude ?? 0,
            location?.coords.longitude ?? 0,
          ]}
          zoom={zoom}
        >
          <Marker
            width={location?.coords.accuracy}
            anchor={[
              location?.coords.latitude ?? 0,
              location?.coords.longitude ?? 0,
            ]}
          />
        </Map>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          latitude: {location?.coords?.latitude}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          longitude: {location?.coords?.longitude}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          altitude: {location?.coords?.altitude}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          speed: {location?.coords?.speed}
        </p>
      </section>
    </Page>
  );
};

export default Index;
