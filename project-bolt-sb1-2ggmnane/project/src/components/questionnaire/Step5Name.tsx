interface Props {
  prenom: string;
  onChange: (prenom: string) => void;
}

export default function Step5Name({ prenom, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#2c3e2d] text-center mb-2">
        Comment vous appelez-vous ?
      </h2>
      <p className="text-center text-[#7a8c7b] mb-10 text-sm">
        Pour personnaliser votre programme Hifz
      </p>

      <div className="max-w-sm mx-auto">
        <input
          type="text"
          value={prenom}
          onChange={e => onChange(e.target.value)}
          placeholder="Votre prénom..."
          className="w-full text-center text-xl font-medium p-4 rounded-2xl border-2 border-[#e0dccf] bg-white text-[#2c3e2d] placeholder-[#c5bfb0] focus:outline-none focus:border-[#2c6e3c] transition-colors"
          autoFocus
        />
        <p className="text-center text-xs text-[#b0a898] mt-3">
          Vos données restent sur votre appareil uniquement
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="bg-[#f8f6e9] rounded-2xl p-6 max-w-sm text-center border border-[#e8e4d4]">
          <p
            className="text-xl text-[#2c6e3c] mb-2"
            style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: 'rtl' }}
          >
            وَلَقَدۡ يَسَّرۡنَا ٱلۡقُرۡءَانَ لِلذِّكۡرِ
          </p>
          <p className="text-xs text-[#7a8c7b] italic">
            "Nous avons facilité le Coran pour la méditation" — Al-Qamar 54:17
          </p>
        </div>
      </div>
    </div>
  );
}
