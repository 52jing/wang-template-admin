import { boot } from 'quasar/wrappers';
import _ from 'lodash';
import * as C from 'src/utils/constants';
import { loadLocal, loadSession } from 'src/utils/storage';
import { useProfileStore } from 'src/stores/profile';
import { useCommonStore } from 'src/stores/common';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // 同步存储到 store
  const profileStore = useProfileStore();
  const commonStore = useCommonStore();
  // 载入前端
  const frontend = loadSession(C.keyFrontend);
  commonStore.$patch((state) => {
    if (frontend && _.isObject(frontend)) {
      state.frontendProfile = _.assign({}, state.frontendProfile, frontend);
    }
  });
  // 载入令牌、用户、菜单
  const accessToken = loadLocal(C.keyAccessToken);
  const refreshToken = loadLocal(C.keyRefreshToken);
  const user = loadSession(C.keyUser);
  const menu = loadSession(C.keyAsideMenu);
  const history = loadLocal(C.keyPageHistory);
  profileStore.$patch((state) => {
    if (accessToken) {
      state.accessToken = _.toString(accessToken);
    }
    if (refreshToken) {
      state.refreshToken = _.toString(refreshToken);
    }
    if (user && _.isObject(user)) {
      state.user = _.assign({}, state.user, user);
    }
    if (menu && _.isArray(menu)) {
      state.asideMenus = menu;
    }
    if (history && _.isArray(history)) {
      state.pageHistory = history;
    }
  });
});
