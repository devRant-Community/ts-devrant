import debug from "debug";
import fetch from "cross-fetch";
import { config } from "./config";

const log = debug("dr:request");

const alwaysIncludeParams = {
    app: 3,
    // plat: 2,
};

type Stringable = string | number | boolean;
type ParamHandlerFunc = (value: [string, Stringable | File | Blob]) => void;

export class RequestError extends Error {}

export async function request<T>(
    url: string | Stringable[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { [name: string]: any } = {},
    options: RequestInit = {}
): Promise<T> {
    log("fetch", url);

    const requestUrl = new URL(
        url instanceof Array ? url.join("/") : url,
        config.api
    );

    const addParams = async (addFunc: ParamHandlerFunc) => {
        const entries = Object.entries({
            ...alwaysIncludeParams,
            ...params,
        });

        await Promise.all(entries.map((entry) => addFunc(entry)));
    };

    let form: null | FormData = null;

    switch (options.method?.toUpperCase()) {
        case "POST": {
            form = new FormData();
            await addParams(async ([name, value]) => {
                if (form) {
                    form.append(
                        name,
                        value instanceof Blob ? value : String(value)
                    );
                }
            });
            break;
        }
        default: {
            addParams(([name, value]) => {
                requestUrl.searchParams.set(name, String(value));
            });
        }
    }

    const response = await fetch(String(requestUrl), {
        ...options,
        body: form,
    });

    let json = null;

    if (response.headers.get("content-type") === "application/json") {
        json = await response.json();
    } else if (!response.ok) {
        // eslint-disable-next-line max-len
        throw new RequestError(
            `${response.status}: ${
                response.statusText
            }; ${await response.text()}`
        );
    }

    if (json && json.error) {
        throw new RequestError(json.error);
    }

    return json;
}
