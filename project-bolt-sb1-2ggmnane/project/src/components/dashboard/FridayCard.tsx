import { isFriday } from '../../utils/calculations';

export default function FridayCard() {
  if (!isFriday()) return null;

  return (
    <div className="bg-gradient-to-br from-[#2c6e3c] to-[#235630] rounded-3xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="relative">
        <p className="text-2xl mb-2">🌙</p>
        <h3 className="font-bold text-lg mb-1">Aujourd'hui c'est vendredi</h3>
        <p className="text-[#a8d4b4] text-sm mb-4">
          Pas de nouvelle page · Une journée de baraka
        </p>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-sm font-semibold mb-1">📚 Lis Al-Kahf aujourd'hui</p>
          <p className="text-xs text-[#a8d4b4]">
            "Quiconque lit Al-Kahf le vendredi, une lumière brillera pour lui entre les deux vendredis"
          </p>
          <p className="text-[10px] text-[#7ab88a] mt-1">— Rapporté par Al-Hakim</p>
        </div>
      </div>
    </div>
  );
}
