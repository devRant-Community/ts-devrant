
import defaults from './default-config';

interface Configuration {
    api: string;
}

let config: Configuration = defaults;

export function updateConfig(updatedConfig: Partial<Configuration>) {
    config = {
        ...config,
        ...updatedConfig
    }
}

export function getConfig() {
    return config;
}