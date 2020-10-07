import {request} from "./http";
import {RantType, Responses, Tags, Token, VoteState} from "./types";
import {mapTokenToRequest} from './utils';

export enum Sort {
    Algo = "algo",
    Top = "top",
    Recent = "recent"
}
export enum Range {
    Day = "day",
    Week = "week",
    Month = "month",
    All = "all"
}

/**
 * Not all responses are typed, but the important ones are.
 */
export namespace DevRantAPI {
    export async function profile(
        userId: string,
        content: string = "all",
        skip: number = 0,
        token?: Token,
    ) {
        return request<Responses.ProfileResponse>(['users', userId], {
            ...mapTokenToRequest(token),
            content,
            skip
        })
    }

    export async function rant(rantId: number, token?: Token) {
        return request<Responses.RantResponse>(["devrant/rants", rantId], mapTokenToRequest(token))
    }

    export async function rants(sort: Sort, limit: number, skip: number, range: Range, token?: Token) {
        return request<Responses.RantFeedResponse>(["devrant/rants"], {
            ...mapTokenToRequest(token),
            sort,
            limit,
            skip,
            range
        })
    }

    export async function search(term: string) {
        return request<Responses.SearchResponse>('devrant/search', {
            term
        })
    }

    /**
     * If the authentication fails, an error is thrown.
     * @param username 
     * @param password 
     */
    export async function login(username: string, password: string) {
        return request<Responses.AuthResponse>('users/auth-token', {
            username,
            password
        }, { method: 'POST' })
    }

    /**
     * If the authentication fails, an error is thrown.
     * @param username 
     * @param password 
     */
    export async function register(username: string, email: string, password: string) {
        return request<Responses.RegisterResponse>('users', {
            username,
            email,
            password
        }, { method: 'POST' })
    }

    export async function postRant(rant: string, tags: Tags, rantType: RantType, image: ArrayBuffer, token: Token) {
        return request<Responses.ResponseSignal & { rant_id: number }>('devrant/rants', {
            ...mapTokenToRequest(token),
            rant,
            type: rantType,
            tags,
            image,
        })
    }

    /**
     * Not sure if `newTags` and `newImage` are working.
     * @param rantId 
     * @param newText 
     * @param newTags 
     * @param newImage 
     * @param token 
     */
    export async function editRant(rantId: number, newText: string, newTags: Tags, newImage: null | ArrayBuffer = null, token: Token) {
        return request(['devrant/rants', rantId], {
            ...mapTokenToRequest(token),
            rant: newText,
            tags: newTags,
            image: newImage,
        }, { method: 'POST' })
    }

    export async function deleteRant(rantId: number, token: Token) {
        return request(
            ['devrant/rants', rantId],
            mapTokenToRequest(token),
            { method: 'DELETE' }
        )
    }

    export async function comment(commentId: number, token?: Token) {
        return request<Responses.CommentResponse>(['comments', commentId], {
            ...mapTokenToRequest(token),
            comment,
        })
    }

    export async function postComment(rantId: number, comment: string, image: null | ArrayBuffer = null, token: Token) {
        return request(['devrant/rants', rantId, 'comments'], {
            ...mapTokenToRequest(token),
            comment,
            image
        }, { method: 'POST' })
    }

    /**
     * Not sure if `newImage` is working.
     * @param commentId 
     * @param newComment 
     * @param newImage 
     * @param token 
     */
    export async function editComment(commentId: number, newComment: string, newImage: null | ArrayBuffer = null, token: Token) {
        return request(['comments', commentId], {
            ...mapTokenToRequest(token),
            comment: newComment,
            image: newImage
        }, { method: 'POST' })
    }

    export async function deleteComment(commentId: number, token: Token) {
        return request(
            ['comments', commentId],
            mapTokenToRequest(token),
            { method: 'DELETE' }
        )
    }

    export async function vote(vote: VoteState, rantId: number, token: Token) {
        return request<Responses.RantResponse>(['devrant/rants', rantId, 'vote'], {
            ...mapTokenToRequest(token),
            vote
        }, { method: 'POST' })
    }

    export async function voteComment(vote: VoteState, commentId: number, token: Token) {
        return request<Responses.CommentResponse>(['comments', commentId, 'vote'], {
            ...mapTokenToRequest(token),
            vote
        }, { method: 'POST' })
    }

    export async function surpriseRant(token?: Token) {
        return request('devrant/rants/surprise', mapTokenToRequest(token))
    }

    export async function notifications(token: Token, lastTime: number = 0) {
        return request<Responses.NotificationResponse>('users/me/notif-feed', {
            ...mapTokenToRequest(token),
            last_time: lastTime,
            ext_prof: 1,
        })
    }

    export async function clearNotifications(token: Token) {
        return request('users/me/notif-feed', mapTokenToRequest(token), { method: 'DELETE' })
    }

    export async function collabs(sort: Sort, limit: number, skip: number, token: Token) {
        return request('devrant/collabs', {
            ...mapTokenToRequest(token),
            sort,
            limit,
            skip
        })
    }

    export async function stories(sort: Sort, limit: number, skip: number, range: Range, token: Token) {
        return request('devrant/story-rants', {
            ...mapTokenToRequest(token),
            sort,
            limit,
            skip,
            range
        })
    }

    export async function weekly(sort: Sort, limit: number, skip: number, week: number, token: Token) {
        return request('devrant/weekly-rants', {
            ...mapTokenToRequest(token),
            sort,
            limit,
            skip,
            week
        })
    }

    export async function listWeekly(token: Token) {
        return request('devrant/weekly-list', mapTokenToRequest(token))
    }

    export async function favorite(rantId: number, token: Token) {
        return request(['devrant/rants', rantId, 'favorite'], mapTokenToRequest(token), { method: 'POST' })
    }

    export async function unFavorite(rantId: number, token: Token) {
        return request(['devrant/rants', rantId, 'unfavorite'], mapTokenToRequest(token), { method: 'POST' })
    }

    export async function subscribe(toUserId: number, token: Token) {
        return request(['users', toUserId, 'subscribe'], mapTokenToRequest(token), { method: 'POST' })
    }

    export async function unSubscribe(toUserId: number, token: Token) {
        return request(['users', toUserId, 'subscribe'], mapTokenToRequest(token), { method: 'DELETE' })
    }

    export async function getFrequentSearchTerms() {
        return request<Responses.TagsResponse>('devrant/search/tags')
    }


    export async function getIdByUsername(username: string) {
        return request<Responses.UserIdResponse>('get-user-id', {
            username
        })
    }

}
