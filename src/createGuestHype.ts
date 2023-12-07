import { IConfinableElement, ICreateFunc } from './doc.ts';

export function createGuestHype (el: IConfinableElement, create: ICreateFunc): IConfinableElement {
  console.dir(create);
  if (!create) {
    debugger
    throw new Error('that aint right')
  }
  const result = create('p').push([
    create('span').text(`I don't actually know what number `),
    el,
    create('span').text(` is, but I'm very proud of you.`),
  ])
  return result
}