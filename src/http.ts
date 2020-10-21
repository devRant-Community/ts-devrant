import debug from "debug";
import FormDataNode from "form-data";
import fetchNode from "node-fetch";
/* @ts-ignore */
import URLNode from "url-polyfill";
import FileType = require('file-type');
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

    const addParams = async (addFunc: ParamHandlerFunc) => {
        const entries = Object.entries({
            ...alwaysIncludeParams,
            ...params,
        })

        for (const entry of entries) {
            await addFunc(entry);
        }
    };

    let form: null | FormData = null;

    /**
     * If you use lowercase HTTP methods, it's your fault.
     */
    switch (options.method) {
        case "POST": {
            form = new FormData();
            await addParams(async ([name, _value]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = _value as any;
                if (form) {
                    let fileName = undefined;

                    if (name === 'image') {
                        if (value.constructor.name === "File") {
                            fileName = `attachment.${(value as File).type
                                .split('/')
                                .pop()
                                }`;
                        } else if (value.constructor.name === "Buffer") {
                            const type = await FileType.fromBuffer(value)
                            fileName = type
                                ? `attachment.${type.ext}`
                                : undefined
                        } else {
                            const type = await FileType.fromStream(value);
                            fileName = type
                                ? `attachment.${type.ext}`
                                : undefined
                        }
                    }

                    form.append(
                        name,
                        value instanceof Array
                            ? value.join()
                            : value,
                        fileName
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
