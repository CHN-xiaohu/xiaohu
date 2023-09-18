import type { Location, History } from 'history';

import type { RouteItem } from './app.d';

type RouteChildrenProps<Params = any> = {
  history: History;
  location: Location<any> & { query?: Record<string, any> };
  match: {
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
  };
  route: {
    routes: RouteItem[];
    [k: string]: any;
  };
};
