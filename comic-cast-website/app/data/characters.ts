export type Character = {
  name: string;
  role: string;
  power: string;
  description: string;
  color: string;
  bg: string;
};

export const comicCharacters: Character[] = [
  {
    name: 'Leon Yash',
    role: 'Protagonist',
    power: 'Energy Manipulation',
    description: 'A fierce warrior harnessing raw cosmic aura to protect the core dimensions.',
    color: 'border-red-500',
    bg: 'hover:bg-red-950/20',
  },
  {
    name: 'Miro',
    role: 'Antagonist',
    power: 'Illusion & Shadow',
    description: 'A master of deception who bends spatial light and dark matter to create cognitive distortions.',
    color: 'border-purple-500',
    bg: 'hover:bg-purple-950/20',
  },
  {
    name: 'Justin Bieber',
    role: 'Anti-Hero',
    power: 'Tech & Armored Warfare',
    description: 'An independent operator combining heavy structural armor with advanced tactical weaponry.',
    color: 'border-amber-500',
    bg: 'hover:bg-amber-950/20',
  },
];
