import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CLOUD_PROVIDERS } from "../cloud-providers";
import { CLOUD_PROVIDERS_CONFIGURATION } from "../constants/default-settings";
import { useLocation } from "react-router-dom";
import { loadRemoteMap } from "../store/actions/kepler.action";
import { replaceLoadDataModal } from "./factories/loadDataModal.factory";
import { messages } from "../constants/localization";

const KeplerGl = require('kepler.gl/components').injectComponents([
    replaceLoadDataModal(),
]);

const { MAPBOX_TOKEN } = CLOUD_PROVIDERS_CONFIGURATION

function Map() {
    const dispatch = useDispatch();
    const { search } = useLocation()

    useEffect(() => {
        const queryParams = new URLSearchParams(search);
        const mapUrl = queryParams.get('mapUrl')
        if (mapUrl) {
            console.log(mapUrl)
            dispatch(loadRemoteMap({ dataUrl: mapUrl }));
        }

    }, [search, dispatch])

    return (
        <KeplerGl
            id="covid"
            mapboxApiAccessToken={MAPBOX_TOKEN}
            width={window.innerWidth}
            height={window.innerHeight}
            cloudProviders={CLOUD_PROVIDERS}
            localeMessages={messages}
        />
    );
}


export default Map