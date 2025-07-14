export interface RealtimeSettings {
    connection: Connection;
    display: Display;
}

export interface Connection {
    url: string;
    token: string;
}

export interface Display {
    canvas: Agent;
    bubble: Agent;
    text: Agent;
    largeScale: boolean;
}

export interface Agent {
    name: boolean;
    team: boolean;
    role: boolean;
}

export class Convert {
    public static fromJson(json: string): RealtimeSettings {
        return JSON.parse(json) as RealtimeSettings;
    }

    public static toJson(value: RealtimeSettings): string {
        return JSON.stringify(value, null, 2);
    }
}