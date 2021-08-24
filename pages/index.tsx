import Page from "@/components/page";
import { Map, Marker } from "pigeon-maps";
import React, { useEffect, useState } from "react";
import { Ord } from "fp-ts/number";
import { clamp } from "fp-ts/Ord";

const Index = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [zoom, setZoom] = useState<number>(10);
  const incZoom = () => setZoom((z) => clamp(Ord)(1, 19)(z + 1));
  const decZoom = () => setZoom((z) => clamp(Ord)(1, 19)(z - 1));
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
        <div className="flex justify-items-start items-center">
          <button
            type="button"
            onClick={incZoom}
            className="w-6 h-8 bg-gray-700 hover:bg-gray-800"
          >
            +
          </button>
          <button
            type="button"
            onClick={decZoom}
            className="w-6 h-8 bg-gray-700 hover:bg-gray-800"
          >
            -
          </button>
          <p className="h-8 ml-3 flex items-center">Zoom Level: {zoom}</p>
        </div>
        <Map
          height={300}
          center={[
            location?.coords.latitude ?? 0,
            location?.coords.longitude ?? 0,
          ]}
          zoom={zoom}
        >
          <Marker
            width={clamp(Ord)(4, 45)(
              Math.sqrt(location?.coords.accuracy ?? 0 * 10)
            )}
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
          speed: {location?.coords?.speed}m/s (
          {(location?.coords?.speed ?? 0) * 2.2369} mph)
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          heading: {location?.coords?.heading}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          altitude Accuracy: {location?.coords?.altitudeAccuracy}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          accuracy: {location?.coords?.accuracy} (
          {clamp(Ord)(4, 45)(Math.sqrt(location?.coords.accuracy ?? 0 * 10))})
        </p>
      </section>
    </Page>
  );
};

export default Index;
