

import { Program, Provider, web3, } from "@project-serum/anchor";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, TransactionInstruction ,SYSVAR_RENT_PUBKEY,Keypair,Blockhash,
  FeeCalculator,} from "@solana/web3.js";
import { Button } from "antd";
import React, { useState } from "react";
import { Borsh, Account, AnyPublicKey, StringPublicKey } from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import { deserializeUnchecked, serialize } from 'borsh';
import {
  CreateMasterEditionV3Args,
  CreateMetadataV2Args,
  DataV2,
  UpdateMetadataV2Args,
  MetadataData,
} from '@metaplex-foundation/mpl-token-metadata';
import { AccountMeta,AccountInfo} from '@solana/web3.js';
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { struct, u32, u8 } from '@solana/buffer-layout';
import { MULTISIG_SIZE } from './multisig';

import { WalletAdapter, WalletError } from '@solana/wallet-adapter-base';



  
// import { struct, u8 } from '@solana/buffer-layout';

import * as Metaplex from '@metaplex/js';
import { ClientRequest } from "http";
import { programs } from '@metaplex/js';
import * as idl from "../src/Idl.json"
import { clusterApiUrl, LAMPORTS_PER_SOL,Signer,Commitment, sendAndConfirmTransaction,ConfirmOptions,TransactionSignature,Transaction} from '@solana/web3.js';
enum TokenInstruction {
  InitializeMint = 0,
  InitializeAccount = 1,
  InitializeMultisig = 2,
  Transfer = 3,
  Approve = 4,
  Revoke = 5,
  SetAuthority = 6,
  MintTo = 7,
  Burn = 8,
  CloseAccount = 9,
  FreezeAccount = 10,
  ThawAccount = 11,
  TransferChecked = 12,
  ApproveChecked = 13,
  MintToChecked = 14,
  BurnChecked = 15,
  InitializeAccount2 = 16,
  SyncNative = 17,
  InitializeAccount3 = 18,
  InitializeMultisig2 = 19,
  InitializeMint2 = 20,
  GetAccountDataSize = 21,
  InitializeImmutableOwner = 22,
  AmountToUiAmount = 23,
  UiAmountToAmount = 24,
  InitializeMintCloseAuthority = 25,
  TransferFeeExtension = 26,
  ConfidentialTransferExtension = 27,
  DefaultAccountStateExtension = 28,
  Reallocate = 29,
  MemoTransferExtension = 30,
  CreateNativeMint = 31,
}
interface Account1 {
  /** Address of the account */
  address: PublicKey;
  /** Mint associated with the account */
  mint: PublicKey;
  /** Owner of the account */
  owner: PublicKey;
  /** Number of tokens the account holds */
  amount: bigint;
  /** Authority that can transfer tokens from the account */
  delegate: PublicKey | null;
  /** Number of tokens the delegate is authorized to transfer */
  delegatedAmount: bigint;
  /** True if the account is initialized */
  isInitialized: boolean;
  /** True if the account is frozen */
  isFrozen: boolean;
  /** True if the account is a native token account */
  isNative: boolean;
  /**
   * If the account is a native token account, it must be rent-exempt. The rent-exempt reserve is the amount that must
   * remain in the balance until the account is closed.
   */
  rentExemptReserve: bigint | null;
  /** Optional authority to close the account */
  closeAuthority: PublicKey | null;
  tlvData: Buffer;
}
enum AccountType {
  Uninitialized,
  Mint,
  Account,
}
enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}
interface RawAccount {
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegateOption: 1 | 0;
  delegate: PublicKey;
  state: AccountState;
  isNativeOption: 1 | 0;
  isNative: bigint;
  delegatedAmount: bigint;
  closeAuthorityOption: 1 | 0;
  closeAuthority: PublicKey;
}
interface BlockhashAndFeeCalculator {
  blockhash: Blockhash;
  feeCalculator: FeeCalculator;
}
// @FIXME: replace with @solana/spl-token

// declare type CreatorArgs = {
//   address: StringPublicKey;
//   verified: boolean;
//   share: number;
// };
//  class Creator {
//   address: StringPublicKey;
//   verified: boolean;
//   share: number;

//   constructor(args: {
//     address: StringPublicKey;
//     verified: boolean;
//     share: number;
//   }) {
//     this.address = args.address;
//     this.verified = args.verified;
//     this.share = args.share;
//   }
// }
//  class Data {
//   name: string;
//   symbol: string;
//   uri: string;
//   sellerFeeBasisPoints: number;
//   creators: Creator[] | null;
//   constructor(args: { 
//     name: string;
//     symbol: string;
//     uri: string;
//     sellerFeeBasisPoints: number;
//     creators: Creator[] | null;
//   }) {
//     this.name = args.name;
//     this.symbol = args.symbol;
//     this.uri = args.uri;
//     this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
//     this.creators = args.creators;
//   }
// }
// //  declare class Creator extends Borsh.Data<CreatorArgs> {
// //   static readonly SCHEMA: any;
// //   address: StringPublicKey;
// //   verified: boolean;
// //   share: number;
// // }
// declare type Args = {
//   key: StringPublicKey;
//   verified: boolean;
// };
//  declare class Collection extends Borsh.Data<Args> {
//   static readonly SCHEMA: any;
//   key: StringPublicKey;
//   verified: boolean;
//   constructor(args: Args);
// }
// declare type Args2 = {
//   useMethod: UseMethod;
//   total: number;
//   remaining: number;
// };
//  declare class Uses extends Borsh.Data<Args2> {
//   static readonly SCHEMA: any;
//   useMethod: UseMethod;
//   total: number;
//   remaining: number;
//   constructor(args: Args);
// }

