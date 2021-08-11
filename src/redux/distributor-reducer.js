import { waxAPI } from "../api/apiWAX";

const SET_NFT = "nft-distributor/nft-reducer/SET_NFT";
const SET_RESPONSE_TRANSACTION = "nft-distributor/recipient/SET_RESPONSE_TRANSACTION";
const SET_ERROR_MESSAGE = "nft-distributor/recipient/SET_ERROR_MESSAGE";
const SET_DATA_IN_PROCESS_UPDATE = "nft-distributor/recipient/SET_IN_PROCESS_UPDATE";
const SET_DISADVANTAGED_USERS = "nft-distributor/recipient/SET_DISADVANTAGED_USERS";
const SET_BLOCKING_SITE_CONTROL = "nft-distributor/recipient/SET_BLOCKING_SITE_CONTROL"

let initialState = {
    generalDataNFT: [],
    recipientData: [],
    quantityNFT: 0,
    responseTransaction: [],
    dataUpdateDone: false,
    errorMessage: "",
    dataInProcessUpdate: false,
    disadvantagedUsers: [],
    blockingSiteControl: false
};

let distributorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NFT:
            return {
                ...state,
                quantityNFT: action.quantityNFT,
                generalDataNFT: action.currentNFTOnWallet,
                dataUpdateDone: action.dataUpdateDone
            };
        case SET_RESPONSE_TRANSACTION:
            return {
                ...state,
                responseTransaction: action.response,
                dataUpdateDone: action.dataUpdateDone
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.currentErrorMessage
            };
        case SET_DATA_IN_PROCESS_UPDATE:
            return {
                ...state,
                dataInProcessUpdate: action.dataInProcessUpdate
            }
        case SET_DISADVANTAGED_USERS:
            return {
                ...state,
                disadvantagedUsers: action.disadvantagedUsers
            }
        case SET_BLOCKING_SITE_CONTROL:
            return {
                ...state,
                blockingSiteControl: action.blockingSiteControl
            }
        default:
            return state;
    }
};

//*ActionCreator
const setNFT = (currentNFTOnWallet, quantityNFT, dataUpdateDone) => ({ type: SET_NFT, currentNFTOnWallet, quantityNFT, dataUpdateDone });
const setResponseTransaction = (response, dataUpdateDone) => ({ type: SET_RESPONSE_TRANSACTION, response, dataUpdateDone });
const setDisadvantagedUsers = (disadvantagedUsers) => ({ type: SET_DISADVANTAGED_USERS, disadvantagedUsers });
const setBlockingSiteControl = (blockingSiteControl) => ({ type: SET_BLOCKING_SITE_CONTROL, blockingSiteControl });
export const setErrorMessage = (currentErrorMessage) => ({ type: SET_ERROR_MESSAGE, currentErrorMessage });
export const setDataInProcessUpdate = (dataInProcessUpdate) => ({ type: SET_DATA_IN_PROCESS_UPDATE, dataInProcessUpdate });

