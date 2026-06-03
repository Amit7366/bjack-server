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
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
