import type { Space, GameCard, PlayerSetup, ColorKey } from '../types/game';

export const COLOR_HEX: Record<ColorKey, string> = {
  brown:'#a0522d', lightblue:'#5bc8e8', pink:'#f06090', orange:'#ff7c28',
  red:'#e83040', yellow:'#f5c842', green:'#3ab870', darkblue:'#3060e8',
};

export const SPACES: Space[] = [
  // ── Bottom row (0–10): GO → Jail ──
  { id:0,  name:'GO',                type:'go',       icon:'⭐' },
  { id:1,  name:'Mediterranean Avenue', type:'prop', color:'brown',     price:60,  rent:[2,10,30,90,160,250],    group:0 },
  { id:2,  name:'Community Chest',   type:'chest',    icon:'📦' },
  { id:3,  name:'Baltic Avenue',        type:'prop', color:'brown',     price:60,  rent:[4,20,60,180,320,450],   group:0 },
  { id:4,  name:'Income Tax',        type:'tax',      icon:'💸', amount:200 },
  { id:5,  name:'Reading Railroad',  type:'railroad', icon:'🚂', price:200 },
  { id:6,  name:'Oriental Avenue',      type:'prop', color:'lightblue', price:100, rent:[6,30,90,270,400,550],   group:1 },
  { id:7,  name:'Chance',            type:'chance',   icon:'❓' },
  { id:8,  name:'Vermont Avenue',       type:'prop', color:'lightblue', price:100, rent:[6,30,90,270,400,550],   group:1 },
  { id:9,  name:'Connecticut Avenue',   type:'prop', color:'lightblue', price:120, rent:[8,40,100,300,450,600],  group:1 },
  { id:10, name:'Jail',              type:'jail',     icon:'🏛️' },
  // ── Left column (11–19) ──
  { id:11, name:'St. Charles Place', type:'prop', color:'pink',      price:140, rent:[10,50,150,450,625,750], group:2 },
  { id:12, name:'Electric Company',  type:'utility',  icon:'⚡', price:150 },
  { id:13, name:'States Avenue',     type:'prop', color:'pink',      price:140, rent:[10,50,150,450,625,750], group:2 },
  { id:14, name:'Virginia Avenue',      type:'prop', color:'pink',      price:160, rent:[12,60,180,500,700,900], group:2 },
  { id:15, name:'Pennsylvania RailRoad',   type:'railroad', icon:'🚂', price:200 },
  { id:16, name:'St. James Place',   type:'prop', color:'orange',    price:180, rent:[14,70,200,550,750,950], group:3 },
  { id:17, name:'Community Chest',   type:'chest',    icon:'📦' },
  { id:18, name:'Tennessee Avenue',     type:'prop', color:'orange',    price:180, rent:[14,70,200,550,750,950], group:3 },
  { id:19, name:'New York Avenue',      type:'prop', color:'orange',    price:200, rent:[16,80,220,600,800,1000],group:3 },
  // ── Top row (20–30): Free Parking → Go To Jail ──
  { id:20, name:'Free Parking',      type:'free',     icon:'🌿' },
  { id:21, name:'Kentucky Avenue',      type:'prop', color:'red',       price:220, rent:[18,90,250,700,875,1050],group:4 },
  { id:22, name:'Chance',            type:'chance',   icon:'❓' },
  { id:23, name:'Indiana Avenue',       type:'prop', color:'red',       price:220, rent:[18,90,250,700,875,1050],group:4 },
  { id:24, name:'Illinois Avenue',      type:'prop', color:'red',       price:240, rent:[20,100,300,750,925,1100],group:4 },
  { id:25, name:'B&O Railroad',      type:'railroad', icon:'🚂', price:200 },
  { id:26, name:'Atlantic Avenue',      type:'prop', color:'yellow',    price:260, rent:[22,110,330,800,975,1150],group:5 },
  { id:27, name:'Ventnor Avenue',       type:'prop', color:'yellow',    price:260, rent:[22,110,330,800,975,1150],group:5 },
  { id:28, name:'Water Works',       type:'utility',  icon:'💧', price:150 },
  { id:29, name:'Marvin Gardens',    type:'prop', color:'yellow',    price:280, rent:[24,120,360,850,1025,1200],group:5 },
  { id:30, name:'Go To Jail',        type:'gotojail', icon:'👮' },
  // ── Right column (31–39) ──
  { id:31, name:'Pacific Avenue',       type:'prop', color:'green',     price:300, rent:[26,130,390,900,1100,1275],group:6 },
  { id:32, name:'North Carolina Avenue',type:'prop', color:'green',     price:300, rent:[26,130,390,900,1100,1275],group:6 },
  { id:33, name:'Community Chest',   type:'chest',    icon:'📦' },
  { id:34, name:'Pennsylvania Avenue',  type:'prop', color:'green',     price:320, rent:[28,150,450,1000,1200,1400],group:6 },
  { id:35, name:'Short Line',        type:'railroad', icon:'🚂', price:200 },
  { id:36, name:'Chance',            type:'chance',   icon:'❓' },
  { id:37, name:'Park Place',        type:'prop', color:'darkblue',  price:350, rent:[35,175,500,1100,1300,1500],group:7 },
  { id:38, name:'Luxury Tax',        type:'tax',      icon:'💸', amount:100 },
  { id:39, name:'Boardwalk',         type:'prop', color:'darkblue',  price:400, rent:[50,200,600,1400,1700,2000],group:7 },
];

