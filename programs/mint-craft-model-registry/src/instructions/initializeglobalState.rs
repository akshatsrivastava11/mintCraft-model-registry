use anchor_lang::prelude::*;

use crate::GlobalState;

#[derive(Accounts)]
pub struct InitializeGlobalState<'info>{
    #[account(mut)]
    pub authority:Signer<'info>,
    #[account(
        init,
        payer=authority,
        space=8+GlobalState::INIT_SPACE,
        seeds=[b"globalAiState"],
        bump
    )]
    pub global_state:Account<'info,GlobalState>,
    pub system_program:Program<'info,System>
}
impl<'info>InitializeGlobalState<'info>{
    pub fn initialize(&mut self,bumps:InitializeGlobalStateBumps)->Result<()>{
        self.global_state.set_inner(GlobalState { 
            authority: self.authority.key(),
             total_models:0, 
             platform_total_fees:300,
              bump:bumps.global_state
             });
        Ok(())
    }
}