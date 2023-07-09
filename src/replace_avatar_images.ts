import { catImageURL } from './api';
import { fetchFromStorage, saveToStorage } from './lib/storage';

export const replaceAvatarImages = () => {
  const images = findAvatarImages();
  replace(images);
};

const findAvatarImages = (): Element[] => {
  const images: Element[] = [];

  const avatars = document.getElementsByClassName('avatar');
  for (const avatar of avatars) {
    if (avatar.nodeName === 'IMG') {
      images.push(avatar);
      continue;
    }

    const image = avatar.firstElementChild;
    if (image === null) {
      console.debug('avatar child node not found', avatar);
      continue;
    }

    images.push(image);
  }

  return images;
};

const replace = async (images: Element[]) => {
  let isMapUpdated = false;
  const [imgMap, userNames] = await Promise.all([fetchImageMap(), fetchSkipUsers()]);
  const userNameRegex = new RegExp(`^(?:Owner avatar|${userNames.join('|')})$`);

  for (const image of images) {
    const userName = userNameFromImage(image);
    if (userName === null || userNameRegex.test(userName)) {
      continue;
    }

    let newImageURL: string;
    if (imgMap.has(userName)) {
      newImageURL = imgMap.get(userName)!;
    } else {
      newImageURL = await catImageURL(true);
      imgMap.set(userName, newImageURL);
      isMapUpdated = true;
    }
    image.setAttribute('src', newImageURL);
    image.setAttribute('style', 'object-fit: cover;');
  }

  if (isMapUpdated) {
    saveToStorage('avatarImages', Object.fromEntries(imgMap));
  }
};

const fetchImageMap = async (): Promise<Map<string, string>> => {
  const { avatarImages } = await fetchFromStorage(['avatarImages']);
  const mp = new Map(Object.entries(avatarImages));
  return mp;
};

const fetchSkipUsers = async (): Promise<string[]> => {
  const { skipUsers } = await fetchFromStorage(['skipUsers']);
  return skipUsers;
};

const userNameFromImage = (image: Element): string | null => {
  const altText = image.getAttribute('alt');
  if (altText === null || altText === '') {
    return null;
  }

  return altText.replace('@', '');
};
