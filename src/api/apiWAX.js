import * as waxJS from "@waxio/waxjs/dist";
import { RpcApi, deserialize, ObjectSchema } from "atomicassets"

const myWaxJS = new waxJS.WaxJS('https://wax.greymass.com', null, null, true);
const myAtomic = new RpcApi("https://wax.greymass.com", "atomicassets", { fetch, rateLimit: 4 });

const contract = "atomicassets";
const tableName = "assets";
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
                code: contract,                     // Contract that we target
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
                    code: contract,
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
        try {
            const actions = [];

            for (let i = 0; i < transactionData.length; i++) {
                actions.push({
                    account: contract,
                    name: 'transfer',
                    authorization: [{
                        actor: myWaxJS.userAccount,
                        permission: 'active',
                    }],
                    data: {
                        from: myWaxJS.userAccount,
                        to: transactionData[i].recipient.name,
                        asset_ids: transactionData[i].NFT,
                        quantity: null,
                        memo: '',
                    },
                })
            }

            const result = await myWaxJS.api.transact({
                actions,
            }, {
                blocksBehind: 3,
                expireSeconds: 1200,
            });

            return result;
        } catch (e) { return { errorMessage: e.message }; }
    }
}