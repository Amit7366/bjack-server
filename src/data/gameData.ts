interface ProviderGame {
    platform: string,
    provider: string;
    games: {
        game_name: string;
        game_code: string;
        game_type: string;
        game_image: string;
    }[];
}
const pgsoft = {
    platform: 'digital',
    provider: 'pgsoft',
    games:
        [
            {
                "game_name": "Mahjong Ways",
                "game_code": "1189baca156e1bbbecc3b26651a63565",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mahjong-Ways_rounded_1024.png"
            },
            {
                "game_name": "Mahjong Ways 2",
                "game_code": "ba2adf72179e1ead9e3dae8f0a7d4c07",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mahjong-Ways2_rounded_1024.png"
            },
            {
                "game_name": "Treasures of Aztec",
                "game_code": "2fa9a84d096d6ff0bab53f81b79876c8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Treasures-of-Aztec_rounded_1024.png"
            },
            {
                "game_name": "Leprechaun Riches",
                "game_code": "fb2a2ac51303c0a0801dbe6a72d936f7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Leprechaun-Riches_rounded_1024.png"
            },
            {
                "game_name": "Lucky Neko",
                "game_code": "e1b4c6b95746d519228744771f15fe4b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Lucky-Neko_icon_1024_rounded.png"
            },
            {
                "game_name": "Captain's Bounty",
                "game_code": "cd29b9906a852ce26b53b6d6d81037d4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Captains-Bounty_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Queen of Bounty",
                "game_code": "83a6890cf84e4c5a6bacf96d5355d472",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Queen-of-Bounty_1024_rounded.png"
            },
            {
                "game_name": "Wild Bandito",
                "game_code": "95fc290bb05c07b5aad1a054eba4dcc4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Bandito_icon_1024_rounded.png"
            },
            {
                "game_name": "Ways of the Qilin",
                "game_code": "fedfca553a97a791a3a41c4f1e3bff58",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ways-of-the-Qilin_icon_1024_rounded.png"
            },
            {
                "game_name": "Dragon Hatch",
                "game_code": "4afef91d3addb9ce5107abaf3342b9a5",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Dragon-Hatch_rounded_1024.png"
            },
            {
                "game_name": "Double Fortune",
                "game_code": "3810e528e0abb8ce1cd7ddc2ece005c0",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Double-Fortune_Icon_Rounded_1024.png"
            },
            {
                "game_name": "The Great Icescape",
                "game_code": "99f07ed2226f37e22570325fc1c078f2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/The-Great-Icescape_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Caishen Wins",
                "game_code": "82a810ba99a5fb3e23fc514afebd6314",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Caishen-Wins_rounded_1024.png"
            },
            {
                "game_name": "Ganesha Fortune",
                "game_code": "c4b57c6dcfac5c8a31b9174523103c8c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ganesha-Fortune_rounded_1024.png"
            },
            {
                "game_name": "Dreams of Macau",
                "game_code": "0ef82ebe6f819619f53b83e218b9452c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Dreams-of-Macau_rounded_1024.png"
            },
            {
                "game_name": "Fortune Ox",
                "game_code": "8db4eb6d781f915eebab2a26133db0e9",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Ox_icon_1024_rounded.png"
            },
            {
                "game_name": "Wild Bounty Showdown",
                "game_code": "c98bb64436826fe9a2c62955ff70cba9",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Bounty-Showdown_1024_rounded.png"
            },
            {
                "game_name": "Prosperity Fortune Tree",
                "game_code": "0da0fda6981138234f03cb665984c07e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Prosperity-Fortune-Tree_rounded_1024.png"
            },
            {
                "game_name": "Diner Delights",
                "game_code": "7e6298970ad1c3c983e495be86833dee",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Diner-Delights_icon_1024_rounded.png"
            },
            {
                "game_name": "Egypt's Book of Mystery",
                "game_code": "1babfc499be7bc670f11695e8668b59d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Egypts-Book-of-Mystery_icon_1024_rounded.png"
            },
            {
                "game_name": "Phoenix Rises",
                "game_code": "21c55c4cd28bb1ebf465fcfaf413477c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Phoenix-Rises_app-icon_rounded_1024.png"
            },
            {
                "game_name": "Wild Fireworks",
                "game_code": "fb8888b2dec33fe9d28996376580b410",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Fireworks_icon_1024_rounded.png"
            },
            {
                "game_name": "Thai River Wonders",
                "game_code": "fcc6918b79eddf49984d4f5f650c8ded",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Thai-River-Wonders_icon_1024_rounded.png"
            },
            {
                "game_name": "Bali Vacation",
                "game_code": "c79544b2cf7a3326c85f6ab5bdf53d25",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Bali-Vacation_icon_1024_rounded.png"
            },
            {
                "game_name": "Crypto Gold",
                "game_code": "b1e11902cecf38023f2916569c32040a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Crypto-Gold_icon_1024_rounded.png"
            },
            {
                "game_name": "Jurassic Kingdom",
                "game_code": "4eef5090166a6889956a630321713366",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Jurassic-Kingdom_icon_1024_rounded.png"
            },
            {
                "game_name": "Cocktail Nights",
                "game_code": "5bea5667515cb7a31f6f07dc3caa13b1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Cocktail-Nights_1024_rounded.png"
            },
            {
                "game_name": "Fortune Tiger",
                "game_code": "9a8482565ce343ad3ea7fc4bc42cb043",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Tiger_app-icon_rounded.png"
            },
            {
                "game_name": "Speed Winner",
                "game_code": "386a9d8e184d9bc7c7aca32a8a5db686",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Speed-Winner_1024_rounded.png"
            },
            {
                "game_name": "Legend of Perseus",
                "game_code": "6e37f6e1b6042c2147866c4d86206979",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Legend-of-Perseus_1024_rounded.png"
            },
            {
                "game_name": "Honey Trap of Diao Chan",
                "game_code": "cd0cc7e653b42133d57145d5505d4e96",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Honey-Trap-of-Diao-Chan_rounded_1024.png"
            },
            {
                "game_name": "Fortune Gods",
                "game_code": "d3aad7ca1486eb3f145e2c43f38b559c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Gods_rounded_1024.png"
            },
            {
                "game_name": "Win Win Won",
                "game_code": "43862cc768882dff441a60b26dcec1c0",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Win-Win-Won_rounded_1024.png"
            },
            {
                "game_name": "Medusa II",
                "game_code": "1c6d773d6a616d74e2573343a5dcecc3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Medusa-II_rounded_1024.png"
            },
            {
                "game_name": "Tree of Fortune",
                "game_code": "e7d7e8396619459db2c178ed72f81049",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Tree-of-Fortune_rounded_1024.png"
            },
            {
                "game_name": "Medusa",
                "game_code": "dcc55631d793ad44be98d21c99f7e361",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Medusa_rounded_1024.png"
            },
            {
                "game_name": "Plushie Frenzy",
                "game_code": "b34c5e632cdc53fc67f1a5eec5758af7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Plushie-Frenzy_rounded_1024.png"
            },
            {
                "game_name": "Gem Saviour",
                "game_code": "9e795df6bdf093a144e714fd35afbb7a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Gem-Saviour_rounded_1024.png"
            },
            {
                "game_name": "Hood vs Wolf",
                "game_code": "222ce90a04a2246eecd5216454f9792f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Hood-vs-Wolf_rounded_1024.png"
            },
            {
                "game_name": "Hotpot",
                "game_code": "2fea77daa52fd607ed0abe816e4dc7c7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Hotpot_rounded_1024.png"
            },
            {
                "game_name": "Dragon Legend",
                "game_code": "b990b58ed9e1aa341b3164f49bcb1517",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Dragon-Legend_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Mr. Hallow-Win",
                "game_code": "12e94577c713a431ef7765394bb9be2f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/MrHallow-Win_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Legend of Hou Yi",
                "game_code": "1ed6fe92243975f73c944342119a1336",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Legend-of-Hou-Yi_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Prosperity Lion",
                "game_code": "1fcb23fa9fac3ca32e20adfe90028de3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Prosperity-Lion_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Hip Hop Panda",
                "game_code": "5fdbd55ac67eea146b93939ee060cd54",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Hip-Hop-Panda_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Santa's Gift Rush",
                "game_code": "864edc20e589a738c632f8a49a2e02a3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Santas-Gift-Rush_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Baccarat Deluxe",
                "game_code": "22c3b8df172b40ac24a7e9c909e0e50e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Baccarat-Deluxe_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Gem Saviour Sword",
                "game_code": "4bbb563e9cf0211a3433beeebe70f35b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Gem-Saviour-Sword_rounded_1024.png"
            },
            {
                "game_name": "Piggy Gold",
                "game_code": "a9d874dd5305212b09845fc88f72e02d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Piggy-Gold_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Symbols of Egypt",
                "game_code": "0c7c636333c3c0807d2da26e1f0c8cd1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Symbols-of-Egypt_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Emperor's Favour",
                "game_code": "12766ca09f503fec11f391199fce5e24",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Emperors-Favour_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Ganesha Gold",
                "game_code": "8dcea650a5a4d96530a77e6df8f61923",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ganesha-Gold_rounded_1024.png"
            },
            {
                "game_name": "Jungle Delight",
                "game_code": "232e8e0c74f9bb16ab676e5ed49d72b4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Jungle-Delight_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Journey to the Wealth",
                "game_code": "139f7ae7151a8bd388511bd8b7ce0c40",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Journey-to-the-Wealth_Icon_Rounded_1024.png"
            },
            {
                "game_name": "Flirting Scholar",
                "game_code": "0c884fde76cbc187f2797c4f76532220",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Flirting-Scholar_rounded_1024.png"
            },
            {
                "game_name": "Ninja vs Samurai",
                "game_code": "2eb712d4bb30e4594032ebf1464618b1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ninja-vs-Samurai_rounded_1024.png"
            },
            {
                "game_name": "Muay Thai Champion",
                "game_code": "82127ece1232c6762c81fedb73c99756",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Muay-Thai-Champion_rounded_1024.png"
            },
            {
                "game_name": "Dragon Tiger Luck",
                "game_code": "3d3dd6e2fd819832528108e0af197c43",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Dragon-Tiger-Luck_rounded_1024.png"
            },
            {
                "game_name": "Fortune Mouse",
                "game_code": "8e5a4dd7da06fb68165d13f8bcd06328",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Mouse_rounded_1024.png"
            },
            {
                "game_name": "Reel Love",
                "game_code": "813138051d990c0c21fb78015b14cbef",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Reel-Love_rounded_1024.png"
            },
            {
                "game_name": "Gem Saviour Conquest",
                "game_code": "07d9e7940f430557447cb19692ae4409",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Gem-Saviour-Conquest_rounded_1024.png"
            },
            {
                "game_name": "Shaolin Soccer",
                "game_code": "da483088a7f719026e93ba95c5547a8c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Shaolin-Soccer_rounded_1024.png"
            },
            {
                "game_name": "Candy Burst",
                "game_code": "27237d7e8d9b183c92fa9f6ab9832edc",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Candy-Burst_rounded_1024.png"
            },
            {
                "game_name": "Bikini Paradise",
                "game_code": "18f7f3fdda3e951989731b7204572a8f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Bikini-Paradise_rounded_1024.png"
            },
            {
                "game_name": "Genie's 3 Wishes",
                "game_code": "16e34863dada5465919b289f83c494a1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Genies-3-Wishes_rounded_1024.png"
            },
            {
                "game_name": "Circus Delight",
                "game_code": "5a11d239f4368b4ec21d31e5979d85cf",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Circus-Delight_icon_1024_rounded.png"
            },
            {
                "game_name": "Secrets of Cleopatra",
                "game_code": "7028ed373d5bffeeb22fa90c4066bd9e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Secrets-of-Cleopatra_icon_1024_rounded.png"
            },
            {
                "game_name": "Vampire's Charm",
                "game_code": "8912f36ea0ca97fc6911fc21b3be6f6a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Vampires-Charm_app-icon_rounded_1024.png"
            },
            {
                "game_name": "Jewels of Prosperity",
                "game_code": "f55a666db274fcf210dd69801ae7e87a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Jewels-of-Prosperity_rounded_1024.png"
            },
            {
                "game_name": "Jack Frost's Winter",
                "game_code": "0a8772ad753cfce2c03c0599ad60c74c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Jack-Frosts-Winter_icon_1024_rounded.png"
            },
            {
                "game_name": "Galactic Gems",
                "game_code": "5d26d9ec03d3bc031e49abd5b0ffbdda",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Galactic-Gems_1024_rounded.png"
            },
            {
                "game_name": "Guardians of Ice and Fire",
                "game_code": "4e2f6b7602035730e0e8ee89675a417c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Guardians-of-Ice-and-Fire_rounded_1024.png"
            },
            {
                "game_name": "Opera Dynasty",
                "game_code": "c9ec6bce856aafad85f7de5405f7b1c3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Opera-Dynasty_icon_1024_rounded.png"
            },
            {
                "game_name": "Majestic Treasures",
                "game_code": "894240c0ef08d5c2e29b231013e1514d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Majestic-Treasures_icon_1024_rounded.png"
            },
            {
                "game_name": "Candy Bonanza",
                "game_code": "bbe2320adc5c506e7e56a2d24d96a252",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Candy-Bonanza-icon_1024_rounded.png"
            },
            {
                "game_name": "Heist Stakes",
                "game_code": "a4a67f1259cabed59e338e30149ceb0f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Heist-Stakes_icon_1024_rounded.png"
            },
            {
                "game_name": "Rise of Apollo",
                "game_code": "3da7ee034052b8cb90c6ca060652ded4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Rise-of-Apollo_1024_rounded.png"
            },
            {
                "game_name": "Mermaid Riches",
                "game_code": "a9d7a5af417a94caf554170e6b345e57",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mermaid-Riches-icon_1024_rounded.png"
            },
            {
                "game_name": "Raider Jane's Crypt of Fortune",
                "game_code": "24d8e1dbc5cface0907f5a21ecd56753",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Raider-Janes-Crypt-of-Fortune_1024_rounded.png"
            },
            {
                "game_name": "Supermarket Spree",
                "game_code": "7ef03497fc0b21c34b137e85b1e409cd",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Supermarket-Spree_rounded_1024.png"
            },
            {
                "game_name": "Buffalo Win",
                "game_code": "2818a7add6e10b2ec5f938d7ae0efb04",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Buffalo-Win_icon_1024_rounded.png"
            },
            {
                "game_name": "Legendary Monkey King",
                "game_code": "5cdeba2ab48d6ba345b1a4de8e2776b5",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Legendary-Monkey-King_icon_1024_rounded.png"
            },
            {
                "game_name": "Spirited Wonders",
                "game_code": "87a05c81af5635bed41765bfd076ee15",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Spirited-Wonders_app-icon_rounded.png"
            },
            {
                "game_name": "Emoji Riches",
                "game_code": "101ca3ff83b149dcf3439309e9b32142",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Emoji-Riches_app-Icon_1024_rounded.png"
            },
            {
                "game_name": "Mask Carnival",
                "game_code": "adf297c2666c69b3abc3b61618d593b8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mask-Carnival_app-icon_rounded.png"
            },
            {
                "game_name": "Oriental Prosperity",
                "game_code": "23b43b58e11aadb1f27fd05ba41e9819",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Oriental-Prosperity_icon_1024_rounded.png"
            },
            {
                "game_name": "Garuda Gems",
                "game_code": "aa609892f551de2053e92427dc4ae17f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Garuda-Gems_1024_rounded.png"
            },
            {
                "game_name": "Destiny of Sun & Moon",
                "game_code": "617ca04ffcffbc543a1a30cacdac98fa",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Destiny-of-Sun-and-Moon_icon_1024_rounded.png"
            },
            {
                "game_name": "Butterfly Blossom",
                "game_code": "116989bb267a72035bd01818c5496126",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Butterfly-Blossom_1024_rounded.png"
            },
            {
                "game_name": "Rooster Rumble",
                "game_code": "5c371d9fca6109c954de93ac7986c5db",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Rooster-Rumble_app-icon_rounded.png"
            },
            {
                "game_name": "The Queen's Banquet",
                "game_code": "1b317b5f8bf2ca0cc609307810407426",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/The-Queens-Banquet_icon_1024_rounded.png"
            },
            {
                "game_name": "Battleground Royale",
                "game_code": "e9f92f6edc2dac2d08bc345ee036260c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Battleground-Royale_icon_1024_rounded.png"
            },
            {
                "game_name": "Win Win Fish Prawn Crab",
                "game_code": "9b344f0b2a9bda427684be60597d2fc6",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Win-Win-Fish-Prawn-Crab_rounded_1024.png"
            },
            {
                "game_name": "Lucky Piggy",
                "game_code": "66fadac68ed45e23def86c06cc811820",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Lucky-Piggy_icon_1024_rounded.png"
            },
            {
                "game_name": "Wild Coaster",
                "game_code": "a06f1a154698243bf2484853d38e5fbb",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Coaster_app-icon_rounded.png"
            },
            {
                "game_name": "Totem Wonders",
                "game_code": "a03c6e7a918132b50f9caa297df1752d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Totem-Wonders_icon_1024_rounded.png"
            },
            {
                "game_name": "Alchemy Gold",
                "game_code": "9860c865264dcacad1ef37176cdefc1a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Alchemy-Gold_1024_rounded.png"
            },
            {
                "game_name": "Asgardian Rising",
                "game_code": "08d92dc2ca14f42c681b44297386d600",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Asgardian-Rising_appicon_rounded.png"
            },
            {
                "game_name": "Midas Fortune",
                "game_code": "a2fd6b0cadc8fefccfb0d063b1f81d85",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Midas-Fortune_appicon_rounded.png"
            },
            {
                "game_name": "Fortune Rabbit",
                "game_code": "e175cdd3215a02f5539cc8354a149b75",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Rabbit_appicon_rounded.png"
            },
            {
                "game_name": "Rave Party Fever",
                "game_code": "901aa1b709a937f6a04baddb98a8d1d3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Rave-Party-Fever_1024_rounded.png"
            },
            {
                "game_name": "Hawaiian Tiki",
                "game_code": "35d6743ae5d73a3359f143cbb44ede09",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Hawaiian-Tiki_icon_1024_rounded.png"
            },
            {
                "game_name": "Bakery Bonanza",
                "game_code": "d0fe7aa2f7ed5778190b1e60d94e6773",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Bakery-Bonanza_app-Icon_1024_rounded.png"
            },
            {
                "game_name": "Songkran Splash",
                "game_code": "894b1c7609629cf9b3d127d9dbaa372c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Songkran-Splash_appicon_rounded.png"
            },
            {
                "game_name": "Mystical Spirits",
                "game_code": "3b2d4d1ae24b1c3ad29556a6cf875f11",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mystical-Spirits_icon_1024_rounded.png"
            },
            {
                "game_name": "Super Golf Drive",
                "game_code": "d37dde2adb52e0ea708c0ccd6877b1b3",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Super-Golf-Drive_icon_1024_rounded.png"
            },
            {
                "game_name": "Lucky Clover Riches",
                "game_code": "288f290554746bb32322a79b96ecdcbb",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Lucky-Clover-Lady_1024_rounded.png"
            },
            {
                "game_name": "Fruity Candy",
                "game_code": "9f2c89ae5b7c0894c9ee9e223e3fd9d8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fruity-Candy_1024_rounded.png"
            },
            {
                "game_name": "Cruise Royale",
                "game_code": "8489d662ccc07a2e9677729f76e26ae8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Cruise-Royale_icon_1024_rounded.png"
            },
            {
                "game_name": "Safari Wilds",
                "game_code": "97c6f05ef6a0a34cad10d5e00edc909c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Safari-Wilds_appicon_rounded.png"
            },
            {
                "game_name": "Gladiator's Glory",
                "game_code": "2454dc7cfdc651b7318950453bc3f617",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Gladiators-Glory_appicon_1024_rounded.png"
            },
            {
                "game_name": "Ninja Racoon Frenzy",
                "game_code": "6d1937d2e7f87306333443c99ac2c03f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ninja-Racoon-Frenzy_1024_rounded.png"
            },
            {
                "game_name": "Ultimate Striker",
                "game_code": "4415d83cd9c74299814c1473db83bf7f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Ultimate-Striker_appicon_rounded.png"
            },
            {
                "game_name": "Wild Heist Cashout",
                "game_code": "028bd89b2120e880bcf1968c37277460",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Heist-Cashout_appicon_1024_rounded.png"
            },
            {
                "game_name": "Forge of Wealth",
                "game_code": "f8ec50fc2ef996e6c182fd2fe59a16fa",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Forge-of-Wealth_1024_rounded.png"
            },
            {
                "game_name": "Mafia Mayhem",
                "game_code": "c7b3016c70a06ddbb2355a3aee4179d0",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mafia-Mayhem_1024_rounded.png"
            },

            {
                "game_name": "Werewolf's Hunt",
                "game_code": "2ac70bee7b47c172381e55f7e644d92e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Werewolfs-Hunt_icon_1024_rounded.png"
            },
            {
                "game_name": "Tsar Treasures",
                "game_code": "1eb6a959aadf0491f4a648762d8d262a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Tsar-Treasures_icon_1024_rounded.png"
            },
            {
                "game_name": "Fortune Dragon",
                "game_code": "c5435a8a73707a3a8bb4fe8baaaef3d2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Fortune-Dragon_icon_1024_rounded.png"
            },
            {
                "game_name": "Dragon Hatch 2",
                "game_code": "910f25689073d17680be453d7ed90ce2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Dragon-Hatch2_icon_1024_rounded.png"
            },
            {
                "game_name": "Gemstones Gold",
                "game_code": "877c9b2ec1c5e0505129315948f9bbfa",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Gemstones-Gold_appicon_rounded.png"
            },
            {
                "game_name": "Cash Mania",
                "game_code": "c8bbb41367b3971ed3467c2f0c2627a4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Cash-Mania_appicon_rounded.png"
            },
            {
                "game_name": "Wild Ape #3258",
                "game_code": "9b93cb0dc46d847864c87ed42a3428bb",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Wild-Ape_rounded.png"
            },
            {
                "game_name": "Pinata Wins",
                "game_code": "f08cc025e23ee049b570517867c74be0",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Pinata-Wins_1024_rounded.png"
            },
            {
                "game_name": "Mystic Potion",
                "game_code": "e61bde75d590e943d2c5c6d432b29b46",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Mystic-Potion.png"
            },
            {
                "game_name": "Anubis Wrath",
                "game_code": "c268154a85669eea35aa46387834ac76",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/Anubis-Wrath.png"
            },
            {
                "game_name": "Chicky Run",
                "game_code": "c3e600005f72f1d1cabe758e206daf57",
                "game_type": "Gamble Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/chicky-run_icon_1024_rounded.png"
            },
            {
                "game_name": "Zombie Outbreak",
                "game_code": "83b6eceea77859c14426b05480b96c34",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/zombie-outbreaks_appicon_rounded.png"
            },
            {
                "game_name": "Futebol Fever",
                "game_code": "314afef87ff2974867234ac317b37f4c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/futebol-fever_icon_1024_rounded.png"
            },
            {
                "game_name": "Shark Bounty",
                "game_code": "42cf824884f8ecdaf39862c9a15bf1f1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/shark-hunter_1024_rounded.png"
            },
            {
                "game_name": "Yakuza Honor",
                "game_code": "e4772d4ef1de4217915c678d0d1722a8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/yakuza-honor_1024_rounded.png"
            },
            {
                "game_name": "Wings of Iguazu",
                "game_code": "6ae667b26f908e5ebe8976ca334fd472",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/pg/wings-of-iguazu_icon_1024_rounded.png"
            }


        ]
}
// const cq9 = {
//     platform: 'digital',
//     provider: 'cq9',
//     games: [
//         {
//             "game_name": "Thai HILO",
//             "game_code": "e1bf4c2cf1dcf91182d3caf8e944f425",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Thai-HILO.png"
//         },
//         {
//             "game_name": "Xoc Dia",
//             "game_code": "87593975049b4839c5b9883188c825b8",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Xoc-Dia.png"
//         },
//         {
//             "game_name": "Mr.Bean",
//             "game_code": "83bc9b50ddeb49403086070bc61c8dac",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mr.Bean.png"
//         },
//         {
//             "game_name": "Thai Fish Prawn Crab",
//             "game_code": "1636a3694f9eaab1ee27c253c43591aa",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Thai-Fish-Prawn-Crab.png"
//         },
//         {
//             "game_name": "Tenfold Eggs",
//             "game_code": "4bcc8e305d6747e524d698ce02c9e2c7",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Tenfold-Eggs.png"
//         },
//         {
//             "game_name": "Funky Bingo",
//             "game_code": "2075dc1439923a3210deba122fc0d631",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Funky-Bingo.png"
//         },
//         {
//             "game_name": "Jungle Party",
//             "game_code": "bac6b204228688e24eb808caaa459f78",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Jungle-Party.png"
//         },
//         {
//             "game_name": "Mummy's Treasure",
//             "game_code": "0fec5546ea03487eed57e76d4e57e608",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mummys-Treasure.png"
//         },
//         {
//             "game_name": "Mini Roulette",
//             "game_code": "421ca8d057205d7af4e8cfea22cc906b",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mini-Roulette-.png"
//         },
//         {
//             "game_name": "Mahjong Fruit",
//             "game_code": "52db8e8d4992293d9061398fc3f3869d",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mahjong-Fruit.png"
//         },
//         {
//             "game_name": "K.O. Island",
//             "game_code": "55170f3e8904083bb698e15494175b85",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/K.O.-Island.png"
//         },
//         {
//             "game_name": "Dragon Ball Dozer",
//             "game_code": "5a0a7ee701c44fe34549b44333666148",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Ball-Dozer.png"
//         },
//         {
//             "game_name": "3 2 1Go!",
//             "game_code": "c002f8b5cd124abe27b50d5e082364f4",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/3-2-1Go!.png"
//         },
//         {
//             "game_name": "Hanuman Bingo",
//             "game_code": "df98d0dcddb7526eecc11fe760a7d531",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hanuman-Bingo.png"
//         },
//         {
//             "game_name": "Alice Run",
//             "game_code": "7c0f4e40cbbfee4d8017b42cb081ed1e",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Alice-Run.png"
//         },
//         {
//             "game_name": "Dragon Pachinko",
//             "game_code": "3f475158ba1e056a4858b18ba72a2887",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Pachinko.png"
//         },
//         {
//             "game_name": "Seotda",
//             "game_code": "8b410b635a270f49ff933fd188741abf",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Seotda.png"
//         },
//         {
//             "game_name": "Alice Run JP",
//             "game_code": "b4c1e40c11261a77bdfa76dad2585da4",
//             "game_type": "Arcade Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Alice-Run-JP.png"
//         },


//         {
//             "game_name": "Yaxing Live",
//             "game_code": "a751336c5ece3bedbed5b5d73113b665",
//             "game_type": "Video Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Yaxing-Live.png"
//         },
//         {
//             "game_name": "motivation gaming",
//             "game_code": "709f3ade034d0eb105e087a0f8bebc09",
//             "game_type": "Video Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/motivation-gaming.png"
//         },
//         {
//             "game_name": "CQ9 Lottery",
//             "game_code": "349cbd98815ed9b8cb3d081956760bbc",
//             "game_type": "Lottery Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/CQ9-Lottery.png"
//         },

