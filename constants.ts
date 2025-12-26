export const RAW_VERB_LIST = `schlafen fahren laden waschen halten fallen denken kennen nennen stehen gehen essen geben lesen sehen helfen nehmen sprechen sterben werden treffen empfehlen bleiben schreiben treiben steigen heissen vergleichen sein kommen bitten sitzen beiginnen schwimmen finden singen trinken wissen genuessen verlieren ziehen tun rufen`;

// Fix known typos in the input string before processing
export const CLEAN_VERB_LIST = RAW_VERB_LIST
  .replace('beiginnen', 'beginnen')
  .replace('genuessen', 'genießen')
  .replace('heissen', 'heißen'); // Standardize ß if preferred, or keep ss