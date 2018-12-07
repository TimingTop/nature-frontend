
// export { store } from 'redux'
import thunk from 'redux-thunk'

import { applyMiddleware } from 'redux'
// ===================== demo 1 begin=================================
// 模擬兩個 middleware 的組件
//  
function appLoggingOne(store) {
    // 把 store 的 dispatch 方法存起來
    let next = store.dispatch;
    //  替換掉 dispatch 的方法
    store.dispatch = function dispatchLogger(action) {
        console.log("logger 1 begin.....", action);
        // 原生的 dispatch 的方法
        next(action);
        console.log("logger 1 end......", action);
    }
}

function appLoggingTwo(store) {
    let next = store.dispatch;
    store.dispatch = function dispatchLogger2(action) {
        console.log("logger 2 begin ....", action);
        next(action);
        console.log("logger 2 end ....", action);
    }
}
// 建一個 把 middleware 組件鏈接的東西

function applyMiddlewareMock(store, middlewares) {
    middlewares = middlewares.slice();
    // 把 middlewares 數組 翻轉，從最後一個開始封裝
    middlewares.reverse();
    middlewares.forEach( middleware => middleware(store));
}

// 運行

store = {
    dispatch : function(action) {
        console.log("store dispatch...", action);
        action = "test end";
    }
}

applyMiddlewareMock(store, [appLoggingOne, appLoggingTwo]);

store.dispatch("test");

// 輸出的結果
// logger 1 begin..... test
// logger 2 begin .... test
// store dispatch... test
// logger 2 end .... test
// logger 1 end...... test

// ======================= demo 1 end ==========================


/* demo 1 都是通過臨時變量 let next 把 dispatch 這個方法保存起來，然後再用新
function 換掉 store 裡面的 dispatch 方法，周而復此，

下面使用，直接返回函數 做成鏈式操作，不需要中間變量保存 dispatch

*/

// 一般 function 版本
function appLogging(stroe) {
    return function wrapAppLogginOne(next) {
        return function dispatchAndLog(action) {
            console.log("logger 1 begin ...", action);
            next(action);
            console.log("logger 1 end ...", action);
        }
    }
}

// ============== demo 2 begin ===================
/* 仔細觀察這兩個高階函數，如果把兩個高階函數鏈式操作的話，l1 中的 next 其實就是指 l2 中
    帶 wrap * 的封裝函數，

    但是 這裡 缺少了怎麼觸發 next 函數的代碼，在 redux 如果使用 middleware 需要一個前置函數，用來觸發
    demo1 中可以直接 調用 store.dispatch 觸發整個鏈式，因為 store.dispatch 已經被替換掉了，
    demo2 沒有修改 store.dispatch 的方法，所以 怎麼 通過調用 store.dispatch 觸發整個 middleware 都是一個問題

*/
const l1 = store => next => action => {
    console.log("logger 1 begin ...", action);
    next(action);
    console.log("logger 1 end ...", action);
}

const l2 = store => next => action => {
    console.log("logger 2 begin ...", action);
    next(action);
    console.log("logger 2 begin ...", action);
}

// ================= demo 2 end ================


/* 

 applyMiddleware 就是上面串聯 middleware 的工具函數

 源碼改造版本, 接近源碼，幫助理解, 原理 還是 拿 dispatch 當中間件
*/
function applyMiddlewareMock2(store, middlewares) {
    middlewares = middlewares.slice();
    middlewares.reverse();

    let dispatch = store.dispatch;
    middlewares.forEach(middleware => {
        dispatch = middleware(store)(dispatch)
    });
    return Object.assign({}, store, {dispatch});
}

/*
   redux 的 applyMiddelware 的源碼
*/
export default function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
      const store = createStore(...args)
      let dispatch = () => {
        throw new Error(
          `Dispatching while constructing your middleware is not allowed. ` +
            `Other middleware would not be applied to this dispatch.`
        )
      }
  
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)
      }
      /* 結合上面的例子，我們 demo 的 middleware 模擬代碼 全部都是 3層 function
        但是我們看了 createThunkMiddleware 源碼 之後，發現是 4層 fuction，
        所以 applymiddle 的時候，需要 先拆一層 function
        chain 是一個數組，保存了，拆成 3層 function 的 middleware 組件
      */
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      /* 
        使用 reduce 方法，把 middleware 串在一起，好似語法糖
        跟 上面的 例子原理，利用 let 臨時變量保存 一層層遞歸串，
      */
      dispatch = compose(...chain)(store.dispatch)
  
      return {
        ...store,
        dispatch
      }
    }
  }

  // 源碼
  export default function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
  
    if (funcs.length === 1) {
      return funcs[0]
    }
  
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }

/* 
    查看 redux-thunk 的代碼， 如果 action 不是 純對象，或者可執行，需要 使用 此代碼
*/
// 源碼
function createThunkMiddleware(extraArgument) {
    return function (_ref) {
      var dispatch = _ref.dispatch,
          getState = _ref.getState;
      return function (next) {
        return function (action) {
          if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
          }
  
          return next(action);
        };
      };
    };
  }
  
  var thunk = createThunkMiddleware();
  thunk.withExtraArgument = createThunkMiddleware;
  
  export default thunk;