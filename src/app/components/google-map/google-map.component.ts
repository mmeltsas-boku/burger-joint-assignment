import {Component, ViewChild, ElementRef, Input, SimpleChanges, OnInit} from '@angular/core';
import {Marker} from "../../declarations/declarations";
import {environment} from "../../../environments/environment";
import {ScriptLoaderService} from "../../services/script-loader.service";

declare const google: any;

@Component({
  selector: 'app-google-map',
  standalone: true,
  template: `
    <div #mapContainer style="height: 400px; width: 100%;" class="map-container"></div>`,
  styleUrls: ['./google-map.component.scss']
})

export class GoogleMapComponent implements OnInit {
  // @ts-ignore
  @ViewChild('mapContainer', {static: false}) mapElement: ElementRef;
  @Input() markers: Marker[] = [];
  googleMap: any = null
  readonly centerCoordinates = {lat: 58.3780, lng: 26.7290}

  constructor(private scriptLoader: ScriptLoaderService) {
  }

  ngOnInit(): void {
    const googleMapsScriptUrl = `https://maps.googleapis.com/maps/api/js?key=${environment.GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    this.scriptLoader.loadScript(googleMapsScriptUrl)
      .then(() => this.initMap())
      .catch(error => console.error(error));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers']) {
      this.addMarkers();
    }
  }

  initMap() {
    const mapProperties = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.googleMap = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.googleMap.setCenter(this.centerCoordinates);
    this.addMarkers();
    this.drawCircle()
  }

  drawCircle() {
    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      map: this.googleMap,
      center: this.googleMap.center,
      radius: 1000
    });
  }

  isDistanceLongerThan(marker: Marker, length: number): boolean {
    const markerPosition = new google.maps.LatLng(marker.lat, marker.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.centerCoordinates.lat, this.centerCoordinates.lng),
      markerPosition
    );
    return distance > length;
  }

  addMarkers() {
    try {
      this.markers.forEach(marker => {
        if (this.isDistanceLongerThan(marker, 1000)) {
          const gMarker = new google.maps.Marker({
            position: new google.maps.LatLng(marker.lat, marker.lng),
            map: this.googleMap,
            title: marker.name
          });
          const infoWindow = new google.maps.InfoWindow({
            content: marker.name
          });
          gMarker.addListener('click', () => {
            infoWindow.open(this.googleMap, gMarker);
          });
        }
      });
    } catch (e) {
      return;
    }
  }
}

