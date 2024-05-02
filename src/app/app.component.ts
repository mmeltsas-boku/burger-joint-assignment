import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {VenuesService} from "./services/venues.service";
import {Marker, PlacesSearchResponse, VenuePhoto} from "./declarations/declarations";
import {GoogleMapComponent} from "./components/google-map/google-map.component";
import {BurgerService} from "./services/burger.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, GoogleMapComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    venues: PlacesSearchResponse | null = null;
    venuePhotos: VenuePhoto[] | null = null;
    venueMarkers: Marker[] = [];
    loading = true;

    constructor(private venuesService: VenuesService,
                private burgerService: BurgerService) {
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.venuesService.getVenues().subscribe(data => {
            this.venues = data;
            this.updateVenueMarkers();
            if (this.venues?.results) {
                this.venuesService.getVenuePhotos(this.venues?.results)
                    .subscribe(data => {
                        this.venuePhotos = data;
                        this.burgerService.updateVenuePhotosWithBurgers(this.venuePhotos)
                            .subscribe(data => {
                                this.venuePhotos = data;
                                this.endLoader();
                            });
                    })
            }
        });
    }

    updateVenueMarkers() {
        const markers = this.venues?.results.map(venue => {
            return {
                name: venue.name,
                lat: venue.geocodes.main.latitude,
                lng: venue.geocodes.main.longitude,
            };
        })
        this.venueMarkers = markers?.length ? markers : [];
    }

    endLoader() {
        this.loading = false;
        document.body.classList.add('loaded');
    }
}
