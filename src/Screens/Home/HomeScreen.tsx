import React, { useEffect, useState } from 'react';
import { getAppInfo } from '../../Services';
import { useTranslation } from 'react-i18next';

import UpdateDialog from './UpdateDialog';
import HomeNavigator from './HomeNavigator';

const HomeScreen = () => {

  const { t } = useTranslation();
  const [updateRequire, setUpdateRequire] = useState(false);

  useEffect(() => {
    async function start() {
      const update_require = await getAppInfo();
      if (update_require) return setUpdateRequire(true);
    }
    start()
  }, [])

  return (
    <>
      { /**<CustomHeader title={t("commons.home") as string} isHome={true} leftComponent={<CustomLeftComponent />} /> */ }
      {updateRequire && <UpdateDialog t={t} />}
      <HomeNavigator />
    </>
  );
};

export default HomeScreen;