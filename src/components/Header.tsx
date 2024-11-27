import { Menu, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="あなたのいばしょ" 
            className="h-8"
          />
          <span className="font-bold text-gray-800">あなたのいばしょ</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-rose-500 flex items-center gap-1">
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">お気に入り</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}