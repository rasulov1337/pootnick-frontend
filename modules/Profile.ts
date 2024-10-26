'use strict';

import Ajax from './Ajax';
import { BACKEND_URL } from './Consts';

interface EditParams {
    username: string
    name: string
    email: string
    sex: number
    address: string
    birthdate: Date
    isHost: boolean
    password: string
    avatar: File | null
}

export const profile = async (): Promise<any> => {
    const url = BACKEND_URL + '/getUserById';
    return Ajax.get(url);
};

export const editProfile = async({
    username,
    name,
    email,
    sex,
    address,
    birthdate,
    isHost,
    password,
    avatar,
}: EditParams): Promise<any> => {
    const url = BACKEND_URL + '/putUser';
    const formData = new FormData();

    const metadata = {
        username: username,
        name: name,
        email: email,
        sex: sex,
        address: address,
        birthdate: birthdate,
        isHost: isHost,
        password: password,
    };

    formData.append('metadata', JSON.stringify(metadata));
    if (avatar){
        formData.append('avatar', avatar);
    }

    return Ajax.put({url, body: formData});
};   