export interface RegisterParams {
    name: string;
    username: string;
    password: string;
    email: string;
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface AdsFilters {
    distance?: number;
    rating?: number;
    new?: boolean;
    gender?: 'male' | 'female';
    guests?: 5 | 10 | 20 | 50;
}

// interface AuthorData {
//     uuid: string;
//     avatar: string;
//     score: number;
// }

// Interface of a response from DB
export interface AdvertData {
    id: string;
    images: string[];
    city: string;
    address: string;
    description: string;
    publicationDate: string;
    roomsNumber: number;

    // author: AuthorData;
    authorAvatar: string;
    authorName: string;
    authorRating: string;
    authorUUID: string;
}

export interface EditParams {
    username: string;
    name: string;
    email: string;
    sex: string | null;
    birthdate: Date;
    isHost: boolean;
    avatar: File | null;
}

export interface City {
    description: string;
    enTitle: string;
    id: number;
    title: string;
}

export interface FilterValues {
    geo: string;
    rating: boolean;
    new: boolean;
    sex: string;
    vis: string;
}
