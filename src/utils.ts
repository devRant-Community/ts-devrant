import { request } from './http';
import { Responses, Token } from './types';

export function getImageURL(imageId: string) {
    return `https://avatars.devrant.com/${imageId}`;
}

export function mapTokenToRequest(token?: Token) {
    if (!token) {
        return {}
    }

    return {
        token_id: token.id,
        token_key: token.key,
        user_id: token.user_id
    }
}

export async function getIdByUsername(username: string) {
    return request<Responses.UserIdResponse>('get-user-id', {
        username
    })
}
