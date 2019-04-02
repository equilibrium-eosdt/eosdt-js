# Output examples 
Here are some examples of actual objects, returned by EOSDT contracts.

## Position
This is the format of a position, stored on Positions contract.

```Javascript
{ position_id: 2,
  maker: 'accname',
  outstanding: '99.984949053 EOSDT',
  governance: '99.969900373 EOSDT',
  collateral: '44.34987231947751951' }
```

## Positions contract settings
This object is returned when invoking `positions.getSettings()`.

```Javascript
{ id: 0,
  global_lock: 0,
  time_shift: 0,
  liquidator_account: 'eosdtliqdatr',
  oraclize_account: 'eosdtorclize',
  sttoken_account: 'eosdtsttoken',
  nutoken_account: 'eosdtnutoken',
  governance_fee: '0.00500000000000000',
  stability_fee: '0.00500000000000000',
  critical_ltv: '1.60000000000000009',
  liquidation_penalty: '0.13000000000000000',
  liquidator_discount: '0.03000000000000000',
  liquidation_price: '0.0000 USD',
  nut_auct_ratio: '0.29999999999999999',
  nut_discount: '0.03000000000000000' }
```
## Position contract parameters
This object is returned when invoking `position.getParameters()`.

```Javascript
{ parameter_id: 0,
  total_collateral: '348.39512418362238577',
  total_debt: '467.901521446 EOSDT',
  stability_rate: '1.00019182696441589',
  governance_rate: '1.00038788501258202',
  prev_date: '2019-03-15T16:04:32' }
```

## Proposal
This is the format of a propsal, stored on Governance contract. Array of this objects is returned when invoking `governance.getProposals()`.

```Javascript
{ proposal_name: 'change.ltv',
  proposer: 'exampleaccnt',
  title: 'Change LTV and fees',
  proposal_json: '{"eosdtcntract.critical_ltv":1.7,"eosdtcntract.governance_fee":0.03,"eosdtcntract.stability_fee":0.086}',
  created_at: '2019-03-26T15:27:27',
  expires_at: '2019-03-26T15:30:20' }
```

## Vote
This is the format of a vote for or against a proposal. Array of this objects is returned when invoking `governance.getVotes()`.

```Javascript
{ id: 0,
  proposal_name: 'test.proposal',
  voter: 'accname',
  vote: 1,
  updated_at: '2019-03-26T13:30:11',
  quantity: '2.000000000 NUT' } 
```

## Governance contract settings 
This object is returned when invoking `governance.getSettings()`.

```Javascript
{ id: 0,
  time_shift: 0,
  eosdtcntract_account: 'eosdtcntract',
  liquidator_account: 'eosdtliqdatr',
  oraclize_account: 'eosdtorclize',
  nutoken_account: 'eosdtnutoken',
  min_proposal_weight: '5000.0000 USD',
  freeze_period: 259200,
  min_participation: '0.51000000000000001',
  success_margin: '0.55000000000000004',
  top_holders_amount: 10 }
```

## Liquidator 
This object is returned when invoking `liquidator.getParameters()`.

```Javascript
{ parameter_id: 0,
  surplus_debt: '0.000000000 EOSDT',
  bad_debt: '2.310000000 EOSDT',
  eos_balance: '10.8346 EOS',
  nut_collat_balance: '3.3462 EOS' }
```

## Rate
This is the format of token rate, stored on EOSDT contracts. Array of this objects is returned when invoking `positions.getRates()`.

```Javascript
{ rate: '0.126000000 NUT',
  last_update: '2019-03-18T15:20:08',
  master_update: '2019-03-18T15:20:00',
  slave_update: '2019-03-10T11:20:01',
  onerror_update: '1970-01-01T00:00:00' }
```
