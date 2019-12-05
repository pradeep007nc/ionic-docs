import Prismic from 'prismic-javascript';

const apiURL = 'https://ionicframeworkcom.prismic.io/api/v2';
const cacheLife = 20 * 60 * 1000; // 20 mins
let ads: {}[];
let lastFetch: number = null;

const getLatest = async () => {
  console.log('getting latest ad');
  const api = await Prismic.getApi(apiURL);
  const single = await api.query(
    Prismic.Predicates.at('document.type', 'docs_ad'),
    {}
  );
  ads = single.results;
  lastFetch = Date.now();
};

export const getAd = async () => {
  if (!lastFetch || (Date.now() - lastFetch) > cacheLife) {
    await getLatest();
  }
  return chooseAdByWeight();
};

const chooseAdByWeight = () => {
  const weightList = []; // Just Checking...
  for (const ad of ads) {
    if (ad['data'] && ad['data'].ad_weight) { // Safety
      for (let i = 0; i < ad['data'].ad_weight; i++) {
        weightList.push(ad);
      }
    }
  }
  // Probability Fun
  return weightList[Math.floor(Math.random() * weightList.length)]['data'];
};
