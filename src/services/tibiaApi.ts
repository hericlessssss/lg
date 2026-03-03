export interface BazaarFilters {
  vocation?: string;
  pvp_type?: string;
  battleye?: string;
  location?: string;
  min_level?: number;
  max_level?: number;
  min_skill?: number;
  max_skill?: number;
  skill_type?: string;
  page?: number;
}

export async function getCharacterData(name: string) {
  try {
    const response = await fetch(
      `https://api.tibiadata.com/v4/character/${encodeURIComponent(name)}`,
    );

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const data = await response.json();
    return data?.character?.character || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTibiaNews() {
  try {
    const response = await fetch('https://api.tibiadata.com/v4/news/latest');

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const data = await response.json();
    return (data?.news || []).slice(0, 5);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTibiaBazaar(filters?: BazaarFilters) {
  try {
    const url = 'https://api.tibiadata.com/v4/auctions';

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const data = await response.json();
    let auctions = data?.auctions?.auction_list || [];

    if (filters) {
      if (filters.vocation && filters.vocation !== 'all') {
        auctions = auctions.filter((a: any) =>
          a.vocation?.toLowerCase().includes(filters.vocation!.toLowerCase()),
        );
      }

      if (filters.min_level)
        auctions = auctions.filter(
          (a: any) => a.level >= Number(filters.min_level),
        );

      if (filters.max_level)
        auctions = auctions.filter(
          (a: any) => a.level <= Number(filters.max_level),
        );

      if (filters.skill_type) {
        const type = filters.skill_type.toLowerCase();

        auctions = auctions.filter((a: any) => {
          const charSkill = a.skills?.[type] || 0;
          const minOK = filters.min_skill
            ? charSkill >= Number(filters.min_skill)
            : true;
          const maxOK = filters.max_skill
            ? charSkill <= Number(filters.max_skill)
            : true;

          return minOK && maxOK;
        });
      }
    }

    return auctions;
  } catch (error) {
    console.error('Erro ao buscar dados do Bazaar:', error);
    return [];
  }
}