//  declare enum UseMethod {
//   Burn = 0,
//   Single = 1,
//   Multiple = 2
// }
// declare type DataV2Args = {
//   name: string;
//   symbol: string;
//   uri: string;
//   sellerFeeBasisPoints: number;
//   creators: Creator[] | null;
//   collection: Collection | null;
//   uses: Uses | null;
// };

//  declare class DataV2 extends Borsh.Data<DataV2Args> {
//     static readonly SCHEMA: any;
//     name: string;
//     symbol: string;
//     uri: string;
//     sellerFeeBasisPoints: number;
//     creators: Creator[] | null;
//     collection: Collection | null;
//     uses: Uses | null;
// }
// declare class CreateMetadataV2Args extends Borsh.Data<{
//   data: DataV2;
//   isMutable: boolean;
// }> {
//   static readonly SCHEMA: any;
//   instruction: number;
//   data: DataV2;
//   isMutable: boolean;
// }


export const Test=()=> {
  const wallet = useWallet();
    const { SystemProgram, Keypair } = web3;
    /* create an account  */
    const baseAccount = Keypair.generate();
    console.log(baseAccount,">>>>>>>>");
    
    const opts = {
      preflightCommitment: "processed"
    }
  
    async function getProvider() {
      /* create the provider and return it to the caller */
      /* network set to local network for now */
      // const network = "http://127.0.0.1:8899";
      const network = " https://api.devnet.solana.com";
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = new  Provider(
        connection, wallet, opts.preflightCommitment,
      );
      return provider;
    }
  //   const [value, setValue] = useState(null);
   
  // console.log(wallet,"??????????????????????");
  // type UseStorageReturnValue = {
  //   getItem: (key: string) => string;
  //   setItem: (key: string, value: string) => boolean;
  //   removeItem: (key: string) => void;
  // };
  //  const useLocalStorage = (): UseStorageReturnValue => {
  //   const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();
  
  //   const getItem = (key: string): string => {
  //     return isBrowser ? window.localStorage[key] : '';
  //   };
  
  //   const setItem = (key: string, value: string): boolean => {
  //     if (isBrowser) {
  //       window.localStorage.setItem(key, value);
  //       return true;
  //     }
  
  //     return false;
  //   };
  
  //   const removeItem = (key: string): void => {
  //     window.localStorage.removeItem(key);
  //   };
  
  //   return {
  //     getItem,
  //     setItem,
  //     removeItem,
  //   };
  // };
  //  enum MetadataKey {
  //   Uninitialized = 0,
  //   MetadataV1 = 4,
  //   EditionV1 = 1,
  //   MasterEditionV1 = 2,
  //   MasterEditionV2 = 6,
  //   EditionMarker = 7,
  // }
  //  const findProgramAddress = async (
  //   seeds: (Buffer | Uint8Array)[],
  //   programId: PublicKey,
  // ) => {
  //   const localStorage = useLocalStorage();
  //   const key =
  //     'pda-' +
  //     seeds.reduce((agg, item) => agg + item.toString('hex'), '') +
  //     programId.toString();
  //   const cached = localStorage.getItem(key);
  //   if (cached) {
  //     const value = JSON.parse(cached);
  
  //     return [value.key, parseInt(value.nonce)] as [string, number];
  //   }
  
  //   const result = await PublicKey.findProgramAddress(seeds, programId);
  
  //   try {
  //     localStorage.setItem(
  //       key,
  //       JSON.stringify({
  //         key: result[0].toBase58(),
  //         nonce: result[1],
  //       }),
  //     );
  //   } catch {
  //     // ignore
  //   }
  
  //   return [result[0].toBase58(), result[1]] as [string, number];
  // };
  //  class MasterEditionV1 {
  //   key: MetadataKey;
  //   supply: BN;
  //   maxSupply?: BN;
  //   /// Can be used to mint tokens that give one-time permission to mint a single limited edition.
  //   printingMint: StringPublicKey;
  //   /// If you don't know how many printing tokens you are going to need, but you do know
  //   /// you are going to need some amount in the future, you can use a token from this mint.
  //   /// Coming back to token metadata with one of these tokens allows you to mint (one time)
  //   /// any number of printing tokens you want. This is used for instance by Auction Manager
  //   /// with participation NFTs, where we dont know how many people will bid and need participation
  //   /// printing tokens to redeem, so we give it ONE of these tokens to use after the auction is over,
  //   /// because when the auction begins we just dont know how many printing tokens we will need,
  //   /// but at the end we will. At the end it then burns this token with token-metadata to
  //   /// get the printing tokens it needs to give to bidders. Each bidder then redeems a printing token
  //   /// to get their limited editions.
  //   oneTimePrintingAuthorizationMint: StringPublicKey;
  
  //   constructor(args: {
  //     key: MetadataKey;
  //     supply: BN;
  //     maxSupply?: BN;
  //     printingMint: StringPublicKey;
  //     oneTimePrintingAuthorizationMint: StringPublicKey;
  //   }) {
  //     this.key = MetadataKey.MasterEditionV1;
  //     this.supply = args.supply;
  //     this.maxSupply = args.maxSupply;
  //     this.printingMint = args.printingMint;
  //     this.oneTimePrintingAuthorizationMint =
  //       args.oneTimePrintingAuthorizationMint;
  //   }
  // }
  // class MintPrintingTokensArgs {
  //   instruction: number = 9;
  //   supply: BN;
  
  //   constructor(args: { supply: BN }) {
  //     this.supply = args.supply;
  //   }
  // }
  //    class MasterEditionV2 {
  //   key: MetadataKey;
  //   supply: BN;
  //   maxSupply?: BN;
  
  //   constructor(args: { key: MetadataKey; supply: BN; maxSupply?: BN }) {
  //     this.key = MetadataKey.MasterEditionV2;
  //     this.supply = args.supply;
  //     this.maxSupply = args.maxSupply;
  //   }
  // }
  //  class Edition {
  //   key: MetadataKey;
  //   /// Points at MasterEdition struct
  //   parent: StringPublicKey;
  //   /// Starting at 0 for master record, this is incremented for each edition minted.
  //   edition: BN;
  
  //   constructor(args: {
  //     key: MetadataKey;
  //     parent: StringPublicKey;
  //     edition: BN;
  //   }) {
  //     this.key = MetadataKey.EditionV1;
  //     this.parent = args.parent;
  //     this.edition = args.edition;
  //   }
  // }
  //  const EDITION_MARKER_BIT_SIZE = 248;

  // class UpdateMetadataArgs {
  //   instruction: number = 1;
  //   data: Data | null;
  //   // Not used by this app, just required for instruction
  //   updateAuthority: StringPublicKey | null;
  //   primarySaleHappened: boolean | null;
  //   constructor(args: {
  //     data?: Data;
  //     updateAuthority?: string;
  //     primarySaleHappened: boolean | null;
  //   }) {
  //     this.data = args.data ? args.data : null;
  //     this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
  //     this.primarySaleHappened = args.primarySaleHappened;
  //   }
  // }
  

  // class CreateMasterEditionArgs {
  //   instruction: number = 10;
  //   maxSupply: BN | null;
  //   constructor(args: { maxSupply: BN | null }) {
  //     this.maxSupply = args.maxSupply;
  //   }
  // }
  // class CreateMetadataArgs {
  //   instruction: number = 0;
  //   data: Data;
  //   isMutable: boolean;
  
  //   constructor(args: { data: Data; isMutable: boolean }) {
  //     this.data = args.data;
  //     this.isMutable = args.isMutable;
  //   }
  // }
  // class EditionMarker {
  //   key: MetadataKey;
  //   ledger: number[];
  
  //   constructor(args: { key: MetadataKey; ledger: number[] }) {
  //     this.key = MetadataKey.EditionMarker;
  //     this.ledger = args.ledger;
  //   }
  
  //   editionTaken(edition: number) {
  //     const editionOffset = edition % EDITION_MARKER_BIT_SIZE;
  //     const indexOffset = Math.floor(editionOffset / 8);
  
  //     if (indexOffset > 30) {
  //       throw Error('bad index for edition');
  //     }
  
  //     const positionInBitsetFromRight = 7 - (editionOffset % 8);
  
  //     const mask = Math.pow(2, positionInBitsetFromRight);
  
  //     const appliedMask = this.ledger[indexOffset] & mask;
  
  //     return appliedMask != 0;
  //   }
  // }
  // class Metadata {
  //   key: MetadataKey;
  //   updateAuthority: StringPublicKey;
  //   mint: StringPublicKey;
  //   data: Data;
  //   primarySaleHappened: boolean;
  //   isMutable: boolean;
  //   editionNonce: number | null;
  //   collection: Collection;
  //   uses: number | null;
  
  //   // set lazy
  //   masterEdition?: StringPublicKey;
  //   edition?: StringPublicKey;
  
  //   constructor(args: {
  //     updateAuthority: StringPublicKey;
  //     mint: StringPublicKey;
  //     data: Data;
  //     primarySaleHappened: boolean;
  //     isMutable: boolean;
  //     editionNonce: number | null;
  //     collection: Collection;
  //     uses: number | null;
  //   }) {
  //     this.key = MetadataKey.MetadataV1;
  //     this.updateAuthority = args.updateAuthority;
  //     this.mint = args.mint;
  //     this.data = args.data;
  //     this.primarySaleHappened = args.primarySaleHappened;
  //     this.isMutable = args.isMutable;
  //     this.editionNonce = args.editionNonce ?? null;
  //     this.collection = args.collection ?? null;
  //     this.uses = args.uses ?? null;
  //   }
  
  //   public async init() {
  //     //const metadata = toPublicKey(programIds().metadata);
  //     /*
  //     This nonce stuff doesnt work - we are doing something wrong here. TODO fix.
  //     if (this.editionNonce !== null) {
  //       this.edition = (
  //         await PublicKey.createProgramAddress(
  //           [
  //             Buffer.from(METADATA_PREFIX),
  //             metadata.toBuffer(),
  //             toPublicKey(this.mint).toBuffer(),
  //             new Uint8Array([this.editionNonce || 0]),
  //           ],
  //           metadata,
  //         )
  //       ).toBase58();
  //     } else {*/
  //     this.edition = await getEdition(this.mint);
  //     //}
  //     this.masterEdition = this.edition;
  //   }
  // }
  //  const METADATA_SCHEMA = new Map<any, any>([
  //   [
  //     CreateMetadataArgs,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['instruction', 'u8'],
  //         ['data', Data],
  //         ['isMutable', 'u8'], // bool
  //       ],
  //     },
  //   ],
  //   [
  //     UpdateMetadataArgs,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['instruction', 'u8'],
  //         ['data', { kind: 'option', type: Data }],
  //         ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
  //         ['primarySaleHappened', { kind: 'option', type: 'u8' }],
  //       ],
  //     },
  //   ],
  
  //   [
  //     CreateMasterEditionArgs,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['instruction', 'u8'],
  //         ['maxSupply', { kind: 'option', type: 'u64' }],
  //       ],
  //     },
  //   ],
  //   [
  //     MintPrintingTokensArgs,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['instruction', 'u8'],
  //         ['supply', 'u64'],
  //       ],
  //     },
  //   ],
  //   [
  //     MasterEditionV1,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['key', 'u8'],
  //         ['supply', 'u64'],
  //         ['maxSupply', { kind: 'option', type: 'u64' }],
  //         ['printingMint', 'pubkeyAsString'],
  //         ['oneTimePrintingAuthorizationMint', 'pubkeyAsString'],
  //       ],
  //     },
  //   ],
  //   [
  //     MasterEditionV2,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['key', 'u8'],
  //         ['supply', 'u64'],
  //         ['maxSupply', { kind: 'option', type: 'u64' }],
  //       ],
  //     },
  //   ],
  //   [
  //     Edition,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['key', 'u8'],
  //         ['parent', 'pubkeyAsString'],
  //         ['edition', 'u64'],
  //       ],
  //     },
  //   ],
  //   [
  //     Data,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['name', 'string'],
  //         ['symbol', 'string'],
  //         ['uri', 'string'],
  //         ['sellerFeeBasisPoints', 'u16'],
  //         ['creators', { kind: 'option', type: [Creator] }],
  //       ],
  //     },
  //   ],
  //   [
  //     Creator,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['address', 'pubkeyAsString'],
  //         ['verified', 'u8'],
  //         ['share', 'u8'],
  //       ],
  //     },
  //   ],
  //   [
  //     Metadata,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['key', 'u8'],
  //         ['updateAuthority', 'pubkeyAsString'],
  //         ['mint', 'pubkeyAsString'],
  //         ['data', Data],
  //         ['primarySaleHappened', 'u8'], // bool
  //         ['isMutable', 'u8'], // bool
  //         ['editionNonce', { kind: 'option', type: 'u8' }],
  //       ],
  //     },
  //   ],
  //   [
  //     EditionMarker,
  //     {
  //       kind: 'struct',
  //       fields: [
  //         ['key', 'u8'],
  //         ['ledger', [31]],
  //       ],
  //     },
  //   ],
  // ]);


  //  async function getEdition(
  //   tokenMint: StringPublicKey,
  // ): Promise<StringPublicKey> {
  //   // const PROGRAM_IDS = programIds();
  
  //   return (
  //     await findProgramAddress(
  //       [
  //         Buffer.from("metadata"),
  //         new PublicKey("Ahkvt9psv8sKJiqyMYXDP82ggNCY2zdHcKcKC9JzGtkV").toBuffer(),
  //         new PublicKey(tokenMint).toBuffer(),
  //         Buffer.from("edition"),
  //       ],
  //       new PublicKey("Ahkvt9psv8sKJiqyMYXDP82ggNCY2zdHcKcKC9JzGtkV")
  //     )
  //   )[0];
  // }

///////---------------------------------------------------------------------------------
// const addDataV2 =async()=>{



  
//   let res = await deposit()

// }



// const deposit =async( )=>{


//   // console.log(data);
  
// //  let data: DataV2;
// let data : DataV2= {
//   symbol: "+++",
//   name: "amartej ",
//   uri: "///////////////",
//   sellerFeeBasisPoints: 99,
//   creators: [{
//     "address":"2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m",
//     "verified":true,
//     "share":100
//     }],
//   collection: null,
//   uses:null,
// }
// console.log(data);

// console.log('XXXXXXXXX');


//  let updateAuthority: PublicKey;
//  let mintKey: PublicKey;
//  let mintAuthorityKey: PublicKey;
// //  let instructions: TransactionInstruction[];
//  let payer: PublicKey;
//     mintKey=new PublicKey("8rpPU48mjXAZqoRJCep7eqeb8q8LjdQVcT3MbGUMMMkT")
  
//     const metadataProgramId =   new PublicKey('Ahkvt9psv8sKJiqyMYXDP82ggNCY2zdHcKcKC9JzGtkV');
//     ;

//     const metadataAccount = (
//       await findProgramAddress(
//         [
//           Buffer.from('metadata'),
//         metadataProgramId.toBuffer(),
//           mintKey.toBuffer(),
//         ],
//         metadataProgramId,
//       )
//     )[0];
// console.log(metadataAccount,">>>><<<<<");


//     console.log('=================');
    
//     console.log('Metadata V2', data);
//     console.log (' = = = = = = = = ', METADATA_SCHEMA);
    
//     // const txnData = Buffer.from(
//     //   serialize(
//     //     new Map([
//     //       DataV2.SCHEMA,
//     //       ...METADATA_SCHEMA,
//     //       // ...METADATA_SCHEMA,

//     //       ...CreateMetadataV2Args.SCHEMA,
//     //     ]),
//     //     new CreateMetadataV2Args({ data, isMutable: true }),
//     //   ),
//     // );
  
// console.log('= = = = = = = = = = ');


//     const keys = [
//       {
//         pubkey:new PublicKey(metadataAccount),
//         isSigner: false,
//         isWritable: true,
//       },
//       {
//         pubkey: mintKey,
//         isSigner: false,
//         isWritable: false,
//       },
//       {
//         pubkey: new PublicKey("2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m"),
//         isSigner: true,
//         isWritable: false,
//       },
//       {
//         pubkey: new PublicKey("2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m") ,
//         isSigner: true,
//         isWritable: false,
//       },
//       {
//         pubkey: new PublicKey("2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m"),
//         isSigner: false,
//         isWritable: false,
//       },
//       {
//         pubkey: SystemProgram.programId,
//         isSigner: false,
//         isWritable: false,
//       },
//       {
//         pubkey: SYSVAR_RENT_PUBKEY,
//         isSigner: false,
//         isWritable: false,
//       },
//     ];
//     const instructions: TransactionInstruction[] = [];

//     instructions.push(
//       new TransactionInstruction({
//         keys,
//         programId: metadataProgramId,
//         data: Buffer.alloc(0),
//       }),
//     );
//     await sendAndConfirmTransaction(connection,instructions , [payer]);
//     return metadataAccount;
//   }
  
  
const intialize = async()=>{
  const opts = {
    preflightCommitment: "processed"
}
  async function getProvider() {
    const wallet = useWallet();
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    // const network = "http://127.0.0.1:8899";
    const network = " https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  const provider = await getProvider()

  const network = " https://api.devnet.solana.com";
  // const solConnection = new Connection(network, opts.preflightCommitment);
  let programId = new PublicKey("4Y8PGKfY7q5hxDA17h6UHk5eACo6k9idy1chiHb7HKsp")
      const program = new Program(idl, programId, provider);

console.log(program,"/???????????????????");





}
// async function getProvider() {
//   /* create the provider and return it to the caller */
//   /* network set to local network for now */
//   // const network = "http://127.0.0.1:8899";
//   const network = " https://api.devnet.solana.com";
//   const connection = new Connection(network, opts.preflightCommitment);
//   const provider = new Provider(
//     connection, wallet, opts.preflightCommitment,
//   );
//   return provider;
// }
 type WalletSigner = Pick<
  WalletAdapter,
  'publicKey' | 'signTransaction' | 'signAllTransactions'
>;
const hit =async()=>{
  

  const network = " https://api.devnet.solana.com";
  const connection = new Connection(network, opts.preflightCommitment);
  const provider1 = new Provider(
    connection, wallet, opts.preflightCommitment,
  );
  const provider = provider1
  const programId = new PublicKey("9fnWiZpicj8MNHymzYiKpA9GtdxqKeV5p7AYevp9hzWF");
  const AUCTION_SIGNER_SEEDS = "testhuehuehuetest";

  const vault = web3.Keypair.generate();
  const seller = web3.Keypair.generate();

  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(seller.publicKey, 1000000000),
    "processed"
  );
  
  let mint = await Token.createMint(
    provider.connection,
    seller,
    seller.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID
  );

  let sellerTokenAccount = await mint.createAccount(seller.publicKey);
  let vaultTokenAccount = await mint.createAccount(vault.publicKey);

  let price = new BN(web3.LAMPORTS_PER_SOL*2);

  const [auctionAccount, bump] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("auction"),
      programId.toBuffer(),
      mint.publicKey.toBuffer(),
      Buffer.from(AUCTION_SIGNER_SEEDS),
    ],
    programId
  );


      const program = new Program(idl, programId, provider);
      console.log(program,">>>>>>>");
      
  const tx = await program.methods.createAuction(price, bump).accounts({
    auctionAccount: auctionAccount,
    seller: seller.publicKey,
    mint: mint.publicKey,
    sellerTokenAccount: sellerTokenAccount,
    vaultTokenAccount: vaultTokenAccount,
    systemProgram: web3.SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
  }).signers([seller]).rpc();
  console.log("Your transaction signature", tx);


}
 const
  TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

