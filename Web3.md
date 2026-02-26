# Implementing Web3 Authentication

This plan outlines the steps to implement Web3 wallet-based authentication as requested in [web3.md](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/web3.md), allowing users to log in using their crypto wallets (e.g., MetaMask).

## User Review Required
> [!IMPORTANT]
> **Supabase Configuration:** The backend currently does not have a Supabase connection set up. The implementation will include the code for a Supabase client, but you will need to provide the `SUPABASE_URL` and `SUPABASE_KEY` in your backend's `.env` file for it to work. We will also need to add a `wallet_address` column to your `users` table or create it if it doesn't exist.
> 
> **Testing:** Testing Web3 authentication requires a browser extension like MetaMask installed.

## Proposed Changes

### Backend Dependencies
#### [MODIFY] [backend/requirements.txt](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/backend/requirements.txt)
Add `web3`, `eth-account`, `supabase`, and `pyjwt` for handling Ethereum signatures, database calls, and token generation.

### Backend Application
#### [MODIFY] [backend/app/config.py](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/backend/app/config.py)
Add settings for `supabase_url`, `supabase_key`, and a `jwt_secret`.
#### [NEW] `backend/app/routes/auth.py`
Create the `/auth/nonce` and `/auth/verify` endpoints.
#### [MODIFY] `backend/app/main.py` (or wherever routes are registered)
Register the new auth router.

### Frontend Application
#### [MODIFY] [frontend/package.json](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/frontend/package.json)
Install `wagmi`, `viem`, and `@tanstack/react-query`.
#### [MODIFY] [frontend/src/main.jsx](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/frontend/src/main.jsx)
Wrap the application in Wagmi and React Query providers to enable wallet hooks.
#### [NEW] `frontend/src/components/Web3LoginButton.jsx`
Create a component that uses Wagmi's `useConnect`, `useSignMessage`, and makes API calls to the backend to perform the handshake.
#### [MODIFY] [frontend/src/pages/Login.jsx](file:///c:/Users/ANKIT/Gift_hackathon/Gift-Hackathon/frontend/src/pages/Login.jsx)
Add the `Web3LoginButton` to the existing login screen.

## Verification Plan

### Manual Verification
1. Start the frontend and backend servers.
2. Open the application in a browser with a Web3 wallet (like MetaMask) installed.
3. Navigate to the Login page.
4. Click the "Connect Wallet" button.
5. Approve the connection in MetaMask.
6. MetaMask should prompt you to sign a message containing a nonce.
7. Sign the message.
8. The backend should verify the signature, and the frontend should redirect to the Dashboard, indicating a successful login.

Because Web3 interactions require a browser extension wallet to sign transactions properly, this feature must be manually tested by a user, or simulated in an E2E test with something like Synpress (which is outside this scope).
