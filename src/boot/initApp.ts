import { boot } from 'quasar/wrappers';
import { useCommonStore } from 'src/stores/common';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // 应用初始化
  const commonStore = useCommonStore();
  // 载入语言
  commonStore.langs.loadlang();
  // 载入前端配置
  commonStore.getFrontendProfile();
});