/** Address of the SPL Token 2022 program */
 const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

/** Address of the SPL Associated Token Account program */
 const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

/** Address of the special mint for wrapped native SOL in spl-token */
 const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');

/** Address of the special mint for wrapped native SOL in spl-token-2022 */
 const NATIVE_MINT_2022 = new PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');
function addSigners(keys: AccountMeta[], ownerOrAuthority: PublicKey, multiSigners: Signer[]): AccountMeta[] {
  if (multiSigners.length) {
      keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
      for (const signer of multiSigners) {
          keys.push({ pubkey: signer.publicKey, isSigner: true, isWritable: false });
      }
  } else {
      keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
  }
  return keys;
}
function createTransferInstruction(
  source: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: number | bigint,
  multiSigners: Signer[] = [],
  programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys = addSigners(
      [
          { pubkey: source, isSigner: false, isWritable: true },
          { pubkey: destination, isSigner: false, isWritable: true },
      ],
      owner,
      multiSigners
  );

  const data = Buffer.alloc(transferInstructionData.span);
  transferInstructionData.encode(
      {
          instruction: TokenInstruction.Transfer,
          amount: BigInt(amount),
      },
      data
  );

  return new TransactionInstruction({ keys, programId, data });
}
interface TransferInstructionData {
  instruction: TokenInstruction.Transfer;
  amount: bigint;
}
const transferInstructionData = struct<TransferInstructionData>([u8('instruction'), u64('amount')]);
function getSigners(signerOrMultisig: Signer | PublicKey, multiSigners: Signer[]): [PublicKey, Signer[]] {
  return signerOrMultisig instanceof PublicKey
      ? [signerOrMultisig, multiSigners]
      : [signerOrMultisig.publicKey, [signerOrMultisig]];
}

 const sendTransactionWithRetry = async (
  connection: Connection,
  wallet: WalletSigner,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  commitment: Commitment = 'singleGossip',
  includesFeePayer: boolean = false,
  block?: BlockhashAndFeeCalculator,
  beforeSend?: () => void,
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  let transaction = new Transaction();
  instructions.forEach(instruction => transaction.add(instruction));
  transaction.recentBlockhash = (
    block || (await connection.getRecentBlockhash(commitment))
  ).blockhash;

  if (includesFeePayer) {
    transaction.setSigners(...signers.map(s => s.publicKey));
  } else {
    transaction.setSigners(
      // fee payed by the wallet owner
      wallet.publicKey,
      ...signers.map(s => s.publicKey),
    );
  }

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  if (!includesFeePayer) {
    transaction = await wallet.signTransaction(transaction);
    console.log(transaction,"transaction");
    
  }

  if (beforeSend) {
    beforeSend();
  }

  // const { txid, slot } = await sendSignedTransaction({
  //   connection,
  //   signedTransaction: transaction,
  // });

  // return { txid, slot };
};

 async function transfer(
  connection: Connection,
  // payer: Signer,
  wallet:WalletSigner,
  source: PublicKey,
  destination: PublicKey,
  owner:  PublicKey,
  amount: number | bigint,
  multiSigners: Signer[] = [],
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_PROGRAM_ID
): Promise<any> {
  const [ownerPublicKey, signers] = getSigners(owner, multiSigners);
console.log(ownerPublicKey.toBase58(),"OWNER PUBLICKEY");
console.log(owner.toBase58() , "??????");

  const transaction = new Transaction().add(
      createTransferInstruction(source, destination, ownerPublicKey, amount, multiSigners, programId)
  );
console.log(transaction,"transaction");

  // return await sendAndConfirmTransaction(connection, transaction, [payer, ...signers], confirmOptions);
  return await sendTransactionWithRetry(connection,wallet,transaction.instructions,[])
}
 async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<PublicKey> {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new TokenOwnerOffCurveError();

  const [address] = await PublicKey.findProgramAddress(
      [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
      associatedTokenProgramId
  );

  return address;
}
 abstract class TokenError extends Error {
  constructor(message?: string) {
      super(message);
  }
}

/** Thrown if an account is not found at the expected address */
 class TokenAccountNotFoundError extends TokenError {
  name = 'TokenAccountNotFoundError';
}

/** Thrown if a program state account is not a valid Account */
 class TokenInvalidAccountError extends TokenError {
  name = 'TokenInvalidAccountError';
}

/** Thrown if a program state account is not owned by the expected token program */
 class TokenInvalidAccountOwnerError extends TokenError {
  name = 'TokenInvalidAccountOwnerError';
}

/** Thrown if the byte length of an program state account doesn't match the expected size */
 class TokenInvalidAccountSizeError extends TokenError {
  name = 'TokenInvalidAccountSizeError';
}
class WalletNotConnectedError extends TokenError {
  name = 'WalletNotConnectedError';
}


/** Thrown if the mint of a token account doesn't match the expected mint */
 class TokenInvalidMintError extends TokenError {
  name = 'TokenInvalidMintError';
}

/** Thrown if the owner of a token account doesn't match the expected owner */
 class TokenInvalidOwnerError extends TokenError {
  name = 'TokenInvalidOwnerError';
}

/** Thrown if the owner of a token account is a PDA (Program Derived Address) */
 class TokenOwnerOffCurveError extends TokenError {
  name = 'TokenOwnerOffCurveError';
}

/** Thrown if an instruction's program is invalid */
 class TokenInvalidInstructionProgramError extends TokenError {
  name = 'TokenInvalidInstructionProgramError';
}

/** Thrown if an instruction's keys are invalid */
 class TokenInvalidInstructionKeysError extends TokenError {
  name = 'TokenInvalidInstructionKeysError';
}

/** Thrown if an instruction's data is invalid */
 class TokenInvalidInstructionDataError extends TokenError {
  name = 'TokenInvalidInstructionDataError';
}

/** Thrown if an instruction's type is invalid */
 class TokenInvalidInstructionTypeError extends TokenError {
  name = 'TokenInvalidInstructionTypeError';
} const AccountLayout = struct<RawAccount>([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority'),
]);

 const ACCOUNT_TYPE_SIZE = 1;
const ACCOUNT_SIZE = AccountLayout.span;
// function unpackAccount(info: AccountInfo<Buffer> | null, address: PublicKey, programId: PublicKey) {
//   if (!info) throw new TokenAccountNotFoundError();
//   if (!info.owner.equals(programId)) throw new TokenInvalidAccountOwnerError();
//   if (info.data.length < ACCOUNT_SIZE) throw new TokenInvalidAccountSizeError();

//   const rawAccount = AccountLayout.decode(info.data.slice(0, ACCOUNT_SIZE));
//   let tlvData = Buffer.alloc(0);
//   if (info.data.length > ACCOUNT_SIZE) {
//       if (info.data.length === MULTISIG_SIZE) throw new TokenInvalidAccountSizeError();
//       if (info.data[ACCOUNT_SIZE] != AccountType.Account) throw new TokenInvalidAccountError();
//       tlvData = info.data.slice(ACCOUNT_SIZE + ACCOUNT_TYPE_SIZE);
//   }

//   return {
//       address,
//       mint: rawAccount.mint,
//       owner: rawAccount.owner,
//       amount: rawAccount.amount,
//       delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
//       delegatedAmount: rawAccount.delegatedAmount,
//       isInitialized: rawAccount.state !== AccountState.Uninitialized,
//       isFrozen: rawAccount.state === AccountState.Frozen,
//       isNative: !!rawAccount.isNativeOption,
//       rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
//       closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
//       tlvData,
//   };
// }
function unpackAccount(info: AccountInfo<Buffer> | null, address: PublicKey, programId: PublicKey) {
  if (!info) throw new TokenAccountNotFoundError();
  if (!info.owner.equals(programId)) throw new TokenInvalidAccountOwnerError();
  if (info.data.length < ACCOUNT_SIZE) throw new TokenInvalidAccountSizeError();

  const rawAccount = AccountLayout.decode(info.data.slice(0, ACCOUNT_SIZE));
  let tlvData = Buffer.alloc(0);
  if (info.data.length > ACCOUNT_SIZE) {
      if (info.data.length === MULTISIG_SIZE) throw new TokenInvalidAccountSizeError();
      if (info.data[ACCOUNT_SIZE] != AccountType.Account) throw new TokenInvalidAccountError();
      tlvData = info.data.slice(ACCOUNT_SIZE + ACCOUNT_TYPE_SIZE);
  }

  return {
      address,
      mint: rawAccount.mint,
      owner: rawAccount.owner,
      amount: rawAccount.amount,
      delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
      delegatedAmount: rawAccount.delegatedAmount,
      isInitialized: rawAccount.state !== AccountState.Uninitialized,
      isFrozen: rawAccount.state === AccountState.Frozen,
      isNative: !!rawAccount.isNativeOption,
      rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
      closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
      tlvData,
  };
}

async function getAccount(
  connection: Connection,
  address: PublicKey,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID
): Promise<Account1> {
  const info = await connection.getAccountInfo(address, commitment);
  return unpackAccount(info, address, programId);
}
function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys = [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedToken, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
      keys,
      programId: associatedTokenProgramId,
      data: Buffer.alloc(0),
  });
}
async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: Signer,
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<Account1> {
  const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      allowOwnerOffCurve,
      programId,
      associatedTokenProgramId
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account: Account1;
  try {
      account = await getAccount(connection, associatedToken, commitment, programId);
  } catch (error: unknown) {
      // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
      // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
      // TokenInvalidAccountOwnerError in this code path.
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
          // As this isn't atomic, it's possible others can create associated accounts meanwhile.
          try {
              const transaction = new Transaction().add(
                  createAssociatedTokenAccountInstruction(
                      payer.publicKey,
                      associatedToken,
                      owner,
                      mint,
                      programId,
                      associatedTokenProgramId
                  )
              );

              await sendAndConfirmTransaction(connection, transaction, [payer], confirmOptions);
          } catch (error: unknown) {
              // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
              // instruction error if the associated account exists already.
          }

          // Now this should always succeed
          account = await getAccount(connection, associatedToken, commitment, programId);
      } else {
          throw error;
      }
  }

  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

  return account;
}
const transferhit =async()=>{

 
      // Connect to cluster
      const connection = new Connection( "https://api.devnet.solana.com", 'confirmed');
  
      // Generate a new wallet keypair and airdrop SOL
      const fromWallet = Keypair.generate();
      const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
  
      // Wait for airdrop confirmation
      await connection.confirmTransaction(fromAirdropSignature);
  
      // Generate a new wallet to receive newly minted token
      const toWallet = Keypair.generate();
      const updateAuthorityKeypair = Keypair.fromSecretKey(
        new Uint8Array([87,26,94,8,192,222,37,250,45,244,154,222,236,11,214,142,84,97,14,110,101,216,172,5,24,62,251,111,134,69,179,150,2,253,165,141,158,80,5,245,78,92,197,186,120,175,88,54,191,227,114,247,69,228,181,213,52,133,77,62,140,204,189,43]),
      );
      console.log(updateAuthorityKeypair.publicKey.toBase58(),"LLLLLLL  WALLET ID");
      
      // Create new token mint
      // const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
  
      // Get the token account of the fromWallet address, and if it does not exist, create it
  let   mint = new PublicKey("GKp2vaHXUfutKXQtnfXREfigPpJa2UKPTNnPt1H3fw9s")
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          updateAuthorityKeypair,
          mint,
          updateAuthorityKeypair.publicKey
      );
  
      console.log(fromTokenAccount.address.toBase58());
      
      // Get the token account of the toWallet address, and if it does not exist, create it
      //2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m
     let send = new PublicKey("2fHCnUpEB9NSWFwmbWHzTxpJYAvNAVbsMbTcMcWhwo8m")
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, updateAuthorityKeypair, mint, send);
  
      // Mint 1 new token to the "fromTokenAccount" account we just created
      // let signature = await mintTo(
      //     connection,
      //     fromWallet,
      //     mint,
      //     fromTokenAccount.address,
      //     fromWallet.publicKey,
      //     1000000000,
      //     []
      // );
      // console.log('mint tx:', signature);
  
      // Transfer the new token to the "toTokenAccount" we just created


     let  signature = await transfer(
          connection,
          wallet,
          fromTokenAccount.address,
          toTokenAccount.address,
          wallet?.publicKey!,
          1,
        
      );
      console.log('transfer tx:', signature);
  

}






    if (!wallet.connected) {
      /* If the user's wallet is not connected, display connect wallet button. */
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
          <WalletMultiButton />
        </div>
      )
    } else {
      return (
        <div className="App">
          <div> 
        
  
            <><Button onClick={intialize} > intialize</Button></>
            {/* <><Button onClick={updateMetadataV1} > update</Button></> */}
            
            <Button onClick={transferhit} > nft transfer</Button>

            
  
          </div>
        </div>
      );
    }
  
  
  
  }


  import * as bs58 from "bs58";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
