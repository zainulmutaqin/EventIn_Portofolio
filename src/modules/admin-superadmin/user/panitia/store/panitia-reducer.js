import * as actionType from './panitia-action-type';

const initialState = {
    loading: false,
    data: [],
    idUsers : null,
    idPanitia : null,
   
};

const handler = (currentState) => {
    const getDataParticipant = {
        startGetDataParticipant: () => ({
            ...currentState,
            loading: true,
        }),
        finishGetDataParticipant: () => ({
            ...currentState,
            loading: false,
        }),
        setDataParticipant: data => ({
            ...currentState,
            data: data
        }),
    };

    const setIdPanitia = {
        setIdDataPanitia : data => ({
            ...currentState,
            idPanitia : data
        })
    }

    const setIdUsers = {
        setIdDataUsers : data => ({
            ...currentState,
            idUsers : data
        })
    }


    return {
        ...setIdPanitia,
        ...setIdUsers,
    };
};

export default (state = initialState, action) => {
    const { payload, type } = action;
    switch (type) {
        case actionType.START_GET_DATA:
            return handler(state).startGetDataParticipant();
        case actionType.FINISH_GET_DATA:
            return handler(state).finishGetDataParticipant();
        case actionType.SET_DATA:
            return handler(state).setDataParticipant(payload);

    
      
        case actionType.SET_ID_PANITIA:
            return handler(state).setIdDataPanitia(payload);

        case actionType.SET_ID_USERS:
            return handler(state).setIdDataUsers(payload);

        default:
            return state;
    }
};