//*ThunkCreator
export const getNFTFromWallet = () => async (dispatch) => {
    try {
        const response = await waxAPI.getAllNFT();
        if (response.errorMessage === undefined) {
            if (response.length > 0) {
                let resultNFT = [];
                let quantityNFT = 0;
                if (response.length > 0) {
                    const typesNFT = findTypeNFT(response);

                    const typesNFTDetails = await waxAPI.getDetailsDataTemplateNFT(typesNFT);

                    quantityNFT = response.length;

                    for (let i = 0; i < typesNFT.length; i++) {
                        resultNFT.push({
                            template_id: typesNFT[i].template_id,
                            template_name: typesNFTDetails[i].name !== undefined && typesNFTDetails[i].name !== null ? typesNFTDetails[i].name : "NO NAME",
                            collection_name: typesNFT[i].collection_name,
                            schema_name: typesNFT[i].schema_name,
                            NFT: [],
                        });
                        for (let j = 0; j < response.length;) {
                            if (
                                response[j].collection_name === typesNFT[i].collection_name &&
                                response[j].schema_name === typesNFT[i].schema_name &&
                                response[j].template_id === typesNFT[i].template_id
                            ) {
                                resultNFT[i].NFT.push({
                                    asset_id: response[j].asset_id,
                                });
                                response.splice(j, 1);
                            }
                            else {
                                j++
                            }
                        }
                    }
                }
                dispatch(setNFT(resultNFT, quantityNFT, true));
            }
            dispatch(setErrorMessage(response.message));
        }
    } catch (e) { dispatch(setErrorMessage(e.message)); }
};
export const sendTransaction = (recipientList, templateId, quantityNft, generalDataNFT) => async (dispatch) => {
    if (
        recipientList !== undefined &&
        templateId !== undefined &&
        quantityNft !== undefined &&
        quantityNft > 0 &&
        recipientList !== "" &&
        templateId !== "Select NFT..." &&
        quantityNft !== ""
    ) {
        dispatch(setErrorMessage(""));
        dispatch(setDisadvantagedUsers([]));
        const allNftByTemplates = generalDataNFT.find(
            (nft) => nft.template_id.toString() === templateId
        );
        let arrRecipientList = recipientList
            .split(/\n/)
            .map((rl, index) => ({ key: index, name: rl.trim() }));

        arrRecipientList = arrRecipientList.filter((rl) => rl.name !== "");

        const quantityNftForTransaction =
            quantityNft * arrRecipientList.length;

        if (quantityNftForTransaction <= allNftByTemplates.NFT.length) {
            let nftForTransaction = [];
            allNftByTemplates.NFT.slice(0, quantityNftForTransaction).map(
                (asset_id) => {
                    return nftForTransaction.push(asset_id.asset_id);
                }
            );

            const transactionData = arrRecipientList.map((rl, index) => {
                const qNFT = parseInt(quantityNft);
                const begin = index * qNFT;
                const end = begin + qNFT;
                return { recipient: rl, NFT: nftForTransaction.slice(begin, end) };
            });

            dispatch(setBlockingSiteControl(true));
            //* Call method of sending transaction
            const response = await waxAPI.sendAirDropTransaction(transactionData);
            dispatch(setBlockingSiteControl(false));

            if (response.errorMessage === undefined) {
                dispatch(setResponseTransaction(response, false));
            } else {
                dispatch(setErrorMessage(response.errorMessage));
                let _disadvantagedUsersTemp = [];
                if (response.actions && response.actions.length > 0) {
                    for (let i = 0; i < response.actions.length; i++) {
                        _disadvantagedUsersTemp.push(response.actions[i].data.to);
                    }
                }
                if (response.transactionData && response.transactionData.length > 0) {
                    for (let i = 0; i < response.transactionData.length; i++) {
                        _disadvantagedUsersTemp.push(response.transactionData[i].recipient.name);
                    }
                }
                dispatch(setDisadvantagedUsers(_disadvantagedUsersTemp));
                if (response.result.length > 0) {
                    dispatch(setResponseTransaction(response.result, false));
                }
            }
        }
        else {
            dispatch(setErrorMessage("Number of NFT is too large"));
        }
    } else {
        let errorMessage = "";
        recipientList === undefined
            ? errorMessage = "check recipient list (undefined)"
            : templateId === undefined
                ? errorMessage = "check NFT for distribution (undefined)"
                : quantityNft === undefined
                    ? errorMessage = "check quantity NFT (undefined)"
                    : quantityNft <= 0
                        ? errorMessage = "check quantity NFT <= 0"
                        : recipientList === ""
                            ? errorMessage = "empty data recipient list"
                            : templateId === "Select NFT..."
                                ? errorMessage = "empty data NFT for distribution"
                                : quantityNft === ""
                                    ? errorMessage = "empty data quantity NFT"
                                    : errorMessage = "unknown error, call operator"
        dispatch(setErrorMessage(errorMessage));
    }
}

export default distributorReducer;

const findTypeNFT = (arrNFT) => {
    let sortedArrNFT = arrNFT.filter((element, index, self) =>
        index === self.findIndex((t) => (
            t.collection_name === element.collection_name &&
            t.schema_name === element.schema_name &&
            t.template_id === element.template_id
        )));
    return sortedArrNFT.map((sa) => {
        return { collection_name: sa.collection_name, schema_name: sa.schema_name, template_id: sa.template_id };
    });
};