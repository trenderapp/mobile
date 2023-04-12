import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../Components/Container';
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
      if(update_require) return setUpdateRequire(true);
    }
    start()
  }, [])


  return (
    <PageContainer>
      {updateRequire && <UpdateDialog t={t} />}
      <HomeNavigator />
    </PageContainer>
  );
};



export default HomeScreen;