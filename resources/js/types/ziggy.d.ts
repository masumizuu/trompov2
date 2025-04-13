declare module 'ziggy-js' {
  export interface RouteParamsWithQueryOverload {
    (
      name: string,
      params?: Record<string, any> | undefined,
      absolute?: boolean
    ): string;
    (name: undefined, params: Record<string, any>, absolute?: boolean): string;
    current: (name?: string) => boolean;
    has: (name: string) => boolean;
  }

  export type RouteParam = 
    | string
    | number
    | {
        id: string | number;
      };

  export type RouteParams = Record<string, RouteParam>;

  const route: RouteParamsWithQueryOverload;
  export default route;
  export { route };
}

// Add global Ziggy definition for use with the route() function from context
declare global {
  const route: (name: string, params?: Record<string, any> | undefined, absolute?: boolean) => string;
  
  interface Window {
    Ziggy: any;
    auth: {
      user: import('./index').User | null;
    };
    // Pusher environment variables
    PUSHER_APP_KEY: string;
    PUSHER_APP_CLUSTER: string;
  }
}