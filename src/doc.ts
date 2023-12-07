export type IConfinableElement = {
  getChildren: () => IConfinableElement[],
  text: (text: string) => IConfinableElement,
  push: (childOrChildren: IConfinableElement | IConfinableElement[]) => IConfinableElement,
  pushChild: (child: IConfinableElement) => void,
  pushChildren: (children: IConfinableElement[]) => void,
  onClick: (cb: () => void) => IConfinableElement,
  follow: (grain: IObservableObject) => IConfinableElement,
}

import { IObservableObject } from "./grain";

export type IConfinableDoc = {
  create: (elType: string) => IConfinableElement,
  confineElement: (el: IConfinableElement) => IConfinableElement,
  root: IConfinableElement,
}

export type ICreateFunc = (elType: string) => IConfinableElement;

type IClickEvent = {
  preventDefault: () => void,
}

export type IFrozenObject = {}

export function createDoc (htmlElement: HTMLElement): IConfinableDoc {
  const proxyMap: WeakMap<IFrozenObject, IConfinableElement> = new WeakMap();
  const wrappedElMap: WeakMap<IConfinableElement, HTMLElement> = new WeakMap();

  function create (elType: string): IConfinableElement {
    console.log('creating ', elType)
    const el = document.createElement(elType);
    console.log(el);
    const children: IConfinableElement[] = [];

    const pushChild = (child: IConfinableElement) => {
      console.log('pushing child', child);
      if (proxyMap.has(child)) {
        child = proxyMap.get(child)!;
      }

      const childEl = wrappedElMap.get(child);
      if (!childEl) {
        throw new Error('Child element not valid');
      }

      const realEl = wrappedElMap.get(wrappedEl);
      console.log('realEl', realEl)
      realEl?.appendChild(childEl);

      el.appendChild(childEl);
      children.push(child);
    }

    const wrappedEl: IConfinableElement = {
      getChildren: () => children,
      text: (text: string): IConfinableElement => {
        el.innerText = text;
        return wrappedEl;
      },
      onClick: (cb: (handler: IClickEvent) => void): IConfinableElement => {
        el.addEventListener('click', (event) => {
          cb({
            preventDefault: () => event.preventDefault(),
          });
        });
        return wrappedEl;
      },
      follow: (grain: IObservableObject) => {
        grain.get().then((value: any) => {
          el.innerText = value;
        })
        grain.subscribe((value: any) => {
          el.innerText = value;
        });
        return wrappedEl;
      },
      push: (childOrChildren: IConfinableElement | IConfinableElement[]): IConfinableElement => {
        if (!childOrChildren) return wrappedEl;

        if (Array.isArray(childOrChildren)) {
          childOrChildren.forEach(pushChild);
        } else {
          pushChild(childOrChildren);
        }
        return wrappedEl;
      },
      pushChild,
      pushChildren: (children: IConfinableElement[]) => {
        console.log('pushing children');
        children.forEach(pushChild);
      },
      toString: () => {
        `ConfinedElement(${elType})`
      }
    }
    wrappedElMap.set(wrappedEl, el);
    return wrappedEl;
 
  }

  const confinedStub: IConfinableElement = {
    getChildren: () => [],
    text: () => confinedStub,
    pushChild: () => {},
    pushChildren: () => {},
    onClick: () => {
      return { ...confinedStub };
    },
    follow: () => { return { ...confinedStub }},
    push: () => {},
  }
  function confineElement (el: IConfinableElement): IConfinableElement {
    const proxy = Object.freeze(Object.create(confinedStub));
    proxyMap.set(proxy, el);
    return proxy;
  }

  const root = create('div');
  const realRoot = wrappedElMap.get(root);
  htmlElement.appendChild(realRoot!);

  return {
    create,
    confineElement,
    root,
  }
}
