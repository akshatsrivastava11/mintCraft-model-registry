pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("3WbdiK5An2Q5GfqQAZQ2qstSukqqMiiZy8tfydS3TvHf");

#[program]
pub mod mint_craft_model_registry {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
