export interface AgentSettings {
    connection: Connection;
    team: string;
    display: Display;
}

export interface Connection {
    url: string;
    token: string;
}

export interface Display {
    largeScale: boolean;
}

export class Convert {
    public static fromJson(json: string): AgentSettings {
        return JSON.parse(json) as AgentSettings;
    }

    public static toJson(value: AgentSettings): string {
        return JSON.stringify(value, null, 2);
    }
}