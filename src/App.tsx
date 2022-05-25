import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import Button from '@mui/material/Button';

import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,    
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,AccountInfo , Commitment,sendAndConfirmTransaction,TransactionInstruction } from '@solana/web3.js';
import React, { Children, FC, ReactNode, useMemo, useCallback,useState } from 'react';
import { Buffer } from 'buffer';

import * as BufferLayout from '@solana/buffer-layout';

import { Connection } from '@solana/web3.js';
import {useEffect} from 'react'
import * as anchor from '@project-serum/anchor';
import { StakePoolLayout } from '../src/common/layouts';
import {
  STAKE_POOL_INSTRUCTION_LAYOUTS,
  STAKE_POOL_PROGRAM_ID,
  DepositSolParams,
  StakePoolInstruction,
  depositSol,
  withdrawSol,
  withdrawStake,
} from '../src/common';
import * as borsh from "borsh"
import {
 
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  
  TransactionInstruction,
  TransactionSignature,
  Blockhash,
  FeeCalculator,
} from '@solana/web3.js';
// @ts-ignore
import {error, trace} from "console"
import { decodeData } from '../src/common/utils';
import {
  Program, Provider, web3 ,BN
} from '@project-serum/anchor';
// import idl from './idl.json';
import { Int } from '@solana/buffer-layout';
import * as bs58 from "bs58";
import { mockTokenAccount, mockValidatorList, stakePoolMock } from './test/mocks';
import * as idl from "../src/Idl.json"
import {Test} from './Test';



//-------------MAIN APP COMPONENT ----------------


export const App: FC = () => {
    const [connect, setconnect] = useState(false);
    const { connection } = useConnection();
console.log(connection);
const { publicKey, sendTransaction } = useWallet();
console.log(publicKey,"publicKey");

    return (
        <div className='main-conatiner'>  
             <Context>
            <Content />
        </Context>
   

</div>

        
    );
};
    let phantomWallet: PhantomWalletAdapter 



//-------------CONTEXT COMPONENT ----------------



const Context: FC<{ children: ReactNode }> = ({ children }) => {
   
    
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;
   
    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            phantomWallet =     new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

    return (  
        <ConnectionProvider endpoint="http://api.devnet.solana.com/">
            <WalletProvider  wallets={wallets} >
                <WalletModalProvider >
<Test/>
                {/* <WalletDisconnectButton /> */}
                <SendOneLamportToRandomAddress />
               </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
      
        
    );
};


//-------------CONTENT COMPONENT ----------------

const Content: FC = () => {
   
    // console.log(data,"////////////////");
    // console.log(<WalletMultiButton/>);
      phantomWallet.on('connect', () => {
     //  let data=   phantomWallet.connect()
        console.log(phantomWallet,"hii");
    });
       phantomWallet.on('disconnect', () => {
        console.log(phantomWallet);
    })


    return <WalletMultiButton />;
};

//------------------SEND ONE LAMPORT COMPONENT -----------------------

export const SendOneLamportToRandomAddress: FC = () => {

  const [sol, setSol] = useState(0)   ;
   const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
 console.log(publicKey?.toBase58(),"//////////");
 
    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        console.log(publicKey);
        let add= "EJdcLY3VzzvV23VLsrbcM66fy9cJ8xuzzU2PGLE83RYS"
        const send = new PublicKey(add)
        console.log(send.toBase58(),":::::::::::::");
        
        const toAddress = Keypair.generate().publicKey;


        // console.log("New Generated Address => ", toAddress);
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: send,
                lamports: 400000000,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    return (
      <>
     
        <Button variant="contained" onClick={onClick} disabled={!publicKey}>
            Send  lamport to a random address!
        </Button>
        </>
    );
};







