import defaults from './default-config';

interface Configuration {
    api: string;
}

let config: Configuration = defaults;

export function updateConfig(
    updatedConfig: Partial<Configuration>
): Configuration {
    return config = {
        ...config,
        ...updatedConfig
    }
}

export function getConfig(): Configuration {
    return config;
}
