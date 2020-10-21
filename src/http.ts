import debug from "debug";
import FormDataNode from "form-data";
import fetchNode from "node-fetch";
/* @ts-ignore */
import URLNode from "url-polyfill";
import { getConfig } from "./config";


const _global = typeof global !== "undefined" ? global : window;

const URL = _global.URL || URLNode;
const FormData = _global.FormData || FormDataNode;
const fetch = _global.fetch || fetchNode;

const log = debug("dr:request");
log.log = console.log.bind(console);

const alwaysIncludeParams = {
    app: 3,
    // plat: 2,
};

type Stringable = string | number | boolean;
type ParamHandlerFunc = (
    value: [string, Stringable | File | Blob],
    index: number,
    array: [string, number][]
) => void;

export async function request<T>(
    url: string | Stringable[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { [name: string]: any } = {},
    options: RequestInit = {}
): Promise<T> {
    log("fetch", url);
    const config = getConfig();

    const requestUrl = new URL(
        url instanceof Array ? url.join("/") : url,
        config.api
    );

    const addParams = (addFunc: ParamHandlerFunc) =>
        Object.entries({
            ...alwaysIncludeParams,
            ...params,
        }).forEach(addFunc);

    let form: null | FormData = null;

    /**
     * If you use lowercase HTTP methods, it's your fault.
     */
    switch (options.method) {
        case "POST": {
            form = new FormData();
            addParams(([name, _value]) => {
                const value = _value as any;
                if (form) {
                    const isFile = value && (
                        Boolean(
                            (value as Blob).type
                            || value.constructor.name === "File"
                        )
                    );

                    if (isFile) {
                        let fileName = value && value.name;
                        if (!fileName) {
                            const fileExt = (value as Blob).type
                                .split("/")
                                .pop();
                            fileName = `attachment.${fileExt}`;
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        form.append(name, value as any, fileName);
                    } else {
                        form.append(name, String(value));
                    }
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

    const response = await fetch(requestUrl.toString(), {
        ...options,
        body: form,
    });

    let json = null;

    if (response.headers.get("content-type") === "application/json") {
        json = await response.json();
    } else if (!response.ok) {
        // eslint-disable-next-line max-len
        throw new Error(
            `${response.status}: ${response.statusText
            }; ${await response.text()}`
        );
    }

    if (json && json.error) {
        throw new Error(json.error);
    }

    return json;
}
