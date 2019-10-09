import Header from '../store/container/header'
import { withTranslation } from '../components/i18n'
import { useRouter } from 'next/router'

import { checkAuth } from '../utils/auth'
import { useEffect } from 'react'

const Settings = ({ isAuthorized }) => {

  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthorized)
      router.push('/');
  });

  return (
    <div>
      <Header isLoggedIn={isAuthorized} />
      <h1>User Settings</h1>
    </div>
  )
}

Settings.getInitialProps = async ctx => {
  const isAuthorized = await checkAuth(ctx);
  return {
    isAuthorized,
    namespacesRequired: ['common']
  }
}

export default withTranslation('common')(Settings);