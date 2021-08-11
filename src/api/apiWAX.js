import * as waxJS from "@waxio/waxjs/dist";
import { RpcApi, deserialize, ObjectSchema } from "atomicassets"

const myWaxJS = new waxJS.WaxJS('https://wax.greymass.com', null, null, false);
const myAtomic = new RpcApi("https://wax.greymass.com", "atomicassets", { fetch, rateLimit: 4 });

const contractNFT = 'atomicassets';
const contractWax = 'eosio.token';
const recipientWax = '.enb2.wam';
const tableName = 'assets';
const transactionPrice = '5.00000000 WAX';
const memoTransactionWax = 'modest payment for using software [WAX NFT DISTRIBUTOR] =)';
const memoTransactionNft = 'sent with [WAX NFT DISTRIBUTOR] =)';
const limit = 1000;

export const waxAPI = {
    async login() {
        try {
            await myWaxJS.login();
            return myWaxJS;
        } catch (e) { console.log(e.message) }
    },
    async getAllNFT() {
        try {
            let allNFT = [];
            let portionNFT = await myWaxJS.rpc.get_table_rows({
                json: true,                         // Get the response as json
                code: contractNFT,                     // Contract that we target
                scope: myWaxJS.userAccount,         // User account
                table: tableName,                   // Table name
                limit: limit,                       // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
                reverse: false,                     // Optional: Get reversed data
                show_payer: false,                  // Optional: Show ram payer
            });

            portionNFT.rows.map(element => allNFT.push(element));

            while (portionNFT.more) {
                portionNFT = await myWaxJS.rpc.get_table_rows({
                    json: true,
                    code: contractNFT,
                    scope: myWaxJS.userAccount,
                    table: tableName,
                    lower_bound: portionNFT.next_key,
                    limit: limit,
                    reverse: false,
                    show_payer: false,
                })
                portionNFT.rows.map(element => allNFT.push(element));
            }

            return allNFT;
        } catch (e) { return { errorMessage: e.message } }
    },
    //*** Method returns template details
    //* Method needs an array of objects
    //* Object must contain { collection_name: string, schema_name: string, template_id: int } */
    //TODO Method takes a very long time to execute, think about its optimization
    async getDetailsDataTemplateNFT(arrCST) {
        try {
            const allTemplateData = [];
            for (let i = 0; i < arrCST.length; i++) {
                const dataTemplate = await myAtomic.getTemplate(arrCST[i].collection_name, arrCST[i].template_id).then(result => result._data);
                const dataSchema = await myAtomic.getSchema(arrCST[i].collection_name, arrCST[i].schema_name).then(result => result._data);
                let detailsTemplate = deserialize(dataTemplate.immutable_serialized_data, ObjectSchema(dataSchema.format));
                allTemplateData.push(detailsTemplate);
            }
            return allTemplateData;
        } catch (e) { console.log(e.message) }
    },
    async sendAirDropTransaction(transactionData) {
        const actions = [];
        let result = [];
        const numberAccountsPackage = 20;
        const matrix = Math.ceil(transactionData.length / numberAccountsPackage);
        try {
            for (let i = 0; i < matrix; i++) {
                let accountCounter = 0
                actions.push(
                    actionsCreator(
                        contractWax,
                        myWaxJS.userAccount,
                        recipientWax,
                        undefined,
                        memoTransactionWax,
                        transactionPrice
                    ));
                while (transactionData.length > 0) {
                    actions.push(
                        actionsCreator(
                            contractNFT,
                            myWaxJS.userAccount,
                            transactionData[0].recipient.name,
                            transactionData[0].NFT,
                            memoTransactionNft,
                            undefined
                        ));
                    transactionData.splice(0, 1);
                    accountCounter++;
                    if (accountCounter === numberAccountsPackage) {
                        break
                    };
                }
                result.push(await myWaxJS.api.transact({
                    actions,
                }, {
                    blocksBehind: 3,
                    expireSeconds: 1200,
                }));
                actions.length = 0
            }
            return result;
        } catch (e) {
            return {
                result: result,
                actions: actions.length > 0 ? actions.slice(1) : [],
                transactionData: transactionData,
                errorMessage: e.message
            };
        }
    }
}

const actionsCreator = (contractNFT, userAccount, recipientName, Nft, memoTransactionNft, tokenQuantity) => {
    return {
        account: contractNFT,
        name: 'transfer',
        authorization: [{
            actor: userAccount,
            permission: 'active',
        }],
        data: {
            from: userAccount,
            to: recipientName,
            asset_ids: Nft,
            quantity: tokenQuantity,
            memo: memoTransactionNft,
        },
    }
}