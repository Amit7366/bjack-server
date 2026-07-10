import { Router } from 'express';
import { UserRoutes } from '../User/user.route';
import { AdminRoutes } from '../Admin/admin.route';
import { AuthRoutes } from '../Auth/auth.route';
import { NormalUserRoutes } from '../NormalUser/normalUser.route';
import { TransactionRoutes } from '../Transaction/transaction.route';
import { UserOfferRoutes } from '../UserOffer/userOffer.route';
import { TurnoverRoutes } from '../Turnover/turnover.route';
import { MessageRoutes } from '../Message/message.route';
import { ChatRoomRoutes } from '../ChatRoom/chatRoom.route';
import { WeeklyRewardRoutes } from '../WeeklyReward/routes/weeklyReward.routes';
import { GameListRoutes } from '../GameList/gameList.route';
import { HomeGamesRoutes } from '../HomeGames/homeGames.route';
import { ExclusiveGamesRoutes } from '../ExclusiveGames/exclusiveGames.route';
import { UserWalletRoutes } from '../UserWallet/userWallet.route';
import { TeleSalesLeadsRoutes } from '../../teleSalesLeads/teleSalesLeads.route';
import { BetTxnRoutes } from '../Bet/betTxn.routes';
import { gametxnrecordsRoute } from '../GameTxnRecords/routes/gametxn.routes';
import { callbackRoute } from '../Bet/callback.route';
import { SpinHistoryRoutes } from '../SpinHistory/spin.route';
import { RecycleRoutes } from '../Recycle/recycle.route';
import { RecycleAssignRoutes } from '../Recycle/recycle.assign.route';
import { NoDepositBalanceRoutes } from '../NoDepositBalance/noDepositBalance.route';
import { MyFavouriteCustomerRoutes } from '../MyFavouriteCustomers/myFavouriteCustomer.routes';
import { PromotionRoutes } from '../Promotion/promotion.route';
import ReferralRoutes from '../Referral/referral.routes';
import { RewardOfferRoutes } from '../RewardOffer/rewardOffer.route';
import { SignInRewardRoutes } from '../SignInReward/signInReward.route';
import { GameEligibilityRoutes } from '../GameEligibility/gameEligibility.route';
import { KycRoutes } from '../Kyc/kyc.route';
import { DepositPaymentAccountRoutes } from '../DepositPaymentAccount/depositPaymentAccount.route';
import { RebateRoutes } from '../Rebate/rebate.route';
import { ProfitLossRoutes } from '../ProfitLoss/profitLoss.route';
import { SuggestionRoutes } from '../MemberSuggestion/suggestion.route';
import { AdvertiserRoutes } from '../Advertiser/advertiser.route';
import { RescueFundRoutes } from '../RescueFund/rescueFund.route';
import { TemuTicketRoutes } from '../TemuTicket/temuTicket.route';
import { MissionRoutes } from '../Mission/mission.route';
import { PasswordResetRequestRoutes } from '../PasswordResetRequest/passwordResetRequest.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/normalUsers', route: NormalUserRoutes },
  { path: '/admins', route: AdminRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/userOffer', route: UserOfferRoutes },
  { path: '/transaction', route: TransactionRoutes },
  { path: '/turnover', route: TurnoverRoutes },
  { path: '/messages', route: MessageRoutes },
  { path: '/chatRooms', route: ChatRoomRoutes },
  { path: '/bet-txns', route: BetTxnRoutes },
  { path: '/gameRecords-txns', route: gametxnrecordsRoute },
  { path: '/allgames', route: GameListRoutes },
  { path: '/home-games', route: HomeGamesRoutes },
  { path: '/exclusive-games', route: ExclusiveGamesRoutes },
  { path: '/wallets', route: UserWalletRoutes },
  { path: '/weeklyReward', route: WeeklyRewardRoutes },
  { path: '/tele', route: TeleSalesLeadsRoutes },
  { path: '/callback', route: callbackRoute },
  { path: '/spin', route: SpinHistoryRoutes },
  { path: '/recycle', route: RecycleRoutes },
  { path: '/RecycleAssign', route: RecycleAssignRoutes },
  { path: '/no-deposit-balance', route: NoDepositBalanceRoutes },
  { path: '/my-favourite-customers', route: MyFavouriteCustomerRoutes },
  { path: '/promotions', route: PromotionRoutes },
  { path: '/referral', route: ReferralRoutes },
  { path: '/sign-in-reward', route: SignInRewardRoutes },
  { path: '/reward-offers', route: RewardOfferRoutes },
  { path: '/games/eligibility', route: GameEligibilityRoutes },
  { path: '/kyc', route: KycRoutes },
  { path: '/deposit-payment-accounts', route: DepositPaymentAccountRoutes },
  { path: '/rebate', route: RebateRoutes },
  { path: '/profit-loss', route: ProfitLossRoutes },
  { path: '/suggestions', route: SuggestionRoutes },
  { path: '/advertisers', route: AdvertiserRoutes },
  { path: '/rescue-fund', route: RescueFundRoutes },
  { path: '/temu-ticket', route: TemuTicketRoutes },
  { path: '/missions', route: MissionRoutes },
  { path: '/password-reset-requests', route: PasswordResetRequestRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
