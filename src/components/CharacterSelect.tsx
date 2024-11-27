import { motion } from 'framer-motion';

const CHARACTERS = [
  { id: 'rabbit', name: 'うさぎさん', color: 'bg-pink-100' },
  { id: 'cat', name: 'ねこさん', color: 'bg-orange-100' },
  { id: 'dog', name: 'いぬさん', color: 'bg-yellow-100' },
  { id: 'bear', name: 'くまさん', color: 'bg-brown-100' },
];

type CharacterSelectProps = {
  onSelect: (character: string) => void;
};

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto p-4"
    >
      {CHARACTERS.map((character, index) => (
        <motion.button
          key={character.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(character.id)}
          className={`${character.color} p-6 rounded-2xl hover:scale-105 transition-transform`}
        >
          <div className="aspect-square mb-4">
            <img
              src={`/characters/${character.id}-happy.svg`}
              alt={character.name}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-center font-medium text-gray-700">{character.name}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}