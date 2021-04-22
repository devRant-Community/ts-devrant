import { Token } from "./types";

export function getImageURL(imageId: string): string {
    return `https://avatars.devrant.com/${imageId}`;
}

export function withToken(token?: Token): { [name: string]: unknown } {
    return token
        ? {
              token_id: token.id,
              token_key: token.key,
              user_id: token.user_id,
          }
        : {};
}
