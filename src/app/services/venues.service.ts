import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {PhotoResponse, PlacesSearchResponse, VenuePhoto, VenueResult} from "../declarations/declarations";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VenuesService {
  readonly BUS_STATION_COORDINATES = '58.3780,26.7290'
  readonly BURGER_JOINT_CATEGORY_ID = 13031

  constructor(private http: HttpClient) {
  }

  getVenues() {
    return <Observable<PlacesSearchResponse>>this.http.get(`${environment.FOURSQUARE_API_BASE_URL}/places/search`, {
      params: {
        ll: this.BUS_STATION_COORDINATES,
        categories: this.BURGER_JOINT_CATEGORY_ID,
      },
      headers: {
        Authorization: environment.FOURSQUARE_API_KEY
      }
    })
  }

  photoRequest(fsqId: string): Observable<PhotoResponse[]> {
    return this.http.get(`${environment.FOURSQUARE_API_BASE_URL}/places/${fsqId}/photos`,
      {
        params: {
          sort: 'NEWEST',
        },
        headers: {
          Authorization: environment.FOURSQUARE_API_KEY
        }
      }) as Observable<PhotoResponse[]>
  }


  getVenuePhotos(results: VenueResult[]): Observable<VenuePhoto[]> {
    const photoRequests = results.map(result =>
      this.photoRequest(result.fsq_id)
        .pipe(
          map((photos) => photos?.length ? {
            fsqId: result.fsq_id,
            venueName: result.name,
            latestPhotoUrl: `${photos[0].prefix}300x300${photos[0].suffix}`
          } : null)
        ))

    return forkJoin(photoRequests).pipe(
      map(photosArray => photosArray
        .filter(photo => photo !== null))
    ) as Observable<VenuePhoto[]>
  }
}