//         {
//             "game_name": "JumpHigh",
//             "game_code": "630a841b4cf75a38e2e657040f785e63",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/JumpHigh.png"
//         },
//         {
//             "game_name": "Rave Jump",
//             "game_code": "b602205d6a56d999df188e17ecc2bc91",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Rave-Jump.png"
//         },
//         {
//             "game_name": "Jump High 2",
//             "game_code": "8d57ec6274960fe2f2c252f4a49adf7f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Jump-High-2.png"
//         },
//         {
//             "game_name": "Jumping mobile",
//             "game_code": "1282953e9452fe2852cb1724b4b9d617",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Jumping-mobile.png"
//         },
//         {
//             "game_name": "Good Fortune M",
//             "game_code": "50568ba2a8da9f30dded83dbbd3655d6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Good-Fortune-M.png"
//         },
//         {
//             "game_name": "God of War",
//             "game_code": "f4b6484dc2b96fc339604446cd042534",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/God-of-War.png"
//         },
//         {
//             "game_name": "FlyOut",
//             "game_code": "afddbebb27c4b7408bda624aa9354aa7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/FlyOut.png"
//         },
//         {
//             "game_name": "Zeus",
//             "game_code": "0f944952a27be9ab52d8deabf275a552",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Zeus.png"
//         },
//         {
//             "game_name": "DiscoNight M",
//             "game_code": "82839530d48814c586b8844b84693ca4",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/DiscoNight-M.png"
//         },
//         {
//             "game_name": "Lucky Bats",
//             "game_code": "c069592afd5d6ffab7bf759a491a71cd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lucky-Bats.png"
//         },
//         {
//             "game_name": "Good Fortune",
//             "game_code": "61d7c57fedb24242f4e56df7d5c80bfd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Good-Fortune.png"
//         },
//         {
//             "game_name": "JumpHigher",
//             "game_code": "80af0735d78f6056a920770abca9f51c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/JumpHigher.png"
//         },
//         {
//             "game_name": "Fa Cai Shen2",
//             "game_code": "da2929eef2ac66b7b3d44fdf0655c27a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fa-Cai-Shen2.png"
//         },
//         {
//             "game_name": "God of War M",
//             "game_code": "46c55e2ba632f9ae9addda6e169f7743",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/God-of-War-M.png"
//         },
//         {
//             "game_name": "Money Tree",
//             "game_code": "cee72070e3d6fee077cfcb9a050df57d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Money-Tree.png"
//         },
//         {
//             "game_name": "Rave Jump mobile",
//             "game_code": "7b0b749b726371330c991ad01513539a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Rave-Jump-mobile.png"
//         },
//         {
//             "game_name": "Lucky Bats M",
//             "game_code": "8d505ecfefce9b2c3058f58b415782b2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lucky-Bats-M.png"
//         },
//         {
//             "game_name": "5 God Beasts",
//             "game_code": "7148d1ecd2f6787e3d4cfae4580a7b86",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/5-God-Beasts.png"
//         },
//         {
//             "game_name": "THOR",
//             "game_code": "8e77c76cd001acc431fb96ce6d216f80",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/THOR.png"
//         },
//         {
//             "game_name": "Cricket Fever",
//             "game_code": "a36b6a69ffa118773a5e828bcc74dcf8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Cricket-Fever.png"
//         },
//         {
//             "game_name": "FaCaiShen",
//             "game_code": "4fc25c66cbfd8068ff4a12faffe62469",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/FaCaiShen.png"
//         },
//         {
//             "game_name": "Gu Gu Gu 3",
//             "game_code": "260d42bbe34ce7149c636e339100364b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Gu-Gu-Gu-3.png"
//         },
//         {
//             "game_name": "Move n' Jump",
//             "game_code": "8eba0f6d7c38fa6ced38f3abc6409e7f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Move-n-Jump.png"
//         },
//         {
//             "game_name": "Jump Higher mobile",
//             "game_code": "e78b31bc60d05582a34cc19871520cb6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Jump-Higher-mobile.png"
//         },
//         {
//             "game_name": "Flying Cai Shen",
//             "game_code": "660de502d52d1f4566aeab989491686f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Flying-Cai-Shen.png"
//         },
//         {
//             "game_name": "Fire Chibi 2",
//             "game_code": "b05efbb809025d5450f08bdec8febee2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire-Chibi-2.png"
//         },
//         {
//             "game_name": "DiscoNight",
//             "game_code": "4b5dce5597380d02a6daa1946ebfd118",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/DiscoNight.png"
//         },
//         {
//             "game_name": "Wonderland",
//             "game_code": "8764cec7c0232e476536c00145089732",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wonderland.png"
//         },
//         {
//             "game_name": "Thor 2",
//             "game_code": "585f5e69e9fd929d2a78e3d392a22c8e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Thor-2.png"
//         },
//         {
//             "game_name": "Da Hong Zhong",
//             "game_code": "09000b2086ef8632326e33b75714639b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Da-Hong-Zhong.png"
//         },
//         {
//             "game_name": "Zhong Kui",
//             "game_code": "f57af26972d04aeb3918b407fd280187",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Zhong-Kui.png"
//         },
//         {
//             "game_name": "Da Fa Cai",
//             "game_code": "7781583727b17e3c0abd06033338f15b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Da-Fa-Cai.png"
//         },
//         {
//             "game_name": "Flower Fortunes",
//             "game_code": "db0174a59d12ec0480cdfafa50fe8103",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Flower-Fortunes.png"
//         },
//         {
//             "game_name": "Fire Queen 2",
//             "game_code": "a1f1dac8df2ab915628830539f8bb7d7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire-Queen-2-.png"
//         },
//         {
//             "game_name": "Baseball Fever",
//             "game_code": "1b2895c147b842611771c9815000aaa4",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Baseball-Fever.png"
//         },
//         {
//             "game_name": "Double Fly",
//             "game_code": "dabd7e6cc8c05effa4d868ebc088f189",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Double-Fly-.png"
//         },
//         {
//             "game_name": "Night City",
//             "game_code": "20ac774b757e927af3fd59a67e39254a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Night-City.png"
//         },
//         {
//             "game_name": "Funny Alpaca",
//             "game_code": "a6eeb19d6fce96c0b2aef905f01cd46b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Funny-Alpaca.png"
//         },
//         {
//             "game_name": "Invincible Elephant",
//             "game_code": "c66bcf7a826e781c96cd214c97ae2b67",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Invincible-Elephant.png"
//         },
//         {
//             "game_name": "Chameleon",
//             "game_code": "88e704fd702c1318b8ac1b2c540ea308",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Chameleon.png"
//         },
//         {
//             "game_name": "Treasure Pirate",
//             "game_code": "870473a09d666f7c52c3e655f2b64b77",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Treasure-Pirate.png"
//         },
//         {
//             "game_name": "Six Candy",
//             "game_code": "aaff1c8eea4138515f7dc48b9c28503b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Six-Candy.png"
//         },
//         {
//             "game_name": "Fa Cai Shen M",
//             "game_code": "4c5fff40be0ac1e597fa24f3c0a656e9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fa-Cai-Shen-M.png"
//         },
//         {
//             "game_name": "TreasureBowl",
//             "game_code": "5172f73c2829b9cec48b0c7d856ae26a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/TreasureBowl.png"
//         },
//         {
//             "game_name": "888 Cai Shen",
//             "game_code": "28a39e51864bae9fcebdbc6f738815de",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/888-Cai-Shen.png"
//         },
//         {
//             "game_name": "Hercules",
//             "game_code": "93060689fb6ddb3823702549ae22fbc7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hercules.png"
//         },
//         {
//             "game_name": "Fire Queen",
//             "game_code": "43177e1be3e726f8dd532c594a0fe54f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire-Queen.png"
//         },
//         {
//             "game_name": "So Sweet",
//             "game_code": "6e5050176c0efae891a5bcc9e8958329",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/So-Sweet.png"
//         },
//         {
//             "game_name": "GuGuGu",
//             "game_code": "7ecdf8a456674beeb3665f2a0e15e322",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/GuGuGu.png"
//         },
//         {
//             "game_name": "RaveHigh",
//             "game_code": "191678951989eed5609ce6cf2252f0c1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/RaveHigh.png"
//         },

//         {
//             "game_name": "Pyramid Raider",
//             "game_code": "068f8d42261ce77fef124de9608dc391",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Pyramid-Raider.png"
//         },
//         {
//             "game_name": "Snow Queen",
//             "game_code": "7da3427f512c0ba7fe9acb69daab425d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Snow-Queen.png"
//         },
//         {
//             "game_name": "Water Margin",
//             "game_code": "fc003ead2149c77c1bb174cbfbdbe7bb",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Water-Margin.png"
//         },
//         {
//             "game_name": "Hot Spin",
//             "game_code": "7057b9185aaee613216ff18352ad1c2f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hot-Spin.png"
//         },
//         {
//             "game_name": "Super5",
//             "game_code": "e8a984c3aa5e951ef92b053b32ea7dd1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Super5.png"
//         },
//         {
//             "game_name": "Wolf Disco",
//             "game_code": "ec50f4c2e123475287a6bac7239d6db8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wolf-Disco.png"
//         },
//         {
//             "game_name": "Football Fever M",
//             "game_code": "63adb18577103f9631aec0712cb398e2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Football-Fever-M.png"
//         },
//         {
//             "game_name": "Fire Chibi",
//             "game_code": "da8208a22454260a50438c1e1806ea69",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire-Chibi.png"
//         },
//         {
//             "game_name": "6 Toros",
//             "game_code": "4b4d1cb0e676f342db428ac898d5a3ac",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/6-Toros.png"
//         },
//         {
//             "game_name": "Mirror Mirror",
//             "game_code": "d9550ed556610505851f425c37fb57fd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mirror-Mirror.png"
//         },
//         {
//             "game_name": "MuayThai",
//             "game_code": "a27e8f382f0ce434b0c42079ebe33221",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/MuayThai.png"
//         },
//         {
//             "game_name": "Rave Jump2",
//             "game_code": "b9aeb15cd98fb93d5dca0bbddbc9c79f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Rave-Jump2.png"
//         },
//         {
//             "game_name": "Aladdin's lamp",
//             "game_code": "44b775adacc090fd07ad6b24a6b55963",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Aladdins-lamp.png"
//         },
//         {
//             "game_name": "Striker WILD",
//             "game_code": "4a3a333562badf48383a10c7fbf8de26",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Striker-WILD.png"
//         },
//         {
//             "game_name": "WaterWorld",
//             "game_code": "0eebf2f9aaa4705795ce5b01780751ef",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/WaterWorld.png"
//         },
//         {
//             "game_name": "Fa Cai Fu Wa",
//             "game_code": "bad08f4186e60ce20918fcc23a955d7c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fa-Cai-Fu-Wa.png"
//         },
//         {
//             "game_name": "Mr. Miser",
//             "game_code": "264af007099b8306f9c4e4e45485500d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mr.-Miser.png"
//         },
//         {
//             "game_name": "Uproar In Heaven",
//             "game_code": "86c2ea7d87d4ca8f8f305a0a0b0de846",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Uproar-In-Heaven.png"
//         },
//         {
//             "game_name": "GuGuGu2",
//             "game_code": "506e63d96c5377a1d0d2368357e323f9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/GuGuGu2.png"
//         },
//         {
//             "game_name": "Wheel Money",
//             "game_code": "cf4cfcd1f517360be7e3f5e35cb277ef",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wheel-Money.png"
//         },
//         {
//             "game_name": "5 Boxing",
//             "game_code": "6075420770ec2fe9c31b48159729299c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/5-Boxing.png"
//         },
//         {
//             "game_name": "Dragon Ball",
//             "game_code": "83e1f2077918e63f9cbde70f6e3d9ce0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Ball.png"
//         },
//         {
//             "game_name": "The Beast War",
//             "game_code": "8c9750a6cc03f3d0af0a7853ac124fda",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/The-Beast-War.png"
//         },
//         {
//             "game_name": "HappyRichYear",
//             "game_code": "cbce4da7f8b89f8b6b569af14af75d9c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/HappyRichYear.png"
//         },
//         {
//             "game_name": "Floating Market",
//             "game_code": "a34f4808447d12be37d16adf9eaed572",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Floating-Market.png"
//         },
//         {
//             "game_name": "King of Atlantis",
//             "game_code": "e4a15094c2ae54ffc6d77187fff0d2d7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/King-of-Atlantis.png"
//         },
//         {
//             "game_name": "Apsaras",
//             "game_code": "feb4444198c8146d213f9594325ff7d7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Apsaras.png"
//         },
//         {
//             "game_name": "The Chicken House",
//             "game_code": "2e5f381d3f9db2217fb113c829a79f2a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/The-Chicken-House.png"
//         },
//         {
//             "game_name": "Zeus M",
//             "game_code": "fb33a6613e5ba5b8e42f035fbd4e103d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Zeus-M.png"
//         },
//         {
//             "game_name": "777",
//             "game_code": "521c3e444d06b25dc5ed6b6768200d44",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/777.png"
//         },
//         {
//             "game_name": "LuckyBatsJP",
//             "game_code": "9bef1fbf45383b40e170c57a06352a37",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/LuckyBatsJP.png"
//         },
//         {
//             "game_name": "WuKong&Peaches",
//             "game_code": "d0436aec31880e65ad98eef9b3981fcb",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/WuKong&Peaches.png"
//         },
//         {
//             "game_name": "Sky Lanterns",
//             "game_code": "48f9ce3f231f3993c6ec908509d61688",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Sky-Lanterns.png"
//         },
//         {
//             "game_name": "Kronos",
//             "game_code": "f6747563ecef5cb4803e523cc40d7496",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Kronos.png"
//         },
//         {
//             "game_name": "Hephaestus",
//             "game_code": "ccd2f2ff80e15cf4972f1d6357c0f8d5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hephaestus.png"
//         },
//         {
//             "game_name": "King Kong Shake",
//             "game_code": "364284517a08f983992e3ee471960c0d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/King-Kong-Shake.png"
//         },
//         {
//             "game_name": "Gu Gu Gu 2 M",
//             "game_code": "24e0e334a06f1c2f609908ea51f56945",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/-Gu-Gu-Gu-2-M.png"
//         },
//         {
//             "game_name": "Fortune Dragon",
//             "game_code": "3b00fa061de9d0a6ed9843fa95ddb5dc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fortune-Dragon.png"
//         },
//         {
//             "game_name": "Shou-Xin",
//             "game_code": "2b0b1d8d7c8c49ae282f328795916fd1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Shou-Xin.png"
//         },
//         {
//             "game_name": "Mafia",
//             "game_code": "a239266b6011750a0105b676ca92b2f3",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mafia.png"
//         },
//         {
//             "game_name": "Hot DJ",
//             "game_code": "3f1df3f204333b25730681b291a60333",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hot-DJ.png"
//         },
//         {
//             "game_name": "Mr. Rich",
//             "game_code": "a34dc998bf7f4c4c0a62b2810cd0e30e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mr.-Rich.png"
//         },
//         {
//             "game_name": "Rave Jump 2 M",
//             "game_code": "73e303cf417c6bd211ef536507a35b82",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Rave-Jump-2-M.png"
//         },
//         {
//             "game_name": "Fire Chibi M",
//             "game_code": "7fa49af4cf85457b5340d98cbe282563",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire-Chibi-M.png"
//         },
//         {
//             "game_name": "Wolf Moon",
//             "game_code": "fda7ba3b397e7940596a30639e2ab9e1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wolf-Moon.png"
//         },

//         {
//             "game_name": "Football Fever",
//             "game_code": "551c0c158cfcbe2d8c97960f70c7fec8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Football-Fever.png"
//         },
//         {
//             "game_name": "Golden Eggs",
//             "game_code": "69092d998124631d4a8925944bce67b5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Golden-Eggs.png"
//         },
//         {
//             "game_name": "CHICAGOⅡ",
//             "game_code": "1112003dee0f8525b1cbee98a6ab1368",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/CHICAGOII.png"
//         },
//         {
//             "game_name": "TreasureBowlJP",
//             "game_code": "a302435d829c9a6b823b508c2df7aec9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/TreasureBowlJP.png"
//         },
//         {
//             "game_name": "Apollo",
//             "game_code": "9f6d5cad4677d3aa3feeb7b907d9a93a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Apollo.png"
//         },
//         {
//             "game_name": "OrientalBeauty",
//             "game_code": "0e15fd4fa6b9590001cdd71555bd8b87",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/OrientalBeauty.png"
//         },
//         {
//             "game_name": "Hero of the 3 Kingdoms - Cao Cao",
//             "game_code": "a174a38fb0fb007d348c03086ed0efed",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hero-of-the-3-Kingdoms-Cao-Cao.png"
//         },
//         {
//             "game_name": "Sweet POP",
//             "game_code": "e51f1ecea20f87eee1149dac9e78852c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Sweet-POP.png"
//         },
//         {
//             "game_name": "Myeong-ryang",
//             "game_code": "5c10bbe32ed9527d19711986973968a4",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Myeong-ryang.png"
//         },
//         {
//             "game_name": "Treasure House",
//             "game_code": "8a244973588309c9d06b3d2f23020e1e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Treasure-House.png"
//         },
//         {
//             "game_name": "Wing Chun",
//             "game_code": "c20937482acb4256f02c2d9f72258fbe",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wing-Chun.png"
//         },
//         {
//             "game_name": "Fortune Totem",
//             "game_code": "7941e7cf88f7a30533b7c7ab98b3c639",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fortune-Totem.png"
//         },
//         {
//             "game_name": "Running Animals",
//             "game_code": "522977276f1e38334bb71762710d1d8b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Running-Animals.png"
//         },
//         {
//             "game_name": "Fire777",
//             "game_code": "2453bbce4a11850700f3f8634a130e4f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fire777.png"
//         },
//         {
//             "game_name": "Vampire Kiss",
//             "game_code": "b0bf4de1e3881b266a4dfc442e1f665d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Vampire-Kiss.png"
//         },
//         {
//             "game_name": "WanBaoDino",
//             "game_code": "557550df7526b2a8641c08b14c50304d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/WanBaoDino.png"
//         },
//         {
//             "game_name": "Ne Zha Advent",
//             "game_code": "c0adf8478aef16eae670cce8258623b1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Ne-Zha-Advent.png"
//         },
//         {
//             "game_name": "Greek Gods",
//             "game_code": "15e8bdff25079b4be98f84cdea37d1ed",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Greek-Gods.png"
//         },
//         {
//             "game_name": "Zuma Wild",
//             "game_code": "b1c4e04fc5de9e6fe06baf44a650d0e6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Zuma-Wild.png"
//         },
//         {
//             "game_name": "Dragon Koi",
//             "game_code": "f800040e6818ede103dc94b3d3bebbc5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Koi.png"
//         },
//         {
//             "game_name": "SkrSkr",
//             "game_code": "316d8570b1c69f52046d5bb0bbb0a0e3",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/SkrSkr.png"
//         },
//         {
//             "game_name": "Acrobatics",
//             "game_code": "b8f1a2b30586584ac0f20b9ba426ee60",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Acrobatics.png"
//         },
//         {
//             "game_name": "Ganesha Jr.",
//             "game_code": "461e0b9219d51eda0f6413b19153a1c6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Ganesha-Jr..png"
//         },
//         {
//             "game_name": "Yuan Bao",
//             "game_code": "5e4818e6c8946a3d71653e3d22a9a1c9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Yuan-Bao.png"
//         },
//         {
//             "game_name": "Wild Tarzan",
//             "game_code": "dd2046e37aa94f0a6b77497452ac0286",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wild-Tarzan.png"
//         },
//         {
//             "game_name": "Diamond treasure",
//             "game_code": "2f3e4881d605653d536e8b5ab21e113b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/-Diamond-treasure.png"
//         },
//         {
//             "game_name": "TreasureIsland",
//             "game_code": "b3c866fb2c529acf4175603e2c02d074",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/TreasureIsland.png"
//         },
//         {
//             "game_name": "Red Phoenix",
//             "game_code": "a7034f531232014969b8b613fccd0a47",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Red-Phoenix.png"
//         },
//         {
//             "game_name": "Gu Gu Gu M",
//             "game_code": "b5d1c587f497cd331d18f3a618f99229",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Gu-Gu-Gu-M.png"
//         },
//         {
//             "game_name": "Detective Dee2",
//             "game_code": "d91e2b4c05cd7ac6ac59adb3d5f853ab",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Detective-Dee2.png"
//         },
//         {
//             "game_name": "Lucky Tigers",
//             "game_code": "b18de9efd3c251a32eed6ac7e97c67d7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lucky-Tigers.png"
//         },
//         {
//             "game_name": "Dragon Heart",
//             "game_code": "d8cb3a9429cd45c2ec612cb3220acecd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Heart.png"
//         },
//         {
//             "game_name": "Lord Ganesha",
//             "game_code": "89c763b3761557eaa960d022cdd73921",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lord-Ganesha.png"
//         },
//         {
//             "game_name": "Hot Pinatas",
//             "game_code": "171dd44d68bd47df9d2bc386082ca340",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hot-Pinatas.png"
//         },
//         {
//             "game_name": "888",
//             "game_code": "708c6a3de19dd4d7674efea3ef2fe40f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/888.png"
//         },
//         {
//             "game_name": "RunningToro",
//             "game_code": "2df7d3f0fb6dc289a29d58067ab1c596",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/RunningToro.png"
//         },
//         {
//             "game_name": "Gold Stealer",
//             "game_code": "9cec85e2f5c2a0545c10825e897ec433",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Gold-Stealer.png"
//         },
//         {
//             "game_name": "All Star Team",
//             "game_code": "8677aafb4968ee948c42ef31cbcc6c66",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/All-Star-Team.png"
//         },
//         {
//             "game_name": "Dragon's Treasure",
//             "game_code": "9b8589482492af6a92397a889ce24784",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragons-Treasure.png"
//         },
//         {
//             "game_name": "Great Lion",
//             "game_code": "e91f6b84921858afd5a62284d0dfa89b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Great-Lion.png"
//         },
//         {
//             "game_name": "Burning Xi-You",
//             "game_code": "979fc001722dd7c46edab5a787b86d21",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Burning-Xi-You.png"
//         },
//         {
//             "game_name": "All Wilds",
//             "game_code": "bb5c0ea65687c2ee63980f644045f9e4",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/All-Wilds.png"
//         },
//         {
//             "game_name": "Jewel Luxury",
//             "game_code": "572ed9f08de5745603c052fd759989c5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Jewel-Luxury.png"
//         },
//         {
//             "game_name": "Meow",
//             "game_code": "271a0b04341b9b57c9fd46dbc8bb333a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Meow.png"
//         },
//         {
//             "game_name": "Loy Krathong",
//             "game_code": "d63414a615aa145466625ec440176f8e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Loy-Krathong.png"
//         },
//         {
//             "game_name": "The Cupids",
//             "game_code": "3c71b0060fe7214f73ac21af86148b03",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/The-Cupids.png"
//         },
//         {
//             "game_name": "Fruit King",
//             "game_code": "748c8f874063d6629dfc910dd38e85e5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fruit-King.png"
//         },
//         {
//             "game_name": "Chicky Parm Parm",
//             "game_code": "ff89d148948baec771661f4047e7215c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Chicky-Parm-Parm.png"
//         },
//         {
//             "game_name": "WonWonWon",
//             "game_code": "5c60a8521f10c864de5b1da61e1b014c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/WonWonWon.png"
//         },
//         {
//             "game_name": "Magic World",
//             "game_code": "4c70c186616f00adb7cec5d6e58ed604",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Magic-World.png"
//         },
//         {
//             "game_name": "Sherlock Holmes",
//             "game_code": "f4ee292edc93a670a25e31e3d8ae3303",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Sherlock-Holmes.png"
//         },
//         {
//             "game_name": "Summer Mood",
//             "game_code": "d67b92dd4bc3a7180aecf6a5f4eb61ed",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Summer-Mood.png"
//         },
//         {
//             "game_name": "God Of Chess",
//             "game_code": "f72b5f2d241bc0ee370965f21692b96d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/God-Of-Chess.png"
//         },
//         {
//             "game_name": "FruitKingII",
//             "game_code": "737224273b2595a5fc6d5b419611ff00",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/FruitKingII.png"
//         },
//         {
//             "game_name": "Xmas",
//             "game_code": "86731029d440380de665d1705be2cbc8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Xmas.png"
//         },
//         {
//             "game_name": "Six Gacha",
//             "game_code": "a1676b8d40667bab6d107601347ab3c6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Six-Gacha.png"
//         },
//         {
//             "game_name": "Gophers War",
//             "game_code": "82af8f5ea9cb9003accab2a685f6b7dc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Gophers-War.png"
//         },
//         {
//             "game_name": "Ninja Raccoon",
//             "game_code": "071b756a4d6b454a87641fa021d18e11",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Ninja-Raccoon.png"
//         },
//         {
//             "game_name": "Fruity Carnival",
//             "game_code": "d859be0e915d1b72d6c3125fd3764eb0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fruity-Carnival.png"
//         },
//         {
//             "game_name": "Football Baby",
//             "game_code": "9f0cc6b78e12cc19bcfcd95488b5d781",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Football-Baby.png"
//         },
//         {
//             "game_name": "Pharaoh's Gold",
//             "game_code": "d40765682df6cd384a6624bdf2a6be8f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Pharaohs-Gold.png"
//         },
//         {
//             "game_name": "Poseidon",
//             "game_code": "2d44ee24e038513e1d8680d4dd534348",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Poseidon.png"
//         },
//         {
//             "game_name": "LongLongLong",
//             "game_code": "cf576c4aecc1bd3b077b4a78d1b426ec",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/LongLongLong.png"
//         },
//         {
//             "game_name": "Detective Dee",
//             "game_code": "bda2e6a2e08382ae3e6cc407ab2a209c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Detective-Dee.png"
//         },
//         {
//             "game_name": "LuckyBoxes",
//             "game_code": "bcefd23a1c86c94c430ca39868eb36cc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/LuckyBoxes.png"
//         },
//         {
//             "game_name": "Crazy NuoZha",
//             "game_code": "b9a08190e3f3aec328ddae2b0c43bb15",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Crazy-NuoZha.png"
//         },
//         {
//             "game_name": "Ecstatic Circus",
//             "game_code": "7f8fd8227e3b31934e1d86c0a5afb938",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Ecstatic-Circus.png"
//         },
//         {
//             "game_name": "Dollar Bomb",
//             "game_code": "b54ad2b8e8217c07a22495f18589c276",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dollar-Bomb.png"
//         },
//         {
//             "game_name": "Fortune Gate",
//             "game_code": "a493bdd1bbe559f7a3fa5e5947982242",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fortune-Gate.png"
//         },
//         {
//             "game_name": "Sakura Legend",
//             "game_code": "8658e005b8bffc8e727a8846dae13900",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Sakura-Legend.png"
//         },
//         {
//             "game_name": "Songkran Festival",
//             "game_code": "2cb558412aaccd52d6ad8b436953c73c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Songkran-Festival.png"
//         },
//         {
//             "game_name": "Coin Spinner",
//             "game_code": "48d0db2eab9a513a3c0974896e2ba704",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Coin-Spinner.png"
//         },
//         {
//             "game_name": "XIYOUJI",
//             "game_code": "4023d4dc30fb1e751576018ff64610df",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/XIYOUJI.png"
//         },
//         {
//             "game_name": "Sun Er Niang",
//             "game_code": "807a7b2beca7903201adb021098ad95c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Sun-Er-Niang.png"
//         },
//         {
//             "game_name": "The Dragon Brings Wealth",
//             "game_code": "57e95e50da6625ed1e3c00e6266e39cb",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/The-Dragon-Brings-Wealth.png"
//         },
//         {
//             "game_name": "ROLLING DRAGON",
//             "game_code": "77c171c91fb589c2c91879a4ebe8c911",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/ROLLING-DRAGON-.png"
//         },
//         {
//             "game_name": "Lonely Planet",
//             "game_code": "b8d4831b3631a06e1bfbe3da5e951789",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lonely-Planet.png"
//         },
//         {
//             "game_name": "World Cup Russia2018",
//             "game_code": "2409e5731f75846c32589aa11e97bf7b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/World-Cup-Russia2018.png"
//         },
//         {
//             "game_name": "Football Boots",
//             "game_code": "2058fb035a2950763935dcdb3552046d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Football-Boots.png"
//         },
//         {
//             "game_name": "Oo Ga Cha Ka",
//             "game_code": "109f1875d5ab0981b08e958828a6118d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Oo-Ga-Cha-Ka.png"
//         },
//         {
//             "game_name": "MONKEY KING",
//             "game_code": "fed3b52ed8e9d709e637a9482f576c64",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/MONKEY-KING.png"
//         },
//         {
//             "game_name": "Monster Hunter",
//             "game_code": "01d19cf2fedc3bc18e2b8e880af687ed",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Monster-Hunter.png"
//         },
//         {
//             "game_name": "JIN LIAN PAN",
//             "game_code": "2745d0933a8ab0621b76bb93f5a549cc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/JIN-LIAN-PAN-.png"
//         },
//         {
//             "game_name": "GoldenEggsJP",
//             "game_code": "6da38883f15c06b796d8daaed7f80939",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/GoldenEggsJP.png"
//         },
//         {
//             "game_name": "LongLaiFa",
//             "game_code": "ca69f05fd2a52a9fdee69dd819cbb4be",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/LongLaiFa.png"
//         },
//         {
//             "game_name": "HUGA",
//             "game_code": "4e46334e0abde53e5e6cabe78f106764",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/HUGA.png"
//         },
//         {
//             "game_name": "PARTY ISLAND",
//             "game_code": "9b7af082e879ebb276affc760668b54d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/PARTY-ISLAND.png"
//         },
//         {
//             "game_name": "Double Happiness",
//             "game_code": "3632e72eedf24ef82f034d02282f90d4",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Double-Happiness.png"
//         },
//         {
//             "game_name": "Big Wolf",
//             "game_code": "4fc02a42d9981442dc20fe9e03d169ad",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Big-Wolf.png"
//         },
//         {
//             "game_name": "Empress Wu",
//             "game_code": "0582ab3045c14b6268606c11f4d19f95",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Empress-Wu-.png"
//         },
//         {
//             "game_name": "TIGER HERO",
//             "game_code": "f523bb4fbe0dad42c44121cfdfe3ec9d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/TIGER-HERO.png"
//         },
//         {
//             "game_name": "MonkeyOfficeLegend",
//             "game_code": "a26b4a919b9bc8865599ca5f105a8e58",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/MonkeyOfficeLegend.png"
//         },
//         {
//             "game_name": "Pub Tycoon",
//             "game_code": "3a2bd5e7a1b3366cde75570d3ad93de8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Pub-Tycoon.png"
//         },
//         {
//             "game_name": "MULAN",
//             "game_code": "bb28e417cbd03f0ab9be560fdf7773e9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/MULAN.png"
//         },
//         {
//             "game_name": "Mega Winner",
//             "game_code": "6667585b48442cde4516e2f6648dc530",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Mega-Winner.png"
//         },
//         {
//             "game_name": "Lin Chong",
//             "game_code": "d46355c4d9fc77c4ae9d9df297390fb0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lin-Chong.png"
//         },
//         {
//             "game_name": "Slot 777",
//             "game_code": "3d76faac5931819507b7dfba02377f35",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Slot-777.png"
//         },
//         {
//             "game_name": "Lucky 3",
//             "game_code": "a369313204e62dbc8584d75cd3addc82",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Lucky-3.png"
//         },
//         {
//             "game_name": "Pig Of Luck",
//             "game_code": "ef392c2fec8ad75d77131252b6ff3663",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Pig-Of-Luck.png"
//         },
//         {
//             "game_name": "Boots of Luck",
//             "game_code": "316b9e21b4bde165e506351ecf833930",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Boots-of-Luck.png"
//         },
//         {
//             "game_name": "Fortune Spirits",
//             "game_code": "a7f80a70e62368c389a23b300ccbf8a1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fortune-Spirits.png"
//         },
//         {
//             "game_name": "GENIE",
//             "game_code": "598c5d9c30378fdd48d4dfa2bb8c0c46",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/GENIE.png"
//         },
//         {
//             "game_name": "Rush Hour",
//             "game_code": "9d9bf67a8b6b1faf5a1dbfe6ff3dd206",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Rush-Hour.png"
//         },
//         {
//             "game_name": "Treasure of Seti",
//             "game_code": "528101a83d7f3518896e4fce061948f7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Treasure-of-Seti.png"
//         },
//         {
//             "game_name": "Wild Fudge",
//             "game_code": "cb9ddf2d9f433e19ca3d7fda21e520c9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wild-Fudge.png"
//         },
//         {
//             "game_name": "Diamond Fruit",
//             "game_code": "1360fd1d5b971769cdbc922b51303e3a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Diamond-Fruit.png"
//         },
//         {
//             "game_name": "Da Fu Xing",
//             "game_code": "804e9adae94f35f16a2d93bc584f7da0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Da-Fu-Xing.png"
//         },
//         {
//             "game_name": "Master Panda",
//             "game_code": "4a687f358c03e98ffbc4df618b2f1566",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Master-Panda.png"
//         },
//         {
//             "game_name": "Queen Of Dead",
//             "game_code": "f09e471f10d60dfc7fd9876c6711d8c8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Queen-Of-Dead.png"
//         },
//         {
//             "game_name": "Songkran",
//             "game_code": "fb1c07944e9b30c773975d5761f715b3",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Songkran.png"
//         },
//         {
//             "game_name": "Dragon Hunters",
//             "game_code": "9a1d746be3ce06c9617fde95da7299e7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Dragon-Hunters.png"
//         },
//         {
//             "game_name": "The Legend Of Snake",
//             "game_code": "6ac22b2754657ac1f92c52c216ca3123",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/The-Legend-Of-Snake-.png"
//         },
//         {
//             "game_name": "Niu Niu Niu",
//             "game_code": "ca92c58e1ba7a064226fd292e08f1e1f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Niu-Niu-Niu.png"
//         },
//         {
//             "game_name": "Royal Fruit",
//             "game_code": "2dc730c7c7cabe3ced14eadf4f800d23",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Royal-Fruit.png"
//         },
//         {
//             "game_name": "Golden Mayan",
//             "game_code": "4ca28ba2df8175e7742aafb08cb93acb",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Golden-Mayan.png"
//         },
//         {
//             "game_name": "Wild Chameleon",
//             "game_code": "1449bcd0cf997fcbd5db51b71f5a3afd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Wild-Chameleon.png"
//         },
//         {
//             "game_name": "Hollywood Pets",
//             "game_code": "b3626929bd5b55514e43cc9ea30ecdcf",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hollywood-Pets.png"
//         },
//         {
//             "game_name": "Fishing King",
//             "game_code": "396c1296f9805ec93cb73764c11e939b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Fishing-King.png"
//         },
//         {
//             "game_name": "Myth",
//             "game_code": "6d7d54e9ac5d6fbccb4e90f59bb07f54",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Myth.png"
//         },
//         {
//             "game_name": "Nezha",
//             "game_code": "c7177ae93f8b8ad8015d1c15fc84358f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Nezha.png"
//         },
//         {
//             "game_name": "HAPPY BUDDHA",
//             "game_code": "7e64a66d0d74af9f173ab913576b61ce",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/HAPPY-BUDDHA.png"
//         },
//         {
//             "game_name": "Cirque de fous",
//             "game_code": "d9d86e86284357426995e080250e2662",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Cirque-de-fous.png"
//         },
//         {
//             "game_name": "JUNGLE ISLAND",
//             "game_code": "8797a9b3500b2cc510aab54f8f65c9b0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/JUNGLE-ISLAND.png"
//         },
//         {
//             "game_name": "Hong Kong Flavor",
//             "game_code": "32b8e2de14d2dc9fa7de9e60c39181e2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Hong-Kong-Flavor.png"
//         },
//         {
//             "game_name": "Beanstalk",
//             "game_code": "bc6315b1d328ba2a6719d3ce54ecfc6d",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Beanstalk.png"
//         },
//         {
//             "game_name": "Xmas Tales",
//             "game_code": "5aa01f1fb8c92635c69d399deda516b2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Xmas-Tales.png"
//         },
//         {
//             "game_name": "Peeking Banker Bull-Bull",
//             "game_code": "e21186914febf15786f84951e013a37a",
//             "game_type": "Table Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Peeking-Banker-Bull-Bull.png"
//         },
//         {
//             "game_name": "Banker Dice Bull-Bull",
//             "game_code": "874ef5c8f7c51b3e6e8d8f3189917219",
//             "game_type": "Table Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Banker-Dice-Bull-Bull.png"
//         },
//         {
//             "game_name": "Thai Pok Deng",
//             "game_code": "5843c49f399e462d8e4852c45bf14d34",
//             "game_type": "Table Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/cq9/Thai-Pok-Deng.png"
//         },




