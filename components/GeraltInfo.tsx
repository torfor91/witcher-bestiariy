import React from 'react';

export const GeraltInfo: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="bg-[#f3e5ab] paper-texture shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#8d6e63] p-6 md:p-12 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#3e2723] rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#3e2723] rounded-bl-3xl"></div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Left Column: Portrait & Stats */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-full aspect-[3/4] bg-[#2a2320] border-8 border-[#3e2723] shadow-2xl relative mb-6 group overflow-hidden">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/en/c/c9/Geralt_of_Rivia_Witcher_3_Wild_Hunt_Version.png" 
                 alt="Geralt of Rivia" 
                 className="w-full h-full object-cover sepia-[0.3] contrast-125 group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"></div>
            </div>
            
            <div className="w-full bg-[#3e2723] p-4 text-[#f3e5ab] font-headers text-center rounded-sm shadow-lg">
              <h2 className="text-3xl font-bold border-b border-[#5d4037] pb-2 mb-2">Геральт из Ривии</h2>
              <div className="font-serif text-lg space-y-1 text-left px-2">
                <p><span className="text-[#a1887f]">Прозвище:</span> Белый Волк</p>
                <p><span className="text-[#a1887f]">Школа:</span> Волка</p>
                <p><span className="text-[#a1887f]">Возраст:</span> ~100 лет</p>
                <p><span className="text-[#a1887f]">Статус:</span> Мастер-Ведьмак</p>
              </div>
            </div>
          </div>

          {/* Right Column: Lore & Signs */}
          <div className="md:w-2/3">
            <h1 className="text-5xl md:text-6xl font-handwritten font-bold text-[#2b1d19] mb-6 ink-text transform -rotate-1">
              Досье: Мясник из Блавикена
            </h1>
            
            <div className="prose prose-xl font-serif text-[#3e2723] text-justify mb-8 leading-relaxed">
              <p>
                Ведьмак, мутант, убийца чудовищ. Геральт — легенда Северных Королевств. Прошедший через мучительные Испытания Травами, он обрел нечеловеческую реакцию, ночные глаза и замедленное старение. В отличие от многих коллег по цеху, он старается не терять человечность, хотя мир часто убеждает его в обратном.
              </p>
              <p className="mt-4">
                Он владеет двумя мечами: <span className="text-[#8a0a0a] font-bold">стальным</span> для людей и <span className="text-[#8a0a0a] font-bold">серебряным</span> для чудовищ. Хотя, как он сам говорит: "Оба для чудовищ".
              </p>
            </div>

            <div className="border-t-2 border-[#8d6e63] pt-6">
              <h3 className="text-3xl font-handwritten font-bold text-[#5d4037] mb-4">Ведьмачьи Знаки</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Аард', desc: 'Телекинетический удар, сбивающий с ног.' },
                  { name: 'Игни', desc: 'Поток пламени, сжигающий врагов и броню.' },
                  { name: 'Квен', desc: 'Магический щит, поглощающий урон.' },
                  { name: 'Ирден', desc: 'Магическая ловушка, замедляющая время.' },
                  { name: 'Аксий', desc: 'Влияние на разум, успокаивает или подчиняет.' }
                ].map((sign) => (
                  <div key={sign.name} className="flex items-start p-3 bg-[#fff8e1] border border-[#d7ccc8] shadow-sm transform hover:-translate-y-1 transition-transform">
                     <div className="w-10 h-10 rounded-full bg-[#3e2723] text-[#f3e5ab] flex items-center justify-center font-headers font-bold text-lg mr-3 shrink-0">
                       {sign.name[0]}
                     </div>
                     <div>
                       <h4 className="font-headers font-bold text-[#2b1d19]">{sign.name}</h4>
                       <p className="font-handwritten text-xl text-[#5d4037] leading-none mt-1">{sign.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-[#2a1c15] text-[#d7ccc8] font-handwritten text-xl italic text-center rounded border-2 border-[#5d4037]">
              "Зло — это зло. Меньшее, большее, среднее... Всё едино, пропорции условны, а границы размыты."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};