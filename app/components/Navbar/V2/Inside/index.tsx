// @module import
import { MouseEvent } from 'react';
import { useCookies } from "react-cookie";
import { WithTranslation } from "next-i18next";
import { useRouter } from "next/router";


// @local import
import './index.css';
import Lang from '../../LangButton';
import { withTranslation } from '../../../i18n';


// @interface
interface ComponentProps extends WithTranslation {
  title: string,
  subtitle: string,
  actionBtn?: {
    name: string,
    action: (event: any) => void,
    loading: boolean
  }
}



// @component
const NavInside: (props: ComponentProps) => JSX.Element = ({ t, title, subtitle, actionBtn = null }) => {

  const [_, __, removeCookies]  = useCookies();
  const router                  = useRouter();


  // Logout mechanism
  const handleLogout = () => {
    removeCookies('token', { path: '/' });
    router.push('/');
  }


  // Rendering fucntion.
  return (
    <div id='comp-nav-inside-root'>
      <div id='cnir-titles'>
        <h1 id='cnirt-title'>{title}</h1>
        <h2 id='cnirt-subtitle' dangerouslySetInnerHTML={{ __html: subtitle}}></h2>
      </div>

      <div id='cnir-action'>
        {
          actionBtn !== null ?
          <button id='cnir-profil' disabled={actionBtn.loading} onClick={actionBtn.action}>
            <p id='cnirp-txt'>{actionBtn.name}</p>
          </button> :
          null
        }
        <Lang />
        <button id='cnir-logout' onClick={handleLogout}>{t('logout')}</button>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(NavInside);