import './style.css'
import { createDoc } from './doc.ts';
import { makeGrain } from './grain.ts';
import { untrustedHypeComponent } from './untrustedHypeComponent.ts'

const counter = makeGrain(0);

const doc = createDoc(document.body);
doc.root.push([
  doc.create('h1').text('Hello World!'),
  doc.create('p').text('You have clicked this many times:'),
  doc.create('p').follow(counter),
  doc.create('button').text('Click me!').onClick(async () => {
    console.log('clicked!');
    await counter.set(await counter.get() + 1);
  }),
  untrustedHypeComponent(doc.makeOpaqueProxy(doc.create('p').follow(counter)), doc.create)
]);
