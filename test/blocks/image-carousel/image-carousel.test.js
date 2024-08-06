/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import { readFile } from '@web/test-runner-commands';
import decorate from '../../../blocks/image-carousel/image-carousel.js';

document.write(await readFile({ path: './image-carousel.plain.html' }));

const block = document.querySelector('.image-carousel');
await decorate(block);

describe('Image Carousel Block', () => {
  it('Test Picture Tag Count', async () => {
    expect(block.querySelectorAll('picture').length).equal(3);
  });
});
