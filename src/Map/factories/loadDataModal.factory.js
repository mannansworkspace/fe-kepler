
import { LoadDataModalFactory, withState } from 'kepler.gl/components';
import { LOADING_METHODS } from '../../constants/default-settings';
import { CLOUD_PROVIDERS } from "../../cloud-providers";


import { loadRemoteMap } from '../../store/actions/kepler.action';
import LoadRemoteMap from '../components/customLoadRemoteMap';


const CustomLoadDataModalFactory = (...deps) => {
    const LoadDataModal = LoadDataModalFactory(...deps);
    const defaultLoadingMethods = LoadDataModal.defaultProps.loadingMethods;
    const additionalMethods = {
        remote: {
            id: LOADING_METHODS.remote,
            label: 'modal.loadData.remote',
            elementType: LoadRemoteMap
        },
    };

    // add more loading methods
    LoadDataModal.defaultProps = {
        ...LoadDataModal.defaultProps,
        loadingMethods: [
            // defaultLoadingMethods.find(lm => lm.id === 'upload'),
            defaultLoadingMethods.find(lm => lm.id === 'storage'),
            additionalMethods.remote,
        ],
    };

    return withState([], state => ({ ...state, cloudProviders: CLOUD_PROVIDERS }), {
        onLoadRemoteMap: loadRemoteMap,

    })(LoadDataModal);
};

CustomLoadDataModalFactory.deps = LoadDataModalFactory.deps;


export function replaceLoadDataModal() {
    return [LoadDataModalFactory, CustomLoadDataModalFactory];
}