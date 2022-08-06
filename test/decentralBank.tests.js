const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    // from ether to Wei
    function tokens (number) {
        return web3.utils.toWei(number, 'ether')
    }
 
    before(async () =>{
        // 계약을 가져오는 곳
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)
        
        // from reward token to Decentral Bank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 tethers to customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    // 테스팅할 코드가 적힐 부분
    describe('Taek Tether deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Taek Tether Token') 
        })
    })

    describe('Reward Token deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })
    
    describe('Decentral Bank deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })
})