//     ]
// }

const jilli = {
    platform: 'digital',
    provider: 'jilli',
    games:
        [
            {
                "game_name": "Chin Shi Huang",
                "game_code": "24da72b49b0dd0e5cbef9579d09d8981",
                "game_type": "Slot Game",
                "game_image": "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-003.png?v=1778346480421"
            },
            {
                "game_name": "God Of Martial",
                "game_code": "21ef8a7ddd39836979170a2e7584e333",
                "game_type": "Slot Game",
                "game_image": "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-010.png?v=1778346481524"
            },
            {
                "game_name": "Hot Chilli",
                "game_code": "c845960c81d27d7880a636424e53964d",
                "game_type": "Slot Game",
                "game_image": "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-002.png?v=1778346480273"
            },
            {
                "game_name": "Fortune Tree",
                "game_code": "6a7e156ceec5c581cd6b9251854fe504",
                "game_type": "Slot Game",
                "game_image": "https://img.b112j.com/upload/game/AWCV2_JILI/BDT/JILI-SLOT-005.png?v=1778346480722"
            },
            {
                "game_name": "War Of Dragons",
                "game_code": "4b1d7ffaf9f66e6152ea93a6d0e4215b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/War-Of-Dragons.png"
            },
            {
                "game_name": "Gem Party",
                "game_code": "756cf3c73a323b4bfec8d14864e3fada",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Gem-Party.png"
            },
            {
                "game_name": "Lucky Ball",
                "game_code": "893669898cd25d9da589a384f1d004df",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Lucky-Ball.png"
            },
            {
                "game_name": "Hyper Burst",
                "game_code": "a47b17970036b37c1347484cf6956920",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Hyper-Burst.png"
            },
            {
                "game_name": "Shanghai Beauty",
                "game_code": "795d0cae623cbf34d7f1aa93bbcded28",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Shanghai-Beauty.png"
            },
            {
                "game_name": "Fa Fa Fa",
                "game_code": "54c41adcf43fdb6d385e38bc09cd77ca",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fa-Fa-Fa.png"
            },
            {
                "game_name": "Candy Baby",
                "game_code": "2cc3b68cbcfacac2f7ef2fe19abc3c22",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Candy-Baby.png"
            },
            {
                "game_name": "Hawaii Beauty",
                "game_code": "6409b758471b6df30c6b137b49f4d92e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Hawaii-Beauty.png"
            },
            {
                "game_name": "SevenSevenSeven",
                "game_code": "61d46add6841aad4758288d68015eca6",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/SevenSevenSeven.png"
            },
            {
                "game_name": "Bubble Beauty",
                "game_code": "a78d2ed972aab8ba06181cc43c54a425",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bubble-Beauty.png"
            },
            {
                "game_name": "FortunePig",
                "game_code": "8488c76ee2afb8077fbd7eec62721215",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/FortunePig.png"
            },
            {
                "game_name": "Crazy777",
                "game_code": "8c62471fd4e28c084a61811a3958f7a1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Crazy777.png"
            },
            {
                "game_name": "Bao boon chin",
                "game_code": "8c4ebb3dc5dcf7b7fe6a26d5aadd2c3d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bao-boon-chin.png"
            },
            {
                "game_name": "Night City",
                "game_code": "78e29705f7c6084114f46a0aeeea1372",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Night-City.png"
            },
            {
                "game_name": "Fengshen",
                "game_code": "09699fd0de13edbb6c4a194d7494640b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fengshen.png"
            },
            {
                "game_name": "Crazy FaFaFa",
                "game_code": "a57a8d5176b54d4c825bd1eee8ab34df",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Crazy-FaFaFa.png"
            },
            {
                "game_name": "XiYangYang",
                "game_code": "5a962d0e31e0d4c0798db5f331327e4f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/XiYangYang.png"
            },
            {
                "game_name": "DiamondParty",
                "game_code": "48d598e922e8c60643218ccda302af08",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/DiamondParty.png"
            },
            {
                "game_name": "Golden Bank",
                "game_code": "c3f86b78938eab1b7f34159d98796e88",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Bank.png"
            },
            {
                "game_name": "Dragon Treasure",
                "game_code": "c6955c14f6c28a6c2a0c28274fec7520",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dragon-Treasure.png"
            },
            {
                "game_name": "Charge Buffalo",
                "game_code": "984615c9385c42b3dad0db4a9ef89070",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Charge-Buffalo.png"
            },
            {
                "game_name": "Lucky Goldbricks",
                "game_code": "d84ef530121953240116e3b2e93f6af4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Lucky-Goldbricks.png"
            },
            {
                "game_name": "Super Ace",
                "game_code": "bdfb23c974a2517198c5443adeea77a8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Super-Ace.png"
            },
            {
                "game_name": "Money Coming",
                "game_code": "db249defce63610fccabfa829a405232",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Money-Coming.png"
            },
            {
                "game_name": "Golden Queen",
                "game_code": "8de99455c2f23f6827666fd798eb80ef",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Queen.png"
            },
            {
                "game_name": "Jungle King",
                "game_code": "4db0ec24ff55a685573c888efed47d7f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Jungle-King.png"
            },
            {
                "game_name": "Monkey Party",
                "game_code": "fd369a4a7486ff303beea267ec5c8eff",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Monkey-Party.png"
            },
            {
                "game_name": "Boxing King",
                "game_code": "981f5f9675002fbeaaf24c4128b938d7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Boxing-King.png"
            },
            {
                "game_name": "Secret Treasure",
                "game_code": "1d1f267e3a078ade8e5ccd56582ac94f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Secret-Treasure.png"
            },
            {
                "game_name": "Pharaoh Treasure",
                "game_code": "c7a69ab382bd1ff0e6eb65b90a793bdd",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Pharaoh-Treasure.png"
            },
            {
                "game_name": "Lucky Coming",
                "game_code": "ba858ec8e3b5e2b4da0d16b3a2330ca7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Lucky-Coming.png"
            },
            {
                "game_name": "Super Rich",
                "game_code": "b92f491a63ac84b106b056e9d46d35c5",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Super-Rich.png"
            },
            {
                "game_name": "RomaX",
                "game_code": "e5ff8e72418fcc608d72ea21cc65fb70",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/RomaX.png"
            },
            {
                "game_name": "Golden Empire",
                "game_code": "490096198e28f770a3f85adb6ee49e0f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Empire.png"
            },
            {
                "game_name": "Fortune Gems",
                "game_code": "a990de177577a2e6a889aaac5f57b429",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fortune-Gems.png"
            },
            {
                "game_name": "Crazy Hunter",
                "game_code": "69082f28fcd46cbfd10ce7a0051f24b6",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Crazy-Hunter.png"
            },
            {
                "game_name": "Party Night",
                "game_code": "d505541d522aa5ca01fc5e97cfcf2116",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Party-Night.png"
            },
            {
                "game_name": "Magic Lamp",
                "game_code": "582a58791928760c28ec4cef3392a49f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Magic-Lamp.png"
            },
            {
                "game_name": "Agent Ace",
                "game_code": "8a4b4929e796fda657a2d38264346509",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Agent-Ace.png"
            },
            {
                "game_name": "TWIN WINS",
                "game_code": "c74b3cbda5d16f77523e41c25104e602",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/TWIN-WINS.png"
            },
            {
                "game_name": "Ali Baba",
                "game_code": "cc686634b4f953754b306317799f1f39",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Ali-Baba.png"
            },
            {
                "game_name": "Mega Ace",
                "game_code": "eba92b1d3abd5f0d37dfbe112abdf0e2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Mega-Ace.png"
            },
            {
                "game_name": "Medusa",
                "game_code": "2c17b7c4e2ce5b8bebf4bd10e3e958d7",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Medusa.png"
            },
            {
                "game_name": "Book of Gold",
                "game_code": "6b283c434fd44250d83b7c2420f164f9",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Book-of-Gold.png"
            },
            {
                "game_name": "Thor X",
                "game_code": "7e6aa773fa802aaa9cb1f2fac464736e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Thor-X.png"
            },
            {
                "game_name": "Happy Taxi",
                "game_code": "1ed896aae4bdc78c984021307b1dd177",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Happy-Taxi.png"
            },
            {
                "game_name": "Gold Rush",
                "game_code": "2a5d731e0fd60f52873a24ece11f2c0b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Gold-Rush.png"
            },
            {
                "game_name": "Mayan Empire",
                "game_code": "5c2383ef253f9c36dacec4b463d61622",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Mayan-Empire.png"
            },
            {
                "game_name": "Crazy Pusher",
                "game_code": "00d92d5cec10cf85623938222a6c2bb6",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Crazy-Pusher.png"
            },
            {
                "game_name": "Bone Fortune",
                "game_code": "aab3048abc6a88e0759679fbe26e6a8d",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bone-Fortune.png"
            },
            {
                "game_name": "JILI CAISHEN",
                "game_code": "11e330c2b23f106815f3b726d04e4316",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/JILI-CAISHEN.png"
            },
            {
                "game_name": "Bonus Hunter",
                "game_code": "39775cdc4170e56c5f768bdee8b4fa00",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bonus-Hunter.png"
            },
            {
                "game_name": "World Cup",
                "game_code": "28374b7ad7c91838a46404f1df046e5a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/World-Cup.png"
            },
            {
                "game_name": "Samba",
                "game_code": "6d35789b2f419c1db3926350d57c58d8",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Samba.png"
            },
            {
                "game_name": "Neko Fortune",
                "game_code": "9a391758f755cb30ff973e08b2df6089",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Neko-Fortune.png"
            },
            {
                "game_name": "Wild Racer",
                "game_code": "2f0c5f96cda3c6e16b3929dd6103df8e",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Wild-Racer.png"
            },
            {
                "game_name": "Pirate Queen",
                "game_code": "70999d5bcf2a1d1f1fb8c82e357317f4",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Pirate-Queen.png"
            },
            {
                "game_name": "Golden Joker",
                "game_code": "f301fe0b22d1540b1f215d282b20c642",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Joker.png"
            },
            {
                "game_name": "Wild Ace",
                "game_code": "9a3b65e2ae5343df349356d548f3fc4b",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Wild-Ace.png"
            },
            {
                "game_name": "Master Tiger",
                "game_code": "d2b48fe98ac2956eeefd2bc4f7e0335a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Master-Tiger.png"
            },
            {
                "game_name": "Fortune Gems 2",
                "game_code": "664fba4da609ee82b78820b1f570f4ad",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fortune-Gems-2.png"
            },
            {
                "game_name": "Sweet Land",
                "game_code": "91250a55f75a3c67ed134b99bf587225",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Sweet-Land.png"
            },
            {
                "game_name": "Cricket King 18",
                "game_code": "dcf220f4e3ecca0278911a55e6f11c77",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Cricket-King-18.png"
            },
            {
                "game_name": "Elf Bingo",
                "game_code": "5cec2b309a8845b38f8e9b4e6d649ea2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Elf-Bingo.png"
            },
            {
                "game_name": "Cricket Sah 75",
                "game_code": "6720a0ce1d06648ff390fbea832798a9",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Cricket-Sah-75.png"
            },
            {
                "game_name": "Golden Temple",
                "game_code": "976c5497256c020ac012005f6bb166ad",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Temple.png"
            },
            {
                "game_name": "Devil Fire",
                "game_code": "1b4c5865131b4967513c1ee90cba4472",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Devil-Fire.png"
            },
            {
                "game_name": "Bangla Beauty",
                "game_code": "6b60d159f0939a45f7b4c88a9b57499a",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bangla-Beauty.png"
            },
            {
                "game_name": "Aztec Priestess",
                "game_code": "6acff19b2d911a8c695ba24371964807",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Aztec-Priestess.png"
            },
            {
                "game_name": "Fortune Monkey",
                "game_code": "add95fc40f1ef0d56f5716ce45a56946",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fortune-Monkey.png"
            },
            {
                "game_name": "Dabanggg",
                "game_code": "5404a45b06826911c3537fdf935c281f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dabanggg.png"
            },
            {
                "game_name": "Sin City",
                "game_code": "830cac2f5da6cc1fb91cfae04b85b1e2",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Sin-City.png"
            },
            {
                "game_name": "King Arthur",
                "game_code": "fafab1a17a237d0fc0e50c20d2c2bf4c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/King-Arthur.png"
            },
            {
                "game_name": "Charge Buffalo Ascent",
                "game_code": "28bc4a33c985ddce6acd92422626b76f",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Charge-Buffalo-Ascent.png"
            },
            {
                "game_name": "Witches Night",
                "game_code": "82c5c404cf4c0790deb42a2b5653533c",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Witches-Night.png"
            },
            {
                "game_name": "Fortune Gems 3",
                "game_code": "63927e939636f45e9d6d0b3717b3b1c1",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fortune%20Gems%203.jpg"
            },
            {
                "game_name": "Super Ace Deluxe",
                "game_code": "80aad2a10ae6a95068b50160d6c78897",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Super%20Ace%20Deluxe.jpg"
            },
            {
                "game_name": "3 Coin Treasures",
                "game_code": "69c1b4586b5060eefcb45bb479f03437",
                "game_type": "Slot Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/3%20Coin%20Treasures.png"
            },
            {
                "game_name": "Big Small",
                "game_code": "25822eb4d6459cc8b39c4f7b69b1bf2c",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Big-Small.png"
            },
            {
                "game_name": "Number King",
                "game_code": "36d20c24669dca7630715f2e0a7c18be",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Number-King.png"
            },
            {
                "game_name": "Journey West M",
                "game_code": "0d0a5a1731a6a05ffeb0e0f9d1948f80",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Journey-West-M.png"
            },
            {
                "game_name": "Poker King",
                "game_code": "a9b13010273fcb0284c9ef436c5fe2ff",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Poker-King.png"
            },
            {
                "game_name": "Dragon & Tiger",
                "game_code": "e7ac92d2fdd2aedca92a3521b4416f47",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dragon-&-Tiger.png"
            },
            {
                "game_name": "iRich Bingo",
                "game_code": "a53e46bf1e31f7a960ae314dc188e8b3",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/iRich-Bingo.png"
            },
            {
                "game_name": "7up7down",
                "game_code": "3aca3084a5c1a8c77c52d6147ee3d2ab",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/7up7down.png"
            },
            {
                "game_name": "Baccarat",
                "game_code": "b9c7c5f589cdaa63c4495e69eaa6dbbf",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Baccarat.png"
            },
            {
                "game_name": "Fortune Bingo",
                "game_code": "2fd70535a3c838a438b4b8003ecce49d",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Fortune-Bingo.png"
            },
            {
                "game_name": "Sic Bo",
                "game_code": "de0dc8a7fd369bd39a2d5747be87825c",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Sic-Bo.png"
            },
            {
                "game_name": "Super Bingo",
                "game_code": "c934e67c2a84f52ef4fb598b56f3e7ba",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Super-Bingo.png"
            },
            {
                "game_name": "Bingo Carnaval",
                "game_code": "d419ec9ab6a23590770fd77b036aed16",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bingo-Carnaval.png"
            },
            {
                "game_name": "Win Drop",
                "game_code": "8211bc6e55e84d266bef9a6960940183",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Win-Drop.png"
            },
            {
                "game_name": "Lucky Bingo",
                "game_code": "c9f2470e285f3580cd761ba2e1f067e1",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Lucky-Bingo.png"
            },
            {
                "game_name": "Jackpot Bingo",
                "game_code": "780d43c0a98bc8f6a0705976605608c3",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Jackpot-Bingo.png"
            },
            {
                "game_name": "Color Game",
                "game_code": "2ac4917fbc8b2034307b0c3cdd90d416",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Color-Game.png"
            },
            {
                "game_name": "Go Goal BIngo",
                "game_code": "4e5ddaa644badc5f68974a65bf7af02a",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Go-Goal-BIngo.png"
            },
            {
                "game_name": "Calaca Bingo",
                "game_code": "b2f05dae5370035a2675025953d1d115",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Calaca-Bingo.png"
            },
            {
                "game_name": "PAPPU",
                "game_code": "e5091890bbb65a5f9ceb657351fa73c1",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/PAPPU.png"
            },
            {
                "game_name": "West Hunter Bingo",
                "game_code": "8d2c1506dc4ae4c47d23f9359d71c360",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/West-Hunter-Bingo.png"
            },
            {
                "game_name": "Bingo Adventure",
                "game_code": "2303867628a9a62272da7576665bbc65",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Bingo-Adventure.png"
            },
            {
                "game_name": "Golden Land",
                "game_code": "05fc951a633d4c6b4bbe8c429cd63658",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Golden-Land.png"
            },
            {
                "game_name": "Candyland Bingo",
                "game_code": "711acbdf297ce40a09dd0e9023b63f50",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Candyland-Bingo.png"
            },
            {
                "game_name": "Color Prediction",
                "game_code": "4a64504353c2304a3061bfd31cd9a62e",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Color-Prediction.png"
            },
            {
                "game_name": "Magic Lamp Bingo",
                "game_code": "848ac1703885d5a86b54fbbf094b3b63",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Magic-Lamp-Bingo.png"
            },
            {
                "game_name": "Pearls of Bingo",
                "game_code": "0995142f4685f66dfdd1a54fffa66ffa",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Pearls-of-Bingo.png"
            },
            {
                "game_name": "European Roulette",
                "game_code": "d4fc911a31b3a61edd83bdd95e36f3bf",
                "game_type": "Table Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/European-Roulette.png"
            },
            {
                "game_name": "Go Rush",
                "game_code": "edef29b5eda8e2eaf721d7315491c51d",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Go-Rush.png"
            },
            {
                "game_name": "Mines",
                "game_code": "72ce7e04ce95ee94eef172c0dfd6dc17",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Mines.png"
            },
            {
                "game_name": "Tower",
                "game_code": "8e939551b9e785001fcb5b0a32f88aba",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Tower.png"
            },
            {
                "game_name": "HILO",
                "game_code": "bd8a2bb2dd63503b93cf6ac9492786ce",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/HILO.png"
            },
            {
                "game_name": "Limbo",
                "game_code": "eabf08253165b6bb2646e403de625d1a",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Limbo.png"
            },
            {
                "game_name": "Wheel",
                "game_code": "6e19e03c50f035ddd9ffd804c30f8c80",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Wheel.png"
            },
            {
                "game_name": "Mines Gold",
                "game_code": "4bceeb28b1a88c87d1ef518d7af2bba9",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Mines-Gold.png"
            },
            {
                "game_name": "Keno",
                "game_code": "a54e3f5e231085c7d8ba99e8ed2261fc",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Keno.png"
            },
            {
                "game_name": "Plinko",
                "game_code": "e3b71c6844eb8c30f5ef210ad92725a6",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Plinko.png"
            },
            {
                "game_name": "Crash Bonus",
                "game_code": "a7f3e5f210523a989a7c6b32f2f1ad42",
                "game_type": "Crash Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Crash-Bonus.png"
            },
            {
                "game_name": "TeenPatti",
                "game_code": "f743cb55c2c4b737727ef144413937f4",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/TeenPatti.png"
            },
            {
                "game_name": "AK47",
                "game_code": "488c377662cad37a551bde18e2fbe785",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/AK47.png"
            },
            {
                "game_name": "Andar Bahar",
                "game_code": "6f48b3aa0b64c79a2dc320ea021148b5",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Andar-Bahar.png"
            },
            {
                "game_name": "Rummy",
                "game_code": "ae632f32c3a1e6803f9a6fbec16be28e",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Rummy.png"
            },
            {
                "game_name": "Callbreak",
                "game_code": "9092b5a56e001c60850c4c1184c53e07",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Callbreak.png"
            },
            {
                "game_name": "TeenPatti Joker",
                "game_code": "1a4eaca67612e65fdcae43f4c8a667a4",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/TeenPatti-Joker.png"
            },
            {
                "game_name": "Callbreak Quick",
                "game_code": "aa9a9916d6e48ba50afa3c2246b6dacb",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Callbreak-Quick.png"
            },
            {
                "game_name": "TeenPatti 20-20",
                "game_code": "1afa7db588d05de7b9abca4664542765",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/TeenPatti-20-20.png"
            },
            {
                "game_name": "Tongits Go",
                "game_code": "26fbfab92a3837b7dbf767e783b173af",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Tongits-Go.png"
            },
            {
                "game_name": "Pusoy Go",
                "game_code": "f2879a3f20f305eadad13448e11c052e",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Pusoy-Go.png"
            },
            {
                "game_name": "Blackjack",
                "game_code": "3b502aee6c9e1ef0f698332ee1b76634",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Blackjack.png"
            },
            {
                "game_name": "Blackjack Lucky Ladies",
                "game_code": "d0d1c20062e28493e1750f27a1730c48",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Blackjack-Lucky-Ladies.png"
            },
            {
                "game_name": "MINI FLUSH",
                "game_code": "07afefc388ab6af8cf26f85286f83fae",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/MINI-FLUSH.png"
            },

            {
                "game_name": "Caribbean Stud Poker",
                "game_code": "04c9784b0b1b162b2c86f9ce353da8b7",
                "game_type": "India Poker Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Caribbean-Stud-Poker.png"
            },

            {
                "game_name": "Royal Fishing",
                "game_code": "e794bf5717aca371152df192341fe68b",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Royal-Fishing.png"
            },

            {
                "game_name": "Dinosaur Tycoon",
                "game_code": "eef3e28f0e3e7b72cbca61e7924d00f1",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dinosaur-Tycoon.png"
            },

            {
                "game_name": "Dragon Fortune",
                "game_code": "1200b82493e4788d038849bca884d773",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dragon-Fortune.png"
            },
            {
                "game_name": "Mega Fishing",
                "game_code": "caacafe3f64a6279e10a378ede09ff38",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Mega-Fishing.png"
            },
            {
                "game_name": "Boom Legend",
                "game_code": "f02ede19c5953fce22c6098d860dadf4",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Boom-Legend.png"
            },
            {
                "game_name": "Happy Fishing",
                "game_code": "71c68a4ddb63bdc8488114a08e603f1c",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Happy-Fishing.png"
            },
            {
                "game_name": "All-star Fishing",
                "game_code": "9ec2a18752f83e45ccedde8dfeb0f6a7",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/All-star-Fishing.png"
            },
            {
                "game_name": "Dinosaur Tycoon II",
                "game_code": "bbae6016f79f3df74e453eda164c08a4",
                "game_type": "Fish Game",
                "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jili/Dinosaur-Tycoon-II.png"
            }
        ]
}

