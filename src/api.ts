import { request } from "./http";
import * as t from "./types";
import { mapTokenToRequest } from "./utils";

export enum Sort {
    Algo = "algo",
    Top = "top",
    Recent = "recent",
}

export enum Range {
    Day = "day",
    Week = "week",
    Month = "month",
    All = "all",
}

/**
 * Not all responses are typed, but the important ones are.
 */
export async function profile(
    userId: string,
    content = "all",
    skip = 0,
    token?: t.Token
): Promise<t.ProfileResponse> {
    return request(["users", userId], {
        ...mapTokenToRequest(token),
        content,
        skip,
    });
}

export async function rant(
    rantId: number,
    token?: t.Token
): Promise<t.RantResponse> {
    return request(["devrant/rants", rantId], mapTokenToRequest(token));
}

export async function rants(
    sort: Sort,
    limit: number,
    skip: number,
    range: Range,
    token?: t.Token
): Promise<t.RantFeedResponse> {
    return request(["devrant/rants"], {
        ...mapTokenToRequest(token),
        sort,
        limit,
        skip,
        range,
    });
}

export async function search(term: string): Promise<t.SearchResponse> {
    return request("devrant/search", {
        term,
    });
}

/**
 * If the authentication fails, an error is thrown.
 * @param username
 * @param password
 */
export async function login(
    username: string,
    password: string
): Promise<t.AuthResponse> {
    return request(
        "users/auth-token",
        {
            username,
            password,
        },
        { method: "POST" }
    );
}

/**
 * If the authentication fails, an error is thrown.
 * @param username
 * @param password
 */
export async function register(
    username: string,
    email: string,
    password: string
): Promise<t.RegisterResponse> {
    return request(
        "users",
        {
            username,
            email,
            password,
        },
        { method: "POST" }
    );
}

export async function postRant(
    rant: string,
    tags: t.Tags,
    rantType: t.RantType,
    image: File | Blob,
    token: t.Token
): Promise<t.ResponseSignal & { rant_id: number }> {
    return request("devrant/rants", {
        ...mapTokenToRequest(token),
        rant,
        type: rantType,
        tags,
        image,
    });
}

/**
 * Not sure if `newt.Tags` and `newImage` are working.
 * @param rantId
 * @param newText
 * @param newt.Tags
 * @param newImage
 * @param token
 */
export async function editRant(
    rantId: number,
    newText: string,
    newTags: t.Tags,
    newImage: null | File | Blob = null,
    token: t.Token
) {
    return request(
        ["devrant/rants", rantId],
        {
            ...mapTokenToRequest(token),
            rant: newText,
            tags: newTags,
            image: newImage,
        },
        { method: "POST" }
    );
}

export async function deleteRant(rantId: number, token: t.Token) {
    return request(["devrant/rants", rantId], mapTokenToRequest(token), {
        method: "DELETE",
    });
}

export async function comment(
    commentId: number,
    token?: t.Token
): Promise<t.CommentResponse> {
    return request(["comments", commentId], {
        ...mapTokenToRequest(token),
        comment,
    });
}

export async function postComment(
    rantId: number,
    comment: string,
    image: null | File | Blob = null,
    token: t.Token
) {
    return request(
        ["devrant/rants", rantId, "comments"],
        {
            ...mapTokenToRequest(token),
            comment,
            image,
        },
        { method: "POST" }
    );
}

/**
 * Not sure if `newImage` is working.
 * @param commentId
 * @param newComment
 * @param newImage
 * @param token
 */
export async function editComment(
    commentId: number,
    newComment: string,
    newImage: null | File | Blob = null,
    token: t.Token
) {
    return request(
        ["comments", commentId],
        {
            ...mapTokenToRequest(token),
            comment: newComment,
            image: newImage,
        },
        { method: "POST" }
    );
}

export async function deleteComment(commentId: number, token: t.Token) {
    return request(["comments", commentId], mapTokenToRequest(token), {
        method: "DELETE",
    });
}

export async function vote(
    vote: t.VoteState,
    rantId: number,
    token: t.Token
): Promise<t.RantResponse> {
    return request(
        ["devrant/rants", rantId, "vote"],
        {
            ...mapTokenToRequest(token),
            vote,
        },
        { method: "POST" }
    );
}

export async function voteComment(
    vote: t.VoteState,
    commentId: number,
    token: t.Token
): Promise<t.CommentResponse> {
    return request(
        ["comments", commentId, "vote"],
        {
            ...mapTokenToRequest(token),
            vote,
        },
        { method: "POST" }
    );
}

export async function surpriseRant(token?: t.Token) {
    return request("devrant/rants/surprise", mapTokenToRequest(token));
}

export async function notifications(
    token: t.Token,
    lastTime = 0
): Promise<t.NotificationResponse> {
    return request("users/me/notif-feed", {
        ...mapTokenToRequest(token),
        last_time: lastTime,
        ext_prof: 1,
    });
}

export async function clearNotifications(token: t.Token) {
    return request("users/me/notif-feed", mapTokenToRequest(token), {
        method: "DELETE",
    });
}

export async function collabs(
    sort: Sort,
    limit: number,
    skip: number,
    token: t.Token
) {
    return request("devrant/collabs", {
        ...mapTokenToRequest(token),
        sort,
        limit,
        skip,
    });
}

export async function stories(
    sort: Sort,
    limit: number,
    skip: number,
    range: Range,
    token: t.Token
) {
    return request("devrant/story-rants", {
        ...mapTokenToRequest(token),
        sort,
        limit,
        skip,
        range,
    });
}

export async function weekly(
    sort: Sort,
    limit: number,
    skip: number,
    week: number,
    token: t.Token
) {
    return request("devrant/weekly-rants", {
        ...mapTokenToRequest(token),
        sort,
        limit,
        skip,
        week,
    });
}

export async function listWeekly(token: t.Token) {
    return request("devrant/weekly-list", mapTokenToRequest(token));
}

export async function favorite(rantId: number, token: t.Token) {
    return request(
        ["devrant/rants", rantId, "favorite"],
        mapTokenToRequest(token),
        { method: "POST" }
    );
}

export async function unFavorite(rantId: number, token: t.Token) {
    return request(
        ["devrant/rants", rantId, "unfavorite"],
        mapTokenToRequest(token),
        { method: "POST" }
    );
}

export async function subscribe(toUserId: number, token: t.Token) {
    return request(["users", toUserId, "subscribe"], mapTokenToRequest(token), {
        method: "POST",
    });
}

export async function unSubscribe(toUserId: number, token: t.Token) {
    return request(["users", toUserId, "subscribe"], mapTokenToRequest(token), {
        method: "DELETE",
    });
}

export async function getFrequentSearchTerms(): Promise<t.TagsResponse> {
    return request("devrant/search/tags");
}

export async function getIdByUsername(
    username: string
): Promise<t.UserIdResponse> {
    return request("get-user-id", {
        username,
    });
}
