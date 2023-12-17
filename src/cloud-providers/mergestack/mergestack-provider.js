import { Auth0Client } from '@auth0/auth0-spa-js';
import { Provider } from 'kepler.gl/cloud-providers';
import MergestackIcon from './mergestack-icon';



const NAME = 'mergestack';
const DISPLAY_NAME = 'Custom-Provider';
const appName = 'Kepler-JS-Test';

const AUTH_SCOPE = 'openid profile email';

export default class MergeStackProvider extends Provider {
    constructor(domain, clientId, apiURL, redirectUri) {
        super({ name: NAME, displayName: DISPLAY_NAME, icon: MergestackIcon });
        this.redirectUri = redirectUri
        this.icon = MergestackIcon;
        this.appName = appName;
        this.apiURL = apiURL;
        this.user = null
        // All cloud-providers providers must implement the following properties
        this._auth0 = new Auth0Client({
            domain: domain,
            clientId: clientId,
            scope: AUTH_SCOPE,
            authorizationParams: {
                redirect_uri: redirectUri,
            },
            cacheLocation: 'localstorage'
        });

        // the domain needs to be passed as input param
        this._folderLink = '';
        this.isNew = true;
        this.listMaps()

    }

    getAccessToken() {
        console.log("in get access token")
        let token
        if (window.localStorage) {
            const jsonString = window.localStorage.getItem('mergestack');
            if (jsonString) {
                token = JSON.parse(jsonString).token;
                this.user = JSON.parse(jsonString).user
            }
        }
        return (token || '') !== '' ? token : null;
    }

    async getHeaders() {
        console.log("get headers called")
        const accessToken = await this.getAccessToken();
        return {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
    }

    hasPrivateStorage() {
        console.log("hasPrivateStorage called")
        return false;
    }

    hasSharingUrl() {
        console.log("hasSharingUrl called")
        return true
    }

    async getUser() {
        console.log("Get user called")
        return this._auth0.getUser();
    }


    async login(onCloudLoginSuccess) {
        console.log('Login')
        await this._auth0.loginWithPopup();
        const token = await this._auth0.isAuthenticated() ? await this._auth0.getTokenSilently() : null

        if (token) {

            let user = await this.getUser()
            user = {
                name: user.name,
                email: user.email,
                abbreviated: user.name
            }

            if (window.localStorage) {
                window.localStorage.setItem(
                    'mergestack',
                    JSON.stringify({
                        // dropbox token doesn't expire unless revoked by the user
                        token: token,
                        user,
                        timestamp: new Date()
                    })
                );
            }
            console.log(user, token, window.localStorage)

            onCloudLoginSuccess()
            return user

        }

    }

    async logout() {
        console.log('Logout')

        if (window.localStorage) {
            window.localStorage.removeItem('mergestack');
        }
        return this._auth0.logout();
    }

    async uploadMap({ mapData, options = {} }) {
        console.log('uploadMap called')
        // TODO: handle replace
        const method = options.overwrite ? 'PUT' : 'POST';
        const { map } = mapData;

        const { title = '', description = '' } = map.info;
        const headers = await this.getHeaders();
        const payload = {
            name: title,
            description,
            data: { map, user: this.user }
        };

        const mapResponse = await fetch(
            `${this.apiURL}/maps/add`,
            {
                method,
                headers,
                body: JSON.stringify(payload)
            }
        );

        const { filePath } = await mapResponse.json()

        return {
            shareUrl: `${this.redirectUri}?mapUrl=${this.apiURL}/${filePath}`
        };
    }

    getShareUrl() {
        console.log('getShareUrl called')
    }

    getMapUrl() {
        console.log('getMApUrl called')
    }

    async listMaps() {
        return [
            {
                id: 'a',
                title: 'My map',
                description: 'My first kepler map',
                imageUrl: 'http://',
                udpatedAt: 1582677787000,
                privateMap: false,
                loadParams: {}
            }
        ];
    }

    getUserName() {
        console.log("getUserName Called", this.user)
        return this.user?.name || ''
    }

    async downloadMap(loadParams) {
        console.log('downloadmap called')
        const { id } = loadParams;
        if (!id) {
            return Promise.reject('No Map is was provider as part of loadParams');
        }
        const headers = await this.getHeaders();

        const response = await fetch(`${this.apiURL}/v1/maps/${id}`, {
            method: 'GET',
            headers
        });

        const map = await response.json();
        console.log(map)
        return Promise.resolve({
            //   map: extractMapFromFSQResponse(map),
            //   format: KEPLER_FORMAT
        });
    }
}