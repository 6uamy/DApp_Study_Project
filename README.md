# Decentral bank Study project

## 접속 시 Web3 환경 체크와 메타마스크를 통한 연동

``` javascript
    // Web3 연결
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
        } 
        else {
            window.alert('No ethereum browser detected! Check out MetaMask!');
        }
    }
```
### 실행결과 >

<p align='center'>
<img src='https://user-images.githubusercontent.com/79950091/184334161-6988da49-2548-4d8a-90bb-c7416a64eba3.png' width='650' height='400'>
</p>

## 탈중앙화 은행 Main 

<p align='center'>
<img src='https://user-images.githubusercontent.com/79950091/184335608-ff2faac0-7115-46a3-b856-0e6c027cb8ac.png' width='650' height='400'>
</p>
    
* 예금 및 출금 기능을 위한 버튼 / 오른쪽 상단의 현재 연결된 MetaMask 계정주소 / 예금 금액에 따른 Reward Tokens 보상

## Token 예금 하기

<p align='center'>
<img src='https://user-images.githubusercontent.com/79950091/184348470-f7c76531-c509-4c4f-98a0-f604db4b44d4.gif' width='650' height='400'>
</p>

## 예금한 Token 인출 하기

<p align='center'>
<img src='https://user-images.githubusercontent.com/79950091/184348485-625ae28e-3e99-4857-9838-2656afb8c1fd.gif' width='650' height='400'>
</p>


## 예금액에 따른 RewardTokens 발행

<p align='center'>
<img src='https://user-images.githubusercontent.com/79950091/184348493-53e6e468-789b-47cc-a332-9ea3cc581d7e.gif' width='650' height='400'>
</p>






