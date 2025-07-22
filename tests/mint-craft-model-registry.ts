
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintCraftModelRegistry } from "../target/types/mint_craft_model_registry";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";

describe("mint-craft-model-registry", () => {
  // Configure the client to use the local cluster.
  const provider=anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.mintCraftModelRegistry as Program<MintCraftModelRegistry>;
  let authority=Keypair.generate();
  let user=Keypair.generate();
  let userConfig:PublicKey
  let connection= provider.connection
  let global_state:PublicKey;
  let aiModel:PublicKey
  //globalAiState
  before(async()=>{
    //airdropping to the authority
    await provider.connection.confirmTransaction(
    await connection.requestAirdrop(authority.publicKey,2*LAMPORTS_PER_SOL)
    )
    await provider.connection.confirmTransaction(
    await connection.requestAirdrop(user.publicKey,2*LAMPORTS_PER_SOL)
    )
    global_state=PublicKey.findProgramAddressSync(
      [Buffer.from("globalAiState")],
      program.programId
    )[0]

    userConfig=PublicKey.findProgramAddressSync(
      [Buffer.from("user"),user.publicKey.toBuffer()],
      program.programId
    )[0]
//b"ai",name.as_bytes(),signer.key().as_ref(),global_state.key().as_ref()],
    aiModel=PublicKey.findProgramAddressSync(
      [Buffer.from("ai"),Buffer.from("Demoapi"),user.publicKey.toBuffer(),global_state.toBuffer()],
      program.programId
    )[0]
  })

  it('initializeglobalState',async()=>{
    await program.methods.initializeGlobalState().accounts({
      authority:authority.publicKey,
      global_state:global_state,
      system_program:SYSTEM_PROGRAM_ID
    }).signers([authority]).rpc()
  })
  it("initializeUser",async()=>{
    await program.methods.initializeUser().accounts({
      user:user.publicKey,
      userConfig:userConfig,
      system_program:SYSTEM_PROGRAM_ID
    }).signers([user]).rpc()
  })
  it("registerAiModel",async()=>{
    await program.methods.registerAiModel(new anchor.BN(1),5,"https://api.endpoints","This is a demo api","Demoapi").accounts({
      signer:user.publicKey,
      ai_model:aiModel,
      global_state:global_state,
      user_config:userConfig,
      system_program:SYSTEM_PROGRAM_ID
    }).signers([user]).rpc()
  })
  it("dismantleAiModel",async()=>{
    await program.methods.dismantleAiModel("Demoapi").accounts(
      {
        signer:user.publicKey,
        ai_model:aiModel,
        global_state:global_state,
        user_config:userConfig,
        system_program:SYSTEM_PROGRAM_ID
      }
    ).signers([user]).rpc()
  })

});

    // #[account(mut)]
    // pub signer:Signer<'info>,
    // #[account(
    //     init,
    //     payer=signer,
    //     space=8+AiModel::INIT_SPACE,
    //     seeds=[b"ai",name.as_bytes(),signer.key().as_ref(),global_state.key().as_ref()],
    //     bump
    // )]
    // pub ai_model:Account<'info,AiModel>,
    // #[account(
    //     seeds=[b"globalAiState"],
    //     bump=global_state.bump  
    // )]
    // pub global_state:Account<'info,GlobalState>,
    // #[account(
    //     mut,
    //     seeds=[b"user",signer.key().as_ref()],
    //     bump
    // )]
    // pub user_config:Account<'info,UserConfig>,
    // pub system_program:Program<'info,System>