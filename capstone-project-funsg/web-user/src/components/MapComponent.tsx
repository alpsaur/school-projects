import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    latitude: number;
    longitude: number;
    zoom: number;
}

const MapComponent = ({ latitude, longitude, zoom }: MapComponentProps) => {
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        这是你的位置！
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
