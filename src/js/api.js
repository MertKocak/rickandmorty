import { getCharacter } from 'rickmortyapi';

const chars = await getCharacter([1, 2, 3, 4, 5, 8, 18, 28, 45, 48, 58, 67, 76, 82, 88]);

// Modal elemanları
const modalContainer = document.getElementById("modal-container");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

// Modal açma işlevi
const openModal = (character) => {
  const episodesHtml = character.episodes
    .map((episode, index) => `<li class="sm:text-sm text-xs text-gray-600 font-medium">${index + 1}. ${episode}</li>`)
    .join("");

  modalContent.innerHTML = `
      <div class="bg-cblue p-2 mt-4 rounded-xl justify-start flex flex-row">
        <img src="${character.image}" alt="${character.name}" class="sm:h-36 h-24 rounded-xl">
        <div class="flex flex-col ml-4 justify-center">
            <div class="sm:text-3xl font-manrope font-bold text-base text-cgray">${character.name}</div>
            <div class="sm:text-sm font-manrope font-medium text-xs text-cgray -mt-0.5">${character.status} - ${character.species}</div>
        </div>
      </div>
      <div class="sm:text-sm text-xs font-manrope text-cblue font-medium mt-4">Last known location:</div>
      <div class="sm:text-sm text-xs font-manrope font-medium text-gray-600">${character.location.name}</div>
      <div class="sm:text-sm text-xs font-manrope text-cblue font-medium mt-4">Episode(s):</div>
      <ul class="list-none font-manrope list-inside">
        ${episodesHtml}
      </ul>
    `;
  modalContainer.classList.remove("hidden");
};

// Modal kapama işlevi
closeModal.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});


// Alt kısımdaki Card oluşturma kısmı
async function fetchCharacters() {
  try {
    for (let i = 7; i < 91; i++) {
      const episodeUrls = chars.data[i].episode;

      // episode URL için verileri çekme
      const fetchEpisodes = async (urls) => {
        try {
          const promises = urls.map((url) => fetch(url).then((res) => res.json()));
          const episodes = await Promise.all(promises);
          return episodes.map((episode) => episode.name); // Sadece bölüm isimlerini al
        } catch (error) {
          console.error("Bölümleri çekerken hata oluştu:", error);
          return []; // Hata durumunda boş liste döndür
        }
      };

      // Tüm bölümleri çek
      const episodeNames = await fetchEpisodes(episodeUrls);

      // Karakter verilerini Card içerisine yazdır
      const characterElement = document.createElement("a");
      characterElement.href = "#";
      characterElement.innerHTML = `
          <div class="flex flex-row rounded-2xl  bg-cgray border-b-2 border-r-2 border-cblue">
            <img src=${chars.data[i].image} class="md:h-44 sm:h-36 h-28 rounded-l-xl">
            <div class="flex flex-col mx-2 my-2 justify-center">
              <div class="lg:text-xl md:text-base sm:text-sm text-xs text-cblue font-manrope font-bold">${chars.data[i].name}</div>
              <div class="lg:text-sm md:text-sm sm:text-xs text-[10px] flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${chars.data[i].status} - ${chars.data[i].species}</div>
              <div class="lg:text-sm md:text-sm sm:text-xs text-[10px] flex flex-row font-manrope sm:mt-2 mt-0.5 text-cblue font-light">Last known location:</div>
              <div class="lg:text-sm md:text-sm sm:text-xs text-[10px] flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${chars.data[i].location.name}</div>
              <div class="lg:text-sm md:text-sm sm:text-xs text-[10px] flex flex-row font-manrope sm:mt-2 mt-0.5 text-cblue font-light">First seen in:</div>
              <div class="lg:text-sm md:text-sm sm:text-xs text-[10px] flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${episodeNames[0]}</div>
            </div>
          </div>
        `;

      // Modal açma olayını bağla
      characterElement.addEventListener("click", (event) => {
        event.preventDefault();
        const characterData = {
          name: chars.data[i].name,
          status: chars.data[i].status,
          species: chars.data[i].species,
          location: { name: chars.data[i].location.name },
          episodes: episodeNames,
          image: chars.data[i].image,
        };
        openModal(characterData);
      });

      // DOM'a ekle
      document.getElementById("user-info").appendChild(characterElement);
    }
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
  }
}
fetchCharacters();

// Carousel Content
async function fetchCarouselContent() {
  try {
    for (var i = 0; i < 5; i++) {

      const episodeUrl = chars.data[i].episode;

      // Episode URL'ini alıyoruz
      const fetchData = async (apiUrl) => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const episodeData = await response.json();
          return episodeData;
        } catch (error) {
          console.error('Veri çekme hatası:', error);
          return null; // Hata durumunda null döndür
        }
      };

      // İlk episode URL'ini alıp episodeData'yı getiriyoruz
      const episodeData = await fetchData(episodeUrl[0]);

      // Eğer veri varsa kullan?
      const episodeName = episodeData ? episodeData.name : 'Unknown';

      const imageUrl = chars.data[i].image; // API'den gelen resim URL'sini al
      const imageElement = document.getElementById(`carouselImage${i}`);
      imageElement.src = imageUrl;
      document.getElementById(`carouselName${i}`).innerHTML = `
                <h2>${chars.data[i].name}</h2>
                `;
      document.getElementById(`carouselStatus${i}`).innerHTML = `
                <p>${chars.data[i].status}</p>
                <p class="ml-1"> - ${chars.data[i].species}</p>
                `;
      document.getElementById(`carouselLoc${i}`).innerHTML = `
                <p >Last known location:</p>
                <p class="ml-1">${chars.data[i].location.name}</p>
                `;
      document.getElementById(`carouselFirstSeen${i}`).innerHTML = `
                <p >First seen in:</p>
                <p class="ml-1">${episodeName}</p>
                `;
    }
  }
  catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
  }
}
fetchCarouselContent();