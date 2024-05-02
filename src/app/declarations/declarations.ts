export interface PlacesSearchResponse {
  results: VenueResult[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}


export interface VenueResult {
  fsq_id: string;
  categories: VenueCategory[];
  chains: any[];
  closed_bucket: string;
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: {
    country: string;
    cross_street?: string;
    formatted_address?: string;
    locality?: string;
    postcode?: string;
    region?: string;
    address?: string;
  };
  name: string;
  related_places: {
    parent?: {
      fsq_id: string;
      categories: VenueCategory[];
      name: string;
    };
  };
  timezone: string;
}

interface VenueCategory {
  id: number;
  name: string;
  short_name: string;
  plural_name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
}

export interface PhotoResponse {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
}

export interface VenuePhoto {
  fsqId: string;
  latestPhotoUrl: string;
  venueName: string;
  isBurgerPhoto?: boolean;
}

export interface Marker {
  lat: number;
  lng: number;
  name: string;
}
