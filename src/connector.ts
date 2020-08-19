import { Api, JsonRpc } from "eosjs"
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"
import Fetch from "node-fetch"
import { TextDecoder, TextEncoder } from "text-encoding"
import { GovernanceContract, LiquidatorContract } from "."
import { ArmContract } from "./armeq"
import { BalanceGetter } from "./balance"
import { BasicPositionsContract } from "./basic-positions"
import { PositionsContract } from "./main-positions"
import { SavingsRateContract } from "./savings-rate"
import { TokenSwapContract } from "./tokenswap"

/**
 * A connector object, used to build classes to work with EOSDT ecosystem contracts
 */
export class EosdtConnector {
    public readonly rpc: JsonRpc
    public readonly api: Api

    /**
     * A connector object, used to build classes to work with EOSDT ecosystem contracts
     * @param {string} nodeAddress URL of blockchain node, used to send transactions
     * @param {string[]} privateKeys Array of private keys used to sign transactions
     */
    constructor(nodeAddress: string, privateKeys: string[]) {
        // Workaround to avoid incompatibility of fetch types in 'eosjs' and 'node-fetch'
        const fetch: any = Fetch

        this.rpc = new JsonRpc(nodeAddress, { fetch })
        const signatureProvider = new JsSignatureProvider(privateKeys)
        this.api = new Api({
            rpc: this.rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        })
    }

    /**
     * Creates class to work with basic positions contract (non-EOS collateral)
     * @param {string} collateralToken Currently "PBTC" only
     * @returns Instance of `BasicPositionsContract`
     */
    public getBasicPositions(collateralToken: string): BasicPositionsContract {
        return new BasicPositionsContract(this, collateralToken)
    }

    /**
     * Creates a class to work with EOS-collateral positions contract (`eosdtcntract`)
     */
    public getPositions(): PositionsContract {
        return new PositionsContract(this)
    }

    /**
     * Creates a class to work with specified liquidator contract
     * @param {string=} [collateralToken] "EOS" of "PBTC"
     * @returns Instance of `LiquidatorContract`
     */
    public getLiquidator(collateralToken: string = "EOS"): LiquidatorContract {
        return new LiquidatorContract(this, collateralToken)
    }

    /**
     * Creates a wrapper for Savings Rate contract
     * @returns Instance of `SavingsRateContract`
     */
    public getSavingsRateCont(): SavingsRateContract {
        return new SavingsRateContract(this)
    }

    /**
     * Creates a wrapper for 'arm.eq' contract
     * @returns Instance of `ArmContract`
     */
    public getArmContract(): ArmContract {
        return new ArmContract(this)
    }

    /**
     * Creates a wrapper for 'tokenswap.eq' contract
     * @returns Instance of `TokenSwapContract`
     */
    public getTokenSwapContract() : TokenSwapContract {
        return new TokenSwapContract(this)
    }

    /**
     * Instantiates `GovernanceContract` - a wrapper to work with `eosdtgovernc`
     * @returns Instance of `GovernanceContract`
     */
    public getGovernance(): GovernanceContract {
        return new GovernanceContract(this)
    }

    /**
     * Instantiates a simple class to read blockchain balances
     * @returns Instance of `BalanceGetter`
     */
    public getBalances(): BalanceGetter {
        return new BalanceGetter(this)
    }
}
