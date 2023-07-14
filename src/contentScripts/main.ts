import { addCatImages } from './addImages';
import { addSuffixes } from './addSuffixes';
import { replaceAvatarImages } from './replaceAvatarImages';
import { setupObservers } from './observers';
import { fetchFromStorage } from '~/lib/storage';

let isSkippedPage: boolean;

const main = async () => {
  isSkippedPage = await shouldSkip();
  if (isSkippedPage) {
    return;
  }

  const { isSuffixEnabled, isAvatarImageReplacementEnabled, isAddImagesToCommentsEnabled } =
    await fetchFromStorage([
      'isSuffixEnabled',
      'isAvatarImageReplacementEnabled',
      'isAddImagesToCommentsEnabled',
    ]);

  if (isSuffixEnabled) {
    addSuffixes();
  }

  if (isAvatarImageReplacementEnabled) {
    replaceAvatarImages();
  }

  if (isAddImagesToCommentsEnabled) {
    addCatImages();
  }
};

const shouldSkip = async (): Promise<boolean> => {
  const currentURL = location.href;

  const { skipPages } = await fetchFromStorage(['skipPages']);

  for (const pattern of skipPages) {
    const regex = new RegExp(`^https://github.com/${pattern}`);
    if (regex.test(currentURL)) {
      return true;
    }
  }

  return false;
};

main();
setupObservers(main);

chrome.runtime.onMessage.addListener(
  (msg: 'refreshImages', _, sendResponse: (response: boolean) => void) => {
    if (msg === 'refreshImages') {
      if (!isSkippedPage) {
        replaceAvatarImages();
      }
      sendResponse(true);
      return;
    }

    sendResponse(false);
  }
);