// const jdb = {
//     platform: 'digital',
//     provider: 'jdb',
//     games: [
//         {
//             "game_name": "Dragon Soar",
//             "game_code": "9341a18d096ad901ef77338998f29098",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Dragon-Soar.png"
//         },
//         {
//             "game_name": "Pop Pop Candy",
//             "game_code": "fde142e65f14da39f784e9e5325e0a77",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Pop-Pop-Candy.png"
//         },
//         {
//             "game_name": "Open Sesame Mega",
//             "game_code": "cb5e57be0354264c6c7ea0cdf4eb18b3",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Open-Sesame-Mega.png"
//         },
//         {
//             "game_name": "Fruity Bonanza",
//             "game_code": "f5d6b418b755f3aefe3b9828f3112c9c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Fruity-Bonanza.png"
//         },
//         {
//             "game_name": "Caishen Coming",
//             "game_code": "45ecec5dd5077785e7a09988b95bbd24",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Caishen-Coming.png"
//         },
//         {
//             "game_name": "Coocoo Farm",
//             "game_code": "d1f17fd51e474b0e72892332ea551ba1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Coocoo-Farm.png"
//         },
//         {
//             "game_name": "Elemental Link Water",
//             "game_code": "b84274cdfa5731945a34bfd0db1ddeea",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Elemental-Link-Water.png"
//         },
//         {
//             "game_name": "Elemental Link Fire",
//             "game_code": "46016a772b92c7f47dfdc5873f184ef1",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Elemental-Link-Fire.png"
//         },
//         {
//             "game_name": "Birdsparty Deluxe",
//             "game_code": "786d1cd7f4fa9905c825378292f1204c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Birdsparty-Deluxe.png"
//         },
//         {
//             "game_name": "Moneybags Man 2",
//             "game_code": "33c862e7db9e0e59ab3f8fe770f797da",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Moneybags-Man-2.png"
//         },
//         {
//             "game_name": "Trump Card",
//             "game_code": "96c010fc4a95792401e903213d7add44",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Trump-Card.png"
//         },
//         {
//             "game_name": "Fortune Neko",
//             "game_code": "49b706ccfe7c53727ee6760cd9a8721a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Fortune-Neko.png"
//         },
//         {
//             "game_name": "Book Of Mystery",
//             "game_code": "13072a6eb2111c1b5202fe6155227e94",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Book-Of-Mystery.png"
//         },
//         {
//             "game_name": "Prosperitytiger",
//             "game_code": "1d704bbb187a113229f3fdaa3b5406fe",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Prosperitytiger.png"
//         },
//         {
//             "game_name": "Glamorous Girl",
//             "game_code": "2663e14e5b455525252a25d9bd99e840",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Glamorous-Girl.png"
//         },
//         {
//             "game_name": "Blossom Of Wealth",
//             "game_code": "ed6fbaeb7a104dd7ed96fa1683a48669",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Blossom-Of-Wealth.png"
//         },
//         {
//             "game_name": "Big Three Dragons",
//             "game_code": "600c338d3fca2da208f1bba2c9d29059",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Big-Three-Dragons.png"
//         },
//         {
//             "game_name": "Mayagoldcrazy",
//             "game_code": "6c8009d165293759bb218b72ba3c380f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Mayagoldcrazy.png"
//         },
//         {
//             "game_name": "Lantern Wealth",
//             "game_code": "f2f2eae301311f0320ef669b68935546",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lantern-Wealth.png"
//         },
//         {
//             "game_name": "Marvelous Iv",
//             "game_code": "126cf2bfe8a8e606b362d23de02c0d5e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Marvelous-Iv.png"
//         },
//         {
//             "game_name": "Wonder Elephant",
//             "game_code": "540da2ba4c849fc1c315f43ae74df220",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Wonder-Elephant.png"
//         },
//         {
//             "game_name": "Kong",
//             "game_code": "f6e9fd31cbc3be8cd3bd95486177377b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Kong.png"
//         },
//         {
//             "game_name": "Lucky Diamond",
//             "game_code": "6f6867ad1956a04b174c92629cab7f54",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Diamond.png"
//         },
//         {
//             "game_name": "Spindrift 2",
//             "game_code": "05dc8c7a43305c3fcb43574c570d6378",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Spindrift-2.png"
//         },
//         {
//             "game_name": "Dragons Gate",
//             "game_code": "feaba603992f26633116fb54562e3693",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Dragons-Gate.png"
//         },
//         {
//             "game_name": "Spindrift",
//             "game_code": "b624d1917ef5a740c151e4904a7cf0dd",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Spindrift.png"
//         },
//         {
//             "game_name": "Double Wilds",
//             "game_code": "7bd5233c83de0669336ee649e6c8d2b5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Double-Wilds.png"
//         },
//         {
//             "game_name": "Moneybags Man",
//             "game_code": "c4fdebb24ff26fffb3a65d018da8ae92",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Moneybags-Man.png"
//         },
//         {
//             "game_name": "Miner Babe",
//             "game_code": "e705514fdd4f9bea5f82bbd0b2c0a353",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Miner-Babe.png"
//         },
//         {
//             "game_name": "Super Niubi Deluxe",
//             "game_code": "5d940d11c48b64ec1e6a3c8be5228250",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Super-Niubi-Deluxe.png"
//         },
//         {
//             "game_name": "Funky King Kong",
//             "game_code": "cdea2d0670bc40309b4a9b6f942a218a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Funky-King-Kong.png"
//         },
//         {
//             "game_name": "Golden Disco",
//             "game_code": "dfb8a198ce0e821560cf543387a2acc2",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Golden-Disco.png"
//         },
//         {
//             "game_name": "Treasure Bowl",
//             "game_code": "0651af3e73c7600633522ffe15cc175b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Treasure-Bowl.png"
//         },
//         {
//             "game_name": "Mjolnir",
//             "game_code": "e270f0674dff538b181499d18ab47845",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Mjolnir.png"
//         },
//         {
//             "game_name": "Fortune Treasure",
//             "game_code": "5a55a19d9cfbead5e64b8169e96bd27a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Fortune-Treasure.png"
//         },
//         {
//             "game_name": "Super Niubi",
//             "game_code": "4042e5d0c777e1d3c3bd481dac0a867e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Super-Niubi.png"
//         },
//         {
//             "game_name": "Dragons World",
//             "game_code": "00b886803f3d067f7028872468e84745",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Dragons-World.png"
//         },
//         {
//             "game_name": "Go Lai Fu",
//             "game_code": "a3584394182e8abce362d90c2f048c75",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Go-Lai-Fu.png"
//         },
//         {
//             "game_name": "Birds Party",
//             "game_code": "7b497c4d19f87c86ea29910c12129edc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Birds-Party.png"
//         },
//         {
//             "game_name": "Triple King Kong",
//             "game_code": "a9f60e017f2765c74e1ec80473ac4ffa",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Triple-King-Kong.png"
//         },
//         {
//             "game_name": "Orient Animals",
//             "game_code": "bdb0459f7e116a20839a3b2a0063a2ff",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Orient-Animals.png"
//         },
//         {
//             "game_name": "Lucky Seven",
//             "game_code": "b560b7c42bd29f7d0cda06485a3c4af5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Seven.png"
//         },
//         {
//             "game_name": "Kingsman",
//             "game_code": "55e3b4d064b014a403be6ffba8c4343e",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Kingsman.png"
//         },
//         {
//             "game_name": "Dragon",
//             "game_code": "735fcdbf9f5e6042132cc01e9860723f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Dragon.png"
//         },
//         {
//             "game_name": "Dragon Warrior",
//             "game_code": "29135c91125ae1655f8c91eb29617705",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Dragon-Warrior.png"
//         },
//         {
//             "game_name": "Billionaire",
//             "game_code": "16b1418fe87a6fa5628eec8cb40da056",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Billionaire.png"
//         },
//         {
//             "game_name": "Legendary 5",
//             "game_code": "04a3be36bbf1110345d53e07df9c9cc3",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Legendary-5.png"
//         },
//         {
//             "game_name": "Rooster In Love",
//             "game_code": "2f24019dc8abbe05b984611462a1f01c",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Rooster-In-Love.png"
//         },
//         {
//             "game_name": "Xi Yang Yang",
//             "game_code": "f1496f1b49981a63e6064ac84517b5ae",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Xi-Yang-Yang.png"
//         },
//         {
//             "game_name": "Fortune Horse",
//             "game_code": "ca6e7b621b13077debbf1bf9d5a6c031",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Fortune-Horse.png"
//         },
//         {
//             "game_name": "Flirting Scholar Tang Ii",
//             "game_code": "857d3426c220b4003cd0e4521c07e94b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Flirting-Scholar-Tang-Ii.png"
//         },
//         {
//             "game_name": "Open Sesameii",
//             "game_code": "558ca5b101d1be5bd7a08c6d01422c4f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Open-Sesameii.png"
//         },
//         {
//             "game_name": "Winning Mask Ii",
//             "game_code": "955ab46e30fcda3b2446169409848fa7",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Winning-Mask-Ii.png"
//         },
//         {
//             "game_name": "Guan Gong",
//             "game_code": "90bfd55dcf41709d27f1f38fd4a314a9",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Guan-Gong.png"
//         },
//         {
//             "game_name": "Beauty And The Kingdom",
//             "game_code": "478d2e337f0d0a1b40e0e3521f89f1ba",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Beauty-And-The-Kingdom.png"
//         },
//         {
//             "game_name": "Lucky Phoenix",
//             "game_code": "8244e0afc46b2b8a3446ec18ae0e129a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Phoenix.png"
//         },
//         {
//             "game_name": "Lucky Miner",
//             "game_code": "8146db6ded1ef29540d262650817d090",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Miner.png"
//         },
//         {
//             "game_name": "Olympian Temple",
//             "game_code": "ca11d9830495d2888d7e50770353ce32",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Olympian-Temple.png"
//         },
//         {
//             "game_name": "Mahjong",
//             "game_code": "e9d4b66c06a43e73ec8f1b2055f83c3a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Mahjong.png"
//         },
//         {
//             "game_name": "Banana Saga",
//             "game_code": "77f407b50f00ec4569249b008a5adca0",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Banana-Saga.png"
//         },
//         {
//             "game_name": "Open Sesame",
//             "game_code": "d5cede7b6800bd9cd266cde8c4f73dc6",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Open-Sesame.png"
//         },
//         {
//             "game_name": "Four Treasures",
//             "game_code": "d53f82ab4fbb353480e012fd763bc339",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Four-Treasures.png"
//         },
//         {
//             "game_name": "Napoleon",
//             "game_code": "e4b973ece238c954fbcdf30fdfeae969",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Napoleon.png"
//         },
//         {
//             "game_name": "New Year",
//             "game_code": "319fb2a372755ff47f6adc4f36e67b0f",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/New-Year.png"
//         },
//         {
//             "game_name": "Moonlight Treasure",
//             "game_code": "85e29fa6b578c6bf131ad4fdff750acb",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Moonlight-Treasure.png"
//         },
//         {
//             "game_name": "Lucky Lion",
//             "game_code": "c1557ea0fad63c5e07b32d9f62ef1899",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Lion.png"
//         },
//         {
//             "game_name": "Lucky Qilin",
//             "game_code": "f2298bcf0de0dccdd767d30b6e4f811a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Qilin.png"
//         },
//         {
//             "game_name": "Formosa Bear",
//             "game_code": "e0afed167c1ef4c9a35c527a52419f0a",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Formosa-Bear.png"
//         },
//         {
//             "game_name": "The Llama Adventure",
//             "game_code": "6800ef74e2b33c9a9155848f1328c8e5",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/The-Llama-Adventure.png"
//         },
//         {
//             "game_name": "Wukong",
//             "game_code": "59acc6ad72fd6fb6cf30eb58cd9bedb8",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Wukong.png"
//         },
//         {
//             "game_name": "Winning Mask",
//             "game_code": "4aebce625a1495532a25344f0e4ac584",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Winning-Mask.png"
//         },
//         {
//             "game_name": "Flirting Scholar Tang",
//             "game_code": "07df172c089e29e576aa41eeb0cbeb2b",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Flirting-Scholar-Tang.png"
//         },
//         {
//             "game_name": "Lucky Dragons",
//             "game_code": "c32fff242e09a234f7350bb9aaa055cc",
//             "game_type": "Slot Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Dragons.png"
//         },

//         {
//             "game_name": "Plinko",
//             "game_code": "cb54272cd536cf77eb6093bae2513095",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Plinko.png"
//         },
//         {
//             "game_name": "Hilo",
//             "game_code": "9ffbc085919e5e19f93a682fd3a737bb",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Hilo.png"
//         },
//         {
//             "game_name": "Goal",
//             "game_code": "0160b30b64598290365f61211fb84a7b",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Goal.png"
//         },
//         {
//             "game_name": "Firework Burst",
//             "game_code": "19f082ffb4656934e80459a73ab73037",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Firework-Burst.png"
//         },
//         {
//             "game_name": "Mines",
//             "game_code": "45a2a92108634508e5c47c690eb01c0b",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Mines.png"
//         },
//         {
//             "game_name": "Galaxy Burst",
//             "game_code": "37ca0b32e1908480e03db00cdc1bc2cf",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Galaxy-Burst.png"
//         },
//         {
//             "game_name": "Jogo Do Bicho",
//             "game_code": "0e8432be6bc0cab304b41bc964aaf154",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Jogo-Do-Bicho.png"
//         },
//         {
//             "game_name": "Caishen Party",
//             "game_code": "6437f1794f0753b268b2badbd69ef156",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Caishen-Party.png"
//         },
//         {
//             "game_name": "Lucky Color Game",
//             "game_code": "5708005e9f2340dbd719567a94ba44b4",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Lucky-Color-Game.png"
//         },
//         {
//             "game_name": "King Of Football",
//             "game_code": "4088c7ed9db461f990d9514d6b9f7537",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/King-Of-Football.png"
//         },
//         {
//             "game_name": "Crazy King Kong",
//             "game_code": "c2c611f87d47faae8e4b285fe8145d41",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Crazy-King-Kong.png"
//         },
//         {
//             "game_name": "Super Super Fruit",
//             "game_code": "a9899c045de7873e620e0ef330f3fc73",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Super-Super-Fruit.png"
//         },
//         {
//             "game_name": "Huaguoshan Legends",
//             "game_code": "6ff786580f7d9453728b9a8a3d1c3499",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Huaguoshan-Legends.png"
//         },
//         {
//             "game_name": "Beer Tycoon",
//             "game_code": "b133cf4f3c32b80344b381cc9f26442a",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Beer-Tycoon.png"
//         },
//         {
//             "game_name": "Birds And Animals",
//             "game_code": "db93ffd7164953bb1eb4c86b68542ed6",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Birds-And-Animals.png"
//         },
//         {
//             "game_name": "Happy New Year",
//             "game_code": "d0b0d503d3d553643f665d5d2fdab138",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Happy-New-Year.png"
//         },
//         {
//             "game_name": "Classic Mario",
//             "game_code": "627148e0dd36ff12df432fc920a0c59f",
//             "game_type": "Arcade Games",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Classic-Mario.png"
//         },
//         {
//             "game_name": "Happy Lottery",
//             "game_code": "d6cd29e274d066e2e8f0cb171e7583a8",
//             "game_type": "Lottery Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Happy-Lottery.png"
//         },
//         {
//             "game_name": "Gold Rooster Lottery",
//             "game_code": "2f3361619ef9520214c08fd2aecf33da",
//             "game_type": "Lottery Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Gold-Rooster-Lottery.png"
//         },
//         {
//             "game_name": "Cai Shen Bingo",
//             "game_code": "f3629935719cf04d6b689933486177ce",
//             "game_type": "Lottery Game",
//             "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/jdb/Cai-Shen-Bingo.png"
//         }

//     ]
// }
const spribe = {
    platform: 'digital',
    provider: 'spribe',
    games: [
        {
            "game_name": "Aviator",
            "game_code": "a04d1f3eb8ccec8a4823bdf18e3f0e84",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Aviator.png"
        },
        {
            "game_name": "Dice",
            "game_code": "8a87aae7a3624d284306e9c6fe1b3e9c",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Dice.png"
        },
        {
            "game_name": "Goal",
            "game_code": "c68a515f0b3b10eec96cf6d33299f4e2",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Goal.png"
        },
        {
            "game_name": "Hi Lo",
            "game_code": "a669c993b0e1f1b7da100fcf95516bdf",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Hi-Lo.png"
        },
        {
            "game_name": "Hotline",
            "game_code": "b31720b3cd65d917a1a96ef61a72b672",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Hotline.png"
        },
        {
            "game_name": "Keno",
            "game_code": "c311eb4bbba03b105d150504931f2479",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Keno.png"
        },
        {
            "game_name": "Mines",
            "game_code": "5c4a12fb0a9b296d9b0d5f9e1cd41d65",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Mines.png"
        },
        {
            "game_name": "Mini Roulette",
            "game_code": "9dc7ac6155c5a19c1cc204853e426367",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Mini-Roulette.png"
        },
        {
            "game_name": "Plinko",
            "game_code": "6ab7a4fe5161936012d6b06143918223",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/Plinko.png"
        },
        {
            "game_name": "Balloon",
            "game_code": "de88f202c5a8beeaccabbd944f8acfbf",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/balloon.png"
        },
        {
            "game_name": "Keno 80",
            "game_code": "7a762edbe411ebc9be416870a734bd03",
            "game_type": "Slot Game",
            "game_image": "https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/spribe/keno80.png"
        },

    ]
}

const evolution = {
    platform: 'live',
    provider: 'evolution',
    games: [
        {
            game_name: 'Speed Baccarat 3',
            game_code: 'e7931b2e0d410ddc4f88520e9ad87c4b',
            game_type: 'CasinoLive',
            game_image: ''
        },
        {
            game_name: 'Speed Baccarat F',
            game_code: 'b332c47c868946659d7de97f4157bdb3',
            game_type: 'CasinoLive',
            game_image: ''
        },
        {
            game_name: 'Emperor Speed Baccarat A',
            game_code: '68fa4cdc74cd23b043db2caa25f1b42c',
            game_type: 'CasinoLive',
            game_image: ''
        },
        {
            game_name: 'Super Sic Bo',
            game_code: 'e3951a5bf624e822a22cba1cbe619df5',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/Super Sic Bo.png'
        },
        {
            game_name: 'First Person Top Card',
            game_code: '64985010e87aab51c7fb18076d34062d',
            game_type: 'CasinoLive',
            game_image: ''
        },
        {
            game_name: 'First Person Dream Catcher',
            game_code: '7ee0da50996278d7fe5136f86f368fa5',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Dream Catcher.png'
        },
        {
            game_name: 'First Person Dragon Tiger',
            game_code: '4b4c45709dfd8188d7d6d12fae15bd42',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Dragon Tiger.png'
        },
        {
            game_name: 'First Person Mega Ball',
            game_code: '3150b1cd8fbbddd94d36f20fab504653',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Mega Ball.png'
        },
        {
            game_name: 'First Person Lightning Baccarat',
            game_code: 'fec1b730e804bf14bd471a1e9b82bf44',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Lightning Baccarat.png'
        },
        {
            game_name: 'First Person Craps',
            game_code: '823245918aa2afd108a5912e363c083c',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Craps.png'
        },
        {
            game_name: 'First Person Baccarat',
            game_code: 'e18dfa4a5dd4a0f2d8b45337bd6abb9d',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Baccarat.png'
        },
        {
            game_name: 'First Person Golden Wealth Baccarat',
            game_code: '88e49e3fb9a9883f01f167d03f5efdcb',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Golden Wealth Baccarat.png'
        },
        {
            game_name: 'First Person American Roulette',
            game_code: '88b2d98462fbc45d6d31e95083e183df',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person American Roulette.png'
        },
        {
            game_name: 'First Person Deal or No Deal',
            game_code: 'c715eb06391fabe5275d0b56440f49f3',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Deal or No Deal.png'
        },
        {
            game_name: 'First Person Blackjack',
            game_code: '4ac0e874a4d5fc55bcdba5302b43bc96',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Blackjack.png'
        },
        {
            game_name: 'First Person Lightning Blackjack',
            game_code: '74914b065a9e6b9c7cb8a0e4b17294ed',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Lightning Blackjack.png'
        },
        {
            game_name: 'First Person Roulette',
            game_code: 'a82670530f49a6b3445dc1a592a2eb9e',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Roulette.png'
        },
        {
            game_name: 'Dream Catcher',
            game_code: '7f50a6fbfcd9257299303b5757d43525',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/Dream Catcher.png'
        },
        {
            game_name: 'Football Studio Dice',
            game_code: '1909b4e3380dc37654f8e3997e63ec1b',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/Football Studio Dice.png'
        },
        {
            game_name: 'Dead or Alive: Saloon',
            game_code: 'eda1a2c5edb8370f8df58dcf8e1381b9',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/Dead or Alive: Saloon.png'
        },
        {
            game_name: 'First Person Lightning Roulette',
            game_code: 'f5ee6fce16d369d1a656f3b227fc7236',
            game_type: 'CasinoLive',
            game_image: 'https://huidu-bucket.s3.ap-southeast-1.amazonaws.com/api/evoplay/First Person Lightning Roulette.png'
        },
        {
            "game_name": "Football Studio",
            "game_code": "392e13e38b3cec5ad259254a206d343a",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Deal or No Deal",
            "game_code": "bee6be84ab995f2040f4e575c2cc3910",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Gonzo's Treasure Hunt",
            "game_code": "e1969a739eb17b9e7d97835357a30082",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Cash or Crash",
            "game_code": "b53a604877024ef2eab9946898e65d6b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Monopoly Big Baller",
            "game_code": "067806e82742ca16bfffe70f76215647",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Mega Ball",
            "game_code": "3955853fc6a0b53f7f9b9cff0be19cb8",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Monopoly Live",
            "game_code": "d496ac5fd91702331133e44b6bd12b26",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Crazy Time A",
            "game_code": "814aa56348ac4165588f2a3e251f8732",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Teen Patti",
            "game_code": "0617a82334f4f1766cf282ce906e1df7",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Super Andar Bahar",
            "game_code": "f7b98e899461bdd49f92afc36b4c0db5",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Crazy Time",
            "game_code": "917c0c51d248c33eb058e3210a2e7371",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Side Bet City",
            "game_code": "ccf9a69b0ff627e53fdecfcb3a379ef2",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Texas Hold'em Bonus Poker",
            "game_code": "0d743830cca897a7c4c9187bc7f9b812",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Caribbean Stud Poker",
            "game_code": "724eebd5cbe7555b01ed60279cb59e5a",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Extreme Texas Hold'em",
            "game_code": "fc4e71748bc1a8a7abfc4c1e2f63aa3b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Triple Card Poker",
            "game_code": "b7c3b022f1c2b768524523d855a58d89",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Roulette",
            "game_code": "105735cbbaca3b69176c710ebb2c751d",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "2 Hand Casino Hold'em",
            "game_code": "97dcc429fe7142159aab82b918780f14",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Casino Hold'em",
            "game_code": "8cb4d1c55915742a45f59f2adbb97e24",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Dragonara Roulette",
            "game_code": "5c558d5217948dedcccd2592705a8b2f",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Auto Lightning Roulette",
            "game_code": "bad3e93f3faadef550cb11fcb44a49b1",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Auto-Roulette VIP",
            "game_code": "367c395a50d4ef9edda332e17094670b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Auto-Roulette La Partage",
            "game_code": "56fbfbaa2183a0389eed13255b8b9b52",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Speed Auto Roulette",
            "game_code": "1ffeecc77f75d0485e83036269fd9401",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Double Ball Roulette",
            "game_code": "fae08e8e222f162b27a2d5c4329d1044",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "American Roulette",
            "game_code": "0afb35f8abd269ca0c0c65a49d5145db",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "VIP Roulette",
            "game_code": "e8f217c3d554285933cb67072c897fac",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Instant Roulette",
            "game_code": "ec65c22981a707736871eecfca8e5e25",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Auto-Roulette",
            "game_code": "ed9e15ea8a2cbb9e7ad2604819764d43",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Immersive Roulette",
            "game_code": "3b43390eebe1f1a84b15f1251a253b24",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Emperor Roulette",
            "game_code": "53b7cbb34adc1279d0df4c0942af9393",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Gold Bar Roulette",
            "game_code": "ddec0b9e4bcb684d843af9f480e57369",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "XXXtreme Lightning Roulette",
            "game_code": "394fe6a2cde24bc487767236cc6eccd6",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Roulette",
            "game_code": "c9020da3ac9119910b7146416d5a9850",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack G",
            "game_code": "cf2ee43e0200d8fe0564628d5a56bd6f",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Lightning Roulette",
            "game_code": "4a858d6b74c05260d3ea2762838798c7",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack I",
            "game_code": "d9b7ea7819d2d7abee3197bf2b1281c7",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack J",
            "game_code": "cae32c1011d6e41ab7d6948f1696ab1c",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack H",
            "game_code": "db69d21bbd5bc9d37b38bbfbfa3169fc",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack E",
            "game_code": "88094da66b69066587ab29163d239142",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack F",
            "game_code": "9aef9d09e355adc2f1bb3c4179d28385",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack C",
            "game_code": "2e8a0e70afbf41baf8200fbdf90fb6ec",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack B",
            "game_code": "4c4ee10f6c080904bc2e70f66d6185d4",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack D",
            "game_code": "9e78f6d00dbebadc3efe5a52af3a0c83",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Salon Privé Blackjack A",
            "game_code": "0b8610191202673d86d53d45f4f05804",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack Diamond VIP",
            "game_code": "7d4e80750fdbd046e210dc8e1d1a0c21",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack Fortune VIP",
            "game_code": "06e7ecf8debac2b86e8b38342de30a7a",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack Grand VIP",
            "game_code": "79efa086e10bbd8543b6e03e7a491351",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack Platinum VIP",
            "game_code": "c2bd2aafaa4dbaff9df0cd0b53fc6056",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP Gamma",
            "game_code": "9f71de77938927179599cd645a5688c5",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP Alpha",
            "game_code": "a6117241477a0b712edc856274691f9b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 27",
            "game_code": "74f9dadea990e593f531953b1feaac7b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP Beta",
            "game_code": "3a3bb51ef96c4795ac20c935ca68443b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 26",
            "game_code": "84c4ac47b33cb83dbdfbd56af4e658ad",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 21",
            "game_code": "fcb1de01fe2c14217bfabd92976c7a05",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 25",
            "game_code": "cc61ff297d5beef775880c9ffcccf63e",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 20",
            "game_code": "a9d74415dfdde9ca16087d260c63fd68",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 19",
            "game_code": "31915e590bc4f5904681c9ed3fec7e91",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 22",
            "game_code": "ba4f73d5e19cb97db65f0766cd785434",
            "game_type": "CasinoLive",
            "game_image": ""
        },

        {
            "game_name": "Blackjack VIP 17",
            "game_code": "994a2681526c98fec2b9a2d63a642faa",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 18",
            "game_code": "ebdf09c0f6d79eed79b1027afc9d7df7",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 16",
            "game_code": "295743c7d72fd2eb61ca06749bb25a44",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 15",
            "game_code": "e200f3434cd89322594336ee0f90afd0",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 14",
            "game_code": "1d5d1c1c3d9c76bd7f4c58b9239c373a",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 13",
            "game_code": "ad6b96a22d790052e3f899b3ece69c03",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 11",
            "game_code": "1329b0405db81b9964d6dd6eb0a514c9",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 10",
            "game_code": "323f4086833fda7bb471f10e18a28364",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 9",
            "game_code": "54806d16c3eac96d4bea63ccfc0c674c",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 5",
            "game_code": "f3d684a1b2fb22ac35c67e296df4db31",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 8",
            "game_code": "ecffee81bd446ea53e4836e497f9e803",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 6",
            "game_code": "4a33673ccc580aea8ae80ffa03c12ba7",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 7",
            "game_code": "3d3f89247b5ec9e98e76ef2b22da2532",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 4",
            "game_code": "aed251dded03e8a1e665e52cdc4b6e80",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP X",
            "game_code": "195f9f3cb289ab0c8e281317692590ba",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 3",
            "game_code": "f8e17bc0ad780b65f684558001ee2e64",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 2",
            "game_code": "7530ac3d1140882df7e883641237bb42",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP Z",
            "game_code": "54b14b8af2eab62dad3053c09ff7508d",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP 1",
            "game_code": "9f509cdc3cdce669368977eda1588011",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP V",
            "game_code": "c69e64c185d94548fda619a867e1f031",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP T",
            "game_code": "78beceac05fb03bb597646ee2a85cb1e",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP U",
            "game_code": "921477a239b298fdd623e29c8f982274",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP S",
            "game_code": "a422edff8144adb81cd3e5d0236bb52b",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP P",
            "game_code": "5a04abf1c8f61ff36beaa840b38fd720",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP N",
            "game_code": "8cadf51f3bab6ca1d1351e39920f0cd0",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP Q",
            "game_code": "694ea4e8c2bc49bb69c0c113a29e5c18",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP M",
            "game_code": "bee49a234fcb2ed9547b9e1562953f35",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP O",
            "game_code": "4134e22ef51602a341306df756ee8f2c",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP I",
            "game_code": "2703c1a1340451d9f9d35904c721f7d6",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP K",
            "game_code": "ce84d2072af4db522109e3e349bec9c9",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP J",
            "game_code": "bd5be8139f01f6719bdd15b92e005523",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP L",
            "game_code": "2d2e7afef9695e9cf82be87a08f28d23",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP H",
            "game_code": "fe2e28180d600b1dfc7784324d3df640",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP E",
            "game_code": "2c2f06025f65fe745cabd81a3aae8aba",
            "game_type": "CasinoLive",
            "game_image": ""
        },
        {
            "game_name": "Blackjack VIP G",
            "game_code": "40273c03c2a48786cb6111e35f012e6b",
            "game_type": "CasinoLive",
            "game_image": ""
        }


    ]


}
// const sexybcrt = {
//     platform: 'live',
//     provider: 'sexybcrt',
//     games: [
//         {
//             game_name: 'Baccarat Classic',
//             game_code: 'a225b3ced269ae6545ce3750bcb15175',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Baccarat',
//             game_code: 'e2b258c3076709d5bef791b5031b7bd2',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'DragonTiger',
//             game_code: '5956fee9c7e1524f0e6310e75a368c81',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Roulette',
//             game_code: 'ab22f33340fac5c424ba87c259204002',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Thai Hi Lo',
//             game_code: '2d5b06cf3cc2aa86777523de7df46a78',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Thai Fish Prawn Crab',
//             game_code: '3b504cf69d3b581436eecc82eef54c4c',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Extra Sicbo',
//             game_code: '828afebe8ddb20b96b670e471262c3d1',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },
//         {
//             game_name: 'Sedie',
//             game_code: 'a203874299381060b2c91fa169799031',
//             game_type: 'CasinoLive',
//             game_image: ''
//         },


//     ]


// }

