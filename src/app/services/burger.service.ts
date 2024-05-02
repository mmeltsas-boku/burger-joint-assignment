import { Injectable } from '@angular/core';
import {catchError, forkJoin, map, Observable, of, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {VenuePhoto} from "../declarations/declarations";

@Injectable({
  providedIn: 'root'
})
export class BurgerService {

  constructor(private http: HttpClient) { }

  checkForBurgers(photoUrl: string): Observable<{ urlWithBurger: string }> {
    return this.http.post<{ urlWithBurger: string }>(environment.BURGER_SERVICE_URL, {urls: [photoUrl]})
        .pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => {
              if (error.status === 404) {
                return of({urlWithBurger: ''});
              }
              return throwError(() => new Error('An unexpected error occurred'));
            })
        )
  }

  updateVenuePhotosWithBurgers(photos: VenuePhoto[]): Observable<VenuePhoto[]> {
    const checkObservables = photos.map(photo =>
        this.checkForBurgers(photo.latestPhotoUrl).pipe(
            map(response => ({
              ...photo,
              isBurgerPhoto: response.urlWithBurger === photo.latestPhotoUrl
            }))
        )
    );
    return forkJoin(checkObservables);
  }
}
