export interface ProviderRecord {
  serial_number: string;
  currency_code: string;
  game_uid: string;
  member_account: string;         // like "hfb20f_sbm47457_1fac6d"
  win_amount: string | number;
  bet_amount: string | number;
  timestamp: string;              // "YYYY-MM-DD HH:mm:ss" (UTC)
  game_round?: string;
  agency_uid?: string;
}

export interface IngestBody {
  records?: ProviderRecord[];
  /** txserver.site/testIndex.php — top-level `data` array */
  data?: ProviderRecord[] | { payload?: { records?: ProviderRecord[] } };
  payload?: { records?: ProviderRecord[] };
}
