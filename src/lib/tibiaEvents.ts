export interface TibiaEvent {
  name: string;
  startMonth: number;
  startDay: number | ((year: number) => number);
  endMonth: number;
  endDay: number | ((year: number) => number);
  description: string;
  link: string;
}

const getNthDayOfWeek = (
  year: number,
  month: number,
  nth: number,
  dayOfWeek: number,
): number => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  let day = ((dayOfWeek - firstDayOfMonth + 7) % 7) + 1;
  day += (nth - 1) * 7;
  return day;
};

export const TIBIA_EVENTS: TibiaEvent[] = [
  {
    name: 'Ano Novo',
    startMonth: 11,
    startDay: 27,
    endMonth: 0,
    endDay: 3,
    description: 'Fogos de artifício baratos no Ned Nobel.',
    link: 'https://www.tibiawiki.com.br/wiki/Ned_Nobel',
  },
  {
    name: 'Aniversário do Tibia',
    startMonth: 0,
    startDay: 7,
    endMonth: 0,
    endDay: 10,
    description: 'Celebre os anos de história do jogo!',
    link: 'https://www.tibiawiki.com.br/wiki/Anivers%C3%A1rio_do_Tibia',
  },
  {
    name: 'The First Dragon',
    startMonth: 0,
    startDay: 14,
    endMonth: 1,
    endDay: 12,
    description: 'Derrote o temível Primeiro Dragão.',
    link: 'https://www.tibiawiki.com.br/wiki/The_First_Dragon_Quest',
  },
  {
    name: 'Masquerade Days',
    startMonth: 1,
    startDay: 1,
    endMonth: 1,
    endDay: 28,
    description: 'Mês das máscaras com Stan em Venore.',
    link: 'https://www.tibiawiki.com.br/wiki/Masquerade_Days',
  },
  {
    name: "Valentine's Day",
    startMonth: 1,
    startDay: 14,
    endMonth: 1,
    endDay: 14,
    description: 'Presentes especiais com Valentina.',
    link: 'https://www.tibiawiki.com.br/wiki/Valentine%27s_Day',
  },
  {
    name: 'A Piece of Cake',
    startMonth: 1,
    startDay: 21,
    endMonth: 1,
    endDay: 26,
    description: 'Ajude seu mundo a devorar o bolo gigante.',
    link: 'https://www.tibiawiki.com.br/wiki/A_Piece_of_Cake',
  },
  {
    name: 'The Colours of Magic',
    startMonth: 2,
    startDay: 15,
    endMonth: 2,
    endDay: 23,
    description: 'Escolha seu mago e ganhe bônus mundiais.',
    link: 'https://www.tibiawiki.com.br/wiki/The_Colours_of_Magic',
  },
  {
    name: 'Orcsoberfest (Março)',
    startMonth: 2,
    startDay: (y) => getNthDayOfWeek(y, 2, 2, 5),
    endMonth: 2,
    endDay: (y) => getNthDayOfWeek(y, 2, 3, 5),
    description: 'Festival de cerveja e orcs.',
    link: 'https://www.tibiawiki.com.br/wiki/Orcsoberfest',
  },
  {
    name: 'April Fools',
    startMonth: 3,
    startDay: 1,
    endMonth: 3,
    endDay: 30,
    description: 'Brinquedos da Hoaxette e Jester Dolls.',
    link: 'https://www.tibiawiki.com.br/wiki/April_Fools',
  },
  {
    name: 'Chyllfroest',
    startMonth: 3,
    startDay: 1,
    endMonth: 3,
    endDay: 30,
    description: 'Explore a ilha de gelo e pegue sua montaria.',
    link: 'https://www.tibiawiki.com.br/wiki/Chyllfroest',
  },
  {
    name: 'Spring Into Life',
    startMonth: 3,
    startDay: 16,
    endMonth: 3,
    endDay: 23,
    description: 'Ninhos de dragão espalhados por todo o continente.',
    link: 'https://www.tibiawiki.com.br/wiki/Spring_Into_Life',
  },
  {
    name: "Demon's Lullaby",
    startMonth: 4,
    startDay: 7,
    endMonth: 4,
    endDay: 14,
    description: 'Cuide de um bebê demônio para a mamãe.',
    link: 'https://www.tibiawiki.com.br/wiki/Demon%27s_Lullaby',
  },
  {
    name: 'Flower Month',
    startMonth: 5,
    startDay: 1,
    endMonth: 5,
    endDay: 30,
    description: 'Sementes das Dryads e vasos de flores.',
    link: 'https://www.tibiawiki.com.br/wiki/Flower_Month',
  },
  {
    name: 'Bewitched',
    startMonth: 5,
    startDay: 21,
    endMonth: 5,
    endDay: 25,
    description: 'Ajude as bruxas no caldeirão para bônus de XP.',
    link: 'https://www.tibiawiki.com.br/wiki/Bewitched',
  },
  {
    name: 'Hot Cuisine',
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 31,
    description: 'Pratos especiais com bônus poderosos de Jean Pierre.',
    link: 'https://www.tibiawiki.com.br/wiki/Hot_Cuisine_Quest',
  },
  {
    name: 'Rise of Devovorga',
    startMonth: 8,
    startDay: 1,
    endMonth: 8,
    endDay: 7,
    description: 'O renascimento da Devovorga!',
    link: 'https://www.tibiawiki.com.br/wiki/Rise_of_Devovorga',
  },
  {
    name: 'The Colours of Magic (2)',
    startMonth: 8,
    startDay: 15,
    endMonth: 8,
    endDay: 23,
    description: 'Segunda chance para os magos das cores.',
    link: 'https://www.tibiawiki.com.br/wiki/The_Colours_of_Magic',
  },
  {
    name: 'Annual Autumn Vintage',
    startMonth: 9,
    startDay: 1,
    endMonth: 9,
    endDay: 8,
    description: 'Coleta de Winterberries fase 1.',
    link: 'https://www.tibiawiki.com.br/wiki/Annual_Autumn_Vintage',
  },
  {
    name: 'Annual Autumn Vintage (2)',
    startMonth: 9,
    startDay: 17,
    endMonth: 9,
    endDay: 24,
    description: 'Coleta de Winterberries fase 2.',
    link: 'https://www.tibiawiki.com.br/wiki/Annual_Autumn_Vintage',
  },
  {
    name: 'Halloween',
    startMonth: 9,
    startDay: 31,
    endMonth: 10,
    endDay: 3,
    description: 'Mutated Pumpkin e Halloween Hare.',
    link: 'https://www.tibiawiki.com.br/wiki/Halloween',
  },
  {
    name: 'Orcsoberfest (Outubro)',
    startMonth: 9,
    startDay: (y) => getNthDayOfWeek(y, 9, 2, 5),
    endMonth: 9,
    endDay: (y) => getNthDayOfWeek(y, 9, 3, 5),
    description: 'Festival de cerveja e orcs.',
    link: 'https://www.tibiawiki.com.br/wiki/Orcsoberfest',
  },
  {
    name: 'The Lightbearer',
    startMonth: 10,
    startDay: 11,
    endMonth: 10,
    endDay: 15,
    description: 'Mantenha as tochas acesas por 4 dias.',
    link: 'https://www.tibiawiki.com.br/wiki/The_Lightbearer',
  },
  {
    name: 'Christmas',
    startMonth: 11,
    startDay: 12,
    endMonth: 11,
    endDay: 31,
    description: 'Presentes do Papai Noel e decoração natalina.',
    link: 'https://www.tibiawiki.com.br/wiki/Christmas',
  },
  {
    name: 'Solstício de Inverno',
    startMonth: 11,
    startDay: 22,
    endMonth: 0,
    endDay: 10,
    description: 'Enfrente a Rainha Percht.',
    link: 'https://www.tibiawiki.com.br/wiki/Winterlight_Solstice',
  },
];

