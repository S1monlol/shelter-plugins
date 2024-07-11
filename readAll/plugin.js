(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // shltr-res-ns:solid-js/web
  var require_web = __commonJS({
    "shltr-res-ns:solid-js/web"(exports, module) {
      module.exports = shelter.solidWeb;
    }
  });

  // plugins/readAll/index.jsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div style="text-align: center; width: 100%; margin-top: 5px; margin-bottom: 10px;"></div>`, 2);
  var {
    util: {
      getFiber,
      reactFiberWalker
    },
    flux: {
      dispatcher
    },
    observeDom
  } = shelter;
  var {
    Button,
    ButtonSizes
  } = shelter.ui;
  var {
    subscribe
  } = shelter.plugin.scoped.flux;
  function readAll() {
    const channels = [];
    Object.values(shelter.flux.stores.GuildStore.getGuilds()).forEach((guild) => {
      shelter.flux.stores.GuildChannelStore.getChannels(guild.id).SELECTABLE.concat(shelter.flux.stores.GuildChannelStore.getChannels(guild.id).VOCAL).concat(Object.values(shelter.flux.stores.ActiveJoinedThreadsStore.getActiveJoinedThreadsForGuild(guild.id)).flatMap((threadChannels) => Object.values(threadChannels))).forEach((c) => {
        if (!shelter.flux.stores.ReadStateStore.hasUnread(c.channel.id))
          return;
        channels.push({
          channelId: c.channel.id,
          messageId: shelter.flux.stores.ReadStateStore.lastMessageId(c.channel.id),
          readStateType: 0
        });
      });
    });
    console.log(channels);
    dispatcher.dispatch({
      type: "BULK_ACK",
      context: "APP",
      channels
    });
  }
  var ReadAllButton = () => (() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Button, {
      get size() {
        return ButtonSizes.MIN;
      },
      style: "width: 100%; height: 5px;",
      onClick: readAll,
      children: "Read All"
    }));
    return _el$;
  })();
  function handleElement(elem) {
    if (elem.dataset.readall)
      return;
    elem.dataset.readall = 1;
    let parent = elem.parentElement;
    parent.insertBefore(ReadAllButton(), parent.childNodes[1]);
    triggers.forEach((trigger) => unsubscribe(trigger, handleDispatch));
  }
  function handleDispatch(payload) {
    const unObserve = observeDom("[aria-label='Servers']", (elem) => {
      handleElement(elem);
      unObserve();
    });
    setTimeout(unObserve, 500);
  }
  var triggers = ["LAYER_POP", "GUILD_SUBSCRIPTIONS_FLUSH"];
  triggers.forEach((trigger) => subscribe(trigger, handleDispatch));
})();
