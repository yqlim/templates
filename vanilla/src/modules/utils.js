export function DOMContentLoaded(f, ...args){
  if (document.readyState !== 'loading')
    f.apply(window, args);
  else
    document.addEventListener(
      'DOMContentLoaded',
      f.bind.apply(f.bind, [window].concat(args)),
      { once: true }
    );
}
