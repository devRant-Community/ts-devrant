import {
    Notifications,
    Token,
    Tags,
    RantInFeed,
    SessionHash,
    News,
    Profile, DevRantSupporter
} from "./types";

export interface ResponseSignal {
    success: boolean;
    error?: string;
}

export interface NotificationResponse extends ResponseSignal {
    data: Notifications
}

interface FailureRegisterResponse {
    success: false;
    error: string;
    error_field: string;
}

export type RegisterResponse = AuthResponse | FailureRegisterResponse;

export interface AuthResponse extends ResponseSignal {
    auth_token: Token & {
        expire_time: number,
    }
}

export interface CommentResponse extends ResponseSignal {
    comment: Comment
}

export interface TagsResponse {
    tags: Tags
}

export interface SearchResponse extends ResponseSignal {
    results: RantInFeed[]
}

export interface RantResponse extends ResponseSignal {
    rant: RantInFeed;
    comments: Comment[];
}

export interface RantFeedResponse extends ResponseSignal {
    rants: RantInFeed[],
    /**
     * TODO: @Skayo What the fuck is notif_state? And for what is the notif_token?
     */
    settings?: unknown,
    set: SessionHash,

    /**
     * Weekly-Rant Week
     */
    wrw: number,
    dpp?: DevRantSupporter,
    num_notifs?: number,
    unread?: number,
    news: News
}

export interface UserIdResponse extends ResponseSignal {
    user_id: number
}

export interface ProfileResponse extends ResponseSignal {
    profile: Profile
}
