use anchor_lang::{prelude::*, solana_program::example_mocks::solana_transaction};

use crate::AiModel;

#[derive(Accounts)]
#[instruction(name:String)]
pub struct RegisterAiModel<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        init,
        payer=signer,
        space=8+AiModel::INIT_SPACE,
        seeds=[b"ai",name.as_bytes(),signer.key().as_ref()],
        bump
    )]
    pub ai_model:Account<'info,AiModel>,
    pub system_program:Program<'info,System>
}

impl <'info>RegisterAiModel<'info> {
    pub fn register_ai_model(&mut self,id:i64,royalty_percentage:u16,api_endpoint:String,description:String,name:String)->Result<()>{
        self.ai_model.set_inner(AiModel { id, owner: self.signer.key(), royalty_percentage, is_active: true, created_at:Clock::get()?.unix_timestamp,Dismantled_at:None  ,api_endpoint,description,name});
        Ok(())
    }
}