//  const updateMetadataV1 = async () => {
//   let { metadata : {Metadata, UpdateMetadata, MetadataDataData, Creator} } = programs;

//   const opts = {
//     preflightCommitment: "processed"
//   }
//   const network = " https://api.devnet.solana.com";
//   const solConnection = new Connection(network, opts.preflightCommitment);
//   // let signer = loadWalletKey(keyfile);
//   const signer =Keypair.fromSecretKey(
//     bs58.decode("4tuQjd1M2c5pB3P3u8qLyadm6ZPAVGtjcAbEya1ucoGfXtQoEf2JaKCAtLvFkJYdBUixXRg8HFywDAJtnT9MkQpq")
//   );
//   let nftMintAccount = new PublicKey("FEb4dgaS4K48SvZqifkL9aWCSShGp4Tw46vhKpLdV1kP");
//   let metadataAccount = await Metadata.getPDA(nftMintAccount);
//   console.log("metadataAccount",metadataAccount.toBase58());
  
//   const metadat = await Metadata.load(solConnection, metadataAccount);
//   let newUri = "https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4"
//   ;
//   if (metadat.data.data.creators != null) { 
//     const creators = metadat.data.data.creators.map(
//       (el) =>
//           new Creator({
//               ...el,
//           }),
//     );
  
