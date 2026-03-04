import * as cheerio from 'cheerio';

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
    const apiKey = '7b50f45e9846c6a58c8015dd8f0e2104';

    // Mudamos para a visualização de busca (search) que é mais rica em dados do que a home do trade
    const tibiaUrl =
      'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&search_sort=0';

    // Usamos render=true mas sem o premium para tentar ganhar velocidade,
    // já que o que importa é o seletor correto agora
    const scraperUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(tibiaUrl)}&render=true`;

    const response = await fetch(scraperUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const auctions: any[] = [];

    $('.Auction').each((_, element) => {
      const name = $(element).find('.AuctionCharacterName').text().trim();
      if (!name) return;

      // 1. Captura de Skills via Tooltip/Title (Onde o Tibia esconde o dado no Card)
      const skills: any = {
        magic: 0,
        distance: 0,
        sword: 0,
        axe: 0,
        club: 0,
        fist: 0,
        shielding: 0,
      };

      // O Tibia coloca as skills dentro de imagens no container .ShortVocationStuff
      $(element)
        .find('.ShortVocationStuff div img')
        .each((_, img) => {
          const title = $(img).attr('title') || ''; // Ex: "Axe Fighting: 110"
          const value = parseInt(title.match(/\d+/)?.[0] || '0');
          const lowerTitle = title.toLowerCase();

          if (lowerTitle.includes('magic')) skills.magic = value;
          if (lowerTitle.includes('distance')) skills.distance = value;
          if (lowerTitle.includes('sword')) skills.sword = value;
          if (lowerTitle.includes('axe')) skills.axe = value;
          if (lowerTitle.includes('club')) skills.club = value;
          if (lowerTitle.includes('fist')) skills.fist = value;
          if (lowerTitle.includes('shielding')) skills.shielding = value;
        });

      // 2. Fallback: Se o card não tem as imagens, tentamos ler a tabela de "Character Information"
      // que às vezes é renderizada pelo ScraperAPI
      if (skills.magic === 0 && skills.sword === 0) {
        $(element)
          .find('.AuctionUnitChart')
          .each((_, chart) => {
            const label = $(chart).find('.Label').text().toLowerCase();
            const value = parseInt($(chart).find('.Value').text()) || 0;
            if (label.includes('magic')) skills.magic = value;
            // ... (repetiria para as outras skills)
          });
      }

      const headerText = $(element).find('.AuctionHeader').text();

      auctions.push({
        name,
        level: parseInt(headerText.match(/Level:\s*(\d+)/)?.[1] || '0'),
        vocation:
          headerText.match(/Vocation:\s*([^|]+)/)?.[1]?.trim() || 'Unknown',
        world:
          headerText.match(/World:\s*([^|,\n]+)/)?.[1]?.trim() || 'Unknown',
        price:
          parseInt(
            $(element)
              .find('.ShortAuctionDataValue b')
              .text()
              .replace(/,/g, ''),
          ) || 0,
        outfit_url: $(element).find('.AuctionOutfitImage').attr('src') || '',
        skills: skills,
        auction_end_relative: $(element).find('.AuctionTimer').text().trim(),
      });
    });

    return auctions;
  } catch (error) {
    console.error('Erro no processamento:', error);
    return [];
  }
}
