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

    // Get parameters
    let parameters = await liquidator.getParameters();
    console.log("Parameters:");
    logStruture(parameters);

    // Transfer
    const response = await liquidator.transferNut(
        ACCOUNT.name,
        '1'
    );
    console.log("Result:");
    logStruture(response);

    // Get parameters
    parameters = await liquidator.getParameters();
    console.log("Parameters after:");
    logStruture(parameters);
})()