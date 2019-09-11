/**
 * Automatically invoke loading spinner on request.
 * Automatically remove loading spinner on requestError or on repsonse.
 */
export default function({ $axios, store }){

  $axios.interceptors.request.use(loadStart, loadEnd);
  $axios.interceptors.response.use(loadEnd, loadEnd);

  function loadStart(obj){
    store.commit('loading', true);
    return obj;
  }

  function loadEnd(obj){
    store.commit('loading', false);

    // .response property only happen when status is not 200
    return obj.response || obj;
  }

}
