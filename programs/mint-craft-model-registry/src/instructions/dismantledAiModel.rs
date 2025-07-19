use anchor_lang::{prelude::*, solana_program::example_mocks::solana_rpc_client_api::client_error::ClientError};

use crate::AiModel;

#[derive(Accounts)]
#[instruction(name:String)]
pub struct DismantledAiModel<'info>{
    pub signer:Signer<'info>,
    #[account(
        mut,
        seeds=[b"ai",name.as_bytes(),signer.key().as_ref()],
        bump
    )]
    pub AiModel:Account<'info,AiModel>,
    pub system_program:Program<'info,System>,
}

impl<'info>DismantledAiModel<'info>{
    pub fn dismantle_ai_model(&mut self)->Result<()>{
        self.AiModel.is_active=false;
        self.AiModel.Dismantled_at=Some(Clock::get()?.unix_timestamp);
        Ok(())
    }
}