import Page from "@/components/page";
import { Map, Marker } from "pigeon-maps";
import React, { useEffect, useState } from "react";
import { Ord } from "fp-ts/number";
import { clamp } from "fp-ts/Ord";
import * as O from "fp-ts/Option";
import { DmsAngle, toDms } from "@/src/util/to-dms";
import { convertSpeed, metersToFeet, Speed } from "@/src/util/conversions";
import { constUndefined, flow, pipe } from "fp-ts/lib/function";

const clampZoom = clamp(Ord)(1, 19);
const cardinalDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const toCardinalDirection = (heading: number) =>
  cardinalDirections[Math.floor(((heading + 22.5) % 360) / 45)];

const useGeoLogic = () => {
  const [location, setLocation] = useState<O.Option<GeolocationPosition>>(
    O.none
  );
  const [zoom, setZoom] = useState<number>(10);
  const incZoom = () => setZoom((z) => clampZoom(z + 1));
  const decZoom = () => setZoom((z) => clampZoom(z - 1));
  useEffect(() => {
    if ("geolocation" in navigator) {
      const interval = setInterval(
        () =>
          navigator.geolocation.getCurrentPosition(
            flow(O.fromNullable, setLocation)
          ),
        1000
      );
      return () => clearInterval(interval);
    }
  }, []);

  const latitude: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.latitude)
  );

  const latitudeDms: O.Option<DmsAngle> = pipe(latitude, O.map(toDms));

  const longitude: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.longitude)
  );

  const longitudeDms: O.Option<DmsAngle> = pipe(longitude, O.map(toDms));

  const speed: O.Option<Speed> = pipe(
    location,
    O.map((location) => location.coords.speed),
    O.chain(O.fromNullable),
    O.map(convertSpeed)
  );

  const accuracy: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.accuracy)
  );

  const altitude: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.altitude),
    O.chain(O.fromNullable)
  );

  const altitudeAccuracy: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.altitudeAccuracy),
    O.chain(O.fromNullable)
  );

  const hasMinimumGeoData: boolean = pipe(
    O.Do,
    O.apS("latitude", latitude),
    O.apS("longitude", longitude),
    O.isSome
  );

  const heading: O.Option<number> = pipe(
    location,
    O.map((location) => location.coords.heading),
    O.chain(O.fromNullable)
  );

  return {
    latitude,
    latitudeDms,
    longitude,
    longitudeDms,
    speed,
    accuracy,
    altitude,
    altitudeAccuracy,
    heading,
    zoom,
    incZoom,
    decZoom,
    hasMinimumGeoData,
  };
};

const Index = () => {
  const geoResult = useGeoLogic();

  return (
    <Page>
      <section className="mt-20">
        <div className="flex justify-items-start items-center">
          <button
            type="button"
            onClick={geoResult.incZoom}
            className="w-6 h-8 bg-gray-700 hover:bg-gray-800"
          >
            +
          </button>
          <button
            type="button"
            onClick={geoResult.decZoom}
            className="w-6 h-8 bg-gray-700 hover:bg-gray-800"
          >
            -
          </button>
          <p className="h-8 ml-3 flex items-center">
            Zoom Level: {geoResult.zoom}
          </p>
        </div>
        {pipe(
          O.Do,
          O.apS("latitude", geoResult.latitude),
          O.apS("longitude", geoResult.longitude),
          O.fold(
            () => <div>Acquiring GPS signal...</div>,
            ({ latitude, longitude }) => (
              <Map
                height={300}
                center={[latitude, longitude]}
                zoom={geoResult.zoom}
              >
                {pipe(
                  O.Do,
                  O.apS("latitude", geoResult.latitude),
                  O.apS("longitude", geoResult.longitude),
                  O.fold(constUndefined, ({ latitude, longitude }) => (
                    <Marker
                      width={clamp(Ord)(4, 45)(
                        Math.sqrt(
                          pipe(
                            geoResult.accuracy,
                            O.getOrElse(() => 50)
                          ) * 10
                        )
                      )}
                      anchor={[latitude, longitude]}
                    />
                  ))
                )}
              </Map>
            )
          )
        )}
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          latitude:{" "}
          {pipe(
            geoResult.latitudeDms,
            O.fold(
              () => "Not Available",
              (lat) => `${lat.degrees}° ${lat.minutes}' ${lat.seconds}"`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          longitude:{" "}
          {pipe(
            geoResult.longitudeDms,
            O.fold(
              () => "Not Available",
              (long) => `${long.degrees}° ${long.minutes}' ${long.seconds}"`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          altitude:{" "}
          {pipe(
            geoResult.altitude,
            O.fold(
              () => "Not Available",
              (alt) => `${metersToFeet(alt).toFixed(2)}'`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          speed:{" "}
          {pipe(
            geoResult.speed,
            O.fold(
              () => "Not Available",
              ({ mph }) => `${mph.toFixed(2)} mph`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          heading:{" "}
          {pipe(
            geoResult.heading,
            O.fold(
              () => "Not Available",
              (heading) => `${heading} (${toCardinalDirection(heading)})`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          altitude Accuracy:{" "}
          {pipe(
            geoResult.altitudeAccuracy,
            O.fold(
              () => "Not Available",
              (altAcc) => `${altAcc.toFixed(2)}`
            )
          )}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          accuracy:{" "}
          {pipe(
            geoResult.accuracy,
            O.fold(
              () => "Not Available",
              (acc) => `${acc}`
            )
          )}
        </p>
      </section>
    </Page>
  );
};

export default Index;
