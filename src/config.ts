import defaults from "./default-config";

interface Configuration {
    api: string;
}

export const config: Configuration = defaults;

export function updateConfig(
    updatedConfig: Partial<Configuration>
): Configuration {
    return Object.assign(config, updatedConfig);
}
