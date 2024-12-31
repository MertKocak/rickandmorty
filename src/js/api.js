import { getCharacter } from 'rickmortyapi';

const chars = await getCharacter([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]);

// Modal elemanlarını seçme
const modalContainer = document.getElementById("modal-container");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

// Modal açma işlevi
const openModal = (character) => {
    const episodesHtml = character.episodes
      .map((episode, index) => `<li class="text-sm text-gray-600 font-medium">${index + 1}. ${episode}</li>`)
      .join("");
  
    modalContent.innerHTML = `
      <div class="bg-cblue p-2 mt-4 rounded-xl justify-start flex flex-row">
        <img src="${character.image}" alt="${character.name}" class="w-36 h-36 rounded-xl">
        <div class="flex flex-col ml-4 justify-center">
            <div class="sm:text-3xl font-manrope font-bold text-base text-cgray">${character.name}</div>
            <div class="sm:text-sm font-manrope font-medium text-xs text-cgray -mt-0.5">${character.status} - ${character.species}</div>
        </div>
      </div>
      
      <div class="text-sm font-manrope text-cblue font-medium mt-4">Last known location:</div>
      <div class="text-sm font-manrope font-medium text-gray-600">${character.location.name}</div>
      <div class="text-sm font-manrope text-cblue font-medium mt-4">Episode(s):</div>
      <ul class=" list-none font-manrope list-inside">
        ${episodesHtml}
      </ul>
    `;
    modalContainer.classList.remove("hidden");
  };

// Modal kapama işlevi
closeModal.addEventListener("click", () => {
    modalContainer.classList.add("hidden");
});

async function fetchCharacters() {
    try {
      for (let i = 5; i < 17; i++) {
        const episodeUrls = chars.data[i].episode;
  
        // Bir URL listesi için verileri paralel çekme
        const fetchEpisodes = async (urls) => {
          try {
            const promises = urls.map((url) => fetch(url).then((res) => res.json()));
            const episodes = await Promise.all(promises);
            return episodes.map((episode) => episode.name); // Sadece isimleri al
          } catch (error) {
            console.error("Bölümleri çekerken hata oluştu:", error);
            return []; // Hata durumunda boş liste döndür
          }
        };
  
        // Tüm bölümleri çek
        const episodeNames = await fetchEpisodes(episodeUrls);
  
        // Karakter verilerini ekrana yazdır
        const characterElement = document.createElement("a");
        characterElement.href = "#";
        characterElement.innerHTML = `
          <div class="flex flex-row rounded-2xl  bg-cgray border-b-2 border-r-2 border-cblue">
            <img src=${chars.data[i].image} class="md:h-44 h-36 rounded-l-xl">
            <div class="flex flex-col mx-2 my-2 justify-center">
              <div class="lg:text-xl md:text-base text-sm text-cblue font-manrope font-bold">${chars.data[i].name}</div>
              <div class="lg:text-sm md:text-sm text-xs flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${chars.data[i].status} - ${chars.data[i].species}</div>
              <div class="lg:text-sm md:text-sm text-xs flex flex-row font-manrope mt-2 text-cblue font-light">Last known location:</div>
              <div class="lg:text-sm md:text-sm text-xs flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${chars.data[i].location.name}</div>
              <div class="lg:text-sm md:text-sm text-xs flex flex-row font-manrope mt-2 text-cblue font-light">First seen in:</div>
              <div class="lg:text-sm md:text-sm text-xs flex flex-row font-manrope -mt-0.5 text-gray-600 font-medium">${episodeNames[0]}</div>
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