export = AccountManager;
/**
 * Creates/loads {@linkplain Account|Accounts}
 * @property {Map<string,Account>} accounts
 * @property {EntityLoader} loader
 */
declare class AccountManager {
    accounts: Map<unknown, unknown>;
    loader: unknown;
    /**
     * Set the entity loader from which accounts are loaded
     * @param {EntityLoader}
     */
    setLoader(loader: unknown): void;
    /**
     * @param {Account} acc
     */
    addAccount(acc: Account): void;
    /**
     * @param {string} username
     * @return {Account|undefined}
     */
    getAccount(username: string): Account | undefined;
    /**
     * @param {string} username
     * @param {boolean} force Force reload data from disk
     */
    loadAccount(username: string, force: boolean): Promise<Account>;
}
import Account = require("./Account");