export function getEventStatus() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const resolveDay = (day: number | ((y: number) => number), year: number) =>
    typeof day === 'function' ? day(year) : day;

  const active = TIBIA_EVENTS.filter((event) => {
    const sDay = resolveDay(event.startDay, currentYear);
    const eDay = resolveDay(event.endDay, currentYear);

    const start = new Date(currentYear, event.startMonth, sDay, 0, 0, 0);
    const end = new Date(currentYear, event.endMonth, eDay, 23, 59, 59);

    if (end < start) {
      const adjustedStart = new Date(start);
      const adjustedEnd = new Date(end);

      if (now.getMonth() <= event.endMonth) {
        adjustedStart.setFullYear(currentYear - 1);
      } else {
        adjustedEnd.setFullYear(currentYear + 1);
      }
      return now >= adjustedStart && now <= adjustedEnd;
    }

    return now >= start && now <= end;
  });

  const nextEvents = TIBIA_EVENTS.map((event) => {
    let yearToUse = currentYear;
    let sDay = resolveDay(event.startDay, yearToUse);
    let start = new Date(yearToUse, event.startMonth, sDay, 0, 0, 0);

    if (start < now) {
      yearToUse++;
      sDay = resolveDay(event.startDay, yearToUse);
      start = new Date(yearToUse, event.startMonth, sDay, 0, 0, 0);
    }
    return { ...event, nextStart: start };
  })
    .filter((e) => !active.some((a) => a.name === e.name))
    .sort((a, b) => a.nextStart.getTime() - b.nextStart.getTime());

  return { active, next: nextEvents[0] || null };
}

export function getMoonPhase() {
  const LUNAR_CYCLE = 29.530588853;
  const REFERENCE_FULL_MOON = new Date(2024, 0, 25, 12, 0, 0).getTime();
  const now = new Date().getTime();
  const msSinceReference = now - REFERENCE_FULL_MOON;
  const daysSinceReference = msSinceReference / (1000 * 60 * 60 * 24);
  const cyclePosition = daysSinceReference % LUNAR_CYCLE;
  const isFullMoon = cyclePosition < 1.5 || cyclePosition > LUNAR_CYCLE - 1.5;
  let daysUntilNext = isFullMoon ? 0 : LUNAR_CYCLE - cyclePosition;
  if (daysUntilNext > LUNAR_CYCLE) daysUntilNext -= LUNAR_CYCLE;

  return {
    isFullMoon,
    daysUntilNext: Math.floor(daysUntilNext),
    percentage: (cyclePosition / LUNAR_CYCLE) * 100,
  };
}
