export interface GameCard {
  text: string;
  action: 'money' | 'goto' | 'jail' | 'jailfree' | 'nearest_rr' | 'nearest_util' | 'back' | 'repairs' | 'payeach' | 'collecteach';
  amount?: number;
  target?: number;
  collect?: boolean;
  perHouse?: number;
  perHotel?: number;
}

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

// Utility function to shuffle deck
export function shuffleDeck<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Utility function to create shuffled deck indices
export function createShuffledDeck(length: number): number[] {
  return shuffleDeck(Array.from({ length }, (_, i) => i));
}
