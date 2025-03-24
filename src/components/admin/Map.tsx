'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './Map.module.css';

// Importer les icônes correctement
import markerIconImg from 'leaflet/dist/images/marker-icon.png';
import markerShadowImg from 'leaflet/dist/images/marker-shadow.png';

// Convertir les images en string pour Leaflet
const ambulanceIcon = new L.Icon({
  iconUrl: typeof markerIconImg === 'string' ? markerIconImg : markerIconImg.src,
  shadowUrl: typeof markerShadowImg === 'string' ? markerShadowImg : markerShadowImg.src,
  iconSize: [25, 41], // Taille de l'icône
  iconAnchor: [12, 41], // Point d'ancrage
  popupAnchor: [1, -34], // Position du popup
});

// Interface pour les ambulances
interface Ambulance {
  id: string;
  lat: number;
  lng: number;
  status: string; // "disponible" | "occupée"
}

export default function Map() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  // Simulation des ambulances en Mauritanie
  useEffect(() => {
    const fakeData: Ambulance[] = [
      { id: '1', lat: 18.0735, lng: -15.9582, status: 'disponible' }, // Nouakchott
      { id: '2', lat: 16.0356, lng: -16.5063, status: 'occupée' }, // Rosso
      { id: '3', lat: 20.5022, lng: -13.0500, status: 'disponible' }, // Atar
    ];
    setAmbulances(fakeData);
  }, []);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[18.0735, -15.9582]} // Centré sur Nouakchott
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
        style={{ height: '500px', width: '100%' }}
      >
        {/* Couche OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Affichage des ambulances */}
        {ambulances.map((ambulance) => (
          <Marker key={ambulance.id} position={[ambulance.lat, ambulance.lng]} icon={ambulanceIcon}>
            <Popup>
              🚑 <strong>Ambulance {ambulance.id}</strong> <br />
              Statut: {ambulance.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
