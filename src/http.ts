import debug from 'debug';
import fetchNode from 'node-fetch'
// @ts-ignore
import URLNode from 'url-polyfill'
// @ts-ignore
import FormDataNode from 'form-data'

import { getConfig } from './config';

const _global = typeof global !== 'undefined' ? global : window;

const URL = _global.URL || URLNode
const FormData = _global.FormData || FormDataNode
const fetch = _global.fetch || fetchNode

const log = debug('dr:request');
log.log = console.log.bind(console);

const alwaysIncludeParams = {
    app: 3,
    // plat: 2,
}

type Stringable = string | number | boolean;

export async function request<T>(
    url: string | Stringable[],
    params: { [name: string]: any } = {},
    options: RequestInit = {}
): Promise<T> {

    log('fetch', url);
    const config = getConfig();

    const requestUrl = new URL(
        url instanceof Array
            ? url.join('/')
            : url,
        config.api
    )

    const addParams = (addFunc: (value: [string, number], index: number, array: [string, number][]) => any) => Object.entries({
        ...alwaysIncludeParams,
        ...params
    }).forEach(addFunc)

    let form: null | FormData = null;

    /**
     * If you use lowercase HTTP methods, it's your fault.
     */
    switch (options.method) {
        case "POST": {
            form = new FormData();
            addParams(([name, value]) => {
                if (form) {
                    form.append(name, String(value))
                }
            })
            break;
        }
        default: {
            addParams(([name, value]) => {
                requestUrl.searchParams.set(name, String(value))
            })
        }
    }

    const response = await fetch(requestUrl.toString(), {
        ...options,
        body: form
    })

    let json = null;

    if (response.headers.get('content-type') === 'application/json') {
        json = await response.json();
    } else if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}; ${await response.text()}`)
    }

    if (json && json.error) {
        throw new Error(json.error)
    }

    return json;
}