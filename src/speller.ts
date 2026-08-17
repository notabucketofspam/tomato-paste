const spellbound = new Map([
  ['a comin', 'incoming'],
  ['a coming', 'incoming'],
  ['and coming', 'INCOMING'],
  ['and comeg', 'INCOMING'],
  ['pin don','pinned down'],
  ['madic', 'medic'],
  ['truble', 'TROUBLE'],

  ['bleeting', 'BLEEDING'],
  ['hick', 'HIT'],
  ['hoh', 'HIT'],

  ['automaton', 'Automaton'],
  ['a tomaton', 'Automaton'],
  ['the tomaton', 'Automaton'],
  ['a tomatons', 'Automatons'],
  ['uh tomatons', 'Automatons'],
  ['atomatons', 'Automatons'],
  ['atomaton', 'Automaton'],
  ['atomatoms', 'Automatons'],
  ['atomatom', 'Automaton'],
  ['atomit', 'Automatons'],
  ['butt', 'BOTS'],
  ['pubg', 'bot freak'],
  ['but frik', 'bot freak'],
  ['bot frik', 'bot freak'],
  ['cyber standback', 'Cyberstan back'],
  ['cybersstand', 'Cyberstan'],
  ['cyberstand', 'Cyberstan'],
  ['cybers then', 'Cyberstan'],
  ['cyberstain', 'Cyberstan'],
  ['cybersand', 'Cyberstan'],
  ['cybersta', 'Cyberstan'],

  ['terminated', 'Terminid'],
  ['turminats', 'Terminids'],
  ['terminit', 'Terminids'],
  ['terminates', 'Terminids'],

  ['sqts', 'squids'],
  
  ['awy', 'away'],
  ['friks', 'freaks'],
  ['fume', 'from me'],
  ['furmy', 'from me'],

  ['morn', 'mourn'],
  ['mame', 'maim'],
  ['wepon', 'WEAPON'],
  ['lif', 'LIFE'],
  ['redi', 'ready'],

  ['movet', 'MOVE IT'],
  ['movint', 'MOVE IT'],
  ['movin', 'MOVING'],

  ['super earth', 'Super Earth'],

  ['coreta', 'Coretta'],
  ['fur my', 'FROM ME'],
  ['vout', 'VOTE'],

  ['nato m reloud', 'need team reload'],
  ['tim reloud', 'team reload'],

  ['nvmo', 'out of ammo'],
  ['my um', 'my arm'],

  ['lag', 'leg'],
  ['frend', 'FRIEND'],
  ['happi or', 'HAPPY HOUR'],
  ['cazwe', 'CUZ WE'],
  ['ery one', 'EVERYONE'],
  ['happy hourcause', 'happy hour cause'],

  ['stem', 'STIM'],
  ['stems', 'stims'],
  ['my ples', 'ME PLEASE'],
  ['ples', 'PLEASE'],
  ['assistans', 'ASSISTANCE'],

  ['amo', 'AMMO'],
  ['oto', 'OUT OF'],
  ['dout', 'DOUBT'],
  ['dowt', 'DOUBT'],

  ['candlester', 'canister'],

  ['tirny', 'TYRANNY'],
  ['ofm', 'OF THEM'],
  ['ol', 'ALL'],

  ['kilem', 'KILL EM'],
  ['killem', 'KILL EM'],
  ['tillem', 'KILL EM'],

  ['erth', 'Earth'],
  ['hod y', 'HOWD YOU'],
  ['hod you', 'HOWD YOU'],

  ['hell diver', 'Helldiver'],
  ['hell divers', 'Helldivers'],
  ['hell dive are', 'Helldiver'],
  ['hell dive ah', 'Helldiver'],
  ['helldiva', 'Helldiver'],
  ['hell dive', 'Helldiver'],
  ['el ziva', 'Helldiver'],
  ['heldover', 'Helldiver'],
  ['heldive', 'Helldiver'],

  ['tum', 'THEM'],
  ['peces', 'PIECES'],
  ['jum pac', 'jump pack'],

  ['libery', 'LIBERTY'],
  ['librerty', 'LIBERTY'],
  ['libredy', 'LIBERTY'],
  ['librety', 'LIBERTY'],
  ['seberty', 'SWEET LIBERTY'],
  ['swepra', 'SWEET LIBERTY'],

  ['luve', 'LOVE'],
  ['democry', 'DEMOCRACY'],
  ['democy', 'DEMOCRACY'],
  ['swet', 'SWEET'],
  ['freadom', 'FREEDOM'],
  ['fredom', 'FREEDOM'],
  ['fredem', 'FREEDOM'],
  ['fredoom', 'FREEDOM'],
  ['freatom', 'FREEDOM'],
  ['blud', 'BLOOD'],
  ['concers', 'CONQUERS'],
  ['no atec no', 'NOW ATTACK NOW'],
  ['atec', 'ATTACK'],
  ['atac', 'ATTACK'],
  ['a cant', 'I cant'],

  ['e seven ten', 'E-710'],
  ['d seven ten', 'E-710'],
  ['z seven ten', 'E-710'],
  ['element seven ten', 'Element-710'],

  ['hell bomb', 'Hellbomb'],
  ['hellbomb', 'Hellbomb'],

  ['tic covid', 'TAKE COVER'],
  ['tec covid', 'TAKE COVER'],
  ['tay covid', 'TAKE COVER'],
  ['say covid', 'TAKE COVER'],
  ['take covid', 'TAKE COVER'],
  ['take in covid', 'TAKING COVER'],
  ['covid me', 'COVER ME'],
  ['covid my', 'COVER ME'],
  ['covid ma', 'COVER ME'],

  ['reloodin', 'RELOADING'],
  ['relodin', 'RELOADING'],
  ['reloodin', 'RELOADING'],
  ['reloonig', 'RELOADING'],
  ['reloon', 'RELOADING'],
  ['relooni', 'RELOADING'],
  ['reloot', 'RELOADING'],
  ['relood', 'RELOAD'],

  ['mor', 'MORE'],
  ['guna', 'GONNA'],
  ['gana', 'GONNA'],
  ['gan', 'GONNA'],
  ['wer', 'WERE'],
  ['di', 'DIE'],
  ['ach in', 'Anchor'],
  ['hir sring', 'EARS RINGING'],
  ['destry', 'destroy'],
  ['arwe', 'ROE'],
  ['arwe', 'ROE'],

]);

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**thanks gemini*/
function createTextCorrector(dictionary: Map<string, string>) {
  const sortedKeys = Array.from(dictionary.keys())
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);

  const pattern = new RegExp(`\\b(${sortedKeys.join('|')})\\b`, 'gi');

  // 3. Return a closure that does the single-pass replacement
  return (text: string): string => {
    if (text.length===0) {
      // fix for the one file that's glitched
      return 'Liberty Prosperity Democracy';
    } else {
      return text.replace(pattern, (match) => {
        const key = match.toLowerCase();
        return dictionary.get(key) ?? match;
      });
    }
  };
}

export function hellcheck(){
  return createTextCorrector(spellbound);
}