const pragmatic = {
    platform: "digital",
    provider: "pragmatic",
    games: [
        { game_name: "Gem Fire Fortune", game_code: "8a0b30eb466a8a07027cbddc19369d0f", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild West Gold Blazing Bounty", game_code: "91cd6233551cd56e70d900794ed728e3", game_type: "Slot Game", game_image: "" },
        { game_name: "Finger Lick’n Free Spins", game_code: "aa861b71cc3c5dbab1fd7073d5c1c452", game_type: "Slot Game", game_image: "" },
        { game_name: "Gold Party 2 – After Hours", game_code: "e1d2da140286507e851fde1cb2fdd4ba", game_type: "Slot Game", game_image: "" },
        { game_name: "Temple Guardians", game_code: "d333e6e0316422a0d5ffb7eae28fd3b7", game_type: "Slot Game", game_image: "" },
        { game_name: "Big Bass Boxing Bonus Round", game_code: "0b6df3ffc8f38d0e39fccee31e1edf2b", game_type: "Slot Game", game_image: "" },
        { game_name: "Mummy’s Jewels", game_code: "f30340fa76609f5220055eae27ab881e", game_type: "Slot Game", game_image: "" },
        { game_name: "Gates of Hades", game_code: "5eaf8bc24222d8245734ec57cde23bc3", game_type: "Slot Game", game_image: "" },
        { game_name: "Slime Pop", game_code: "e763129659cb5ec4d4a0393f3236dd38", game_type: "Slot Game", game_image: "" },
        { game_name: "Eye of Spartacus", game_code: "94c536991cca6e6df70a30c7e1d896cc", game_type: "Slot Game", game_image: "" },
        { game_name: "Mahjong Wins Super Scatter", game_code: "259ad8e105ef217dad404bffe0fff257", game_type: "Slot Game", game_image: "" },
        { game_name: "Majestic Express - Gold Run", game_code: "ba642e78eca4b9ac43f1a56f8c824705", game_type: "Slot Game", game_image: "" },
        { game_name: "Resurrecting Riches", game_code: "dec331c52aade0f61e5f7dd4bbedfde9", game_type: "Slot Game", game_image: "" },
        { game_name: "Jumbo Safari", game_code: "223147051fc0a47a6d90ebe3e3a0e9c6", game_type: "Slot Game", game_image: "" },
        { game_name: "Sleeping Dragon", game_code: "4a67372025a83767178a6c5fc6c4c8d4", game_type: "Slot Game", game_image: "" },
        { game_name: "Fiesta Fortune", game_code: "fc263087951d1b7406c8a2f3bbedc363", game_type: "Slot Game", game_image: "" },
        { game_name: "Witch Heart Megaways", game_code: "a47148d4858a7f4599dfc00c68a2c141", game_type: "Slot Game", game_image: "" },
        { game_name: "Gates of Olympus Super Scatter", game_code: "880a68222d05a3697055d523d574cb2b", game_type: "Slot Game", game_image: "" },
        { game_name: "Cash Surge", game_code: "de109cef80306297f2a7522a5283dd18", game_type: "Slot Game", game_image: "" },
        { game_name: "Sweet Cherry Blossom", game_code: "ce6fefa0eb82fd4a3f069827ce4f5e25", game_type: "Slot Game", game_image: "" },
        { game_name: "Big Bass Bonanza 1000", game_code: "00d1836f3a1200cb6754a61be4c39160", game_type: "Slot Game", game_image: "" },
        { game_name: "5 Lions Reborn", game_code: "b00d127ba0c5f8439f94646887f1fd4d", game_type: "Slot Game", game_image: "" },
        { game_name: "Ride The Lightning", game_code: "4a6be4b9aeb053d692a649db586d7e56", game_type: "Slot Game", game_image: "" },
        { game_name: "Joker’s Jewels Cash", game_code: "fcb9a4dabb068f060d3701be9fc6a0f0", game_type: "Slot Game", game_image: "" },
        { game_name: "Bandit Megaways", game_code: "de19dcca7f6fbfa5cc5807e786b6b617", game_type: "Slot Game", game_image: "" },
        { game_name: "Fruit Party Dice", game_code: "365d741d1fecf08663e58016675d2a11", game_type: "Slot Game", game_image: "" },
        { game_name: "Blitz Super Wheel", game_code: "d1f8f611d448510a487271b818eabe2f", game_type: "Slot Game", game_image: "" },
        { game_name: "Book of Monsters", game_code: "34cb1fb87c318a4923fc7b7b4e31d53e", game_type: "Slot Game", game_image: "" },
        { game_name: "Triple Pot Gold", game_code: "241e7aaee249b053cb53f7f3e0edf578", game_type: "Slot Game", game_image: "" },
        { game_name: "The Dog House – Royal Hunt", game_code: "102fb01e01cbb7528c6ac803bbd9dd13", game_type: "Slot Game", game_image: "" },
        { game_name: "Volcano Goddess", game_code: "276582955d8f162b3379939a3eb5b038", game_type: "Slot Game", game_image: "" },
        { game_name: "Lucky’s Wild Pub", game_code: "fbe795aa609d23d09688d82498d38f50", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Wild Joker", game_code: "45a1f0f25c0b7c3ab56c1993f9e6e03b", game_type: "Slot Game", game_image: "" },
        { game_name: "Raging Waterfall Megaways", game_code: "497d313c846b303aa1aeea495a4a44b3", game_type: "Slot Game", game_image: "" },
        { game_name: "Greedy Fortune Pig", game_code: "200d25646470d5cca20d0dd408d7957a", game_type: "Slot Game", game_image: "" },
        { game_name: "5 Lions Megaways 2", game_code: "30535756ecf42673db61eca89df50bc3", game_type: "Slot Game", game_image: "" },
        { game_name: "Peppe’s Pepperoni Pizza Plaza", game_code: "395891d339277b24073f5a1ca46cce3c", game_type: "Slot Game", game_image: "" },
        { game_name: "Big Bass Return to the Races", game_code: "9f4e61bc4ef7ebffd8637dd1db5202f1", game_type: "Slot Game", game_image: "" },
        { game_name: "Bigger Bass Splash", game_code: "1944eb208471b5dfd960f26e80cc3715", game_type: "Slot Game", game_image: "" },
        { game_name: "Savannah Legend", game_code: "69866a02334ebe58c3d69c0a4d59255a", game_type: "Slot Game", game_image: "" },
        { game_name: "John Hunter and Galileo’s Secrets", game_code: "0518b5e45a9953982e1c1e77206c2755", game_type: "Slot Game", game_image: "" },
        { game_name: "Ancient Island Megaways", game_code: "914c41ff6ce7c680e2a110d35420b1be", game_type: "Slot Game", game_image: "" },
        { game_name: "Escape the Pyramid Fire & Ice", game_code: "ce7cd8d59599fec6326d5da24f9847ef", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Wildebeest Wins", game_code: "5f096f82cd6cf67f3f3f030a0bb89542", game_type: "Slot Game", game_image: "" },
        { game_name: "Irish Crown", game_code: "3a6bb0239060b0acf471ab2671ca74db", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Wild Pearls", game_code: "69b91ecb2d7ba33c804ceba3ac81956a", game_type: "Slot Game", game_image: "" },
        { game_name: "Aztec Gems Megaways", game_code: "ba3dc54ad1f451262910dda6c61001ce", game_type: "Slot Game", game_image: "" },
        { game_name: "Mahjong Wins - Gong Xi Fa Cai", game_code: "022f71df2642ce42cec8d75be0ec4c59", game_type: "Slot Game", game_image: "" },
        { game_name: "Brick House Bonanza", game_code: "953182d14bc438f502e277812dc452c4", game_type: "Slot Game", game_image: "" },

    ],
};

// const saba = {
//     platform: "digital",
//     provider: "saba",
//     games: [
//         { game_name: "Gem Fire Fortune", game_code: "08ced9dd788aed11ff3c7f387ae0f063", game_type: "Slot Game", game_image: "" },
//     ],
// };
const playngo = {
    platform: "digital",
    provider: "playngo",
    games: [
        { game_name: "Sparky&Shortz", game_code: "50a248ea2542e62a1a796d2b1e121de6", game_type: "Slot Game", game_image: "" },
        { game_name: "Muerto en Mictlan", game_code: "f5a5294357d78653567c392b8f386bf6", game_type: "Slot Game", game_image: "" },
        { game_name: "Beasts of Fire", game_code: "ad9c45d8bed86115afea828f362b1421", game_type: "Slot Game", game_image: "" },
        { game_name: "Bull in a Rodeo", game_code: "790c55c939b8c4beb01a5a0fd9ab9268", game_type: "Slot Game", game_image: "" },
        { game_name: "Tales of Asgard: Loki's Fortune", game_code: "e2b7db849dbf6fa77303ff05412d7ab9", game_type: "Slot Game", game_image: "" },
        { game_name: "Merlin and the Ice Queen Morgana", game_code: "82be129aa1a06d7cfa6cb8dfe68d2645", game_type: "Slot Game", game_image: "" },
        { game_name: "Cat Wilde and the Lost Chapter", game_code: "fe30f84e42e82fb4a31cffb271d73a51", game_type: "Slot Game", game_image: "" },
        { game_name: "Gigantoonz", game_code: "8650281b7cb4e707acad09774b45b84a", game_type: "Slot Game", game_image: "" },
        { game_name: "Moon Princess: Christmas Kingdom", game_code: "ea6ee43262e53deb1990393fa9a06103", game_type: "Slot Game", game_image: "" },
        { game_name: "Love Joker", game_code: "dd40b1b10dc69ed698ebc55d3f0dc567", game_type: "Slot Game", game_image: "" },
        { game_name: "The Last Sundown", game_code: "99f0a52139f0e7a0af9117554f43536d", game_type: "Slot Game", game_image: "" },
        { game_name: "15 Crystal Roses: A Tale of Love", game_code: "6b072dcb3eedf445e0260fc2d2e83316", game_type: "Slot Game", game_image: "" },
        { game_name: "Tale of Kyubiko", game_code: "bc82afddb6d24ef891f70d7b1c9a3106", game_type: "Slot Game", game_image: "" },
        { game_name: "Rich Wilde and the Wandering City", game_code: "55510a4d01b521a72a7e20848e142bdf", game_type: "Slot Game", game_image: "" },
        { game_name: "Captain Xeno's Earth Adventure", game_code: "a0b7345b4699ab37d93c8815e7d99d13", game_type: "Slot Game", game_image: "" },
        { game_name: "Hooligan Hustle", game_code: "8e3e1afd890266cb34e2a8994bd38ed2", game_type: "Slot Game", game_image: "" },
        { game_name: "Raging Rex 2", game_code: "9cf7b04a911896e8e13aac62ef1682ba", game_type: "Slot Game", game_image: "" },
        { game_name: "Safari of Wealth", game_code: "278389ee41407bab6092e388257346b9", game_type: "Slot Game", game_image: "" },
        { game_name: "Secret of Dead", game_code: "ea30e0dc6c93bc21459f7c45a371ab91", game_type: "Slot Game", game_image: "" },
        { game_name: "Tales of Asgard: Freya's Wedding", game_code: "a2942bb4945ef9b8170acf713177a721", game_type: "Slot Game", game_image: "" },
        { game_name: "Puebla Parade", game_code: "824a43d254bf89ebec0c2e3800713a35", game_type: "Slot Game", game_image: "" },
        { game_name: "Moon Princess 100", game_code: "b723f5238f1ff6816c725c0ecb400c67", game_type: "Slot Game", game_image: "" },
        { game_name: "Idol of Fortune", game_code: "ba6566bce43702a5398decb1fcc01b59", game_type: "Slot Game", game_image: "" },
        { game_name: "Forge of Gems", game_code: "0932ea849be274ff5ae4da3a7c44cffa", game_type: "Slot Game", game_image: "" },
        { game_name: "Fat Frankies", game_code: "d9da996edfe9cd68b32fd2e7cde00fd4", game_type: "Slot Game", game_image: "" },
        { game_name: "Eye of Atum", game_code: "62766fe321045f1637fcbd925ad1fb63", game_type: "Slot Game", game_image: "" },
        { game_name: "Animal Madness", game_code: "4d322fc10f41306a221c63df5ac84500", game_type: "Slot Game", game_image: "" },
        { game_name: "Cash of Command", game_code: "09a2d876c28540cf122bba072f8ffb16", game_type: "Slot Game", game_image: "" },
        { game_name: "Cat Wilde and the Pyramids of Dead", game_code: "9a1a83e60432df6c05c17b6c09a1d7aa", game_type: "Slot Game", game_image: "" },
        { game_name: "Champions of Mithrune", game_code: "65587840ef2d8d3b90c6f1cd19d278f2", game_type: "Slot Game", game_image: "" },
        { game_name: "Charlie Chance and the Curse of Cleopatra", game_code: "f3883d409c9125e3781faddab0d09ee3", game_type: "Slot Game", game_image: "" },
        { game_name: "Derby Wheel", game_code: "b92f03933a0b2ddb75f1055cbcfa0ac5", game_type: "Slot Game", game_image: "" },
        { game_name: "Forge of Fortunes", game_code: "acb0775f641f765421de58f48a4a4de0", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Rewind", game_code: "a56191619b35626ad2e62ced9e840173", game_type: "Slot Game", game_image: "" },
        { game_name: "Gates of Troy", game_code: "1f33db1a0f4ca4699dd7cdb427f2b57a", game_type: "Slot Game", game_image: "" },
        { game_name: "Immortails of Egypt", game_code: "c9c6e4e64cb322cbdf4488f110ab577a", game_type: "Slot Game", game_image: "" },
        { game_name: "King's Mask", game_code: "0dbcfb1dae8c1ca0f6adcb37abad5318", game_type: "Slot Game", game_image: "" },
        { game_name: "Leprechaun's Vault", game_code: "18bdfc9546627412b6f9e1c00343589c", game_type: "Slot Game", game_image: "" },
        { game_name: "Mega Don", game_code: "14acbf2ef6569c68794675241665bd28", game_type: "Slot Game", game_image: "" },
        { game_name: "Merlin's Grimoire", game_code: "d20b52e4181bb272739d66ae00c6d809", game_type: "Slot Game", game_image: "" },
        { game_name: "Mount M", game_code: "687aacc4e3d7812942c26cc04af557ff", game_type: "Slot Game", game_image: "" },
        { game_name: "Rise of Gods: Reckoning", game_code: "79f20a8b34c76f3614ebb59473f7a680", game_type: "Slot Game", game_image: "" },
        { game_name: "Rocco Gallo", game_code: "06a472c2a59b35ff0ae92254770e778f", game_type: "Slot Game", game_image: "" },
        { game_name: "Rotiki", game_code: "547cfdbb534bf30e8f139c2c177db55a", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Trigger", game_code: "229a79586252112eea2c2bee0e3ce2e2", game_type: "Slot Game", game_image: "" },
        { game_name: "The Shimmering Woods", game_code: "796e07a02452f884c2b02a95699560e0", game_type: "Slot Game", game_image: "" },
        { game_name: "Rich Wilde & The Shield of Athena", game_code: "1b3cbdd3d76e5673712ab7f9eb2535e3", game_type: "Slot Game", game_image: "" },
        { game_name: "Rabbit Hole Riches - Court of Hearts", game_code: "118791235917848fe0f1642177f17421", game_type: "Slot Game", game_image: "" },
        { game_name: "Pack & Cash", game_code: "03b37d93b45d616adbd11ca392618a6e", game_type: "Slot Game", game_image: "" },
        { game_name: "Xmas Magic", game_code: "15ab10c0b440c230a656f827394f6cab", game_type: "Slot Game", game_image: "" },
        { game_name: "Xmas Joker", game_code: "9150986fe0151f255531e0d4dd18fb8d", game_type: "Slot Game", game_image: "" }
    ],
};
//new
const fachai = {
    platform: "digital",
    provider: "fachai",
    games: [
        { game_name: "GODS GRANT FORTUNE", game_code: "46816b28e0fbcf25d3e01c389510af70", game_type: "Fish Game", game_image: "" },
        { game_name: "EGYPT BONANZA", game_code: "0b506916e1b001c6eb121fb834e09ada", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-035.png?v=1778347228687" },
        { game_name: "GO GO RISE", game_code: "2d1c2e84556060e33e1f4f8b419c5b3a", game_type: "Arcade Game", game_image: "" },
        { game_name: "LEGEND OF INCA", game_code: "c7b9fdd6e1e633485c67c1db2dc57406", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-034.png?v=1778347228529" },
        { game_name: "NIGHT MARKET 2", game_code: "3e3b0ba086c839b394220152951c6d25", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-032.png?v=1778347228213" },
        { game_name: "STAR HUNTER", game_code: "9272bfd25844c3a1373614a457392084", game_type: "Fish Game", game_image: "" },
        { game_name: "CHINESE NEW YEAR", game_code: "c7ea70b0a6c39e2235610b057e0c6621", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-043.png?v=1778347230430" },
        { game_name: "CHINESE NEW YEAR 2", game_code: "6468b1e08cc2132f3c8e7e7d4c619c53", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-043.png?v=1778347230430" },
        { game_name: "NIGHT MARKET", game_code: "9198e4319ced66e3f3dac17c8d36fad8", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-004.png?v=1778347223242" },
        { game_name: "LUCKY FORTUNES", game_code: "6940313357dd1ec127bb2203f9ae8e6c", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-021.png?v=1778347226084" },
        { game_name: "GOLDEN GENIE", game_code: "7b81c1c65363a4c9bf89d8064a41f56a", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-046.png?v=1759492919737" },
        { game_name: "SUGAR BANG BANG", game_code: "69f7770ee6c9b2eb5756652833b84092", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-025.png?v=1778347226760" },
        { game_name: "MONKEY KING FISHING", game_code: "9900afb8cdc3016a34ef00ad563b3293", game_type: "Fish Game", game_image: "" },
        { game_name: "COWBOYS", game_code: "2ea85e851818778e2ed4317c9982e54a", game_type: "Slot Game", game_image: "" },
        { game_name: "ZEUS", game_code: "da0d973cee506257c900d18375883f2c", game_type: "Slot Game", game_image: "" },
        { game_name: "GRAND BLUE", game_code: "2ed381e03765549d45617e7ed48fc37d", game_type: "Slot Game", game_image: "" },
        { game_name: "RICH MAN", game_code: "0a462387fe3c636324c5d9041a39c94c", game_type: "Slot Game", game_image: "" },
        { game_name: "GOLDEN PANTHER", game_code: "60df04ad04885d74510d4c06e05919aa", game_type: "Slot Game", game_image: "" },
        { game_name: "FIERCE FISHING", game_code: "0b25331b95eabc71b962d8b85681e37d", game_type: "Fish Game", game_image: "" },
        { game_name: "MONEY TREE DOZER", game_code: "d031266666b559fef858205fe12bb1ef", game_type: "Arcade Game", game_image: "" },
        { game_name: "MAGIC BEANS", game_code: "b628cd862301d9bd73e70b944a2b3c11", game_type: "Slot Game", game_image: "" },
        { game_name: "MERGE MAGIC", game_code: "9735225d268562198fc5079a36e6b6fe", game_type: "Slot Game", game_image: "" },
        { game_name: "TREASURE RAIDERS", game_code: "c56cfddb7bdbc6bbb517a643803f3121", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-065.png?v=1781251907164" },
        { game_name: "BAO CHUAN FISHING", game_code: "e896288c157bc846234d254d03b083f1", game_type: "Fish Game", game_image: "" },
        { game_name: "SUPER ELEMENTS", game_code: "756fbfeac906e1e78e49ee74fa20b367", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-049.png?v=1781256805249" },
        { game_name: "ROBIN HOOD", game_code: "17184971ad9e01777cb2c06465f479fb", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-020.png?v=1778347225914" },
        { game_name: "CRAZY BUFFALO", game_code: "e5a2c89d257b68a1c2855e00e76bc934", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-026.png?v=1778347226937" },
        { game_name: "FORTUNE KOI", game_code: "1d45e05527b049177d2f55aeb8a26e44", game_type: "Slot Game", game_image: "" },
        { game_name: "TREASURE CRUISE", game_code: "be44b0154904b119fa44cde7debcb82e", game_type: "Slot Game", game_image: "" },
        { game_name: "WIN WIN NEKO", game_code: "9951f259f97eb5202a590284848e4592", game_type: "Slot Game", game_image: "" },
        { game_name: "LUXURY GOLDEN PANTHER", game_code: "d1d5678c7f936d93221b0abf470d9c6d", game_type: "Slot Game", game_image: "" },
        { game_name: "PONG PONG HU", game_code: "5476c4b6b6cc56a28ebcc836dc550df4", game_type: "Slot Game", game_image: "" },
        { game_name: "GOLD RUSH", game_code: "efe01092d040cafc980e6ff266a661f6", game_type: "Slot Game", game_image: "" },
        { game_name: "FORTUNE EGG", game_code: "93fe7c6e8ec4fba41eec4cc52aa03308", game_type: "Slot Game", game_image: "" },
        { game_name: "THREE LITTLE PIGS", game_code: "d8135aaf7a26d46c5f05811b470fd882", game_type: "Slot Game", game_image: "" },
        { game_name: "LIGHTNING BOMB", game_code: "56c52aafb2a426512e1d9319e39525d0", game_type: "Arcade Game", game_image: "" },
        { game_name: "ANIMAL RACING", game_code: "a1c4af9556716238cc206142191601a3", game_type: "Slot Game", game_image: "https://img.b112j.com/upload/game/AWCV2_FC/BDT/FC-SLOT-011.png?v=1778347224414" },
        { game_name: "SUPER COLOR GAME", game_code: "6a15165043642df7c8f15b81955ec6bd", game_type: "Arcade Game", game_image: "" },
        { game_name: "HOT POT PARTY", game_code: "1c5a69caf9e2f1736eab4e7989f0ed0f", game_type: "Slot Game", game_image: "" },
        { game_name: "GLORY OF ROME", game_code: "74d2c49fa6db0aaa0f21f572e853977f", game_type: "Slot Game", game_image: "" },
        { game_name: "PANDA DRAGON BOAT", game_code: "82ee456817c94ee4277c5656b02fe3bf", game_type: "Slot Game", game_image: "" },
        { game_name: "DA LE MEN", game_code: "c71b42d70137fc20da8106e2543a3775", game_type: "Slot Game", game_image: "" },
        { game_name: "CIRCUS DOZER", game_code: "5567159cfbb33c82c406384533ffb9d6", game_type: "Arcade Game", game_image: "" },
        { game_name: "WAR OF THE UNIVERSE", game_code: "303e0dd2081ecb6fb4f834f3223bfd1f", game_type: "Slot Game", game_image: "" },
        { game_name: "FA CHAI DOZER", game_code: "ab53133d196c47e91376d9e82e7d5280", game_type: "Arcade Game", game_image: "" },
        { game_name: "HAPPY DUO BAO", game_code: "9da31e3ea32029b6221b423390f78d14", game_type: "Slot Game", game_image: "" },
        { game_name: "LUCKY 9", game_code: "4de0c305e78b77ab9b3714138299a36d", game_type: "Table Game", game_image: "" },
        { game_name: "FA CHAI FISHING", game_code: "04666c8536a1ae5e7a86a4c019fed992", game_type: "Fish Game", game_image: "" },
        { game_name: "CHILIHUAHUA", game_code: "b677323f4bfb14e28a2df679d946993b", game_type: "Slot Game", game_image: "" },
        { game_name: "BOXING RICHES", game_code: "f7ea01c4cc69ad2990c2a1f69394f08b", game_type: "Slot Game", game_image: "" },
        { game_name: "POKER WIN", game_code: "acbb123948d98dd0745c0876b236812b", game_type: "Slot Game", game_image: "" },
        { game_name: "CHINESE NEW YEAR MOREWAYS", game_code: "c9a9e3b6325ff66ea33134e5b59d85d6", game_type: "Slot Game", game_image: "" },
        { game_name: "ROMA GLADIATRIX", game_code: "0816f874c3158d7015a94be92179df71", game_type: "Slot Game", game_image: "" },
        { game_name: "FORTUNE GODDESS", game_code: "1180fe0cde1d83f307d3db95883123d8", game_type: "Slot Game", game_image: "" },
        { game_name: "QUEEN OF INCA", game_code: "b2e0b41e9e4892e3133e8109830a8bfa", game_type: "Slot Game", game_image: "" },
        { game_name: "FORTUNE MONEY BOOM", game_code: "a7969767da0317b91b1d79c9645beefd", game_type: "Slot Game", game_image: "" },
        { game_name: "LUCKY FORTUNES 3x3", game_code: "8fb374c36918b49d6d3cf4c5acca8f11", game_type: "Slot Game", game_image: "" },
        { game_name: "FORTUNE SHEEP", game_code: "cce3ee2271788268012af054ded9d193", game_type: "Slot Game", game_image: "" },
        { game_name: "MINES", game_code: "9f01a3aaa2f517416c0e25fae5e4aab6", game_type: "Arcade Game", game_image: "" },
        { game_name: "SUGAR BANG BANG 2", game_code: "a9356b06b10d45430c8c5e39c1495161", game_type: "Slot Game", game_image: "" },
        { game_name: "PHOENIX FEVER", game_code: "890af0346fa60480f0ff6c6b3235569e", game_type: "Slot Game", game_image: "" },
        { game_name: "JUNGLE BANG BANG", game_code: "a1e8f49f643c3a1aa264970f14e646e0", game_type: "Slot Game", game_image: "" },
        { game_name: "TREASURES OF ODIN", game_code: "db0c45f4fc7a2a106b886e89e6ba8945", game_type: "Slot Game", game_image: "" },
        { game_name: "PHOENIX FEVER JACKPOT", game_code: "5226f45579695a40088b2c221f4d8e1f", game_type: "Slot Game", game_image: "" },
        { game_name: "BUFFALO WAYS", game_code: "b86dfd1a8ca545ac50c6147ca48a2223", game_type: "Slot Game", game_image: "" },
        { game_name: "SWORD OF KING", game_code: "f543a0a6fa08d8468239adea2ed9f134", game_type: "Slot Game", game_image: "" }


    ]
    ,
};
const eazygaming = {
    platform: "digital",
    provider: "eazygaming",
    games: [
        { game_name: "Witch's Love", game_code: "730934d13092e3f9e7c23f2a774e663a", game_type: "Slot Game", game_image: "" },
        { game_name: "Neko Maid", game_code: "177977776019fe295e1fa61383400b92", game_type: "Slot Game", game_image: "" },
        { game_name: "Adventure Of Sinbad", game_code: "4349ce1ba0fc4c1c794a11d18d7ba94b", game_type: "Slot Game", game_image: "" },
        { game_name: "G-idol", game_code: "c86ff6fdb3e91db1b7d110d58a778a74", game_type: "Slot Game", game_image: "" },
        { game_name: "Goal Line Baby", game_code: "364805284c56dc5888fd21e73be3dda2", game_type: "Slot Game", game_image: "" },
        { game_name: "Miss Holmes: Cold Case", game_code: "045efa0ecf10c2d171f93db6c1e2e75c", game_type: "Slot Game", game_image: "" },
        { game_name: "Kitsune Sister", game_code: "70c6ce3e01e79c019a9bd68522826993", game_type: "Slot Game", game_image: "" },
        { game_name: "Queen Of Casino", game_code: "b84161166710f1ab3223421c92b406cb", game_type: "Slot Game", game_image: "" },
        { game_name: "Streaming Girl", game_code: "bf89fbb9dbef22224b3da74f6654e1a5", game_type: "Slot Game", game_image: "" },
        { game_name: "Dim Sum Hottie", game_code: "920fe25ea07729a287c668216bdfc256", game_type: "Slot Game", game_image: "" },
        { game_name: "Goddess Wonderland", game_code: "9d18644a1c6951932f0b7ced77ff0f49", game_type: "Slot Game", game_image: "" },
        { game_name: "Napoleon", game_code: "422b086bd63d28be3e812dbb7736b9b8", game_type: "Slot Game", game_image: "" },
        { game_name: "Tron: Century", game_code: "35c52efe2c5618e5bc3bdf47d5da1dd2", game_type: "Slot Game", game_image: "" },
        { game_name: "Glory of Poseidon", game_code: "357e66a063eb207b7d5d9b841b313801", game_type: "Slot Game", game_image: "" },
        { game_name: "Beauty SPA", game_code: "4f000007fa6a15bfe51d1ce1766e57b7", game_type: "Slot Game", game_image: "" },
        { game_name: "Bikini Revelry", game_code: "66c29ee5ba8641cd859a8f139142402e", game_type: "Slot Game", game_image: "" },
        { game_name: "Money tree", game_code: "77336e5f3488be53a2851df9ce46e738", game_type: "Slot Game", game_image: "" }
    ]
    ,
};
// const gameart = {
//     platform: "digital",
//     provider: "gameart",
//     games: [
//         { game_name: "20 Hot Fruit Delights", game_code: "a70e2fc86389943ca5f0119e738b9e3d", game_type: "Slot Game", game_image: "" },
//         { game_name: "40 Super Heated Sevens", game_code: "52c3522012c3861d833d3d4f522638f5", game_type: "Slot Game", game_image: "" },
//         { game_name: "7s and Diamonds", game_code: "8ca0e3b6e9b85d61a92ad3b4ffd0fa06", game_type: "Slot Game", game_image: "" },
//         { game_name: "88 Riches", game_code: "dfbe325db464f981c5257be04ad7237d", game_type: "Slot Game", game_image: "" },
//         { game_name: "African Sunset", game_code: "643f4db37c7c065873c37d85d3e73312", game_type: "Slot Game", game_image: "" },
//         { game_name: "African Sunset 2", game_code: "57ec6e7ba280def6022297e3718fbb7d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Aladdins Quest", game_code: "bc9fb02e656418babf3638d119427d4a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Ali Babas Riches", game_code: "91b011a873f0892570b7a23efaf365d0", game_type: "Slot Game", game_image: "" },
//         { game_name: "Ancient Gong", game_code: "f80179d24080b231086dbc5fa492ae77", game_type: "Slot Game", game_image: "" },
//         { game_name: "Angry Dogs", game_code: "2eabac2e13e30edc8898ec61c8db01b5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Apocalypse Quest", game_code: "faed97f14811dcdb939e342e5dd0d450", game_type: "Slot Game", game_image: "" },
//         { game_name: "Atlantis World", game_code: "9054aa9df62b93abd107985b9d912247", game_type: "Slot Game", game_image: "" },
//         { game_name: "Awesome 7s", game_code: "04e2ce2513f0eee38f9aa3d29bc66c1b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Baccarat", game_code: "96664cc4baefeaec0d023d04ee952c30", game_type: "Table Game", game_image: "" },
//         { game_name: "Battle for Atlantis", game_code: "caf70cc65943221854fc57a4abca0658", game_type: "Slot Game", game_image: "" },
//         { game_name: "Book Of Cupigs", game_code: "68ed991b0a74d1bdc94e4d1db13b1f49", game_type: "Slot Game", game_image: "" },
//         { game_name: "Book of Museum", game_code: "dc8ac0a63823eab4a4419a96ddad7df8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Book of Oziris", game_code: "4ffe3b55f37d8aad38d1b24527b2f72a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Buffaloes Duel", game_code: "0a015ceb4dd4d01602e9d6d4d6f910ef", game_type: "Slot Game", game_image: "" },
//         { game_name: "Caligula", game_code: "d579a4a2806f3750ca8ecba794e5cb57", game_type: "Slot Game", game_image: "" },
//         { game_name: "Caribbean Stud Poker", game_code: "3ba60266dbb8d484fd2942832cde8f95", game_type: "Table Game", game_image: "" },
//         { game_name: "Castle Blood", game_code: "d7c05147efd13ad96caa19903ca5a00d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Chili Quest", game_code: "e2b5df1b4f5014c3eb4b494d658305cf", game_type: "Slot Game", game_image: "" },
//         { game_name: "Chinese Zodiac", game_code: "cc1c9fb0d8ed44d368a008db6ef5ce9e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Circus of Horror", game_code: "c4133b611af850791eb94e39dfb4852c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dancing Lions", game_code: "a1528c886b0428d5ae70fe9c9d940df5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dawn of Olympus", game_code: "25f7a6db8f4fab5caae849a00fc624f2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Diamond Magic", game_code: "d36ff7f60dced7714d516589252a640a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Diamond Magic Deluxe", game_code: "755227bfc81213ac799b4f3eda075bb7", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dolphins Dream", game_code: "f95cce94cf725a49d440f615d3da1af7", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragon King", game_code: "56d4e1d658d91ba56eb957e28a712f8f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragon Lady", game_code: "66d1d531be62179e283de4336d61a51c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragon Whisperer", game_code: "03c9f642d7bdda5e8c65ed4fe34644d8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dynamite Fruits", game_code: "bd10f8038ea8de2697f2d8e57192d5c4", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dynamite Fruits Deluxe", game_code: "9621a8ca604976a28ec7e4598a313cff", game_type: "Slot Game", game_image: "" },
//         { game_name: "Emperors Wealth", game_code: "9c99211663ef8b6b56ccfd338617d84d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Cleopatra", game_code: "1961f8a133fbd856f910bbf3f9941070", game_type: "Slot Game", game_image: "" },
//         { game_name: "GREAT BUFFALO HOLDN WIN", game_code: "099ea0d574954795a0351fe0b0968098", game_type: "Slot Game", game_image: "" },
//         { game_name: "Halloween farm", game_code: "ced9144efb1f33455b9c015ed8d36bb0", game_type: "Slot Game", game_image: "" },
//         { game_name: "GREAT BUFFALO MEGAWAYS", game_code: "7155ecf4ebf5d11f73c211de0f4d9150", game_type: "Slot Game", game_image: "" },
//         { game_name: "LUCKY PUPS", game_code: "fb1a2a57966748456c459e8c014bd4a3", game_type: "Slot Game", game_image: "" },
//         { game_name: "JAZZ JAM JACKPOTS", game_code: "c7b6e70fb81abf0026ab98bf09010a1a", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Way of the Dead", game_code: "89b80b332a532cc77595e171b8de596b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky Loser", game_code: "54151eadaebd090f406ec81b54b80613", game_type: "Slot Game", game_image: "" },
//         { game_name: "Olympus Majesty", game_code: "60875596c7b9aa05653eba2214b6b971", game_type: "Slot Game", game_image: "" },
//         { game_name: "Candy Treats", game_code: "b94bb43566de2cd39c12876b3cb74862", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jungle Rave", game_code: "277e27b95175df7cae287db8421a9c93", game_type: "Slot Game", game_image: "" },
//         { game_name: "Empire of wealth", game_code: "a6d355595bb6b2137e78a065dc815d4c", game_type: "Slot Game", game_image: "" },
//         { game_name: "3 Headed Dragon", game_code: "f0f024bb2fd4d884592941252601794b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Totem Token", game_code: "de6d4b46ab9cf85e0d4aed8389ec864c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Santas Downfall", game_code: "9b3c855922384d1e3f85be7e10bc54c9", game_type: "Slot Game", game_image: "" },
//         { game_name: "Broken Ballerina", game_code: "9d2a0a493cb6a16f91c51897fa62f1b2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Tales of the Serpent Maiden", game_code: "1d527689e9b0068f4f1269144f8e2c3f", game_type: "Slot Game", game_image: "" },
//         { game_name: "OReally Lucky", game_code: "932a328854f38b13edcd0d3124850ace", game_type: "Slot Game", game_image: "" },
//         { game_name: "Midgards Fortune Megaways", game_code: "c6cee5ac4a5348c7611dca930de3ced1", game_type: "Slot Game", game_image: "" },
//         { game_name: "Big Snapper", game_code: "ddb77b14105c62c84379bd3d4bf004a8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Witchs Candy Quest Megaways", game_code: "3776bdb8e45cef5ce7ed7ea7a8b6e522", game_type: "Slot Game", game_image: "" },
//         { game_name: "BlackJack Gold", game_code: "02774f43a445adb437912e073717b2d0", game_type: "Table Game", game_image: "" },
//         { game_name: "Vegas Kingmaker 100", game_code: "a9a5341428ebd874218a879e3df31800", game_type: "Slot Game", game_image: "" },
//         { game_name: "Helluva Slot", game_code: "501c1e9363060fdbadb9c529ea06a40b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Electric Power Play", game_code: "60a44174c0c7ebfde3acf17bb57dfec2", game_type: "Arcade Game", game_image: "" },
//         { game_name: "Golden Dragon", game_code: "d745056198a386e3bb15def343c27f8d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Gold Of Ra", game_code: "8ff4a10d57ca7210463a8ef768666c90", game_type: "Slot Game", game_image: "" },
//         { game_name: "Hawaiian Christmas", game_code: "895cdf4ea3b52940c855f8f4ee0247c6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Hollywoof", game_code: "a3df5251c154209c18fe59f36e950e8e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Hot Fruit Delights", game_code: "b80a3d433990d974a34a7057c5462f64", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jingle Jokers", game_code: "9001dc77d9b23172ef790a0fb0b9f0ca", game_type: "Slot Game", game_image: "" },
//         { game_name: "Joan of Arc", game_code: "6e2f67e3e318be4a158dcc3d575ca54a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jumpin Pot", game_code: "1f75e7d723282bb823185fb369a3b4f7", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kitty Twins", game_code: "78c91a1843d636e95f909b775804cf79", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lady Luck", game_code: "aca95d54831b0c6b333f200aa910975c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky Coins", game_code: "6ffc265ef44657c789e343b1171f7505", game_type: "Slot Game", game_image: "" },
//         { game_name: "Magic Dragon", game_code: "3f7e1915c92eae1b46922f6a75a7bebb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Magic Unicorn", game_code: "a31242071bc9a18a5b4c5cf9c782d48e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Mariachi Fiesta", game_code: "84d9857477998b514c74e8a6700108ab", game_type: "Slot Game", game_image: "" },
//         { game_name: "Money Farm", game_code: "919389cd41a28fdf949a24e0854174ec", game_type: "Slot Game", game_image: "" },
//         { game_name: "Money Farm 2", game_code: "ebd93b179fc318928bee8ec97f0a6d08", game_type: "Slot Game", game_image: "" },
//         { game_name: "More Cash", game_code: "7aac589e40fc5c4b14c10d07ab68d7fa", game_type: "Slot Game", game_image: "" },
//         { game_name: "Piggy Bjorn  Muspelheims Treasure", game_code: "0b17b785063ae1c53527d3ebed260a07", game_type: "Slot Game", game_image: "" },
//         { game_name: "Nefertitis Nile", game_code: "4bc7e0ba60b1cc6807821abfc27304e8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Night at KTV", game_code: "8efead0c4ffaef25415f42a9a859e8bb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Norns Fate", game_code: "996faca3ffd871ea50dea605997ddc19", game_type: "Slot Game", game_image: "" },
//         { game_name: "Peters Universe", game_code: "f576f011f1390f8ba33734764817d850", game_type: "Slot Game", game_image: "" },
//         { game_name: "Phoenix Princess", game_code: "887ed93b15faeea0ac58604d2d96da0f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Piggy Bjorn  Winter is Coming", game_code: "16ba66452befe1a745080b81d656ee41", game_type: "Slot Game", game_image: "" },
//         { game_name: "Piggy Holmes", game_code: "1b4cbf4ba7c142df22f07e91822ca03b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Power Dragon", game_code: "79b72dd6ec797d159c533a6dff08e0e8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Royal Gems", game_code: "faadf54dcefa384189787000ab47d7b0", game_type: "Slot Game", game_image: "" },
//         { game_name: "Santas Factory", game_code: "52c8f6d97fbf57517c60f7e8a4a59291", game_type: "Slot Game", game_image: "" },
//         { game_name: "Spooky graves", game_code: "7961c859e045e0e259ecbd07d74d4d6e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Storming Flame", game_code: "165106313eadac2b411eb3f836894a5c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Striking Joker", game_code: "8d086675adc31f92e3e57211908fab19", game_type: "Slot Game", game_image: "" },
//         { game_name: "Summer Jam", game_code: "04e80a60c5c9146cf43ac1589f690d3e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Super Heated sevens", game_code: "fcc3b21b564ecb66120bfba0d634a9b2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Surfin Joker", game_code: "4627b8c661d9ccf33ae3edd635bebf71", game_type: "Slot Game", game_image: "" },
//         { game_name: "Sushi Yatta", game_code: "80fafca263b93008335de741fbdd658b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Texas Rangers Reward", game_code: "98e3214b63b30f6ef256420b3f901194", game_type: "Slot Game", game_image: "" },
//         { game_name: "Three Kings", game_code: "8c73a850d55bd1e70c5d2ffa40b7c9bf", game_type: "Slot Game", game_image: "" },
//         { game_name: "Tiger Heart", game_code: "322cbd9dc3706e043382471b65964edc", game_type: "Slot Game", game_image: "" },
//         { game_name: "Video Poker", game_code: "2192df3e0f070c970215d017644320ff", game_type: "Table Game", game_image: "" },
//         { game_name: "Wild Dolphin", game_code: "9f6882c77cd4d09582dbd765ef871155", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild Marmalade", game_code: "7eb6fc0a8e6fedaec8545b1f75d8e829", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild Wild Fruit", game_code: "14db31507ebde336d29686ea87f7cf82", game_type: "Slot Game", game_image: "" },
//         { game_name: "Xtreme Hot", game_code: "d5c9c1af7bcb0f5b5ebd2e8dc4db9dbb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Xtreme Summer Hot", game_code: "9e95ee6be7700a2cfbbe1d6054b3daf6", game_type: "Slot Game", game_image: "" }


//     ]
//     ,
// };
const bggaming = {
    platform: "digital",
    provider: "bggaming",
    games: [
        { game_name: "Catdiana", game_code: "384b3a3daaea2fa88474b0ada8ad1ef2", game_type: "Slot Game", game_image: "" },
        { game_name: "Dice Clash", game_code: "46ffd224ee8960ceb02d5d7cb6c3ec88", game_type: "Dice Game", game_image: "" },
        { game_name: "Snoop Dogg Dollars", game_code: "42c10ec14f7bed81dd8948bcc9ff3d79", game_type: "Slot Game", game_image: "" },
        { game_name: "Forgotten", game_code: "5692803026f0040a9d205b5f2859303d", game_type: "Slot Game", game_image: "" },
        { game_name: "Rotating Element", game_code: "312e294c95f438e0c2a53edc16f42dd1", game_type: "Slot Game", game_image: "" },
        { game_name: "Haunted Reels", game_code: "acf9940b57dfc5c17dae1683546254f8", game_type: "Slot Game", game_image: "" },
        { game_name: "Carnival Bonanza", game_code: "3872e9e145ed83caabc13a45fb731eaa", game_type: "Slot Game", game_image: "" },
        { game_name: "Aztec's Claw Wild Dice", game_code: "107be31f7f1acd063a3848d9ab8faaab", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortuna TRUEWAYS", game_code: "096cff957fbb194d2b6600af093d32bb", game_type: "Slot Game", game_image: "" },
        { game_name: "Voodoo People", game_code: "362714f8384ac625c50da8def330e897", game_type: "Slot Game", game_image: "" },
        { game_name: "Top Eagle", game_code: "2eceb69abe28088ebd587e3d20e42132", game_type: "Crash Game", game_image: "" },
        { game_name: "Royal Fruits MultiLines", game_code: "9c85548c5a5682fb75b97d93f9bf6ba1", game_type: "Slot Game", game_image: "" },
        { game_name: "Robospin", game_code: "21dbf27bf1926124b306bc5659c47883", game_type: "Casual Game", game_image: "" },
        { game_name: "Train to Rio Grande", game_code: "7d9fcac036458ee987df0963fa23fbe0", game_type: "Slot Game", game_image: "" },
        { game_name: "Kraken's Hunger", game_code: "f798b5e34e30ec1d707bbad93275de66", game_type: "Slot Game", game_image: "" },
        { game_name: "Mine Gems", game_code: "caf101eea60fb8976d2b08cbc4ac57db", game_type: "Casual Game", game_image: "" },
        { game_name: "Catch the Gold Hold and Win", game_code: "c15396a5ca8b7bb0336d9823e7d70599", game_type: "Slot Game", game_image: "" },
        { game_name: "Street Power", game_code: "c1bde325f7f9ebb6dd8eb8bdc2701e89", game_type: "Casual Game", game_image: "" },
        { game_name: "Wild West TRUEWAYS", game_code: "29b092dc73646c8ad1e68a89160e837c", game_type: "Slot Game", game_image: "" },
        { game_name: "Secret Bar Multidice X", game_code: "de10c5031eba2a70c3ef056df6a301a0", game_type: "Slot Game", game_image: "" },
        { game_name: "Gold Magnate", game_code: "4330b56250e3e12d42a333a54cf53252", game_type: "Slot Game", game_image: "" },
        { game_name: "Grand Patron", game_code: "1de21a609d4ff294a2dcf5b54f11247e", game_type: "Slot Game", game_image: "" },
        { game_name: "Aviamasters", game_code: "d3c7985229b2e4651fa7889445a5bfd8", game_type: "Casual Game", game_image: "" },
        { game_name: "Alien Fruits 2", game_code: "8e672d4494c81a04d183d02c0ac928d8", game_type: "Slot Game", game_image: "" },
        { game_name: "Dragon Age Hold & Win (Dragon Age)", game_code: "300cc204eb151ef25e59a5ae5e30bc35", game_type: "Slot Game", game_image: "" },
        { game_name: "Fishing Club", game_code: "1a6331cb34de981ca1e88592ef06c752", game_type: "Casual Game", game_image: "" },
        { game_name: "Gold of Minos", game_code: "33017959e334dc1c7b0b1b5436951838", game_type: "Slot Game", game_image: "" },
        { game_name: "Panda Luck", game_code: "ae09663fb727565cc8754b6b33637b4d", game_type: "Slot Game", game_image: "" },
        { game_name: "Chicken Rush", game_code: "7df9dde49a097fe9b62222ba12f606df", game_type: "Slot Game", game_image: "" },
        { game_name: "Luck & Magic Scratch", game_code: "ef0998245805a6a32a910a6667ad7c6c", game_type: "Scratch cards", game_image: "" },
        { game_name: "OOF The Goldmine Planet", game_code: "96da7b41a5092a2ba6d80c02d54d8e4e", game_type: "Slot Game", game_image: "" },
        { game_name: "Lucky Dragon MultiDice X", game_code: "1f580513685cdfd29b3c6cd1493211a8", game_type: "Slot Game", game_image: "" },
        { game_name: "3 Kings Scratch", game_code: "206b98759b35412a1ecf0cc0fa42b29a", game_type: "Scratch cards", game_image: "" },
        { game_name: "Diamond of Jungle", game_code: "163940b133daf4662a23ac3642698eea", game_type: "Slot Game", game_image: "" },
        { game_name: "Dragon's Crash", game_code: "fc81d13da9be4741f1897b7142c1e43a", game_type: "Crash Game", game_image: "" },
        { game_name: "Lucky 8 Merge Up", game_code: "e8a2fedff5f5941e2ebebf6cb8ae10f1", game_type: "Slot Game", game_image: "" },
        { game_name: "Pop Zen", game_code: "fe31a3383c140b2389eec2c09b95f641", game_type: "Slot Game", game_image: "" },
        { game_name: "Aztec Clusters", game_code: "ebdc5bc54ce398aa8d1a7466a4e68d21", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Heart", game_code: "9ea3ced80f0706d9d6d25994092b3cd4", game_type: "Slot Game", game_image: "" },
        { game_name: "God of Wealth Hold And Win", game_code: "0a8bae754cd2dba41b5998fcce9d5b37", game_type: "Slot Game", game_image: "" },
        { game_name: "Keepers Of The Secret", game_code: "e85b9a6b6d7bf1f41ba0e4a320585d62", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Tiger", game_code: "a1de8d30de1e8795221e0cbcea462141", game_type: "Slot Game", game_image: "" },
        { game_name: "Capymania Green", game_code: "1709447d71bc8e313f35ba35b0033845", game_type: "Scratch cards", game_image: "" },
        { game_name: "Capymania Orange", game_code: "02207f5732e5b39e0c1fbe435ebb1b26", game_type: "Scratch cards", game_image: "" },
        { game_name: "Capymania Yellow", game_code: "7e4b004c6fc0c64537050447e2965ef9", game_type: "Scratch cards", game_image: "" },
        { game_name: "Hottest 666", game_code: "9568278f10bfbb78253db073bb816e4f", game_type: "Slot Game", game_image: "" },
        { game_name: "Gemza", game_code: "3f61a021f0d55f041ff714d16bc4ac17", game_type: "Slot Game", game_image: "" },
        { game_name: "Ice Scratch Bronze", game_code: "e51c959e79559583f491fcfea1ab68b7", game_type: "Scratch cards", game_image: "" },
        { game_name: "Ice Scratch Gold", game_code: "a01aa8b7e5d3058d109db68af8ac4bd0", game_type: "Scratch cards", game_image: "" },
        { game_name: "Ice Scratch Silver", game_code: "b596d059279938f1ab74ed3eaeebdc8e", game_type: "Scratch cards", game_image: "" },
        { game_name: "Slot Machine", game_code: "2ade52905d4104a302def8149910b664", game_type: "Slot Game", game_image: "" },
        { game_name: "Gift X", game_code: "e0a7754ad24321587b40915d6f391070", game_type: "Crash Game", game_image: "" },
        { game_name: "Tramp Day", game_code: "0c8fffd494b172256607a79ec4fb7acd", game_type: "Slot Game", game_image: "" },
        { game_name: "Book of Panda Megaways", game_code: "81c648af2d38be5fd6bd735f672f35b6", game_type: "Slot Game", game_image: "" },
        { game_name: "Mummy's Gold", game_code: "4afaea9e17bbc75d26d92cc7c7d2ec65", game_type: "Slot Game", game_image: "" },
        { game_name: "Merge Up", game_code: "22aeab95aef5b3f01b7b7f563dc36ac7", game_type: "Slot Game", game_image: "" },
        { game_name: "Scratch Alpaca Bronze", game_code: "8664b8269de1a8b4a91d45fb375bcfb0", game_type: "Scratch cards", game_image: "" },
        { game_name: "Scratch Alpaca Gold", game_code: "a584912bbe94b034018b3f7dc9794d9e", game_type: "Scratch cards", game_image: "" },
        { game_name: "Scratch Alpaca Silver", game_code: "58e06f5e2ce49a695a51e1636f4095bf", game_type: "Scratch cards", game_image: "" },
        { game_name: "Monster Hunt", game_code: "eff2df94539988f3468e687a7d7cea30", game_type: "Slot Game", game_image: "" },
        { game_name: "Mice & Magic Wonder Spin", game_code: "0ccaaa45143d186f7ef3311989bb018a", game_type: "Slot Game", game_image: "" },
        { game_name: "Bone Bonanza", game_code: "7d05837c55942cf0f36e2597b7e0ae76", game_type: "Slot Game", game_image: "" },
        { game_name: "Maneki 88 Fortunes", game_code: "05d6232a3336a2b4bb2ee83b4b6bcf7d", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Cash Dice", game_code: "94783ae2695c2546da00bec3213fcfa0", game_type: "Slot Game", game_image: "" },
        { game_name: "Savage Buffalo Spirit Megaways", game_code: "042f069ea08ab7fb50af2027b2d93725", game_type: "Slot Game", game_image: "" }
    ]
    ,
};
const km = {
    platform: "digital",
    provider: "km",
    games: [
        { game_name: "Penguin Panic", game_code: "1c9a1b9147a04994c899faec87fb1352", game_type: "Table Game", game_image: "" },
        { game_name: "Video Poker", game_code: "dd4d960875be77bde1dfdc481a3495bc", game_type: "Table Game", game_image: "" },
        { game_name: "Gold Mine", game_code: "c73eccc34c692f336f2332e927f13055", game_type: "Slot Game", game_image: "" },
        { game_name: "Toon Crash", game_code: "a92698b9cbec7f355870466602810ca7", game_type: "Table Game", game_image: "" },
        { game_name: "Iron Dome", game_code: "93c356f0911addcd4282f1d1af2fa329", game_type: "Table Game", game_image: "" },
        { game_name: "Almighty Greek", game_code: "78b5bd93dabb9ab681eeb002bbe78188", game_type: "Slot Game", game_image: "" },
        { game_name: "Warriors Temple", game_code: "d03ef012d9f545cb7ad3eb37be85baf8", game_type: "Slot Game", game_image: "" },
        { game_name: "Dice Duet", game_code: "eb638dc43fd5762889eb1fc6e5d22ecc", game_type: "Table Game", game_image: "" },
        { game_name: "Gold Rush Bonanza", game_code: "81a64237f0d2522e7d5e27461de12fd9", game_type: "Slot Game", game_image: "" },
        { game_name: "Leppy's Loot", game_code: "1fd7dbe78a8d3912ce28a2fc63f488a9", game_type: "Slot Game", game_image: "" },
        { game_name: "Egyptian Mines", game_code: "0cfd7e0901a2cb99bb8fe47eeab8215b", game_type: "Table Game", game_image: "" },
        { game_name: "Jogo De Bozo", game_code: "1d821c77f169f85f876e87de54625887", game_type: "Table Game", game_image: "" },
        { game_name: "Hippo Splash", game_code: "cc9fdac6d38d79bb564762baabe099ce", game_type: "Slot Game", game_image: "" },
        { game_name: "Pirate's Tresure", game_code: "40133e6572603484d3406f126f00d1e4", game_type: "Slot Game", game_image: "" },
        { game_name: "Piggy Heist", game_code: "e793bc96c7aad22833422292a8f7aac4", game_type: "Slot Game", game_image: "" },
        { game_name: "Merlin's Saga", game_code: "d1f8fcf6194114917664af0d7ad95c4a", game_type: "Slot Game", game_image: "" },
        { game_name: "London Mystery", game_code: "d17c382283f61b126abac9453bcbbd09", game_type: "Slot Game", game_image: "" },
        { game_name: "Horus Glory", game_code: "8740d016de45d10bc39a0a049994f7f1", game_type: "Slot Game", game_image: "" },
        { game_name: "Ladder Game", game_code: "b0db27d1892defd4614614fc826329e8", game_type: "Table Game", game_image: "" },
        { game_name: "Cupid Archery", game_code: "cb833139d14364862e77260931bfa6da", game_type: "Slot Game", game_image: "" },
        { game_name: "Rome Gladiator", game_code: "6da4413a7bf4413316fe1ea84a6a2c66", game_type: "Slot Game", game_image: "" },
        { game_name: "Bicho", game_code: "8bffb2e1429e5cc41a3f25b499eabf10", game_type: "Table Game", game_image: "" },
        { game_name: "Burmese 6 Animals", game_code: "43c6b5b2f3a61a9556dd553d4853cb94", game_type: "Table Game", game_image: "" },
        { game_name: "Hunk Cai Shen", game_code: "2c7ac8a392c7b4803a88f9162733bc52", game_type: "Slot Game", game_image: "" },
        { game_name: "Speedy Andar Bahar", game_code: "140fe97d0f6d5e9ca713e957acf1dcc5", game_type: "Table Game", game_image: "" },
        { game_name: "Magic Pearls", game_code: "2653300fa50048f58a09e9e0b451f3cd", game_type: "Slot Game", game_image: "" },
        { game_name: "Captain Loot", game_code: "ddb7802958863d7fa280e7e358fcfefa", game_type: "Slot Game", game_image: "" },
        { game_name: "Chicken Crossy", game_code: "14807d064afec4b00c845c8b5fdb6351", game_type: "Table Game", game_image: "" },
        { game_name: "Teen Patti Blitz", game_code: "5ee137ab91ce7d519f7d1b3618114ec5", game_type: "Table Game", game_image: "" },
        { game_name: "7 Up 7 Down Rush", game_code: "662abe294b44bf77c8cc6c162e3489d8", game_type: "Table Game", game_image: "" },
        { game_name: "Dear Senpai", game_code: "9a3dacc2bc68cb90da67a4a263588a63", game_type: "Slot Game", game_image: "" },
        { game_name: "Money Wheel Deluxe", game_code: "dad4dca903d6af9c1785026d95cc2ed8", game_type: "Table Game", game_image: "" },
        { game_name: "Thai Fish Prawn Crab GO", game_code: "f9772d5dcb593d0a5d2a7859da54fc07", game_type: "Table Game", game_image: "" },
        { game_name: "Mahjong Beauty", game_code: "45305555854c69d9893ee79c054a4785", game_type: "Slot Game", game_image: "" },
        { game_name: "Samba Rhapsody", game_code: "d25b3461c5db0791ed8d9cf1f8267400", game_type: "Slot Game", game_image: "" },
        { game_name: "Vietnam Rock Paper Scissors", game_code: "3f3f876b0174d3b15199a47ea6d58477", game_type: "Table Game", game_image: "" },
        { game_name: "Lucky Cat Gala", game_code: "3e2b0af4d1bc8b604f5aae6c86f4a058", game_type: "Table Game", game_image: "" },
        { game_name: "Bai Cao Mystic Four", game_code: "4cc0fe20507910e4e309dc579285ba03", game_type: "Table Game", game_image: "" },
        { game_name: "Teen Patti Versus", game_code: "a4e49ce1e39785211a649d7cb4d75b67", game_type: "Table Game", game_image: "" }
    ]
    ,
};
const relaxgaming = {
    platform: "digital",
    provider: "relaxgaming",
    games: [
        { game_name: "6 Wild Sharks", game_code: "202715df7fed47121496ead87f777c70", game_type: "Slot Game", game_image: "" },
        { game_name: "Alice In Adventureland", game_code: "a84f48e5a30029420528ba6915312f71", game_type: "Slot Game", game_image: "" },
        { game_name: "Attila The Hun", game_code: "6e942b33c944fbfd0199e9c651e22307", game_type: "Slot Game", game_image: "" },
        { game_name: "Aurora", game_code: "9963ea2cace07152fc4e625e9a83afa0", game_type: "Slot Game", game_image: "" },
        { game_name: "Aztec Luck", game_code: "1ad257ba975e7bf8c867704ecdd21c3b", game_type: "Slot Game", game_image: "" },
        { game_name: "Beast Mode", game_code: "c8b928e2c00fa0f2f5ca2a6447da3612", game_type: "Slot Game", game_image: "" },
        { game_name: "Book of 99", game_code: "24f01721a5c9d5420ac3b4af7939233e", game_type: "Slot Game", game_image: "" },
        { game_name: "Book of Destiny", game_code: "9cc73530b2250a5686ce9232d4e1de49", game_type: "Slot Game", game_image: "" },
        { game_name: "Boost it", game_code: "5df4f9668ec1f6bafb0280e5f925fd58", game_type: "Slot Game", game_image: "" },
        { game_name: "Bounty Showdown", game_code: "f37ce10de227223f41453582bcc28cfe", game_type: "Slot Game", game_image: "" },
        { game_name: "Caravan of Riches", game_code: "07b6b170f5d6670dea0b33a90281af1e", game_type: "Slot Game", game_image: "" },
        { game_name: "Caveman Bob", game_code: "cac55ca05f276e2d367f1f1c07e91350", game_type: "Slot Game", game_image: "" },
        { game_name: "Chip Spin", game_code: "f5791cec452ebbeb3befd12b7c27314a", game_type: "Slot Game", game_image: "" },
        { game_name: "Christmas Santa", game_code: "1a8eacb9ffdf18a1b8023fcc85c8f30b", game_type: "Slot Game", game_image: "" },
        { game_name: "Clover Fortunes", game_code: "07e7ab86bc0801442c43eff99a232bd6", game_type: "Slot Game", game_image: "" },
        { game_name: "Cluster Tumble", game_code: "276031cf4c6d182ac0dde2440de4ff2c", game_type: "Slot Game", game_image: "" },
        { game_name: "Crystal Golem", game_code: "7963b3addd926a73a599b881ec906d72", game_type: "Slot Game", game_image: "" },
        { game_name: "Dead Man's Trail", game_code: "7c74df7ff8eb3196300d4ef2b105b8a1", game_type: "Slot Game", game_image: "" },
        { game_name: "Deep Descent", game_code: "0894cec481afaea1c85b66992b548591", game_type: "Slot Game", game_image: "" },
        { game_name: "Desert Shark", game_code: "d83293f698af234801bac20dc508b866", game_type: "Slot Game", game_image: "" },
        { game_name: "Dragons Awakening", game_code: "60ab472ffaf7edc0655cd0bd531ad16b", game_type: "Slot Game", game_image: "" },
        { game_name: "Electric Wilds", game_code: "7ad2ddf6fef9d7bb637f7868148d0f60", game_type: "Slot Game", game_image: "" },
        { game_name: "Elemento", game_code: "b2ce225ef2b7e333efd00173f323f33e", game_type: "Slot Game", game_image: "" },
        { game_name: "Emerald's Infinity Reels", game_code: "94dcdcb04587ab7aca0b0a20549f659e", game_type: "Slot Game", game_image: "" },
        { game_name: "Epic Joker", game_code: "8475f301c0bcb3773e5ab2c34619c091", game_type: "Slot Game", game_image: "" },
        { game_name: "Erik the Red", game_code: "83de38637d1f14bba830c242fa8617a2", game_type: "Slot Game", game_image: "" },
        { game_name: "Flower Fortunes Supreme", game_code: "c9cd62edbd4bc5bb38955436b62aad7b", game_type: "Slot Game", game_image: "" },
        { game_name: "Frequent Flyer", game_code: "e81cea750f7152af7d71982dbc567f3c", game_type: "Slot Game", game_image: "" },
        { game_name: "Fruit Strike", game_code: "10fa8ebebb936f67b806412decd7057f", game_type: "Slot Game", game_image: "" },
        { game_name: "Golden Castle", game_code: "da55439845c3eaebe4aafe77b15c3dd9", game_type: "Slot Game", game_image: "" },
        { game_name: "Golden Gods", game_code: "b2d996b091f292f5d51f386ba74909b0", game_type: "Slot Game", game_image: "" },
        { game_name: "Hazakura Ways", game_code: "86929be84fe1f0d67913a8960ed15fd0", game_type: "Slot Game", game_image: "" },
        { game_name: "Helios Fury", game_code: "747b8549ea241d6894c6ed81ba3aa3bc", game_type: "Slot Game", game_image: "" },
        { game_name: "Hellcatraz", game_code: "a21c9e64ecadb4ac2ef6591b2d25e721", game_type: "Slot Game", game_image: "" },
        { game_name: "Heroe's Gathering", game_code: "1041cc7ee268d01bef9167b2750a79d3", game_type: "Slot Game", game_image: "" },
        { game_name: "Heroes Hunt 2", game_code: "61f666c39f980c8f502904fd33385942", game_type: "Slot Game", game_image: "" },
        { game_name: "HEX", game_code: "b83138c16ca5b9f17eec6c56898a9d38", game_type: "Slot Game", game_image: "" },
        { game_name: "Ignite The Night", game_code: "bc0292df2bf187a78230ffac3da03fc0", game_type: "Slot Game", game_image: "" },
        { game_name: "Iron Bank", game_code: "e4ca777001c387d1d0f72afc1685675b", game_type: "Slot Game", game_image: "" },
        { game_name: "It's Time", game_code: "c63471a52b7cc5f9d0430706558af627", game_type: "Slot Game", game_image: "" },
        { game_name: "Joker Jackpot", game_code: "3b50ee5424f0a603c5e099bf238f206a", game_type: "Slot Game", game_image: "" },
        { game_name: "King of Kings", game_code: "6538c023e2a114c08aa6dc99a074d346", game_type: "Slot Game", game_image: "" },
        { game_name: "Kluster Krystals Megaclusters", game_code: "5683181337fcb0199cefa0d2a0accc61", game_type: "Slot Game", game_image: "" },
        { game_name: "La Fiesta", game_code: "bcc619fe63942c19eea3262ffeb457b5", game_type: "Slot Game", game_image: "" },
        { game_name: "Let's get ready to Rumble", game_code: "713751df9feb95ec6ba3107bec478f4e", game_type: "Slot Game", game_image: "" },
        { game_name: "Magikspell", game_code: "04fa959a6d67e73c75ae914e8d8ab970", game_type: "Slot Game", game_image: "" },
        { game_name: "Marching Legions", game_code: "e0afcc1e0c80717e0109f24210ad6ad9", game_type: "Slot Game", game_image: "" },
        { game_name: "Maze Escape", game_code: "9c694106c336ae752eaaf21c8294cb6f", game_type: "Slot Game", game_image: "" },
        { game_name: "Medallion Megaways", game_code: "5228ebc61415bab98372846ad6723165", game_type: "Slot Game", game_image: "" },
        { game_name: "Mega Flip", game_code: "0d9c8f4c90c9ae3967010af3adf9af12", game_type: "Slot Game", game_image: "" },
        { game_name: "Mega Masks", game_code: "4da9b77527b051c23d54f737a8511217", game_type: "Slot Game", game_image: "" },
        { game_name: "Mega Mine", game_code: "2e4c51b2765d93618a3f315682cbf6db", game_type: "Slot Game", game_image: "" },
        { game_name: "Money Cart", game_code: "bd2dda321e50679e17332c84dbcff09a", game_type: "Slot Game", game_image: "" },
        { game_name: "Money Cart 2", game_code: "800084ab353ffbc364984ecda50f39a8", game_type: "Slot Game", game_image: "" },
        { game_name: "Money Train", game_code: "fad0fd9b89d6784c6a4110b6609ff685", game_type: "Slot Game", game_image: "" },
        { game_name: "Money Train 2", game_code: "53e2366f625dc6ebc240a32541e93a9d", game_type: "Slot Game", game_image: "" },
        { game_name: "Multiplier Odyssey", game_code: "5b69407e95f29e79f0e5aff93e83d0e4", game_type: "Slot Game", game_image: "" },
        { game_name: "Mystery Stacks", game_code: "bf4c0d4cac1fe23448a11017b281c93d", game_type: "Slot Game", game_image: "" },
        { game_name: "Plunderland", game_code: "871e21dded538632a5c0a4accf30fc55", game_type: "Slot Game", game_image: "" },
        { game_name: "Powerspin", game_code: "a8a21cd62f27103c8f277129ca67376f", game_type: "Slot Game", game_image: "" },
        { game_name: "Ramses Revenge", game_code: "28ab7b8ceb6a6878b024fbb2196ad310", game_type: "Slot Game", game_image: "" },
        { game_name: "Rocky's Gold", game_code: "276fab1972603f8d7e5eab2385a35259", game_type: "Slot Game", game_image: "" },
        { game_name: "Royal Potato", game_code: "c84f14ec356c6c9137f519675ac99506", game_type: "Slot Game", game_image: "" },
        { game_name: "Sails of Fortune", game_code: "8d4c17f08994b2a42903ff72fed2d75e", game_type: "Slot Game", game_image: "" },
        { game_name: "Santa's Stack", game_code: "222fe762eec92afc6de5562b6853a322", game_type: "Slot Game", game_image: "" },
        { game_name: "Serpent Shrine", game_code: "27fc5f9ebc932a75efb4b1381304c408", game_type: "Slot Game", game_image: "" },
        { game_name: "Sherlock Bones", game_code: "bd3dd93484b07041024ad23dff3da9a8", game_type: "Slot Game", game_image: "" },
        { game_name: "Snake Arena", game_code: "210b089dbbd0104f00c2f093e58f9dd5", game_type: "Slot Game", game_image: "" },
        { game_name: "Space Miners", game_code: "0d7283aa7ae90cfdaea4e7982acb21db", game_type: "Slot Game", game_image: "" },
        { game_name: "Spirit of The Beast", game_code: "c9f41931cda435c0c80fbdc761b66d1e", game_type: "Slot Game", game_image: "" },
        { game_name: "Splendour Forest", game_code: "b4fd2cc496356a5d63e9c14160b707a9", game_type: "Slot Game", game_image: "" },
        { game_name: "Star Pops", game_code: "064357bd3f8a3f50350db142bee82215", game_type: "Slot Game", game_image: "" },
        { game_name: "Super Boost", game_code: "89656510874f78a6e2159e1377ec55d7", game_type: "Slot Game", game_image: "" },
        { game_name: "Templar Tumble", game_code: "f43d0e981d28ceb7810ba13bb2256c51", game_type: "Slot Game", game_image: "" },
        { game_name: "Temple Tumble", game_code: "3262fc859fa134a4a373607d6cc71fbe", game_type: "Slot Game", game_image: "" },
        { game_name: "The Golden Sail", game_code: "5a52417f6a7fe389a7abe77cae838135", game_type: "Slot Game", game_image: "" },
        { game_name: "The Great Pigsby", game_code: "8bce189551fbd9871fb19bdb35a06279", game_type: "Slot Game", game_image: "" },
        { game_name: "The Great Pigsby Megaways", game_code: "f8ccf08677de47b53e3576ff5b3a155a", game_type: "Slot Game", game_image: "" },
        { game_name: "Top Dawg$", game_code: "17fbe4ff135f4be5451abb1fbd837c78", game_type: "Slot Game", game_image: "" },
        { game_name: "Tower Tumble", game_code: "046a747cb698fafab6727fc4bd488db5", game_type: "Slot Game", game_image: "" },
        { game_name: "Troll's Gold", game_code: "14fbe3ca7391d58561589a31b9b237c4", game_type: "Slot Game", game_image: "" },
        { game_name: "Twisted Turbine", game_code: "4cdcffd906d3e7036322ca3c660ef9ce", game_type: "Slot Game", game_image: "" },
        { game_name: "Volatile Vikings", game_code: "4b279c61e4cc5d63ae3a0fe98944a9bd", game_type: "Slot Game", game_image: "" },
        { game_name: "Wild Chapo", game_code: "5a1696874baae65ada36024621b80825", game_type: "Slot Game", game_image: "" },
        { game_name: "Wildchemy", game_code: "0dcbaa8bfc76d8b0641df762a8649028", game_type: "Slot Game", game_image: "" },
        { game_name: "Zombie Circus", game_code: "d4caa1b692e779ca3d7397b58755dade", game_type: "Slot Game", game_image: "" }
    ]
    ,
};
const evoplay = {
    platform: "digital",
    provider: "evoplay",
    games: [
        { game_name: "Mary's Mining Mania", game_code: "58817c1ce7f65322581e1be2aeadadee", game_type: "instant game", game_image: "" },
        { game_name: "Lucky Porker Bonus Buy", game_code: "a83230f3acade57c2b27e77f8f9002b1", game_type: "video slot", game_image: "" },
        { game_name: "Europe Transit Bonus Buy", game_code: "23fa591e8d844c65f60c188778f8303a", game_type: "video slot", game_image: "" },
        { game_name: "Northern Temple Bonus Buy", game_code: "234b6bf7260c93d5bc638b60d6b8511b", game_type: "video slot", game_image: "" },
        { game_name: "Goddess Of The Night Bonus Buy", game_code: "668353e4fe70ec38c958fc09353d977e", game_type: "video slot", game_image: "" },
        { game_name: "Neon Capital Bonus Buy", game_code: "a3676ae2df86374d136e30c0d51e2996", game_type: "video slot", game_image: "" },
        { game_name: "Goddess of the Night", game_code: "bc4f2a5cdafd60877bd7decce61561ba", game_type: "video slot", game_image: "" },
        { game_name: "Northern Temple", game_code: "61f76fbcb85fdd340304574eb6c1083f", game_type: "video slot", game_image: "" },
        { game_name: "Lucky Porker", game_code: "f8cf0fdec52cce71072c4159eb1c9224", game_type: "video slot", game_image: "" },
        { game_name: "Europe Transit", game_code: "51ecfd4912cb93a693523c908fb738f9", game_type: "video slot", game_image: "" },
        { game_name: "Xmas Keno Cat", game_code: "fdff2a1bab4fdec3599cf29b26c7a1a3", game_type: "Slot Game", game_image: "" },
        { game_name: "X-Demon Bonus Buy", game_code: "9ef0ff60c1adb03b9f777cf7fdade6d3", game_type: "video slot", game_image: "" },
        { game_name: "X-Demon", game_code: "60173b6bcdf9d5d96931dc7516cce002", game_type: "video slot", game_image: "" },
        { game_name: "Wonder Farm Bonus Buy", game_code: "abcccab4dafb536db5176f4dd6967eeb", game_type: "video slot", game_image: "" },
        { game_name: "Wonder Farm", game_code: "e2c7f9694088040491f024b15544b3c0", game_type: "video slot", game_image: "" },
        { game_name: "Wolf Hiding Bonus Buy", game_code: "fb300c072f655d2f81641c2be72b0f58", game_type: "video slot", game_image: "" },
        { game_name: "Wolf Hiding", game_code: "8e95cd667a6d2b61d31c16d167125559", game_type: "video slot", game_image: "" },
        { game_name: "Wild Overlords Bonus Buy", game_code: "a4baefea8c96a19b13b4c1b091dceb3d", game_type: "video slot", game_image: "" },
        { game_name: "Wild Overlords", game_code: "50286869adfdd58224797db54df4ac93", game_type: "video slot", game_image: "" },
        { game_name: "Wild Bullets", game_code: "d4b0ce668d4e90cba8581ed740f47ffe", game_type: "video slot", game_image: "" },
        { game_name: "Wheel of Time", game_code: "e69ae392236b0275f357ed756d3fbbc7", game_type: "instant game", game_image: "" },
        { game_name: "Western Reels", game_code: "742546e917724e33b084b1ea80ac5904", game_type: "video slot", game_image: "" },
        { game_name: "Vegas Nights", game_code: "cb5e4dacd8ec8783972ac64164770416", game_type: "video slot", game_image: "" },
        { game_name: "Valley of Dreams", game_code: "b32495d9ee065b2aae52c35014806ca0", game_type: "video slot", game_image: "" },
        { game_name: "Unlimited Wishes", game_code: "d36d6e34d2807f8968929ef048655951", game_type: "video slot", game_image: "" },
        { game_name: "Unlimited Treasures Bonus Buy", game_code: "693d47e6f61bd2aa27c13f6d3fbb74fe", game_type: "video slot", game_image: "" },
        { game_name: "Unlimited Treasures", game_code: "1a201944c4097ec94e7e74f83fea7dc6", game_type: "video slot", game_image: "" },
        { game_name: "Triple Chili", game_code: "392b293870153cf7e65c172a1dc5a9d5", game_type: "video slot", game_image: "" },
        { game_name: "Trip to the Future", game_code: "b6a46dc4a6d35660517d5ae35ac227ff", game_type: "Slot Game", game_image: "" },
        { game_name: "Tree Of Light Bonus Buy", game_code: "7b1837fd27abdf24f1461bebc199e8e8", game_type: "video slot", game_image: "" },
        { game_name: "Tree of Light", game_code: "5867eb70eb08b522e1f44ea5bc33a213", game_type: "video slot", game_image: "" },
        { game_name: "Treasure-snipes: Christmas Bonus Buy", game_code: "ca3a67f5181a6e86c94a25b4162ddf3f", game_type: "video slot", game_image: "" },
        { game_name: "Treasure-snipes: Christmas", game_code: "088d2ed459019ae6de11f7860342ee57", game_type: "video slot", game_image: "" },
        { game_name: "Treasure-snipes Bonus Buy", game_code: "26c898682112883ea50be69c5766b7c6", game_type: "video slot", game_image: "" },
        { game_name: "Treasure-Snipes", game_code: "13bd0bd2c811989a10459a386a2939ee", game_type: "video slot", game_image: "" },
        { game_name: "Treasure of the Gods", game_code: "6bd81be054b9e2846d5626adfb04921e", game_type: "instant game", game_image: "" },
        { game_name: "Treasure Mania", game_code: "a717d11e7a78b6c05c9d1337c1d58b52", game_type: "video slot", game_image: "" },
        { game_name: "Thimbles", game_code: "814cf15a2faff32d479c6d8e69baa986", game_type: "instant game", game_image: "" },
        { game_name: "The Slavs", game_code: "f0dd6ee9c991538662c66db1fb5f6fcb", game_type: "video slot", game_image: "" },
        { game_name: "The Greatest Catch Bonus Buy", game_code: "bf7e85bc4f56302e92369481e3ffba6c", game_type: "video slot", game_image: "" },
        { game_name: "The Greatest Catch", game_code: "c113c62b010f448b281ca16cae935914", game_type: "video slot", game_image: "" },
        { game_name: "The Great Wall Treasure", game_code: "e7a0f9d6503d39083fdd512dfe9c482a", game_type: "Slot Game", game_image: "" },
        { game_name: "The Great Conflict", game_code: "a1d44162c344376ef028e0933389942c", game_type: "Slot Game", game_image: "" },
        { game_name: "The Emperor's Tomb", game_code: "567b79d2f2849dd68fbc37b9a211d4e7", game_type: "video slot", game_image: "" },
        { game_name: "Temple of Thunder", game_code: "f75f229e24dcc389214bc65a87697c35", game_type: "video slot", game_image: "" },
        { game_name: "Temple of Dead Bonus Buy", game_code: "77c3109374d2d17a2c9e44d544c244e0", game_type: "video slot", game_image: "" },
        { game_name: "Temple of Dead", game_code: "fbcc05972043b7dc4ff03e583410d56a", game_type: "video slot", game_image: "" },
        { game_name: "Talismans of Fortune", game_code: "96f74cf998fc152084e03afabee45e7e", game_type: "video slot", game_image: "" },
        { game_name: "Syndicate", game_code: "f654a65cc9ddb9af481758e79f0bfb70", game_type: "Slot Game", game_image: "" },
        { game_name: "Sweet Sugar", game_code: "51267b0432cf5819590f7d322cfeeb2d", game_type: "video slot", game_image: "" },
        { game_name: "Surf Zone", game_code: "37d423393a5c79fff1ecbddd07fee270", game_type: "video slot", game_image: "" },
        { game_name: "Super Bartender", game_code: "0e83ccc2dd4836ce85681fca672d6441", game_type: "Slot Game", game_image: "" },
        { game_name: "Sprinkle", game_code: "b35ecb8e3232139150994c589df7175e", game_type: "Slot Game", game_image: "" },
        { game_name: "Sold it Bonus Buy", game_code: "8fda0343e213121627fc9cf4c3d771a1", game_type: "video slot", game_image: "" },
        { game_name: "Sold it", game_code: "44ab6ba5268ed8ce3b8dc616b327e9d8", game_type: "video slot", game_image: "" },
        { game_name: "Soccer Solo Striker", game_code: "f61025613b581df8ad5727da782bd8da", game_type: "instant game", game_image: "" },
        { game_name: "Shadow Of Luxor", game_code: "ac5c88f22c0b570ac4826380e99b79fc", game_type: "video slot", game_image: "" },
        { game_name: "Season Sisters", game_code: "0a4d16841015b26d9196449b4b97379f", game_type: "video slot", game_image: "" },
        { game_name: "Sea of Spins", game_code: "927b46978cb1a5fd90521951aaa4f857", game_type: "Slot Game", game_image: "" },
        { game_name: "Scratch Match", game_code: "d763610ce7c5c22a12e1f7c840836af8", game_type: "instant game", game_image: "" },
        { game_name: "Save the Hamster", game_code: "62fa50b18baf9cb6190fe23c684e38ed", game_type: "instant game", game_image: "" },
        { game_name: "Runes Of Destiny", game_code: "a90416eb3f298ceb10bac60100e37a2e", game_type: "video slot", game_image: "" },
        { game_name: "Rueda De Chile Bonus Buy", game_code: "d8855fde26e955b501d2d65cf1ac203b", game_type: "video slot", game_image: "" },
        { game_name: "Rueda De Chile", game_code: "f9c8e7d065cd8a9c1f135706a6a9b72a", game_type: "video slot", game_image: "" },
        { game_name: "Roll to Luck", game_code: "caff8916522d0728fd7340fa5a3d446f", game_type: "Slot Game", game_image: "" },
        { game_name: "Roll The Dice", game_code: "93c1e88bf2a1bd489a1360cb533a9c6e", game_type: "instant game", game_image: "" },
        { game_name: "Rocket Stars", game_code: "7335c18ab12e7f8902411a6abd692f78", game_type: "video slot", game_image: "" },
        { game_name: "Rock Paper Scissors", game_code: "cf3101762e302a012d3d9b4652863d87", game_type: "Slot Game", game_image: "" },
        { game_name: "Robots: Energy Conflict", game_code: "65e019f5c58d6f4a3bad60286c5d928a", game_type: "Slot Game", game_image: "" },
        { game_name: "Robinson", game_code: "ec8ec03146e5779287ec55e8814b3137", game_type: "Slot Game", game_image: "" },
        { game_name: "Robin Hood", game_code: "d8ffea673dfa9835af890c44bd6420ef", game_type: "video slot", game_image: "" },
        { game_name: "Rise of Horus", game_code: "e9f0fa071c389c91cc7e1c786c392aeb", game_type: "video slot", game_image: "" },
        { game_name: "Rich Reels", game_code: "6cd7fc00e69d8a482cd3fcb1a2e8ae60", game_type: "video slot", game_image: "" },
        { game_name: "Reign Of Dragons", game_code: "4ed27a1a60b74411ce5787615a93555a", game_type: "video slot", game_image: "" }
    ]
    ,
};
const ezugi = {
    platform: "digital",
    provider: "ezugi",
    games: [
        { game_name: "EZ Dealer Roleta Brazileira", game_code: "4165dec80667c631a66941c68a5bee96", game_type: "CasinoLive", game_image: "" },
        { game_name: "Roleta da sorte", game_code: "eacbc601b30b2992db7c3eda2a777fe6", game_type: "CasinoLive", game_image: "" },
        { game_name: "Dragon Tiger da Sorte", game_code: "f84c5ce9ae53fac2e7afa9f8157e453c", game_type: "CasinoLive", game_image: "" },
        { game_name: "Blackjack da Sorte", game_code: "4f22281594a261d99c1b1222bc2d3a8a", game_type: "CasinoLive", game_image: "" },
        { game_name: "Oracle 360 Roulette", game_code: "c74c90c712566b3212cd08a4c191275d", game_type: "CasinoLive", game_image: "" },
        { game_name: "Oracle Real Roulette", game_code: "c5d4fd6cec78dd439ed2ee33c8965777", game_type: "CasinoLive", game_image: "" },
        { game_name: "Russian Roulette", game_code: "ce1b314dccf3756a581d117190ddd172", game_type: "CasinoLive", game_image: "" },
        { game_name: "Turkish Roulette", game_code: "f8bbea8c1a3b2204190d6a7e3c8d55e8", game_type: "CasinoLive", game_image: "" },
        { game_name: "EZ Dealer Roulette Mandarin", game_code: "db62931938bcaf0b327b11304a406b16", game_type: "CasinoLive", game_image: "" },
        { game_name: "EZ Dealer Roulette Japanese", game_code: "4a963476f45508711a7147ba888600ad", game_type: "CasinoLive", game_image: "" },
        { game_name: "EZ Roulette", game_code: "fb53959d1f55434d555ee50e0fc764b8", game_type: "CasinoLive", game_image: "" },
        { game_name: "Ruleta del Sol", game_code: "4589bec2f464797bb0752d2eb283babd", game_type: "CasinoLive", game_image: "" },
        { game_name: "Spanish Roulette", game_code: "7d0d91d4477b9d14e3a4ba40e34451ea", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Roulette 2", game_code: "44b99989a409c0ca24aca784f0433dcc", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Roulette 1", game_code: "d205c518208016404504e995620d2b83", game_type: "CasinoLive", game_image: "" },
        { game_name: "Ultimate Andar Bahar", game_code: "75f81c56555d394503f544f3431ef370", game_type: "CasinoLive", game_image: "" },
        { game_name: "Teen Patti 3 Card", game_code: "26f9f76a8fc813b8abcb6b8cb03c2eab", game_type: "CasinoLive", game_image: "" },
        { game_name: "Namaste Roulette", game_code: "b1ffb1afd5b76785bd4ee21e31400849", game_type: "CasinoLive", game_image: "" },
        { game_name: "Prestige Auto Roulette", game_code: "efaed662fbebbb84e056c09580ae1aa4", game_type: "CasinoLive", game_image: "" },
        { game_name: "Diamond Roulette", game_code: "a40c7e3222a17717bcc1d2e4f5d6eae8", game_type: "CasinoLive", game_image: "" },
        { game_name: "Speed Auto Roulette", game_code: "f4299915859041e94b641a558a1ca9df", game_type: "CasinoLive", game_image: "" },
        { game_name: "Speed Roulette", game_code: "b5c8e49fdd80b57de6da0e234b1bd683", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Baccarat 4", game_code: "527db204952a306f8459b9d702dfb285", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Baccarat 3", game_code: "243c511540c8d82597245bd282c327a1", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Baccarat 2", game_code: "58501dadbf6088c4722e72660a1f38b7", game_type: "CasinoLive", game_image: "" },
        { game_name: "Spanish Unlimited Blackjack", game_code: "e34d828be9c5dbd861dbcc414d2daad7", game_type: "CasinoLive", game_image: "" },
        { game_name: "Rumba Blackjack 4", game_code: "1c77a06449c384b97f6239572ef87be3", game_type: "CasinoLive", game_image: "" },
        { game_name: "Rumba Blackjack 3", game_code: "e6a2e3cc081f28298164d9197c38ec7c", game_type: "CasinoLive", game_image: "" },
        { game_name: "Rumba Blackjack 2", game_code: "22c57f788355265137a61874d0b53bb9", game_type: "CasinoLive", game_image: "" },
        { game_name: "Rumba Blackjack 1", game_code: "8ef17e9b4c5c67b7f43f4bced3c31a27", game_type: "CasinoLive", game_image: "" },
        { game_name: "VIP Diamond Blackjack", game_code: "48420430ede7a5d7615dae19aa4463a7", game_type: "CasinoLive", game_image: "" },
        { game_name: "Surrender Blackjack", game_code: "d9723621d4007265d66cc115b5a953df", game_type: "CasinoLive", game_image: "" },
        { game_name: "Gold Blackjack 1", game_code: "2955688bdb4f23686e3ce61b905aafeb", game_type: "CasinoLive", game_image: "" },
        { game_name: "Gold Blackjack 3", game_code: "02478a653aa641470951d0a9cae59699", game_type: "CasinoLive", game_image: "" },
        { game_name: "VIP Fortune Baccarat", game_code: "044a24737767690ed7a0be43ed9dd137", game_type: "CasinoLive", game_image: "" },
        { game_name: "Speed Fortune Baccarat", game_code: "a4f20ded65fffacd9001782619a90cce", game_type: "CasinoLive", game_image: "" },
        { game_name: "Fortune Baccarat", game_code: "04f266b7a2e9e68865d52fb7f2ac5e8a", game_type: "CasinoLive", game_image: "" },
        { game_name: "Unlimited Blackjack", game_code: "18cf7864fee424c7471bb7996aa4d37a", game_type: "CasinoLive", game_image: "" },
        { game_name: "Ultimate Sic Bo", game_code: "5cd59a9381764a84f5792d237469903a", game_type: "CasinoLive", game_image: "" },
        { game_name: "Ultimate Roulette", game_code: "b7385424b2c19a46cbcece0c8dfb0080", game_type: "CasinoLive", game_image: "" },
        { game_name: "Sic Bo", game_code: "101e3c281b35485001bec47561a0a03e", game_type: "CasinoLive", game_image: "" },
        { game_name: "Italian Roulette", game_code: "2e31c310ad2491d3c6021f6063dc9b74", game_type: "CasinoLive", game_image: "" },
        { game_name: "EZ Dealer Roulette Thai", game_code: "a987ab0cda923c2f8e6fbc5292d7a062", game_type: "CasinoLive", game_image: "" },
        { game_name: "Portomaso Roulette 2", game_code: "91a2daa3d4b8065ffb75818568907ff8", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Baccarat 1", game_code: "2227c0b7445885e9f6a852eaf2fe74b6", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Marina Andar Bahar", game_code: "5058f0aa42547208b1307fcbf21dcf9a", game_type: "CasinoLive", game_image: "" },
        { game_name: "One Day Teen Patti", game_code: "01556a46c5163d5570739dd7cddfcf68", game_type: "CasinoLive", game_image: "" },
        { game_name: "Lucky 7", game_code: "c88c40ec4fc544518d938315e2d1b2a3", game_type: "CasinoLive", game_image: "" },
        { game_name: "Dragon Tiger", game_code: "efdb52994fbfe97efcbd878dbd697ebb", game_type: "CasinoLive", game_image: "" },
        { game_name: "Cricket War", game_code: "93e289d1b18a9f82fb5d790f3c8e6735", game_type: "CasinoLive", game_image: "" },
        { game_name: "Casino Hold'em", game_code: "045e21f65e0e96eb502a4856ca9ababb", game_type: "CasinoLive", game_image: "" },
        { game_name: "Salon Prive Blackjack", game_code: "9f944a6cb336df7664f81e3ff6aba50e", game_type: "CasinoLive", game_image: "" },
        { game_name: "Gold Blackjack 5", game_code: "b307868469ec2b2e612045335086ff33", game_type: "CasinoLive", game_image: "" },
        { game_name: "Bet on Teen Patti", game_code: "e1b5650cd867be7719c15e7596aa7217", game_type: "CasinoLive", game_image: "" },
        { game_name: "Super 6 Baccarat", game_code: "f1fa68fce40959ce6ad5f367739f9e27", game_type: "CasinoLive", game_image: "" },
        { game_name: "Knockout Baccarat", game_code: "b12517092523e6d4b0c991a181c7d813", game_type: "CasinoLive", game_image: "" }
    ]
    ,
};
// const kmone = {
//     platform: "digital",
//     provider: "kmone",
//     games: [
//         { game_name: "Fortune_Dragon", game_code: "eb974cce48697925955ce55d1afb13c1", game_type: "Slot Game", game_image: "" },
//         { game_name: "Gate_to_Gold", game_code: "17997c58cc44b30679e7efe5ccaa4c8d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Big_Rich_Fortune", game_code: "0052ab3e8fbff56f9d192925ede93728", game_type: "Slot Game", game_image: "" },
//         { game_name: "Fortune_Festival", game_code: "c631bfe3a20840a8654d684a291e6e68", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragons_Legend", game_code: "9fc16beadc31ce189f56a6ec86117547", game_type: "Slot Game", game_image: "" },
//         { game_name: "FaFa_Babies", game_code: "8110ac702071ebc71ca1698143dc7b85", game_type: "Slot Game", game_image: "" },
//         { game_name: "Heavenly_Rich", game_code: "a349eb03e085ed1a84dbdc48e22f6614", game_type: "Slot Game", game_image: "" },
//         { game_name: "Happy_Panda", game_code: "a233ca6f73ed10fe1133903a34f9788a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Celebrating_Lions", game_code: "19b2c308faa7f159cde4494b1a5d3285", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kings_Piggy_Bank", game_code: "d0e22b9864ee4c422d94168e101ccfa2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky_Koi", game_code: "86b90d79b25cb4d4ae4b058d4b72a0e1", game_type: "Slot Game", game_image: "" },
//         { game_name: "Double_Dragon", game_code: "5f04ba80f992a71962436c9c48335bc0", game_type: "Slot Game", game_image: "" },
//         { game_name: "Money_Frog", game_code: "c2e78f3755809824dd635085170b7583", game_type: "Slot Game", game_image: "" },
//         { game_name: "Rising_Phoenix", game_code: "de5964c285168068c8c448d4fc47552f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Winning_Scroll", game_code: "c00c5e9bbe6c918ebf9ea6951889d748", game_type: "Slot Game", game_image: "" },
//         { game_name: "Fa_Cai_Shen", game_code: "f0a8e72cf4de310323cfcb5d99391c3e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Double_Happiness", game_code: "3f6751075faaed2465733a36ed20ac9d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Party_Monkey", game_code: "09742732dd9ec6bc24870a1965004969", game_type: "Slot Game", game_image: "" },
//         { game_name: "Beautiful_Peony", game_code: "0db6915d71e008683985e3637e3e7c2c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Eternal_Fortune", game_code: "b63e1ad05d45d80e967ce3be5339b776", game_type: "Slot Game", game_image: "" },
//         { game_name: "88_Treasures", game_code: "c4bd1db960587685ad9fc6e644bb9a38", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kings_Piggy_Gold", game_code: "439796e07619bca73888d6d069d3e0f8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Monkey_King_Opera", game_code: "6f5eed37f19a7bdb5586b42ab6e2ed60", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kings_Jackpots", game_code: "36f220f7a76f7e7e8c57169546af6b9a", game_type: "Slot Game", game_image: "" },
//         { game_name: "88_Golden_Fortunes", game_code: "700ecc233948076cd0743d937b3ed02a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jin_Chan", game_code: "a3ed01075f2f55704553425f4a7fcf52", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jackpot_Treasures", game_code: "320b24ada6ce9087b4747eeeebcc2898", game_type: "Slot Game", game_image: "" },
//         { game_name: "Monkey_King_Opera_2", game_code: "4f07d5311bf8f9455e7d35eb3b73a40b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Tom_Yummy", game_code: "a2c7bf307127a8d6f82dea44ff01c7cb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Piggy_Bank_XPlay", game_code: "e82dec5e52ad4aa4590180d8cc908b70", game_type: "Slot Game", game_image: "" },
//         { game_name: "Prosperity_Rat", game_code: "1a499305f1eb9b59bbc7d3ecb189cd78", game_type: "Slot Game", game_image: "" },
//         { game_name: "Farm_Of_Fortune", game_code: "68f42ae0380460dc049d517b085dd85b", game_type: "Slot Game", game_image: "" },
//         { game_name: "Thai_Sweets_Bonanza", game_code: "fc37c59478bdd8770bfd59294139e16e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Jin_Chan_Xplay", game_code: "679ca4120fa5dbde81c5cb3403fbe3fe", game_type: "Slot Game", game_image: "" },
//         { game_name: "The_Legend_Of_Banyan_Tree", game_code: "04d23162d73e78890c73a8c86eb07d13", game_type: "Slot Game", game_image: "" },
//         { game_name: "Songkran_Lucky_Splash", game_code: "6604aebe11352c012868311f314b013f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Royal_Treasures", game_code: "52f524729f48e7112e1c5907d7db28be", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragon_King_Of_The_Ocean", game_code: "c92805536524fc8abc8ef0887996e383", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild_West_Gold_Rush", game_code: "811a2c9060d465c62b79c3469bb28aa1", game_type: "Slot Game", game_image: "" },
//         { game_name: "Vikings_Fate_Of_Prosperity", game_code: "00a05e14c5b350367cb2ace55591554f", game_type: "Slot Game", game_image: "" },
//         { game_name: "The_Game", game_code: "76ab3078bdefc63e1911fd668e38bdbe", game_type: "Slot Game", game_image: "" },
//         { game_name: "Usaba_Sambah", game_code: "583906c65e4b70cdc006223bbdc08706", game_type: "Slot Game", game_image: "" },
//         { game_name: "Guardian_of_Fortune", game_code: "064b673d42e2b9a0e7e7579b011c88c2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Majestic_Mandap", game_code: "43d9cc3b237253bcea9fbb2bd7778046", game_type: "Slot Game", game_image: "" },
//         { game_name: "Himalaya_Treasures", game_code: "4f4167c88bfd7441f8031c528dad5f74", game_type: "Slot Game", game_image: "" },
//         { game_name: "White_Elephant", game_code: "89d3e5cc59919e4bcd2969c5a9475986", game_type: "Slot Game", game_image: "" },
//         { game_name: "Break_The_Bank", game_code: "beb125737b2aadf2d7ffacc86ec25f99", game_type: "Slot Game", game_image: "" },
//         { game_name: "Diamond_King", game_code: "08e2f7cb49c357990ef848c73a5dd25d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild_Miner", game_code: "c71dd3e903f5666d1096125547b917c2", game_type: "Slot Game", game_image: "" },
//         { game_name: "The_Big_The_Fat_And_The_Ugly", game_code: "7083bf6168e2fefdef510b0e837174f5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Eyes_of_Ra", game_code: "5d2ac8989d90d73c261f9b570a749e87", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lady_of_Ra", game_code: "9b99e457e857faf34837d0c278dac9d5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Redbeard_Treasures", game_code: "44e251e080e57d0efbeb8593b9fc2e62", game_type: "Slot Game", game_image: "" }
//     ]
//     ,
// };
const ideal = {
    platform: "digital",
    provider: "ideal",
    games: [
        { game_name: "Emperor Qin", game_code: "d58b1c2dd6456da42b2c1a33c70c1630", game_type: "Slot Game", game_image: "" },
        { game_name: "Cracker", game_code: "b6668f2abcfff3f7f78ae92fe908f99f", game_type: "Slot Game", game_image: "" },
        { game_name: "FaFaFa", game_code: "017c1edeaf54d4684d675055c44a6f7e", game_type: "Slot Game", game_image: "" },
        { game_name: "Gold Toad", game_code: "654155802c34cee717e943c4e2bb6bfe", game_type: "Slot Game", game_image: "" },
        { game_name: "Lion Legend", game_code: "eb8dd621ea38d742ff846362a9b1085d", game_type: "Slot Game", game_image: "" },
        { game_name: "Goblin's Gold", game_code: "697993800419bf160901aa9133cde524", game_type: "Slot Game", game_image: "" },
        { game_name: "The Unsurpassed Grace", game_code: "bf0ae3c404807429451d088725ae5377", game_type: "Slot Game", game_image: "" },
        { game_name: "Arctic King", game_code: "8249b0e703ceb0816f3645dbac0a83ce", game_type: "Slot Game", game_image: "" },
        { game_name: "Jalapeno", game_code: "f23ad5acc6c690a45f1280ba49d28266", game_type: "Slot Game", game_image: "" },
        { game_name: "Ice Age Mammoths", game_code: "484025f23c821e32fc6ac31ff75613d6", game_type: "Slot Game", game_image: "" },
        { game_name: "Zorro", game_code: "e2a8a030f69553e9dd8f287c11bed399", game_type: "Slot Game", game_image: "" },
        { game_name: "Three Kings", game_code: "316aa38ad4468a2ab757ff5a8836ab59", game_type: "Slot Game", game_image: "" },
        { game_name: "Panda Warrior", game_code: "96b1f087066664f4bbf547719f4ce562", game_type: "Slot Game", game_image: "" },
        { game_name: "Pirate Attack", game_code: "1ae2dd4a2b6b520ea618e49734114cc2", game_type: "Slot Game", game_image: "" },
        { game_name: "Crazy Penguin", game_code: "b242216f35f89856685b923ea29033d5", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Cat", game_code: "a1149d0f9c50430ae060b026f09e4c7a", game_type: "Slot Game", game_image: "" },
        { game_name: "Toy Soldiers", game_code: "32d3a212089035386a95a21d6582d368", game_type: "Slot Game", game_image: "" },
        { game_name: "Power of Thor", game_code: "324d92fb13d0d6228279b4f7792a75ac", game_type: "Slot Game", game_image: "" },
        { game_name: "Dragon Tiles", game_code: "ba653f265134f4662d05363515e5c510", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Gate", game_code: "18bd994afe332e7ac903f511d485644e", game_type: "Slot Game", game_image: "" },
        { game_name: "Shining Diamond", game_code: "c5d0d421f875023cbf927692da2009d9", game_type: "Slot Game", game_image: "" },
        { game_name: "Gold Miner", game_code: "182d8051c14f15943b8362f809bb23f0", game_type: "Slot Game", game_image: "" },
        { game_name: "Foxy Heist", game_code: "466cbf64cf586706eddbc2dd89e2d5b0", game_type: "Slot Game", game_image: "" },
        { game_name: "Treasure Mine", game_code: "a38019da304f80b536e9677aba84ec9e", game_type: "Slot Game", game_image: "" },
        { game_name: "God of Fortune", game_code: "a1353a355a096a5d7d15fb2636f19f0a", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Koi", game_code: "1eedbd0f491dd245a7e325f200d94834", game_type: "Slot Game", game_image: "" },
        { game_name: "Viking Age", game_code: "4bca928196d945e72b3826e8077ba69f", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Boy", game_code: "4e17695dcfeb6f29e97d392f209f6035", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Panda", game_code: "ce8cc0acf6790e96586cd18e2911c9fc", game_type: "Slot Game", game_image: "" },
        { game_name: "Gold Rush", game_code: "a6edba75571a6e2ad7627bb3c3fbf1aa", game_type: "Slot Game", game_image: "" },
        { game_name: "Train Robber", game_code: "96972e9e911bcff850e2447d4e659378", game_type: "Slot Game", game_image: "" },
        { game_name: "Jalapeno 2", game_code: "eaa49c574b992a6fb3f45c94b9fb4e80", game_type: "Slot Game", game_image: "" },
        { game_name: "Mystery Show", game_code: "1532bc4df58dc85a1be5117db62675c5", game_type: "Slot Game", game_image: "" },
        { game_name: "Pirate Treasure", game_code: "1d6dbb878939ef9da13b6b8874eb922b", game_type: "Slot Game", game_image: "" },
        { game_name: "Royale Expedition", game_code: "b96cb5a9b96659e7697cd854e201cf3b", game_type: "Slot Game", game_image: "" },
        { game_name: "Eagle Parade", game_code: "b0112c09fd807bfe0c1d839b6f002948", game_type: "Slot Game", game_image: "" },
        { game_name: "The King Of Olympus", game_code: "aca500c0066dbf7668bba2ebf63e0ae4", game_type: "Slot Game", game_image: "" },
        { game_name: "Mahjong Gold", game_code: "58f09506283d7a0832dfcab0327ae379", game_type: "Slot Game", game_image: "" },
        { game_name: "Candy Burst", game_code: "dffdfcc2b41ec5672c30b88bbb2e92b7", game_type: "Slot Game", game_image: "" },
        { game_name: "Leprechaun", game_code: "0c78c20229def7d837cbb6bf2d8ae73d", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Neko", game_code: "98a25fb8528bd23ab8f88c1ccf1c92ce", game_type: "Slot Game", game_image: "" },
        { game_name: "Legend of Aztec", game_code: "6c50989ecf5860cc47279d5ee858037e", game_type: "Slot Game", game_image: "" },
        { game_name: "Almighty Zeus", game_code: "d7102fbb62d30b0e9e951c49ad376bfd", game_type: "Slot Game", game_image: "" },
        { game_name: "Gemstone Princess", game_code: "d15afcbd55b16b6b21d6612ea7f09869", game_type: "Slot Game", game_image: "" },
        { game_name: "Mahjong Gold 2", game_code: "77d52f4b95fdc6c04828bd9605e7d1c0", game_type: "Slot Game", game_image: "" },
        { game_name: "Lucky Witch", game_code: "322742d014aca4cb302d86fb3029aba2", game_type: "Slot Game", game_image: "" },
        { game_name: "Fishing Tycoon", game_code: "35970ef5302ee2f20b9de877d6727448", game_type: "Slot Game", game_image: "" },
        { game_name: "Jade Emperor", game_code: "db2e28711729f50609629a9d38de6f9f", game_type: "Slot Game", game_image: "" },
        { game_name: "Crazy Thieves", game_code: "992092a828098028e7de260f937aa4da", game_type: "Slot Game", game_image: "" },
        { game_name: "Spooky Halloween", game_code: "124c8e22d59b3fc448265a1e9b32620c", game_type: "Slot Game", game_image: "" },
        { game_name: "Fortune Bull", game_code: "3d014cc72ef954a49db85f8c04ab2a2a", game_type: "Slot Game", game_image: "" },
        { game_name: "Pharaoh Treasures", game_code: "943e0f1c86ebcad476815003a2084147", game_type: "Slot Game", game_image: "" },
        { game_name: "Thanksgiving Blast", game_code: "f10b39257abb364e56df597f9e07a090", game_type: "Slot Game", game_image: "" },
        { game_name: "Kokushimusou", game_code: "5cb1f73869693063dc0aa1ec4ab4756e", game_type: "Slot Game", game_image: "" },
        { game_name: "Buffalo", game_code: "6cdbaee9633f74e049259494e1eb33f2", game_type: "Slot Game", game_image: "" },
        { game_name: "Tiger Master", game_code: "ac813b4b69128a3732d78fb975752a6a", game_type: "Slot Game", game_image: "" },
        { game_name: "Xiangqi Warfare", game_code: "5bdacaf675d2f94258102e2cbc8d2254", game_type: "Slot Game", game_image: "" },
        { game_name: "Huangdi Legend", game_code: "d760f79443978cce11af6c13c34d9c29", game_type: "Slot Game", game_image: "" },
        { game_name: "Prosperity 168", game_code: "979c421948f713a2e52dcde7c04bfb4f", game_type: "Slot Game", game_image: "" },
        { game_name: "King Gummy Bear", game_code: "8abb0acf4faa451ea4b51eb5e18e3d8b", game_type: "Slot Game", game_image: "" },
        { game_name: "Mahjong Infinity", game_code: "28a9308652063ba362472e2bd1a1f913", game_type: "Slot Game", game_image: "" }
    ]
    ,
};
// const ag = {
//     platform: "digital",
//     provider: "ag",
//     games: [
//         { game_name: "Wild Koi", game_code: "78394335fc08825a6308352060c71477", game_type: "Slot Game", game_image: "" },
//         { game_name: "Royal Gems", game_code: "419e555db225a2da33f8fd70a4b21abf", game_type: "Slot Game", game_image: "" },
//         { game_name: "Pirates Ahoy!", game_code: "5850f48665162c896a75603cefb68239", game_type: "Slot Game", game_image: "" },
//         { game_name: "Animal Fun Park", game_code: "bd5710e6eea38fd01b1c6ee070faaaa7", game_type: "Slot Game", game_image: "" },
//         { game_name: "Treasure Party", game_code: "c469f380f290232fe6900144c05eadfb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky Express", game_code: "708865060caa7d2df743eac11c3f4cf5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kong Invasion", game_code: "3a6096455a8aad592c23da2ad11452d8", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild Gods", game_code: "30fd4ec4f7dff7e3cc3a97317786988c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Gold Class Deluxe", game_code: "d1c1e466b33cf410bcb3bac87109dd8c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky Riches", game_code: "1305a66e13e01e220c7174d0a63d31bc", game_type: "Slot Game", game_image: "" },
//         { game_name: "Mermaid Treasure", game_code: "bf0f661ef7e3913c683733288d82ec23", game_type: "Slot Game", game_image: "" },
//         { game_name: "Beast Party", game_code: "1ffeeff1187bf1e37b6c48e248ae6259", game_type: "Slot Game", game_image: "" },
//         { game_name: "Bingo Slot", game_code: "c68b600f660bf3ce16b99ecda3d78600", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kung Fu All Stars", game_code: "4ab8f4a421d220024f5ef523d4157f21", game_type: "Slot Game", game_image: "" },
//         { game_name: "Bao Zu Po", game_code: "d099fd9bdbfaf7dc0e38bb17200b0e1f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Sex and Zen", game_code: "0a24ae00ed024694a2b6634462904782", game_type: "Slot Game", game_image: "" },
//         { game_name: "Ace Heist", game_code: "33212be7ef2ff23220a19f28c4b74e35", game_type: "Slot Game", game_image: "" },
//         { game_name: "Golden Dragon", game_code: "47599071028717716a5862e260875067", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucha Heroes", game_code: "9f9f0d2472d19dd4876b3515a2be5862", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Nutcracker", game_code: "cebac9092d4b42d95d8d0451814514cb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Temple Raider", game_code: "04a27729ee06289e84a551e53e57437f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Vegas Vegas", game_code: "c0f251e99f38f32552cfdb0ec2be9fac", game_type: "Slot Game", game_image: "" },
//         { game_name: "Ultra Shift", game_code: "22850c724b3b842b8ec88b4e335ea788", game_type: "Slot Game", game_image: "" },
//         { game_name: "Sushi Nights", game_code: "8072d6d6852a99754309f66f4eb4456f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Peking Opera", game_code: "16d9e22e812618aac9cd26e29c4e36cc", game_type: "Slot Game", game_image: "" },
//         { game_name: "Steampunk War", game_code: "41ddfacba068bed9ff7342c1934db3cb", game_type: "Slot Game", game_image: "" },
//         { game_name: "Sexy Succubus", game_code: "6d47c3cc603ea2cfad418bc4b6186c8d", game_type: "Slot Game", game_image: "" },
//         { game_name: "One Percenter", game_code: "e88f7501cbad92d883487cca0732e2e6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Young and Dangerous", game_code: "8a8f9776d24613f1f5f91e6053a078c4", game_type: "Slot Game", game_image: "" },
//         { game_name: "Money Monster", game_code: "32b94e680d9fb12c7949cf6a59e12b8d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Evil Dragons", game_code: "a43fb24437cc772101826bcaede7f9ac", game_type: "Slot Game", game_image: "" },
//         { game_name: "Treasure Tarot", game_code: "a23e8d46b48b8c00d7e2573922085e50", game_type: "Slot Game", game_image: "" },
//         { game_name: "Egyptian Treasure", game_code: "ef720ad608c72d1ed6ac9c90646ab721", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kabuki Gold", game_code: "68ceb604717eee770009a7cb76c02d1e", game_type: "Slot Game", game_image: "" },
//         { game_name: "Fortune Alchemy", game_code: "abc2dcbec0245edb46563c43f0f67a7d", game_type: "Slot Game", game_image: "" },
//         { game_name: "Fengshen Yanyi", game_code: "d7e3d86898d4ed7d35444b003488a913", game_type: "Slot Game", game_image: "" },
//         { game_name: "Festival Lions", game_code: "e4c40222fa107e1570b3fbc4341b679f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Joan of Arc", game_code: "a3f3a761522704640de41eeb53cf962f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Panda's Gold", game_code: "6ab5244c45c39fbdc3305d79245b9c30", game_type: "Slot Game", game_image: "" },
//         { game_name: "Koi Treasure", game_code: "546c9a51ea679e0d63a7754dade7e177", game_type: "Slot Game", game_image: "" },
//         { game_name: "Chinese Zodiac", game_code: "14ae3fbaeafbee3a59468c0278d3558c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Huluwa", game_code: "53ea0a02b499c9803eeef1ae774455f7", game_type: "Slot Game", game_image: "" },
//         { game_name: "TanWanLanYue", game_code: "365cae8fdda38ad7b68469b5bcd1516f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Touchdown Hottie", game_code: "a5ab7f04fefecd2db5ff3f47def5b6f6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Snow White", game_code: "d858ce27f7244c878664b6c093e65b15", game_type: "Slot Game", game_image: "" },
//         { game_name: "Lucky Combo", game_code: "1b7400e38eb9dc82f7d3d0fc22c68127", game_type: "Slot Game", game_image: "" },
//         { game_name: "Happy Jump", game_code: "f03b76b1303529ae3f70d173de89cd75", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Living Dead", game_code: "0e14d2c5dd9d1d5fea9dba28929bcfa6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Bloody Kisses", game_code: "8f36a59c9fce16c7722b162e70777528", game_type: "Slot Game", game_image: "" },
//         { game_name: "Witch's Quest", game_code: "8ddc72d6a684dfe5158f0bb5852c8396", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dark Joker", game_code: "4fad98945a525470055a33f1202223f6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Wild 777", game_code: "427188549299515c91993ca956075212", game_type: "Slot Game", game_image: "" },
//         { game_name: "Diamond Queen", game_code: "7222d94bb916fd77b5a8f5a899300f95", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Moon Lady", game_code: "3264ceb311a117d79bbe9e80919f8575", game_type: "Slot Game", game_image: "" },
//         { game_name: "Alice's Adventures", game_code: "20c13e620572f0c8a282955c44e44e9b", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Storm", game_code: "73ca7225e728ab102fd7ae688c9317c9", game_type: "Slot Game", game_image: "" },
//         { game_name: "King Arthur", game_code: "0aa8d968b7c56974adc8fd3d5194cb34", game_type: "Slot Game", game_image: "" },
//         { game_name: "Mucha Goddesses", game_code: "500277f36736c5367492e2177dc9cced", game_type: "Slot Game", game_image: "" },
//         { game_name: "Real Champions", game_code: "dca095ee1d5c7e02b802462b3b7badfd", game_type: "Slot Game", game_image: "" },
//         { game_name: "King of Glory", game_code: "1149d94840f392e3d08144d3735ae54f", game_type: "Slot Game", game_image: "" },
//         { game_name: "Alibaba", game_code: "532f767bd6abfd7ae1e10d776ca163b2", game_type: "Slot Game", game_image: "" },
//         { game_name: "Mystic Gems", game_code: "8e251b661a10cb978879b9a67f0b3cbc", game_type: "Slot Game", game_image: "" },
//         { game_name: "Mr XIN", game_code: "838e70f96fa6604bec34326ef593e59b", game_type: "Slot Game", game_image: "" },
//         { game_name: "The Dragon Pearl Gold", game_code: "dd0b85faa8172a427b0a8920e4dbb63c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Legend of the Dragon", game_code: "510dd2d9598c7b4e6124e27fcfacce74", game_type: "Slot Game", game_image: "" },
//         { game_name: "Gold Class", game_code: "d36c201786c32d54db2cafc1b828877a", game_type: "Slot Game", game_image: "" },
//         { game_name: "Street Battle", game_code: "5c6b19361ffb0e55f7586f892c5086a5", game_type: "Slot Game", game_image: "" },
//         { game_name: "Fantasies", game_code: "f8aa5ca48f17ddda129d1ac762e6cab4", game_type: "Slot Game", game_image: "" },
//         { game_name: "Moon Festival", game_code: "a4d4688bdd4e009cba6222a5794648ad", game_type: "Slot Game", game_image: "" },
//         { game_name: "K-Pop", game_code: "4e7dc0b750f1c242adb6d1ec425c63d4", game_type: "Slot Game", game_image: "" },
//         { game_name: "Kick Off", game_code: "428f94a75bedc60bf54984ff75d3a046", game_type: "Slot Game", game_image: "" },
//         { game_name: "Dragon Boat Festival", game_code: "2c9f424aa0f5bf82ff334f4fdb707f3c", game_type: "Slot Game", game_image: "" },
//         { game_name: "Ice Crush", game_code: "a5e19853385a5baf4c38e2c5ac7444e6", game_type: "Slot Game", game_image: "" },
//         { game_name: "Candy Quest", game_code: "95b395c3130bcaf9ad954047d9582437", game_type: "Slot Game", game_image: "" },
//     ],
// };
const playtech = {
    platform: "digital",
    provider: "playtech",
    games: [
        { game_name: "1-Of-A-Kind", game_code: "44f6e08965a602e68952f49658b7d3f8", game_type: "Slot Game", game_image: "" },
        { game_name: "28 Mansions", game_code: "d4a6819ce811b1b97c07a8818a64690d", game_type: "Slot Game", game_image: "" },
        { game_name: "A Night Out", game_code: "394dd26b789d93bd041fca2d86ea8820", game_type: "Slot Game", game_image: "" },
        { game_name: "Absolutely Mammoth", game_code: "93aeecbe8381554300edf97c1e4b855e", game_type: "Slot Game", game_image: "" },
        { game_name: "Absolutely Mammoth PowerPlay Jackpot", game_code: "89bafa7a264f7f527c5e1f536a609ca4", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of Egypt", game_code: "9d8735f9017706dc1d19ac5111606490", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods : Epic Troy", game_code: "edd09602fa948f670900b908058c71a3", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods God of Storms 2", game_code: "aaf255e782ce1fbb275ed5ac0ca0e887", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods God of Storms 3", game_code: "9587e5573b6ddafac4cd0c43ffef437d", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Norse: Book of Dwarves", game_code: "6c3fd84bcfa35635ae538fc305b2bc39", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Norse: Gods and Giants", game_code: "d9d4e07b04a071cd63b602fa9c464041", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Norse: King of Asgard", game_code: "eae4d44fd7200da9e0d1b91545976515", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Norse: Norse Legends", game_code: "82b859cec9fc3f510492c2653062eb9c", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Norse: Ways of Thunder", game_code: "fd75d31cb3fc132afd3d19bf58a75aeb", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods Scratch", game_code: "37a974d2647ac14e5b517736f5e12022", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Age of the Gods", game_code: "842569ffeaf7c8062e5c37ef34a3cbb5", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Apollo Power", game_code: "a0067014ed52d964947c03729362f706", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Book of Oracle", game_code: "b48124c128f849cb6af5523d6273fa03", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Fate Sisters", game_code: "747974c975cd480f6daf275ee495b3bd", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Furious Four", game_code: "7c1f9dac0a9b08ba4ef4db64913989e1", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Glorious Griffin", game_code: "26d05f670d5004297c29bca37c5d2a18", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: God of Storms", game_code: "98a322361ea9fb0a50263e4fcb525c4b", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Goddess of Wisdom", game_code: "5d1d43200792ac696842baabeedc57ef", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Helios", game_code: "ddddd3322ef4d339d9d1f07b5db2fa53", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: King of Olympus", game_code: "b56ffe98a1d3b561b4e50fce74c3db4a", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: King of Olympus Megaways", game_code: "6afaba62b54e68a826ec5250536e0324", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Maze Keeper", game_code: "d88d866f0f0b56b43a55c840ae735c99", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Medusa & Monsters", game_code: "bc4140175092f25ce45e69cc46c1d917", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Mighty Midas", game_code: "b7b7ab09f7413cc43a8e47632875a7a7", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Prince of Olympus", game_code: "761da27537daa09466a46dd0309305f5", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Ruler of the Dead", game_code: "68ed2f1d7e1ee7c4bec470c53c16be67", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Ruler of the Seas", game_code: "125c404f620b166fcafef667d6e3e34c", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Ruler of the Sky", game_code: "f33f8c97901234ef019f637869090e63", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Rulers of Olympus", game_code: "251d16f7e6db74914dc68cffbaff76ee", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Wheels of Olympus", game_code: "728584710964fbb11ecf74162a589f9b", game_type: "Slot Game", game_image: "" },
        { game_name: "Age of the Gods: Wonder Warriors", game_code: "83d6b08599236ba5bc2d64d722b2da01", game_type: "Slot Game", game_image: "" },
        { game_name: "Alohawaii: Cash Collect", game_code: "914ee555a5e788c9e6fe597552fdbbaf", game_type: "Slot Game", game_image: "" },
        { game_name: "Anaconda Uncoiled", game_code: "004dc1692ccbb8d46dd44f3480228606", game_type: "Slot Game", game_image: "" },
        { game_name: "Anaconda Wild", game_code: "2399d4cd23a97be3b0970175593f92b3", game_type: "Slot Game", game_image: "" },
        { game_name: "Anaconda Wild 2", game_code: "4739dde37c2560bb4f1aa6263bb2b8cb", game_type: "Slot Game", game_image: "" },
        { game_name: "Anaconda Wild 2 PowerPlay Jackpot", game_code: "735b5a5886aac3c90d863ddd46751363", game_type: "Slot Game", game_image: "" },
        { game_name: "Anaconda Wild Scratch", game_code: "547a08381481e55198a0efffa9819b7e", game_type: "Slot Game", game_image: "" },
        { game_name: "Animal Instinct", game_code: "6e159c1f57dc867f9a88030bb928dc5c", game_type: "Slot Game", game_image: "" },
        { game_name: "Archer", game_code: "19eb221686f726fe8ab00a523f43d0fc", game_type: "Slot Game", game_image: "" },
        { game_name: "Arowana's Luck", game_code: "ff01c1c608d0aa974e9badd014b77374", game_type: "Slot Game", game_image: "" },
        { game_name: "Asian Fantasy", game_code: "c57101e7f9b96f9cdd36f3aee28a6703", game_type: "Slot Game", game_image: "" },
        { game_name: "Atlantis: Cash Collect", game_code: "951e0c7f0a7a8aa92aacfb6dff571a93", game_type: "Slot Game", game_image: "" },
        { game_name: "Aztec Expedition", game_code: "2b8c4e7c12b095785947cfee9c1ce4a9", game_type: "Slot Game", game_image: "" },
        { game_name: "Azteca: Bonus Lines", game_code: "4a4153c592a056728fb27e545abafe98", game_type: "Slot Game", game_image: "" },
        { game_name: "Azteca: Bonus Lines PowerPlay Jackpot", game_code: "1d2f6b8d66fb5ab0382a76216e76d6fa", game_type: "Slot Game", game_image: "" },
        { game_name: "Azteca: Cash Collect", game_code: "e388e3d3028d8743eab4c164075c1822", game_type: "Slot Game", game_image: "" },
        { game_name: "Bai Shi", game_code: "09316ab17daf79adcca3b4d10f93c98b", game_type: "Slot Game", game_image: "" },
        { game_name: "Beach Life", game_code: "6327914a72dfff84b0b20b21f761398e", game_type: "Slot Game", game_image: "" },
        { game_name: "Bee Frenzy", game_code: "24cfafc2cd7e62ac72868a52359a95b7", game_type: "Slot Game", game_image: "" },
        { game_name: "Bermuda Triangle", game_code: "81e1a871550be8048acf0c613c635ef6", game_type: "Slot Game", game_image: "" },
        { game_name: "Berry Berry Bonanza", game_code: "97446e62c7e272b7517d1646b6bcc2a4", game_type: "Slot Game", game_image: "" },
        { game_name: "Better Wilds", game_code: "7d7fdd3b5f66243fd47f6c5a6005860c", game_type: "Slot Game", game_image: "" },
        { game_name: "Better Wilds PowerPlay Jackpot", game_code: "badd47fea6f9905ad9d1530488be7652", game_type: "Slot Game", game_image: "" },
        { game_name: "Big Shots", game_code: "77001fa326967eebe080cb3a00138641", game_type: "Slot Game", game_image: "" },
        { game_name: "Blazing Bells", game_code: "40abe020b930dff62e78631dfbe9b804", game_type: "Slot Game", game_image: "" },
        { game_name: "Blazing Bells PowerPlay Jackpot", game_code: "2a1e5cf43bd2e4af720890ab84cb1567", game_type: "Slot Game", game_image: "" },
        { game_name: "Blitz Scratch", game_code: "293bce168517eaef129e34b5447dc748", game_type: "Slot Game", game_image: "" },
        { game_name: "Bonus Bears", game_code: "fdacfaf60feb36a4486a06acfec403b8", game_type: "Slot Game", game_image: "" },
        { game_name: "Bonus Train Bandits", game_code: "58b40612830758e0d935aa71cf413846", game_type: "Slot Game", game_image: "" },
        { game_name: "Book of Kings", game_code: "1e7cdce727feb9e3aa26bc83975f5b42", game_type: "Slot Game", game_image: "" },
    ],
};

const allProviderGames: ProviderGame[] = [
    evolution,
    pgsoft,
    jilli,
    // jdb,
    // cq9,
    spribe,
    // sexybcrt,
    pragmatic,
    // saba,
    playngo,
    fachai,
    eazygaming,
    // gameart,
    bggaming,
    km,
    relaxgaming,
    evoplay,
    ezugi,
    // kmone,
    ideal,
    // ag,
    playtech
]

export { allProviderGames };