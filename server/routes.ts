
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === SEED DATA ===
  // We seed this on every restart if empty, to ensure the app has the 14 queries
  const existing = await storage.getAllQueries();
  if (existing.length === 0) {
    await storage.createQueries([
      {
        slug: "swap-failed-unpredictable-gas-limit",
        rawQuery: "Swap failed: cannot estimate gas; transaction may fail or may require manual gas limit",
        intent: "Fix gas estimation error",
        pageType: "error_resolution",
        recommendedActions: ["increase_gas_limit", "check_token_tax"],
        problemContext: "This error usually happens when the token has a mechanism (like a tax or anti-bot) that makes gas estimation fail, or the contract is reverting.",
        metaTitle: "Fix Swap Failed: Cannot Estimate Gas Limit (Solution)",
        metaDescription: "Learn how to fix the 'cannot estimate gas' error on Uniswap/PancakeSwap. Step-by-step guide to adjusting gas limits and slippage."
      },
      {
        slug: "unknown-error-json-rpc-slippage",
        rawQuery: "Unknown error: 'Internal JSON-RPC error.' Try increasing your slippage tolerance",
        intent: "Resolve generic RPC error",
        pageType: "error_resolution",
        recommendedActions: ["increase_slippage", "change_rpc_provider"],
        problemContext: "A generic JSON-RPC error often masks a revert due to insufficient slippage, especially on BSC/Polygon.",
        metaTitle: "Internal JSON-RPC Error Fix: Increase Slippage Tolerance",
        metaDescription: "Troubleshoot 'Internal JSON-RPC error' by adjusting slippage tolerance. Interactive tool to simulate the correct settings."
      },
      {
        slug: "execution-reverted-insufficient-output",
        rawQuery: "Transaction cannot succeed due to error: execution reverted: PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT",
        intent: "Fix slippage/price impact error",
        pageType: "error_resolution",
        recommendedActions: ["increase_slippage", "reduce_swap_size"],
        problemContext: "You are trying to swap but the price is moving unfavorably faster than your slippage setting allows.",
        metaTitle: "Fix INSUFFICIENT_OUTPUT_AMOUNT Error on PancakeSwap",
        metaDescription: "Solution for execution reverted: INSUFFICIENT_OUTPUT_AMOUNT. Calculate the correct slippage for your transaction."
      },
      {
        slug: "swap-failed-higher-slippage",
        rawQuery: "Swap failed: try using higher than normal slippage",
        intent: "Adjust slippage for volatile token",
        pageType: "error_resolution",
        recommendedActions: ["set_slippage_auto", "increase_slippage_manual"],
        problemContext: "The token likely has a transaction tax (e.g., 5-10%) that requires higher slippage to cover the fee.",
        metaTitle: "Swap Failed? Try Using Higher Than Normal Slippage",
        metaDescription: "Why your swap failed and how to safely increase slippage tolerance for high-tax tokens."
      },
      {
        slug: "phantom-wallet-swap-failure",
        rawQuery: "Phantom wallet swap failure",
        intent: "Troubleshoot Solana wallet swap",
        pageType: "network_tool",
        recommendedActions: ["retry_transaction", "check_sol_balance"],
        problemContext: "Phantom swap failures are often due to network congestion on Solana or insufficient SOL for rent/fees.",
        metaTitle: "Phantom Wallet Swap Failure: Troubleshooting Guide",
        metaDescription: "Fix failed swaps on Phantom Wallet. Check Solana network status and troubleshoot common errors."
      },
      {
        slug: "web3-python-token-sell-slippage",
        rawQuery: "Web3 Python token sell pancakeswap slippage",
        intent: "Programmatic trading help",
        pageType: "developer_tool",
        recommendedActions: ["generate_code_snippet", "simulate_tx"],
        problemContext: "Setting slippage programmatically in Web3.py requires calculating `amountOutMin` manually.",
        metaTitle: "Web3 Python: Handle PancakeSwap Token Sell Slippage",
        metaDescription: "Code examples for handling slippage when selling tokens on PancakeSwap using Web3.py."
      },
      {
        slug: "failed-transaction-underpriced",
        rawQuery: "Failed Transaction – underpriced / Replacement transaction underpriced",
        intent: "Fix stuck transaction",
        pageType: "error_resolution",
        recommendedActions: ["speed_up_transaction", "cancel_transaction"],
        problemContext: "Your gas price is too low compared to the current network base fee, or you tried to replace a tx with insufficient gas bump.",
        metaTitle: "Fix Failed Transaction Underpriced Error",
        metaDescription: "How to resolve 'replacement transaction underpriced' errors and unstuck your pending transactions."
      },
      {
        slug: "metamask-high-gas-fees",
        rawQuery: "Failed MetaMask Swap Charged me $54 in gas is there anything I can do",
        intent: "Recover/Understand lost gas",
        pageType: "error_resolution",
        recommendedActions: ["check_gas_refund_eligibility", "view_tx_revert_reason"],
        problemContext: "Gas is paid to miners to attempt the transaction. If it fails, the gas is still consumed. It is generally not refundable.",
        metaTitle: "Failed MetaMask Swap Charged High Gas? Can You Refund?",
        metaDescription: "Understanding why failed transactions cost gas and how to prevent losing money on gas fees in the future."
      },
      {
        slug: "evm-revert-token-sale",
        rawQuery: "Transaction reverted by the EVM Pancake swap token sale",
        intent: "Debug contract revert",
        pageType: "error_resolution",
        recommendedActions: ["audit_token", "check_honeypot"],
        problemContext: "EVM revert usually means the smart contract logic forbade the action (e.g., trading disabled, max wallet limit, or honeypot).",
        metaTitle: "Transaction Reverted by EVM on PancakeSwap Token Sale",
        metaDescription: "Debug EVM revert errors during token sales. Check for honeypots or contract restrictions."
      },
      {
        slug: "gatetoken-unsupported-pair-low-liquidity",
        rawQuery: "How can I swap gatetoken (error) unsupported pair, low liquidity",
        intent: "Find liquidity path",
        pageType: "error_resolution",
        recommendedActions: ["find_alternative_route", "bridge_assets"],
        problemContext: "Unsupported pair means there is no direct liquidity pool. You may need to route through another token (e.g., USDT/ETH).",
        metaTitle: "Swap GateToken Error: Unsupported Pair / Low Liquidity",
        metaDescription: "How to swap GateToken when facing unsupported pair or low liquidity errors. Find the right routing path."
      },
      {
        slug: "successful-swap-no-token",
        rawQuery: "Successful swap but didnt received the token in my wallet",
        intent: "Import missing token",
        pageType: "network_tool",
        recommendedActions: ["add_custom_token", "check_explorer"],
        problemContext: "The swap likely worked, but your wallet (MetaMask/Phantom) hasn't imported the token address to display the balance.",
        metaTitle: "Successful Swap But Didn't Receive Token? Fix Here",
        metaDescription: "Don't panic! Here is how to add the custom token address to your wallet to see your funds."
      },
      {
        slug: "pending-swap-not-on-etherscan",
        rawQuery: "Pending swap not appearing on Etherscan",
        intent: "Locate dropped transaction",
        pageType: "network_tool",
        recommendedActions: ["refresh_node", "check_mempool"],
        problemContext: "If it's not on Etherscan, the node might not have broadcasted it, or it was dropped from the mempool.",
        metaTitle: "Pending Swap Not Appearing on Etherscan? Troubleshooting",
        metaDescription: "Why your transaction isn't showing up on Etherscan and what to do about pending swaps."
      },
      {
        slug: "function-selector-not-recognized",
        rawQuery: "Error: Transaction reverted: function selector was not recognized",
        intent: "Fix ABI/Contract mismatch",
        pageType: "developer_tool",
        recommendedActions: ["verify_abi", "check_proxy_contract"],
        problemContext: "You are calling a function that doesn't exist on the contract, or sending data to a proxy without the implementation set.",
        metaTitle: "Error: Transaction Reverted - Function Selector Not Recognized",
        metaDescription: "Developer guide to fixing 'function selector was not recognized' errors in smart contract interactions."
      },
      {
        slug: "transaction-reverted-low-slippage",
        rawQuery: "Transaction reverted due to low slippage",
        intent: "Adjust slippage",
        pageType: "error_resolution",
        recommendedActions: ["calculate_optimal_slippage", "auto_slippage"],
        problemContext: "The price moved beyond your allowed limit during execution.",
        metaTitle: "Transaction Reverted Due to Low Slippage: Fast Fix",
        metaDescription: "Quickly calculate and set the optimal slippage to prevent transaction reverts."
      }
    ]);
  }

  // === ROUTES ===

  app.get(api.queries.list.path, async (req, res) => {
    const all = await storage.getAllQueries();
    res.json(all);
  });

  app.get(api.queries.get.path, async (req, res) => {
    const slug = req.params.slug;
    const query = await storage.getQueryBySlug(slug);
    if (!query) {
      return res.status(404).json({ message: "Query scenario not found" });
    }
    res.json(query);
  });

  app.get(api.market.status.path, (req, res) => {
    // Simulate market data
    const baseFee = Math.floor(Math.random() * 20) + 10; // 10-30 gwei
    res.json({
      gasPrice: `${baseFee} gwei`,
      ethPrice: `$${(2800 + Math.random() * 100).toFixed(2)}`,
      congestion: baseFee > 25 ? "high" : baseFee > 15 ? "medium" : "low",
      blockNumber: 19283700 + Math.floor(Date.now() / 12000),
    });
  });

  app.post(api.simulation.run.path, async (req, res) => {
    const { querySlug, action, slippage } = req.body;
    
    // Simulate outcome based on scenario
    const isSuccess = Math.random() > 0.3; // 70% success rate in simulation
    const gasUsed = Math.floor(Math.random() * 150000) + 21000;
    
    let errorMsg = undefined;
    if (!isSuccess) {
      if (querySlug.includes("slippage")) errorMsg = "INSUFFICIENT_OUTPUT_AMOUNT";
      else if (querySlug.includes("gas")) errorMsg = "OUT_OF_GAS";
      else errorMsg = "EXECUTION_REVERTED";
    }

    const sim = await storage.createSimulation({
      queryId: 1, // simplified association for now, in real app lookup ID from slug
      type: action,
      status: isSuccess ? "success" : "failed",
      simulatedGas: gasUsed.toString(),
      simulatedSlippage: slippage || "0.5%",
      errorMessage: errorMsg,
    });

    res.json({
      success: isSuccess,
      txHash: isSuccess ? "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("") : undefined,
      error: errorMsg,
      gasUsed: gasUsed.toString(),
      simulationLog: `Simulating ${action} for ${querySlug}... \nChecking liquidity... OK\nEstimating Gas... ${gasUsed}\nResult: ${isSuccess ? "Success" : "Revert"}`
    });
  });

  app.get(api.simulation.history.path, async (req, res) => {
    const history = await storage.getSimulations();
    res.json(history);
  });

  return httpServer;
}
