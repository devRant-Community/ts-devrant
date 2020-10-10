export * from './response-types';

export enum PostType {
    Rant = "rant",
    Undefined = "undefined",
    JokeMeme = "joke/meme",
    Question = "question",
    DevRant = "devRant",
    Random = "random",
    Collab = "collab"
}

/**
 * This enum is for creating a Rant
 * @see PostType
 */
export enum RantType {
    Rant,
    JokeMeme,
    Question,
    DevRant,
    Random,
    Collab
}

export enum NotificationKind {
    CommentContent = "comment_content",
    CommentDiscuss = "comment_discuss",
    CommentMention = "comment_mention",
    CommentVote = "comment_vote",
    ContentVote = "content_vote",
    CantSub = "rant_sub"
}

export interface Notification {
    comment_id?: number
    rant_id?: number
    created_time: number
    read: 0 | 1
    type: NotificationKind
    uid: number
}

export interface Notifications {
    check_time: number;
    items: Notification[];
    username_map: {
        [userId: number]: {
            name: string,
            avatar: Avatar,
        }
    },
    unread: {
        all: number,
        comments: number,
        mentions: number,
        subs: number,
        total: number,
        upvotes: number,
    }
}

export interface Profile {
    username: string,
    score: number,
    about: string,
    location: string,
    created_time: number,
    skills: string,
    github: string,
    avatar: Avatar,
    avatar_sm: Avatar,
    dpp: DevRantSupporter,
    content: {
        content: {
            rants: Array<RantInFeed>,
            upvoted: Array<RantInFeed>,
            comments: Array<Comment>,
            favorites: Array<RantInFeed>,
        },
        counts: {
            rants: number,
            upvoted: number,
            comments: number,
            favorites: number,
            collabs: number,
        }
    }
}

export type SessionHash = string;
export type DevRantSupporter = 0 | 1;

export enum Action {
    None = "none",
    GroupRant = "grouprant",
    Rant = "rant"
}

export interface News {
    id: number,
    type: 'intlink' | unknown,
    headline: string,
    body: string,
    footer: string,
    height: number,
    action: Action
}


export interface Token {
    id: string;
    key: string;
    user_id: number;
}

export interface Avatar {
    /**
     * Avatar background color in hex
     */
    b: string,
    /**
     * Avatar file name
     */
    i: string
}

export interface RantEntry {
    id: number,
    score: number,
    links?: LinkDef[],
    created_time: number,
    attached_image: Image,
    vote_state: VoteState,
    user_dpp: DevRantSupporter,
    user_id: number,
    user_username: string,
    user_score: number,
    user_avatar: Avatar,
    user_avatar_lg?: Avatar,
}

export interface Image {
    url: string,
    width: number,
    height: number,
}

export type Tags = string[];

export type RantTags = [PostType] & Tags;

export interface LinkDef {
    end: number
    start: number
    short_url: string
    special: 1
    title: string
    type: "url"
    url: string
}

export interface RantInFeed extends RantEntry {
    user_dpp: DevRantSupporter;

    text: string,
    num_comments: number,
    tags: RantTags,
    edited: boolean,

    /**
     * Link to rant for social share etc
     */
    link: string,

    /**
     * Skayo said: No clue what this is
     */
    rt: number,

    /**
     * Skayo said: No clue what this is
     */
    rc: number,

    /**
     * Only if collab
     */
    c_type?: CollabState,

    /**
     * Only if collab, display text for `c_type`
     */
    c_type_long?: string,
}


export enum CollabState {
    Unknown,
    OpenSourceProject,
    ExistingOpenSourceProject,
    ProjectIdea,
    ExistingProject
}

export enum VoteState {
    Unvoted,
    Upvoted,
    Downvoted = -1,
    NotAllowed = -2,
}

export interface Comment extends RantEntry {
    rand_id: number,
    body: string,
}
