import { waxAPI } from "../api/apiWAX";

const SET_NFT = "nft-distributor/nft-reducer/SET_NFT";
const SET_RECIPIENT = "nft-distributor/recipient/SET_RECIPIENT";
const SET_RESPONSE_TRANSACTION = "nft-distributor/recipient/SET_RESPONSE_TRANSACTION";

let initialState = {
    generalDataNFT: [],
    recipientData: [],
    quantityNFT: 0,
    responseTransaction: "",
    dataUpdateDone: false
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
        case SET_RECIPIENT:
            return {};
        case SET_RESPONSE_TRANSACTION:
            return {
                responseTransaction: action.response,
                dataUpdateDone: action.dataUpdateDone
            };
        default:
            return state;
    }
};

//*ActionCreator
export const setNFT = (currentNFTOnWallet, quantityNFT, dataUpdateDone) => ({ type: SET_NFT, currentNFTOnWallet, quantityNFT, dataUpdateDone });
export const setResponseTransaction = (response, dataUpdateDone) => ({ type: SET_RESPONSE_TRANSACTION, response, dataUpdateDone });

//*ThunkCreator
export const getNFTFromWallet = () => async (dispatch) => {
    try {
        const response = await waxAPI.getAllNFT();
        if (response.length > 0) {
            let resultNFT = [];
            let quantityNFT = 0;
            if (response.length > 0) {
                const typesNFT = findTypeNFT(response);

                const typesNFTDetails = await waxAPI.getDetailsDataTemplateNFT(typesNFT)

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
                            response.splice(j, 1)
                        }
                        else {
                            j++
                        }
                    }
                }
            }
            dispatch(setNFT(resultNFT, quantityNFT, true));
        }
    } catch (e) { console.log(e.message) }
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

            const response = await waxAPI.sendAirDropTransaction(transactionData);
            if (response !== "") {
                dispatch(setResponseTransaction(response, false));
            }
        }
        else {
            console.log("Number of NFT is too large")
        }
    } else {
        console.log(
            recipientList === undefined
                ? "check recipient list (undefined)"
                : templateId === undefined
                    ? "check NFT for distribution (undefined)"
                    : quantityNft === undefined
                        ? "check quantity NFT (undefined)"
                        : quantityNft <= 0
                            ? "check quantity NFT <= 0"
                            : recipientList === ""
                                ? "empty data recipient list"
                                : templateId === "Select NFT..."
                                    ? "empty data NFT for distribution"
                                    : quantityNft === ""
                                        ? "empty data quantity NFT"
                                        : "unknown error"
        );
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