export const CHANCE_CARDS: GameCard[] = [
  { text:'Advance to the nearest Utility.',                              action:'nearest_util' },
  { text:'Advance to the nearest Utility.',                              action:'nearest_util' },
  { text:'Advance to the nearest Railroad.',                             action:'nearest_rr' },
  { text:'Advance to the nearest Railroad.',                             action:'nearest_rr' },
  { text:'Advance token to GO. Collect $200.',                           action:'goto', target:0, collect:true },
  { text:'Bank pays you a dividend of $50.',                             action:'money', amount:50 },
  { text:'Get out of Jail Free.',                                        action:'jailfree' },
  { text:'Go to Jail. Do not pass GO, do not collect $200.',             action:'jail' },
  { text:'Make general repairs on all your property. $25/house, $125/hotel.', action:'repairs', perHouse:25, perHotel:125 },
  { text:'Move back 3 spaces.',                                          action:'back', amount:3 },
  { text:'Speeding fine $15.',                                           action:'money', amount:-15 },
  { text:'You have been elected Chairman of the Board. Pay each player $50.', action:'payeach', amount:50 },
  { text:'You have won a crossword competition. Collect $100.',          action:'money', amount:100 },
  { text:'Your building loan matures. Collect $150.',                    action:'money', amount:150 },
  { text:'Pay poor tax of $15.',                                         action:'money', amount:-15 },
  { text:'Go to Reading Railroad.',                                      action:'goto', target:5 },
];

export const CHEST_CARDS: GameCard[] = [
  { text:'Bank error in your favor. Collect $200.',                      action:'money', amount:200 },
  { text:'From sale of stock you get $50.',                              action:'money', amount:50 },
  { text:"Doctor's fee. Pay $50.",                                       action:'money', amount:-50 },
  { text:'You have won second prize in a beauty contest. Collect $10.',  action:'money', amount:10 },
  { text:'Go to Jail. Do not pass GO, do not collect $200.',             action:'jail' },
  { text:'Grand Opera Night. Collect $50 from every player.',            action:'collecteach', amount:50 },
  { text:'Holiday Fund matures. Receive $100.',                          action:'money', amount:100 },
  { text:'Income Tax refund. Collect $20.',                              action:'money', amount:20 },
  { text:'It is your birthday. Collect $10 from every player.',          action:'collecteach', amount:10 },
  { text:'Life insurance matures. Collect $100.',                        action:'money', amount:100 },
  { text:'School fees. Pay $50.',                                        action:'money', amount:-50 },
  { text:'Tax refund. Collect $25.',                                     action:'money', amount:25 },
  { text:'Hospital fee. Pay $100.',                                      action:'money', amount:-100 },
  { text:'Get out of Jail Free.',                                        action:'jailfree' },
  { text:'Pay a fine of $10.',                                           action:'money', amount:-10 },
  { text:'You are assessed for street repairs. $40/house, $115/hotel.',  action:'repairs', perHouse:40, perHotel:115 },
];

export const PLAYER_SETUP: PlayerSetup[] = [
  { name:'Người 1', emoji:'🎩', color:'#e74c3c', glow:'rgba(231,76,60,.65)', tokenShape:'hat', isBot:false },
  { name:'Người 2', emoji:'🚀', color:'#3498db', glow:'rgba(52,152,219,.65)', tokenShape:'car', isBot:false },
  { name:'Người 3', emoji:'🎸', color:'#2ecc71', glow:'rgba(46,204,113,.65)', tokenShape:'guitar', isBot:false },
  { name:'Người 4', emoji:'👑', color:'#f39c12', glow:'rgba(243,156,18,.65)', tokenShape:'crown', isBot:false },
];

export function buildGridMap(): Record<string, number> {
  const grid: Record<string, number> = {};
  for (let i=0;i<=10;i++) grid[`10,${i}`]=i;
  for (let i=0;i<9;i++)   grid[`${9-i},10`]=11+i;
  for (let i=0;i<=10;i++) grid[`0,${10-i}`]=20+i;
  for (let i=0;i<9;i++)   grid[`${1+i},0`]=31+i;
  return grid;
}
