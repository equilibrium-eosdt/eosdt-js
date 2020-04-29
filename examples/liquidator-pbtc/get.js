const Connector = require('../../dist/connector').EosdtConnector;
const Liquidator = require('../../dist/liquidator').LiquidatorContract;
const logStruture = require('../log-structure');
const ACCOUNT = require('./config');

(async () => {
    const connector = new Connector(
        'http://nodeos-2.jungle.eosdt.com:8888',
        [ACCOUNT.privateKey]
    );

    const liquidator = new Liquidator(
        connector,
        'PBTC'
    );

    // Parameters
    const parameters = await liquidator.getParameters();
    console.log("Parameters:");
    logStruture(parameters);

    // Settings
    const settings = await liquidator.getSettings();
    console.log("Settings:");
    logStruture(settings);
})()