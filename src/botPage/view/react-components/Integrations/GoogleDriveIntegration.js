import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/i18n';
import google_drive_util from '../../../../common/integrations/GoogleDrive';
import GD_CONFIG from '../../../../botPage/common/google_drive_config';

const GoogleDriveIntegration = () => {
    // const { is_gd_logged_in } = useSelector(state => state.client);
    let is_gd_logged_in = true;



    function handleCllbackResponse(response){
        console.log('id', response.credential)
        // var userObject = jwt_decode(response.credential);
        // console.log('userObject', userObject)
    }

    React.useEffect(() =>  {
        const initGoogle = document.createElement('script');
        initGoogle.src = 'https://accounts.google.com/gsi/client';
        document.head.append(initGoogle);
            
        initGoogle.onload = function() {
            console.log('google ready');
                    /* global google */
        google.accounts.id.initialize({
            client_id: "421032537360-bs7d6orvvd7inrj2apc86fkmnbmbmj9g.apps.googleusercontent.com",
            // client_id: GD_CONFIG.CLIENT_ID,
            callback: handleCllbackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", size: "large"}
        )
        google.accounts.id.prompt();

                /* global google */
                const init_code_client =  google.accounts.oauth2.initCodeClient({
                    scope: 'https://www.googleapis.com/auth/calendar.readonly',
                    // // ux_mode: 'redirect',
                    // // redirect_uri: "https://your.domain/code_callback_endpoint",
                    // // state: "YOUR_BINDING_VALUE"
                    //
                    client_id: process.env.GD_CLIENT_ID,
                    // client_id: "421032537360-bs7d6orvvd7inrj2apc86fkmnbmbmj9g.apps.googleusercontent.com",
                    API_KEY: process.env.GD_API_KEY,
                    APP_ID: process.env.GD_APP_ID,
                    API_URL: 'https://accounts.google.com/gsi/client',
                    redirect_uri: "https://your.domain/code_callback_endpoint",
                    // // AUTH_SCOPE: 'client:auth2:picker',
                    // // DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                });
                console.log('init_code_client', init_code_client)
        }
      }, [])

    return (<>
            <div id="signInDiv"></div>
        <div className="integration input-row last gd-popup">
            <div className="left">
                <h2>Google Drive</h2>
                <div className="description">{translate('Save your blocks and strategies to Google Drive')}</div>
                {is_gd_logged_in && (
                    <div className="integration-user">
                        {`${translate('You are logged in as')} ${google_drive_util.profile?.getEmail()}`}
                    </div>
                )}
            </div>
            <div className="right">
                <a
                    onClick={() => google_drive_util.authorise()}
                    className={!is_gd_logged_in ? 'button' : 'button-disabled'}
                >
                    <span id="connect-google-drive">{translate('Connect')}</span>
                </a>
                <a
                    onClick={() => google_drive_util.logout()}
                    className={is_gd_logged_in ? 'button' : 'button-disabled'}
                >
                    <span id="disconnect-google-drive">{translate('Disconnect')}</span>
                </a>
            </div>

            <button onClick={(e) => handleSignOut(e)}>Sing Out</button>
        </div>
        </>
    );
};

export default React.memo(GoogleDriveIntegration);
