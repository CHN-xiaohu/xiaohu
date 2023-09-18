// import { Location } from 'history';
// // import { check } from './permission';

// import { getAuthRoutes } from '@/services/Api/Global';

// import { RouteItem } from './typings/app';
// import { logout } from './services/User';

// interface RouteChangeParamsInterface {
//   location: Location;
//   routes: any[];
//   action: 'PUSH' | 'POP' | 'REPLACE' | undefined;
// }

export async function getInitialState() {
  const data = {};

  return data;
}

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // eslint-disable-next-line no-console
      console.error(err, err.message);
    },
  },
};

// //
// const authRoutes = {};

// // 动态更新路由
// export function patchRoutes(params: { routes: RouteItem[] }) {
//   //
// }

// export function render(oldRender: Function) {
//   getAuthRoutes()
//     .then(res => {
//       console.log(res);
//     })
//     .catch(() => {
//       logout()
//     })

//   oldRender()
//   // routesAuthority().then(response => {
//   //   if (response && response.success) {
//   //     authRoutes = response.data;
//   //   }
//   //   oldRender();
//   // });
// }