//     let newMetadataData = new MetadataDataData({
//       name: "new ",
//       symbol: "<><><>",
//       uri: newUri,
//       creators: [...creators],
//       sellerFeeBasisPoints: 10,
//     })
// console.log("newMetadataData",newMetadataData);

//     const updateTx = new UpdateMetadata(
//       { feePayer: signer.publicKey },
//       {
//         metadata: metadataAccount,
//         updateAuthority: signer.publicKey,
//         metadataData: newMetadataData,
//         newUpdateAuthority: signer.publicKey,
//         primarySaleHappened:true,
//       },
//     );
//     let result = await sendAndConfirmTransaction(solConnection, updateTx, [signer]);
//     console.log("result =", result);
//   // }
//     }
//     }






// import { actions, Wallet } from '@metaplex/js';
// import { PublicKey } from '@solana/web3.js';
// import useCluster from '@/composables/cluster';

// const { getConnection } = useCluster();

// export async function NFTUpdate(
//   wallet: Wallet,
//   // editionMint: PublicKey,
//   // newMetadataData?: any,
//   newUpdateAuthority?: PublicKey,
//   primarySaleHappened?: boolean
// ) {
//   // console.log(wallet ,editionMint.toBase58() ,">>>>>>>>>>>>WALLET");
//   debugger
//   let { metadata : {Metadata, UpdateMetadata, MetadataDataData, Creator} } = programs;

//   const connection = getConnection();



//   let editionMint:PublicKey = new PublicKey("FEb4dgaS4K48SvZqifkL9aWCSShGp4Tw46vhKpLdV1kP");
//   let metadataAccount = await Metadata.getPDA(editionMint);
//   console.log("metadataAccount>>>>>>",metadataAccount.toBase58());
  
//   const metadat = await Metadata.load(connection, metadataAccount);
//   console.log(metadat,"................");
  
//   let newUri = "https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4"
//   ;
//   // if (metadat.data.data.creators != null) {
//     const creators:any = metadat?.data?.data?.creators?.map(
//       (el) =>
//           new Creator({
//               ...el,
//           }),
//     );
  
//     let newMetadataData:any = new MetadataDataData({
//       name: "new 111",
//       symbol: "<><><>",
//       uri: newUri,
//       creators: [...creators],
//       sellerFeeBasisPoints: 10,
//     })
//   const txId = await actions.updateMetadata({
//     connection,
//     wallet,
//     editionMint,
//     newMetadataData,
//     newUpdateAuthority,
//     primarySaleHappened,
//   });
//   console.log('Updated NFT:', txId);
//   return txId;


// }

  